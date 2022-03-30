<div align="center">

# ![](./src/static/icons/icon32.png) Mini Translator

[![Chrome Web Store](https://img.shields.io/badge/Chrome-20222c?logo=google-chrome&logoColor=white&style=for-the-badge)](https://chrome.google.com/webstore/detail/mini-translator/godoijpcenklboeghnkeafimbadkgiib)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-20222c?logo=firefox-browser&logoColor=white&style=for-the-badge)](https://addons.mozilla.org/addon/mini-translator/)
[![Edge Addons](https://img.shields.io/badge/Edge-20222c?logo=microsoft-edge&logoColor=white&style=for-the-badge)](https://microsoftedge.microsoft.com/addons/detail/fhpmmefclididfhfepdmjakbamipkdgp)

</div>

Simple translator extension, you can translate selected text or use the toolbar to get a translation of any text. Translations are obtained by Google Translate.

## Developing

### Build

1. Clone this repository: `git clone https://github.com/axel_vc/mini_translator`
2. Run `yarn install`
3. Run `yarn build `

This will generate `build/mini_translator-manifest_v2.zip` and `build/mini_translator-manifest_v3.zip` files. Firefox only accepts version 2. Chromium based browser prefers versions 3.

### Load the extension in Chrome/Edge

1. Open Chrome/Edge browser and navigate to `about://extensions`
2. Enable "Developer Mode"
3. Click "Load unpacked" and choose `mini_translator-manifest_v3.zip`, or drag and drop it to the page

### Load the extension in Firefox

1. Open Firefox browser and navigate to `about:debugging`
2. Go to "This Firefox" tab
3. Click "Load Temporary Add-on" and choose `mini_translator-manifest_v2.zip`
