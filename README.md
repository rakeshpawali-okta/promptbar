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
- 47 built-in prompts across 7 personas
- Filter by persona: Everyday, Developer, Product Owner, Business Analyst, Sales, Customer Success, Marketing
- Save your own prompts (stored in localStorage)
- Export your prompts as JSON to share with your team
- Import JSON prompt packs from others
- No install, no account, no server

---

## How to Use

1. Download `index.html` and open it in Chrome
2. Press `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows) to show your bookmarks bar
3. Drag any template button to your bookmarks bar
4. Open Gemini / ChatGPT / Claude, click the text box, then click the bookmark

The prompt is injected instantly. Fill in `[INPUT]` and go.

---

## Prompt Format

All prompts follow a structured format with five fields:

```json
{
  "title":   "Short display name",
  "tag":     "Category badge (e.g. Documentation, Agile)",
  "group":   "Persona (Developer | Product Owner | Business Analyst | Sales | Customer Success | Marketing | General)",
  "desc":    "One sentence describing what the prompt does",
  "prompt":  "[ROLE]    You are a...\n[TASK]    Write / review / summarise...\n[STYLE]   Tone and style instructions.\n[FORMAT]  Output format instructions.\n[INPUT]   "
}
```

The `[ROLE]`, `[TASK]`, `[STYLE]`, `[FORMAT]` labels are shown in the library for readability but are **automatically stripped before injection** so the AI receives clean instructions.

---

## Importing a Prompt Pack

Click **Import JSON** in the My Templates section and select any `.json` file that matches the format above.

To import a specific persona pack, use the relevant file under `prompts/`.  
To see an example with 3 prompts and schema documentation: use `prompts/example.json`

---

## Contributing New Prompts

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for full instructions.

**Quick summary:**

1. Fork the repository
2. Add your prompts to `prompts/default.json` or create a new pack file under `prompts/`
3. Follow the prompt format above
4. Open a pull request with a short description of what persona/use case you're adding

---

## Repo Structure

```
promptbar/
├── index.html                    # The app — open this in your browser
├── favicon.svg                   # Browser tab icon
├── vercel.json                   # Deployment config
├── prompts/
│   ├── everyday.json             # 20 everyday prompts (writing, email, productivity)
│   ├── developer.json            # 5 developer prompts
│   ├── product-owner.json        # 5 product owner prompts
│   ├── business-analyst.json     # 5 business analyst prompts
│   ├── sales.json                # 4 sales prompts
│   ├── customer-success.json     # 4 customer success prompts
│   ├── marketing.json            # 4 marketing prompts
│   └── example.json              # Example format + schema for contributors
├── README.md
└── CONTRIBUTING.md
```

---

## License

MIT — free to use, modify, and distribute.
