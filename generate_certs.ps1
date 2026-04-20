
# Cerberus C2 - HTTPS Certificate Generator (Windows)
# Usage: .\generate_certs.ps1 [-OutputDir <path>]
#
# This script generates a self-signed ECDSA P-256 certificate for HTTPS listeners.
# The certificate is valid for 10 years and includes localhost + all local IPs in SAN.
#
# Output files:
#   <output_dir>\certs\server.crt  - Certificate (PEM)
#   <output_dir>\certs\server.key  - Private key (PEM)

param(
    [string]$OutputDir = "."
)

$ErrorActionPreference = "Stop"

$CERT_DIR = Join-Path $OutputDir "certs"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cerberus C2 - Certificate Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create output directory
if (-not (Test-Path $CERT_DIR)) {
    New-Item -ItemType Directory -Path $CERT_DIR | Out-Null
}

$CERT_FILE = Join-Path $CERT_DIR "server.crt"
$KEY_FILE = Join-Path $CERT_DIR "server.key"

if ((Test-Path $CERT_FILE) -and (Test-Path $KEY_FILE)) {
    Write-Host "[INFO] Certificate already exists at: $CERT_DIR" -ForegroundColor Yellow
    Write-Host "[INFO] Delete existing files to regenerate." -ForegroundColor Yellow
    exit 0
}

# Collect local IPs for SAN
$localIPs = @("127.0.0.1", "0.0.0.0")
try {
    Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | 
        Where-Object { $_.IPAddress -ne "127.0.0.1" -and $_.PrefixOrigin -ne "WellKnown" } |
        ForEach-Object { $localIPs += $_.IPAddress }
} catch {}

# Method 1: Try OpenSSL
$openssl = Get-Command openssl -ErrorAction SilentlyContinue
if ($openssl) {
    Write-Host "[CERT] Generating certificate with OpenSSL..." -ForegroundColor Yellow

    $sanEntries = @("DNS:localhost", "DNS:*.localhost")
    foreach ($ip in $localIPs) {
        $sanEntries += "IP:$ip"
    }
    $san = $sanEntries -join ","

    Write-Host "[CERT] SAN: $san" -ForegroundColor Gray

    & openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 `
        -keyout $KEY_FILE -out $CERT_FILE `
        -days 3650 -nodes `
        -subj "/O=Cerberus C2/CN=Cerberus C2 Self-Signed" `
        -addext "subjectAltName=$san" 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Certificate generated successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Certificate: $CERT_FILE" -ForegroundColor White
        Write-Host "  Private Key: $KEY_FILE" -ForegroundColor White
        Write-Host ""
        & openssl x509 -in $CERT_FILE -noout -subject -dates -fingerprint -sha256 2>$null
        exit 0
    }
    Write-Host "[WARN] OpenSSL generation failed, trying PowerShell method..." -ForegroundColor Yellow
}

# Method 2: PowerShell New-SelfSignedCertificate
Write-Host "[CERT] Generating certificate with PowerShell..." -ForegroundColor Yellow

try {
    $dnsNames = @("localhost", "*.localhost")
    
    $cert = New-SelfSignedCertificate `
        -DnsName $dnsNames `
        -CertStoreLocation "Cert:\CurrentUser\My" `
        -NotAfter (Get-Date).AddYears(10) `
        -FriendlyName "Cerberus C2" `
        -Subject "CN=Cerberus C2 Self-Signed, O=Cerberus C2" `
        -KeyAlgorithm ECDSA_nistP256

    # Export certificate as PEM
    $certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
    $certBase64 = [Convert]::ToBase64String($certBytes, [Base64FormattingOptions]::InsertLineBreaks)
    $certPem = "-----BEGIN CERTIFICATE-----`r`n$certBase64`r`n-----END CERTIFICATE-----"
    [System.IO.File]::WriteAllText($CERT_FILE, $certPem)

    # Export private key as PEM
    $keyBytes = $cert.PrivateKey.ExportECPrivateKey()
    $keyBase64 = [Convert]::ToBase64String($keyBytes, [Base64FormattingOptions]::InsertLineBreaks)
    $keyPem = "-----BEGIN EC PRIVATE KEY-----`r`n$keyBase64`r`n-----END EC PRIVATE KEY-----"
    [System.IO.File]::WriteAllText($KEY_FILE, $keyPem)

    # Clean up from cert store
    Remove-Item "Cert:\CurrentUser\My\$($cert.Thumbprint)" -ErrorAction SilentlyContinue

    Write-Host "[OK] Certificate generated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Certificate: $CERT_FILE" -ForegroundColor White
    Write-Host "  Private Key: $KEY_FILE" -ForegroundColor White
} catch {
    Write-Host "[ERROR] Certificate generation failed: $_" -ForegroundColor Red
    Write-Host "[INFO] The server will auto-generate a certificate on first HTTPS listener start." -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Place these files in the 'certs/' directory" -ForegroundColor White
Write-Host "  next to the c2-platform binary." -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
