# Content Authoring Guide

Markdown content lives in two folders:

- `pages/` -> served at `/content/pages/<slug>.md`
  - `pages/knowledgebase` -> served at `/content/pages/knowledgebase/<slug>.md`
- `updates/` -> served at `/content/updates/<slug>.md`

## Frontmatter

Each static page must start with YAML frontmatter followed by content:

```markdown
---
title: "Page title"
subtitle: "Optional subtitle"
heroImage: "susquehanna-valley.jpg" # optional, see assets map in the client
rightImage: "meshtastic-powered.png" # optional, home page only
rightImageAlt: "Alt text" # optional
attributionUrl: "https://example.com" # please attribute images from the internet and make sure their license allows use.
---

# Heading

Body content...
```

For updates use:

```markdown
---
title: "Update title"
date: "2025-12-07"
summary: "One-line summary"
tag: "optional"
---

Content here
```

## Validation tips

- File names must be alphanumeric with dashes/underscores and end in `.md` (enforced by the API).
- Avoid duplicate slugs; the slug is the file name without `.md`.
- Keep images referenced in `pages/` or `updates/` in the `svmesh.client/src/assets` map when needed.
