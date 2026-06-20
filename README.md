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
- Guided prompt builder for creating structured prompts step by step
- Filter by persona: Everyday, Developer, Product Owner, Business Analyst, Sales, Customer Success, Technical Account Management, Engineering Manager, HR & People, Legal, Marketing
- Search across all prompts
- Save your own prompts (stored in localStorage)
- Share your own saved prompts with a shareable link
- Export your prompts as JSON to share with your team
- Import JSON prompt packs from others
- No install, no account, no server

---

## How to Use

**Option A — Visit the live site** *(easiest)*  
Open [promptbar-kappa.vercel.app](https://promptbar-kappa.vercel.app/) in Chrome.

**Option B — Run locally**  
Clone the repo, then run a simple static server from the `promptbar` folder:

```bash
cd promptbar
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/` in Chrome.

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

You can create prompts in two ways:

- Use the guided builder to generate a structured draft from a few inputs.
- Use the manual form to write the full prompt yourself.

## Why This Structure Works

The five fields make prompts easier to reuse, edit, and share because each part has one job:

- `Role` sets the perspective the model should take.
- `Task` makes the objective unambiguous.
- `Style` controls tone, depth, and voice.
- `Format` tells the model exactly how to present the answer.
- `Input` separates the reusable prompt from the content you are working on.

That separation helps people get more consistent results, and it makes the prompts much easier to copy, tweak, or turn into a reusable template.

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
├── index.html                             # App markup and landing page
├── styles.css                             # App styles
├── js/
│   └── app.js                             # App logic, rendering, storage, builder, sharing
├── favicon.svg                            # Browser tab icon
├── vercel.json                            # Deployment config
├── og.svg                                 # Social preview image
├── prompts/
│   ├── everyday.json                      # Built-in everyday prompt pack
│   ├── developer.json                     # Built-in developer prompt pack
│   ├── product-owner.json                 # Built-in product owner prompt pack
│   ├── business-analyst.json              # Built-in business analyst prompt pack
│   ├── sales.json                         # Built-in sales prompt pack
│   ├── customer-success.json              # Built-in customer success prompt pack
│   ├── technical-account-management.json  # Built-in TAM prompt pack
│   ├── engineering-manager.json           # Built-in engineering manager prompt pack
│   ├── hr-people.json                     # Built-in HR & people prompt pack
│   ├── legal.json                         # Built-in legal prompt pack
│   ├── marketing.json                     # Built-in marketing prompt pack
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
