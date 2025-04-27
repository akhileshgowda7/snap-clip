# SnapClip

A lightweight browser extension built with [Plasmo](https://docs.plasmo.com/) that lets you click any page element—even non-selectable text—and copy its contents straight to your clipboard.

## Prerequisites

- **Node.js** ≥ 16  
- **pnpm** (recommended) or **npm**

## Development

- **Install dependencies**  
  ```bash
  pnpm install
  # or
  npm install

- **Start the dev server
    ```
    pnpm dev
    # or
    npm run dev

### Load the unpacked extension

- Open chrome://extensions in your browser
- Enable Developer mode
- Click Load unpacked and select the ```.plasmo/dev/chrome-mv3 folder```

## Production Build

- Build
    ```
    pnpm build
    # or
    npm run build
- output directory: ```build/chrome-mv3-prod/```
- Load that folder via Load unpacked to test your production build.

