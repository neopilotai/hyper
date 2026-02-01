# Clean Rebuild Process

Following the upgrade to Electron 29 and the removal of the legacy `electron-link` package, a clean rebuild is required to ensure all dependencies and native modules are correctly aligned.

## Steps to Execute a Clean Rebuild

1.  **Clear existing dependencies and build artifacts:**
    ```bash
    npm run clean
    ```
    This script will remove `node_modules`, `app/node_modules`, and the `app/renderer` directory.

2.  **Install fresh dependencies:**
    ```bash
    pnpm install
    ```
    *Note: We are using `pnpm` as the primary package manager as per the `pnpm-lock.yaml` file.*

3.  **Execute post-installation tasks:**
    ```bash
    pnpm run postinstall
    ```
    This step is critical as it handles:
    - Native module rebuilding (e.g., `node-pty`).
    - Webpack compilation for the main app.

4.  **Start the development environment:**
    ```bash
    pnpm run dev
    ```

## Why This Refresh is Necessary

- **Version Alignment:** Electron 29, `@types/node` 20, and `electron-mksnapshot` 29 are now synchronized, preventing binary incompatibility issues during snapshot generation.
- **Legacy Removal:** Removing `electron-link` eliminates a common source of build-time failures in modern Node.js environments (Node 20+).
- **Native Modules:** `node-pty` and other native dependencies must be rebuilt against the new Electron headers.
