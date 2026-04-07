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

## Repository Data Scraper (Optional)

This repo includes a helper script, `src/github_scraper.py`, for **scraping and organizing GitHub repository metadata**. It’s useful when you want to batch-generate or continuously update your project inventory, and then extend / sync the results into `src/config.ts` (e.g. name, description, homepage, topics, stars, language, created/updated time, etc.).

### Usage

Scrape your own repositories (recommended; supports private repos with a token):

```bash
python src/github_scraper.py -t <YOUR_GITHUB_TOKEN> -o my_repos.json --pretty
```

Scrape a user’s public repositories:

```bash
python src/github_scraper.py -u <GITHUB_USERNAME> -o my_repos.json --pretty
```

The output is a JSON file containing a `projects` array. You can filter/map it and then copy the final list into the `projects` field in `src/config.ts`.

### Suggested Workflow

- **Scrape**: export `my_repos.json`
- **Filter**: remove repos you don’t want to showcase (templates / archived / experiments)
- **Map**: map `repo_url` or `website(homepage)` into the vending-machine `url`, then set `price` manually
- **Update**: paste the final list back into `src/config.ts`

> Note: `src/config.ts` currently uses a minimal schema (`name` / `url` / `price`). If you want to display richer metadata from the scraper (description, topics, stars, etc.), you can extend the config schema and update the UI components accordingly.

## Good For

- **Indie dev portfolios**: turn scattered projects into one cohesive, memorable experience.
- **Open-source demo hub**: a playful directory for repos and live demos.
- **Event / booth displays**: works nicely as an interactive entry point on a big screen.

## License

This project is open-sourced under **Creative Commons BY-NC-SA 4.0**.

- **BY (Attribution)**: you must give appropriate credit and provide a link to the source  
- **NC (NonCommercial)**: you may not use the material for commercial purposes  
- **SA (ShareAlike)**: adaptations must be distributed under the same license

