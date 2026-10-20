# Pinky Studio — Responsive Storefront

This local Figma development plugin creates **nine editable screens**: Home, Shop, and Product detail at **1440, 768, and 390 px**. It uses the existing React website’s catalogue, DM Sans and Playfair Display typography, blush/cream/burgundy colors, and twelve bundled skincare photographs. It creates a new page and preserves your existing wireframes.

## Import into Figma

1. Open a new blank **Figma Design** file in the Figma desktop app.
2. Select **Plugins → Development → Import plugin from manifest…** and choose `manifest.json` from this folder.
3. Run **Pinky Studio — Responsive Storefront**, then click **Create 9 responsive screens**.

Use Figma’s available **DM Sans Regular** and **Playfair Display Regular** fonts. Photos are bundled: the plugin needs no network access.

## Resize the designs

Select a generated screen and drag its width, keeping the plugin open. Below **761 px**, the header switches to mobile navigation, hero/editorial/product sections stack, shop filters hide, and typography and spacing shrink. You can also enter a width from **320–1920 px** in the plugin and click **Apply width & responsive layout**.

Cards, category sections, and footer columns use native wrapping Auto Layout; text wraps and height grows with content. These settings remain after the plugin closes. **Figma does not apply CSS media queries:** breakpoint changes to direction, visibility, and font size require the plugin to stay open or to be reapplied with the width control. Preset desktop/tablet/mobile screens keep their saved layout after closing it.

All screen content consists of editable layers and reusable product/button components with shared color, spacing, radius variables and text styles. Product photos are discrete image fills, not flattened page screenshots. Designs are static mockups; links, filters and shopping actions are not a working store or a wired Figma prototype.

## Review before importing

Open `preview.html` in a browser and resize the browser window. The Home / Shop / Product buttons switch the preview. This is a browser approximation of the planned Figma layouts, **not an export from a verified Figma canvas**.

The plugin source has been syntax-checked and exercised with a local API mock. Direct Figma creation and visual validation remain unavailable because the connected account’s MCP Starter quota was reached.
