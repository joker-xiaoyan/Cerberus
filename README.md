

<p align="center">
  <img src="icon.png" alt="Cerberus C2" width="180"/>
</p>

# Cerberus C2

> **Next-Generation Command & Control Framework**  
> AI-Powered · Fully Automated · Advanced EDR Evasion · Cross-Platform

---

## Overview

**Cerberus C2** is a next-generation red team command and control framework designed for modern adversary simulation and advanced penetration testing. Benchmarked against industry-leading platforms like Cobalt Strike and BRC4, Cerberus integrates a built-in AI engine, deep automation capabilities, and state-of-the-art EDR/AV evasion techniques — delivering APT-grade offensive capabilities in a single, unified platform.

> ⚠️ **Legal Disclaimer**: This tool is intended for authorized security research, red team engagements, and penetration testing only. Unauthorized use against systems you do not own or have explicit permission to test is illegal. The authors assume no liability for misuse.

---

## Key Features

### 🤖 AI Engine & Intelligent Automation
- **Integrated AI Assistant** — Context-aware command suggestions, payload generation guidance, and real-time operational analysis
- **AI-Driven Beacon Operations** — Autonomous beacon management with intelligent task scheduling and adaptive strategy execution
- **Automation Engine** — Rule-based and AI-assisted automation strategies; define complex multi-stage attack workflows that execute without manual intervention
- **AI Operations Dashboard** — Dedicated UI for monitoring and controlling AI-driven campaigns

### 🛡️ Advanced EDR Evasion (Beacon)
- **Indirect Syscalls** — Halo's Gate / Tartarus' Gate implementation to bypass user-mode hooks on `ntdll.dll`
- **Dynamic API Resolution** — DJB2 hash-based runtime API resolution; no sensitive imports in the IAT
- **Sleep Obfuscation** — Multi-layer sleep masking with heap/stack memory encryption; supports Ekko, Fiber, and ThreadPool modes with dynamic switching
- **Stack Spoofing** — Thread pool (`tp_exec`) routing for sensitive API calls to defeat call stack inspection
- **Module Stomping** — Preferred shellcode/PE loading via module stomping to avoid private RWX memory regions
- **PPID Spoofing + Thread Start Address Spoofing** — Process injection with parent process forgery and thread entry point masking
- **Traffic Obfuscation** — Encrypted binary beacon data embedded in legitimate Cookie/Body fields; no plaintext sensitive data in HTTP headers

### 🌐 Cross-Platform Support
| Platform | Architecture | Beacon Type |
|----------|-------------|-------------|
| Windows  | x64         | Full-featured DLL beacon |
| Windows  | x64         | Staged DLL (stager) |
| Linux    | x64         | Full-featured ELF beacon |
| Linux    | x64         | Basic ELF beacon |

### 📡 Flexible C2 Communication
- **Multiple Listener Types** — HTTP, HTTPS, TCP, UDP, DNS
- **C2 Profiles** — Built-in traffic profiles mimicking legitimate services:
  - `default` — Generic HTTP
  - `azure_ad` — Azure Active Directory traffic pattern
  - `google_api` — Google API traffic pattern
  - `microsoft_teams` — Microsoft Teams traffic pattern
  - `onedrive_sync` — OneDrive sync traffic pattern
  - `slack_api` — Slack API traffic pattern
- **Domain Fronting Support** — Dynamic Host header spoofing for traffic redirection
- **Endpoint Rotation** — Automatic C2 endpoint rotation with configurable strategies and failure thresholds
- **Session Encryption** — X25519 ECDH key exchange + AES-256-GCM for all task/result communication

### 🔗 Proxy & Pivoting
- **SOCKS5 Proxy** — Forward SOCKS5 with optional username/password authentication
- **Reverse SOCKS5 (rsocks5)** — Beacon-side reverse SOCKS5 for internal network pivoting
- **HTTP/HTTPS Proxy** — Transparent HTTP proxy with CONNECT tunnel support and TLS
- **Beacon Topology View** — Visual network topology map of all beacon chains and proxy connections

### 🎯 Post-Exploitation Capabilities
- **File Manager** — Full remote file system browsing, upload, download, rename, delete
- **Process Manager** — Process listing, injection, and kill
- **Screenshot** — Real-time remote screen capture
- **DLL Management** — Remote DLL load, execute, and unload
- **BOF (Beacon Object Files)** — Inline execution of BOF modules
- **Inline PE Execution** — Execute PE files in memory without touching disk

### 🏗️ Infrastructure & Operations
- **Distributed Cluster** — Multi-node TeamServer clustering for high-availability red team operations
- **Arsenal** — Centralized payload and tool storage with upload/management UI
- **Delivery** — Payload delivery management and staging
- **Loot** — Centralized credential and sensitive data collection
- **Notification System** — Configurable alerts (email, webhook) for beacon check-ins and events
- **Metrics & Health Monitoring** — Real-time server health dashboard with memory, goroutine, and uptime metrics
- **Multi-Operator Support** — Role-based access with multiple concurrent operator sessions

---

## Quick Start

### Requirements
- **No external dependencies** — single binary deployment
- Supported platforms: Windows x64 / Linux x64 / macOS x64
- A modern browser (Chrome / Edge / Firefox)

---

### 🚀 Step 1 — Start the TeamServer

#### 🪟 Windows
```cmd
c2-platform.exe <port> <username>/<password>
```
**Example:**
```cmd
c2-platform.exe 8443 admin/P@ssw0rd
```

#### 🐧 Linux
```bash
chmod +x c2-platform-linux-amd64
./c2-platform-linux-amd64 8443 admin/P@ssw0rd
```

#### 🍎 macOS
```bash
chmod +x c2-platform-darwin-amd64
./c2-platform-darwin-amd64 8443 admin/P@ssw0rd
```

> **Tip:** It is recommended to run the server on a Linux VPS for production red team operations.

---

### 🌐 Step 2 — Open the Web UI

Once the server starts, open your browser and navigate to:
```
http://<server-ip>:<port>
```
**Example:** `http://192.168.1.100:8443`

Log in with the username and password you specified at startup.

---

### 📦 Step 3 — Create a Listener

1. Go to **Listeners** page → click **New Listener**
2. Select protocol (HTTP / HTTPS / TCP / UDP / DNS)
3. Configure bind address, port, and C2 profile
4. Click **Start**

---

### 🎯 Step 4 — Generate a Beacon

1. Go to **Client Generator** page
2. Select target platform (Windows DLL / Linux ELF)
3. Configure listener, sleep interval, and evasion options
4. Click **Generate** — the beacon will appear in **Downloads**

### Directory Structure

```
.
├── c2-platform(.exe)       # TeamServer binary
├── config/
│   ├── c2_active_profile.json      # Active C2 profile
│   ├── c2_profiles/                # Built-in traffic profiles
│   ├── distributed.json            # Cluster configuration
│   └── notification.json           # Alert configuration
├── templates/
│   ├── beacon_full.dll             # Windows full beacon template
│   ├── stager_basic.dll            # Windows stager template
│   ├── beacon_full_linux_x64       # Linux full beacon template
│   └── beacon_basic_linux_x64      # Linux basic beacon template
├── static/                         # Web UI assets
├── arsenal_storage/                # Arsenal file storage
├── delivery_storage/               # Delivery payload storage
└── downloads/                      # Downloaded files from beacons
```

---

## C2 Profiles

C2 profiles control how beacon traffic is shaped to blend in with legitimate network activity. Switch profiles from the **System → C2 Communication Manager** panel.

| Profile | Mimics |
|---------|--------|
| `default` | Generic HTTP requests |
| `azure_ad` | Azure Active Directory API calls |
| `google_api` | Google API requests |
| `microsoft_teams` | Microsoft Teams webhook traffic |
| `onedrive_sync` | OneDrive file sync operations |
| `slack_api` | Slack API polling |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Cerberus TeamServer             │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ AI Engine│  │Automation│  │  C2 Listeners  │  │
│  │          │  │  Engine  │  │ HTTP/S TCP UDP │  │
│  └──────────┘  └──────────┘  │    DNS         │  │
│                               └───────────────┘  │
│  ┌──────────────────────────────────────────┐    │
│  │           Web UI (Browser-based)         │    │
│  │  Dashboard · Beacons · AI · Automation   │    │
│  │  Arsenal · Delivery · Loot · Cluster     │    │
│  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
                        │
          Encrypted C2 Channel (X25519 + AES-256-GCM)
                        │
┌─────────────────────────────────────────────────┐
│                  Cerberus Beacon                 │
│                                                  │
│  Windows x64 (DLL)        Linux x64 (ELF)       │
│  · Indirect Syscalls       · Cross-platform      │
│  · Sleep Obfuscation       · Full post-ex        │
│  · Stack Spoofing                                │
│  · Module Stomping                               │
│  · PPID Spoofing                                 │
└─────────────────────────────────────────────────┘
```

---

## License

This project is released for **educational and authorized security research purposes only**.

---

*Cerberus C2 — Redefining the boundaries of modern red team operations.*
