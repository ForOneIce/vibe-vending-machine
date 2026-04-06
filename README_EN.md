# 🍹 Vibe Vending Machine | Indie Dev Portfolio Vending Machine

In the era of **VibeCoding**, indie devs can ship a surprising number of small-but-fun projects: demos, microsites, OSS tools, prototypes… The problem is that once you have *many*, the usual “links list / navigation page” starts to feel bland and forgettable.

This project proposes a more playful showcase: turn your portfolio into a **anime-style street vending machine**. Visitors aren’t just clicking links—they’re “buying a drink”. A tiny interaction, a little dopamine, and your work gets explored naturally.

## Highlights

- **🌸 Anime-inspired look**: bright street-scene background + translucent, tactile vending-machine UI.
- **🕹️ Satisfying physics-like interaction**: click a product (site), it “drops” into the pickup slot; once the animation finishes, the site opens in a new tab.
- **⚙️ Config-driven**: project list, price tags, sponsorship link, theme color—edit one central config file.
- **🪙 Tip jar as a coin slot**: sponsorship (e.g. Ko-fi) is integrated into the coin slot for a fun “insert coin” moment.

## Quick Start

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Configure Your “Products”

Edit `src/config.ts`:

- **sponsorshipUrl**: the link behind the “coin slot”
- **vendingMachineColor**: theme color
- **projects**: your project list (`name` / `url` / `price`)

## Good For

- **Indie dev portfolios**: turn scattered projects into one cohesive, memorable experience.
- **Open-source demo hub**: a playful directory for repos and live demos.
- **Event / booth displays**: works nicely as an interactive entry point on a big screen.

## License

This project is open-sourced under **Creative Commons BY-NC-SA 4.0**.

- **BY (Attribution)**: you must give appropriate credit and provide a link to the source  
- **NC (NonCommercial)**: you may not use the material for commercial purposes  
- **SA (ShareAlike)**: adaptations must be distributed under the same license

