#!/bin/bash
# Cerberus C2 - HTTPS Certificate Generator
# Usage: ./generate_certs.sh [output_dir]
#
# This script generates a self-signed ECDSA P-256 certificate for HTTPS listeners.
# The certificate is valid for 10 years and includes localhost + all local IPs in SAN.
#
# Output files:
#   <output_dir>/certs/server.crt  - Certificate (PEM)
#   <output_dir>/certs/server.key  - Private key (PEM)

set -e

OUTPUT_DIR="${1:-.}"
CERT_DIR="$OUTPUT_DIR/certs"

echo "========================================"
echo "  Cerberus C2 - Certificate Generator"
echo "========================================"
echo ""

# Create output directory
mkdir -p "$CERT_DIR"

CERT_FILE="$CERT_DIR/server.crt"
KEY_FILE="$CERT_DIR/server.key"

if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo "[INFO] Certificate already exists at: $CERT_DIR"
    echo "[INFO] Delete existing files to regenerate."
    echo ""
    openssl x509 -in "$CERT_FILE" -noout -subject -dates 2>/dev/null || true
    exit 0
fi

# Build SAN extension with local IPs
SAN="DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:0.0.0.0,IP:::1"

# Detect local IP addresses
if command -v ip &>/dev/null; then
    # Linux
    LOCAL_IPS=$(ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1' || true)
elif command -v ifconfig &>/dev/null; then
    # macOS / BSD
    LOCAL_IPS=$(ifconfig | grep -oE 'inet [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | awk '{print $2}' | grep -v '127.0.0.1' || true)
else
    LOCAL_IPS=""
fi

for ip in $LOCAL_IPS; do
    SAN="$SAN,IP:$ip"
done

echo "[CERT] Generating self-signed ECDSA P-256 certificate..."
echo "[CERT] SAN: $SAN"
echo ""

openssl req -x509 \
    -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -days 3650 \
    -nodes \
    -subj "/O=Cerberus C2/CN=Cerberus C2 Self-Signed" \
    -addext "subjectAltName=$SAN" \
    2>/dev/null

chmod 644 "$CERT_FILE"
chmod 600 "$KEY_FILE"

echo "[OK] Certificate generated successfully!"
echo ""
echo "  Certificate: $CERT_FILE"
echo "  Private Key: $KEY_FILE"
echo ""
openssl x509 -in "$CERT_FILE" -noout -subject -dates -fingerprint -sha256 2>/dev/null
echo ""
echo "========================================"
echo "  Place these files in the 'certs/' directory"
echo "  next to the c2-platform binary."
echo "========================================"
