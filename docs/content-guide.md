# Content Authoring Guide

Markdown content lives in two folders that are mounted into the app container:

- `pages/` -> served at `/content/pages/<slug>.md`
- `updates/` -> served at `/content/updates/<slug>.md`

## Frontmatter

Each file must start with YAML frontmatter followed by content:

```markdown
---
title: "Page title"
subtitle: "Optional subtitle"
heroImage: "susquehanna-valley.jpg"  # optional, see assets map in the client
rightImage: "meshtastic-powered.png"  # optional, home page only
rightImageAlt: "Alt text"             # optional
attributionUrl: "https://example.com" # optional
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
- Run `npm run lint` in `svmesh.client` and `dotnet build` in `SVMesh.Server` before committing.

## Deployment notes
- In containers, `pages/` and `updates/` are mounted read-only to `/app/wwwroot/content/pages` and `/app/wwwroot/content/updates`.
- Environment variable `ALLOWED_ORIGINS` controls CORS for content fetches; `RATE_LIMIT_REQUESTS_PER_MINUTE` controls rate limits.
