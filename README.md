# 🍹 Vibe Vending Machine | 独立开发者作品贩卖机

在 **VibeCoding** 盛行的当下，独立开发者往往同时维护着许多小而美的项目：demo、独立站、开源工具、实验作品……数量变多以后，一个常见困境是——**缺乏一个足够有趣、足够“有记忆点”的展示机制**。

如果你也觉得普通的“列表导航站/作品清单”太无聊，那么这个项目提供了另一种包装方式：把你的作品集做成一台 **动漫风的街边饮料自动售货机**。访客不是在“点链接”，而是在“买饮料”——用更轻松、解压的交互，把你的作品自然地介绍出去。

<img width="1272" height="810" alt="image" src="https://github.com/user-attachments/assets/735c9bca-dd28-476f-9600-c4bb72e871a5" />


## 核心亮点

- **🌸 动漫审美**：明亮的街景背景 + 售货机 UI。
- **🕹️ 拟真解压交互**：点击货架上的“商品”（站点），商品会顺着重力掉落到取物口；掉落完成后自动在新标签页打开站点。
- **⚙️ 极简配置驱动**：站点数据、价格标签、赞助链接等，集中在一个配置文件中修改。
- **🪙 投币赞助机制**：把传统赞助按钮（如 Ko-fi）融合进售货机投币槽，让访客在趣味互动中为你“投币”。

## 快速开始

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

## 配置你的“商品”

在 `src/config.ts` 中修改：

- **sponsorshipUrl**：投币赞助跳转链接
- **vendingMachineColor**：售货机主题色
- **projects**：你的项目列表（`name` / `website` / `version`）

## 仓库数据整理脚本（可选）

仓库里自带了一个脚本 `src/github_scraper.py`，用于**抓取并整理 GitHub 仓库信息**，方便你批量生成/更新作品清单数据，再扩展到 `src/config.ts`（例如：自动收集项目名、描述、主页、topics、stars、语言、创建时间等）。

### 使用方式

抓取你自己的仓库（推荐，支持私有仓库）：

```bash
python src/github_scraper.py -t <YOUR_GITHUB_TOKEN> -o my_repos.json --pretty
```

抓取指定用户的公开仓库：

```bash
python src/github_scraper.py -u <GITHUB_USERNAME> -o my_repos.json --pretty
```

输出结果是一个 JSON（包含 `projects` 数组）。你可以据此做二次筛选与映射，然后把最终要展示的项目写入 `src/config.ts` 的 `projects` 字段。

### 推荐工作流

- **抓取**：用脚本导出 `my_repos.json`
- **筛选**：删除不想展示的仓库（例如模板/归档/实验）
- **映射**：把 `repo_url` 或 `website(homepage)` 等字段映射为你要在售货机里展示的 `website`
- **更新展示**：把最终列表贴回 `src/config.ts`

> 注意：`src/config.ts` 当前使用的是最简字段（`name` / `website` / `version`）。如果你想把脚本输出的更多信息（如描述、topics、stars 等）也展示到 UI，可以继续扩展 `config.ts` 的项目结构与页面组件。


## 适用场景

- **独立开发者作品集**：把分散的小项目“串成一台机器”，更有故事性。
- **开源项目导航页**：用更轻松的方式带人“逛”你的仓库与 demo。
- **活动/展会展示**：作为现场大屏的互动入口也很合适。

## 协议 License

本项目采用 **Creative Commons BY-NC-SA 4.0** 协议开源。

- **BY（署名）**：使用时需保留作者署名与来源说明  
- **NC（非商业）**：不得用于商业目的  
- **SA（相同方式共享）**：基于本项目二次创作需使用相同协议开源
