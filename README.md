# Dry Run Board

Dry Run Board is a native desktop application designed to visually trace, debug, and model algorithmic data structures in real-time. Built around an infinite-canvas paradigm, it serves as a digital whiteboard specifically optimized for software engineers and computer science students who need to mentally execute ("dry run") code and visualize memory state transitions.

## Project Overview

When studying algorithms or debugging complex logic, developers often resort to physical whiteboards or pen and paper to draw arrays, trees, and matrices. Dry Run Board digitizes this process. It provides an immersive, borderless workspace where users can instantiate interactive data structures and manually manipulate them to reflect the state of an algorithm at any given execution step.

The application leverages a high-performance Rust backend via Tauri and a hardware-accelerated frontend via React Flow, ensuring that the canvas remains responsive even with a large number of nodes.

### Key Capabilities

- **Algorithmic Visualization:** Direct manipulation of 6 primary data structures: Arrays, Stacks, Queues, Key-Value Maps, 2D Matrices, and Node Graphs.
- **Native Desktop Performance:** Packaged as a standalone native binary using Tauri v2, offering a highly optimized, low-memory footprint alternative to Electron-based applications.
- **Borderless Fullscreen Immersion:** The application runs in a true fullscreen, borderless mode to maximize canvas real estate and eliminate operating system distractions.
- **Advanced State Management:** Utilizes a persistent Zustand store capable of deep time-travel debugging, allowing users to effortlessly undo (`Ctrl+Z`) and redo (`Ctrl+Shift+Z`) every individual canvas state change.
- **Canvas Workflows:** Full support for multi-selection (`Ctrl+Click`) and deep-copying (`Ctrl+C` / `Ctrl+V`), with cloned structures intelligently projected directly beneath the user's cursor.
- **Automated OTA Updates:** Seamless over-the-air updates managed entirely via a GitHub Actions CI/CD pipeline, ensuring users are always on the latest version without manual intervention.

---

## Technical Architecture

- **Frontend Environment:** React 19 + Vite
- **Canvas Rendering Engine:** React Flow (`@xyflow/react`)
- **State Management Layer:** Zustand (with custom middleware for deep-state history preservation)
- **Desktop Runtime Environment:** Tauri v2 (Rust)
- **Continuous Integration:** GitHub Actions (configured for Ubuntu cross-compilation with extensive NPM and Cargo caching)

---

## Local Development Guide

### System Prerequisites
Ensure that [Node.js (v20+)](https://nodejs.org/) and [Rust](https://rustup.rs/) are installed on your workstation.
For Debian/Ubuntu systems, the following Tauri dependencies are required:
```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

### Installation and Execution
1. Clone the repository:
```bash
git clone https://github.com/AviBapatu/Dry-Run-Board.git
cd Dry-Run-Board
```

2. Install Node dependencies:
```bash
npm install
```

3. Initialize the Tauri development server:
```bash
npm run tauri dev
```

---

## Production Build

To compile the optimized standalone executables manually (e.g., `.deb` or `.AppImage`), execute:

```bash
npm run tauri build
```
The compiled binaries will be deposited in the `src-tauri/target/release/bundle/` directory.

---

## Deployment and Auto-Updater Pipeline

Dry Run Board implements a zero-touch release pipeline defined in `.github/workflows/release.yml`. 

1. **Triggering a Release:** Pushing a new semantic version tag (e.g., `v1.0.3`) triggers the deployment workflow.
2. **Compilation and Caching:** The workflow utilizes `Swatinem/rust-cache@v2` and `npm ci` to efficiently compile the Rust binaries and bundle the React frontend, mitigating lengthy rebuilds.
3. **Cryptographic Signing:** The compiled artifacts are securely signed using the repository's `TAURI_SIGNING_PRIVATE_KEY` secret.
4. **Distribution:** The binaries and a `latest.json` manifest are published to GitHub Releases.
5. **Client Resolution:** Active client applications poll this manifest; if a version discrepancy is detected, the user is prompted via a native dialog to authorize the background download and application restart.

---

## Keyboard Navigation

| Command | Action |
|----------|--------|
| `Ctrl + Z` | Undo previous action |
| `Ctrl + Shift + Z` | Redo next action |
| `Ctrl + C` | Copy selected data structures |
| `Ctrl + V` | Paste copied structures under the active cursor |
| `Ctrl + Click` | Multi-select multiple independent structures |
| `Ctrl + =` / `+` | Zoom In |
| `Ctrl + -` | Zoom Out |
| `Ctrl + 0` | Reset canvas zoom and restore central view |

---

## Contributing

Contributions to the Dry Run Board project are encouraged. Priority areas include the implementation of advanced data structures (e.g., Binary Trees, Doubly Linked Lists) and enhancements to the rendering engine's performance. Please submit a Pull Request for review.
