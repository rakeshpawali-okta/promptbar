# PromptBar — AI Prompt Library

**A zero-install, privacy-first prompt library for Gemini, ChatGPT, and Claude.**

No Chrome extension required. Just an HTML file and a bookmark.

---

## Why PromptBar?

Every prompt manager requires a browser extension. PromptBar doesn't.

It works as a single HTML file — open it in your browser, drag a template to your bookmarks bar, and click it on any AI tool to inject the prompt instantly. Your prompts stay local in your browser. Nothing is sent to a server.

**Built for people whose organisations block Chrome extensions.**

---

## Features

- One-click prompt injection into Gemini, ChatGPT, and Claude
- 74 built-in prompts across 11 personas
- Filter by persona: Everyday, Developer, Product Owner, Business Analyst, Sales, Customer Success, Technical Account Management, Engineering Manager, HR & People, Legal, Marketing
- Search across all prompts
- Save your own prompts (stored in localStorage)
- Export your prompts as JSON to share with your team
- Import JSON prompt packs from others
- No install, no account, no server

---

## How to Use

**Option A — Visit the live site** *(easiest)*  
Open [promptbar-kappa.vercel.app](https://promptbar-kappa.vercel.app/) in Chrome.

**Option B — Run locally**  
Clone the repo and open `index.html` directly in Chrome.

Then:
1. Press `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows) to show your bookmarks bar
2. Drag any template button to your bookmarks bar
3. Open Gemini / ChatGPT / Claude, click the text box, then click the bookmark

The prompt is injected instantly. Fill in `[INPUT]` and go.

> **On mobile?** Bookmarklets don't work on mobile browsers. Use the **Copy** button instead and paste into your AI tool.

---

## Prompt Format

All prompts follow a structured format with five fields:

```json
{
  "title":   "Short display name",
  "tag":     "Category badge (e.g. Documentation, Agile)",
  "group":   "Persona (Everyday | Developer | Product Owner | Business Analyst | Sales | Customer Success | Technical Account Management | Engineering Manager | HR & People | Legal | Marketing | General)",
  "desc":    "One sentence describing what the prompt does",
  "prompt":  "[ROLE]    You are a...\n[TASK]    Write / review / summarise...\n[STYLE]   Tone and style instructions.\n[FORMAT]  Output format instructions.\n[INPUT]   "
}
```

The `[ROLE]`, `[TASK]`, `[STYLE]`, `[FORMAT]` labels are shown in the library for readability but are **automatically stripped before injection** so the AI receives clean instructions.

---

## Importing a Prompt Pack

Click **Import Category** in the My Templates section and select any `.json` file that matches the format above.

To import a specific persona pack, use the relevant file under `prompts/`.  
To see an example with 3 prompts: use `prompts/example.json`

---

## Contributing New Prompts

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for full instructions.

**Quick summary:**

1. Fork the repository
2. Add your prompts to the relevant file under `prompts/` or create a new pack file
3. Follow the prompt format above
4. Open a pull request with a short description of what persona/use case you're adding

---

## Repo Structure

```
├── index.html                             # The app — open this in your browser
├── favicon.svg                            # Browser tab icon
├── vercel.json                            # Deployment config
├── og.svg                                 # Social preview image
├── prompts/
│   ├── everyday.json                      # 20 everyday prompts
│   ├── developer.json                     # 5 developer prompts
│   ├── product-owner.json                 # 5 product owner prompts
│   ├── business-analyst.json              # 5 business analyst prompts
│   ├── sales.json                         # 4 sales prompts
│   ├── customer-success.json              # 4 customer success prompts
│   ├── technical-account-management.json  # 10 TAM prompts
│   ├── engineering-manager.json           # 6 engineering manager prompts
│   ├── hr-people.json                     # 6 HR & people prompts
│   ├── legal.json                         # 5 legal prompts
│   ├── marketing.json                     # 4 marketing prompts
│   └── example.json                       # Example format for contributors
├── .github/
│   ├── workflows/validate-prompts.yml     # Auto-validates JSON on every PR
│   ├── PULL_REQUEST_TEMPLATE.md           # PR checklist for contributors
│   └── ISSUE_TEMPLATE/
│       ├── new-prompts.md                 # New prompt request template
│       └── bug-report.md                 # Bug report template
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## License

MIT — free to use, modify, and distribute.  
Built by [Rakesh Pawali](https://github.com/rakeshpawali-okta).
