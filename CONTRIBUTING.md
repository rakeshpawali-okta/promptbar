# Contributing to PromptBar

Thank you for wanting to add prompts. This guide covers everything you need to open a pull request.

---

## What Makes a Good Prompt

Before writing, ask:

- **Is it reusable?** A prompt for "write a follow-up email" is useful to thousands of people. A prompt for a specific internal process is not.
- **Is it role-specific?** Good prompts are written from a clear professional perspective (a senior developer, a product owner, a CSM).
- **Does it produce consistent output?** The `[FORMAT]` field should define a predictable structure so the AI doesn't guess how to respond.
- **Is the `[INPUT]` placeholder clear?** The user should know exactly what to paste after `[INPUT]`.

---

## Prompt Format

Every prompt must follow this structure:

```json
{
  "title":   "Short display name — shown on the card and as the bookmark name",
  "tag":     "Category badge — keep it short (1-2 words, e.g. Agile, Outbound, Documentation)",
  "group":   "One of: Developer | Product Owner | Business Analyst | Sales | Customer Success | Marketing | General",
  "desc":    "One sentence — what does this prompt help the user do?",
  "prompt":  "[ROLE]    You are a...\n[TASK]    Write / review / summarise / explain...\n[STYLE]   Tone and style guidance.\n[FORMAT]  What the output should look like.\n[INPUT]   "
}
```

### Field rules

| Field | Rules |
|---|---|
| `title` | Max 50 characters. Sentence case. No punctuation at end. |
| `tag` | Max 20 characters. Title Case. |
| `group` | Must exactly match one of the allowed values above. |
| `desc` | One sentence, no full stop at end, max 100 characters. |
| `prompt` | Must end with `[INPUT]   ` (3 spaces after). Use `\n` for line breaks. |

### Prompt writing tips

- **[ROLE]** — name the job title and seniority. "You are a senior..." sets the right tone.
- **[TASK]** — start with a verb (Write, Review, Summarise, Draft, Translate, Extract).
- **[STYLE]** — include at least one negative constraint (e.g. "No exclamation marks", "No jargon", "No fluff"). These reduce AI hedging.
- **[FORMAT]** — be specific. "Bullet points under three headings" beats "structured format".
- **[INPUT]** — always the last line. Three spaces after the colon.

---

## Where to Add Your Prompts

### Option A — Add to `prompts/default.json`

Add your prompt object to the `prompts` array in `prompts/default.json`. Keep prompts grouped by `group` for readability.

### Option B — Create a new pack file

If you're contributing a themed pack (e.g. HR prompts, Legal prompts), create a new file:

```
prompts/hr-pack.json
prompts/legal-pack.json
prompts/devops-pack.json
```

Use the same JSON structure as `default.json`. Include a meaningful `description` field at the top.

---

## Opening a Pull Request

1. **Fork** the repository on GitHub
2. **Create a branch** named after your contribution:
   ```
   git checkout -b prompts/add-hr-pack
   git checkout -b prompts/add-devops-templates
   ```
3. **Add your prompts** following the format above
4. **Validate your JSON** — paste it into [jsonlint.com](https://jsonlint.com) before opening the PR
5. **Open a pull request** with:
   - A title like `Add HR prompt pack (5 prompts)`
   - A short description of the persona/use case and why the prompts are useful
   - Any example output (optional but appreciated)

---

## PR Checklist

Before submitting, confirm:

- [ ] JSON is valid (no trailing commas, correct quotes)
- [ ] `group` value exactly matches an allowed persona
- [ ] `prompt` field ends with `[INPUT]   ` (3 spaces)
- [ ] `\n` used for line breaks (not actual newlines inside the string)
- [ ] `title` is unique — not a duplicate of an existing prompt
- [ ] `desc` is one sentence and under 100 characters

---

## Adding a New Persona

If your prompts don't fit any existing persona, propose a new one in your PR description. New personas require updating `index.html` (the `PERSONAS` array) in addition to the JSON file. Mention this in your PR and the maintainer will handle the code change.

---

## Questions?

Open a GitHub Issue with the label `question` and we'll get back to you.
