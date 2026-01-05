# SVMesh Markdown Guide

This guide explains the markdown formatting features available for SVMesh pages and updates, including special banner components for warnings, errors, and information.

## Table of Contents

- [Basic Markdown Syntax](#basic-markdown-syntax)
- [Special Banner Components](#special-banner-components)
- [Images and Media](#images-and-media)
- [Code Blocks](#code-blocks)
- [Frontmatter Configuration](#frontmatter-configuration)
- [Page vs Update Structure](#page-vs-update-structure)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Quick Reference](#quick-reference)

## Basic Markdown Syntax

SVMesh supports standard markdown formatting for all content.

### Headers

```markdown
# H1 - Main Title

## H2 - Section Title

### H3 - Subsection Title

#### H4 - Minor Heading
```

### Text Formatting

```markdown
**Bold text** or **bold text**
_Italic text_ or _italic text_
~~Strikethrough text~~
`Inline code`
```

### Links

```markdown
[Link text](https://example.com)
[Internal page link](/pages/getting-started)
[Link with title](https://example.com "Hover title")
```

### Lists

**Unordered lists:**

```markdown
- Item one
- Item two
  - Nested item
  - Another nested item
- Item three
```

**Ordered lists:**

```markdown
1. First item
2. Second item
   1. Nested item
   2. Another nested item
3. Third item
```

**Task lists:**

```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And have multiple paragraphs.
```

### Horizontal Rules

```markdown
---
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
```

**Alignment:**

```markdown
| Left | Center | Right |
| :--- | :----: | ----: |
| L    |   C    |     R |
```

## Special Banner Components

SVMesh includes three types of special banner components for highlighting important information.

### Warning Banners

```markdown
::warning[Optional Title]
This is a warning message that will be displayed in a yellow warning banner.
You can use **markdown** inside warning banners.
::warning
```

**Usage:**

- Use for important notices that need attention
- Yellow/amber color scheme
- Warning icon automatically included

### Critical Banners

```markdown
::critical[Important Security Notice]
This is a critical message that will be displayed in a red error banner.
Use for **urgent** information or security warnings.
::critical
```

**Usage:**

- Use for urgent issues, security warnings, or critical problems
- Red color scheme with error styling
- Error icon automatically included

### Info Banners

```markdown
::info[Pro Tip]
This is an informational message displayed in a blue info banner.
Perfect for tips, additional context, or helpful information.
::info
```

**Usage:**

- Use for helpful tips, additional context, or supplementary information
- Blue color scheme
- Info icon automatically included

### Banner Limitations and Notes

**Important guidelines:**

- Banners cannot be nested inside each other
- Banner content supports standard markdown formatting
- Keep banner content concise for maximum impact
- Use an empty line before and after banners for proper rendering
- Banner titles are optional but recommended for clarity

**Incorrect usage:**

```markdown
::warning[Don't Do This]
::info[Nested banner - this won't work]
Nested banners are not supported.
::info
::warning
```

**Correct usage:**

```markdown
::warning[First Warning]
This is the first warning banner.
::warning

::info[Separate Info]
This is a separate info banner with proper spacing.
::info
```

### Banner Examples in Context

```markdown
# Getting Started Guide

Welcome to our platform! Here's what you need to know.

::info[New User Tip]
First-time users should start with the basic setup before moving to advanced features.
::info

## Important Security Information

::critical[Security Warning]
Never share your private keys or authentication tokens with anyone.
::critical

## Common Issues

::warning[Known Issue]
Some users may experience delays during peak usage hours. This is being addressed.
::warning

The rest of your markdown content continues normally...
```

## Images and Media

### Basic Image Syntax

```markdown
![Alt text](image-filename.jpg)
![Alt text with title](image-filename.jpg "Image title")
```

### Image Storage

**Client-side images:**

Place images in the appropriate directory:

```
svmesh.client/public/images/
```

Reference them in markdown:

```markdown
![Device setup](/images/device-setup.jpg)
```

### Image Optimization

**Best practices:**

- Use WebP format when possible for smaller file sizes
- Compress images before uploading
- Recommended max width: 1920px for hero images, 800px for inline images
- Use descriptive filenames: `antenna-setup-diagram.jpg` not `img001.jpg`
- Always include meaningful alt text for accessibility

**Example with proper alt text:**

```markdown
![T1000-E device showing the power button location on the right side](/images/t1000e-power-button.jpg)
```

### Hero Images

Hero images are configured in frontmatter and displayed at the top of pages:

```yaml
---
title: "Getting Started"
heroImage: "mesh-network-hero.jpg"
attributionUrl: "https://unsplash.com/photos/example"
---
```

**Hero image guidelines:**

- Dimensions: 1920x600px recommended
- Format: JPG or WebP
- File size: Keep under 500KB
- Choose images with good contrast for text overlay
- Always provide attribution for stock photos

## Code Blocks

### Inline Code

Use single backticks for inline code:

```markdown
The `configure()` function accepts a `ConfigObject` parameter.
```

### Code Blocks with Syntax Highlighting

Use triple backticks with language identifier:

````markdown
```javascript
const device = new MeshtasticDevice();
device.connect();
```
````

**Supported languages:**

- `javascript` / `js`
- `typescript` / `ts`
- `python`
- `bash` / `shell`
- `json`
- `yaml`
- `markdown` / `md`
- `html`
- `css`
- `csharp` / `cs`

### Code Block Examples

**JavaScript:**

````markdown
```javascript
function setupChannel(name, frequency) {
  return {
    name: name,
    frequency: frequency,
    psk: generatePSK(),
  };
}
```
````

**Python:**

````markdown
```python
def configure_device(device_id, settings):
    device = MeshtasticDevice(device_id)
    device.apply_settings(settings)
    return device.status
```
````

**Command line:**

````markdown
```bash
# Install Meshtastic CLI
pip install meshtastic

# Check device connection
meshtastic --info
```
````

**Configuration files:**

````markdown
```yaml
device:
  name: "Node-001"
  region: "US"
  role: "ROUTER"
channels:
  - name: "LongFast"
    frequency: 915.0
```
````

## Frontmatter Configuration

### Pages

Pages use frontmatter for configuration and metadata:

```yaml
---
title: "Page Title"
subtitle: "Optional subtitle for hero section"
heroImage: "image-filename.jpg"
attributionUrl: "https://source-attribution-url.com"
---
```

**Fields:**

- **title** (required): Main page title
- **subtitle** (optional): Displayed in hero section
- **heroImage** (optional): Background image for hero section
- **attributionUrl** (optional): Attribution link for hero image

### Updates

Updates require specific frontmatter for proper display:

```yaml
---
title: "Update Title"
date: "YYYY-MM-DD"
summary: "Brief description of the update content"
tag: "category-name"
---
```

**Fields:**

- **title** (required): Update title for listings and display
- **date** (required): Publication date in YYYY-MM-DD format
- **summary** (required): Brief summary for update listings
- **tag** (optional): Category tag for filtering and organization

## Pages and Updates

### Page Structure

Pages have static content and get their own listing in the header menu:

```
/pages/page-name.md
```

**Example page:**

```markdown
---
title: "Channel Settings Guide"
subtitle: "Configure your Meshtastic device channels"
---

# Channel Configuration

This guide covers how to set up and configure channels...

::info[Quick Start]
Most users can use the default channel settings for basic operation.
::info

## Basic Setup

1. Open the Meshtastic app
2. Navigate to channel settings
   ...
```

### Update Structure

Updates are time-sensitive posts like news, announcements, or community updates, and show up on the home page:

```
/updates/update-filename.md
```

**Example update:**

```markdown
---
title: "Community Meeting Scheduled"
date: "2025-12-15"
summary: "Join us for our monthly community meeting to discuss network improvements and new features."
tag: "community"
---

# Monthly Community Meeting

We're excited to announce our next community meeting...
```

## Best Practices

1. **Use descriptive headings** - Make content scannable
2. **Break up long sections** - Use subheadings every few paragraphs
3. **Include relevant banners** - Highlight important information appropriately
4. **Front-load important information** - Put key points early
5. **Use active voice** - "Configure your device" vs "Your device should be configured"
6. **Include examples** - Show practical applications
7. **Link to related content** - Help users find additional information

### Banner Usage Guidelines

1. **Don't overuse banners** - They lose impact if used too frequently
2. **Choose appropriate types**:
   - `::info` for helpful tips and additional context
   - `::warning` for important notices and cautions
   - `::critical` for urgent issues and security warnings
3. **Keep banner content concise** - Long banners become hard to read
4. **Use markdown inside banners** - Enhance readability with formatting

### Frontmatter Best Practices

**For Pages:**

- Keep titles concise but descriptive
- Use subtitles to provide additional context
- Ensure hero images are optimized for web use
- Provide an attribution URL for any images sourced from the Internet.

**For Updates:**

- Use consistent date formatting (YYYY-MM-DD)
- Write compelling summaries for feed listings
- Use consistent tag naming (lowercase, hyphenated)

### File Organization

```
pages/
├── getting-started.md      # Main guides
├── channel-settings.md     # Specific topics
└── troubleshooting.md      # Support content

updates/
├── community-meeting.md    # Descriptive names
├── version-2-release.md    # Version releases
└── welcome-to-svmesh.md    # Announcements
```

**Note:** Use descriptive filenames rather than date prefixes. Dates should be specified in the frontmatter `date` field.

### Common Formatting Examples

**Tables**:

```markdown
| Device  | Battery Life | GPS | Price |
| ------- | ------------ | --- | ----- |
| T1000-E | 7 days       | Yes | $89   |
| R1 Neo  | 5 days       | Yes | $129  |
```

**Task Lists**:

```markdown
- [x] Complete basic setup
- [x] Configure channels
- [ ] Set up encryption
- [ ] Test messaging
```

**Complex Example**:

```markdown
# Device Configuration

::info[Before You Start]
Make sure your device is fully charged and connected to the Meshtastic app.
::info

## Step 1: Basic Setup

1. Open the Meshtastic app
2. Select your device from the list

::warning[Connection Issues]
If your device doesn't appear, try resetting the Bluetooth connection.
::warning

## Step 2: Channel Configuration

Configure your channels using these settings:

| Setting   | Value      | Notes           |
| --------- | ---------- | --------------- |
| Name      | "LongFast" | Default channel |
| Frequency | 915MHz     | US frequency    |

::critical[Important]
Never use channels that interfere with emergency services.
::critical

Your device is now ready for mesh networking!
```

## Troubleshooting

### Common Markdown Issues

**Banners not rendering:**

```markdown
Incorrect - missing closing tag:
::warning[Important]
This banner won't render properly.

Correct:
::warning[Important]
This banner will render correctly.
::warning
```

**Banners not rendering - typo in tag:**

```markdown
Incorrect - typo in closing tag:
::warning[Important]
Banner content here.
::warnign

Correct:
::warning[Important]
Banner content here.
::warning
```

**Images not displaying:**

```markdown
Incorrect - wrong path:
![Device](device.jpg)

Correct - path from public directory:
![Device](/images/device.jpg)
```

**Code blocks not highlighting:**

````markdown
Incorrect - unsupported language identifier:

```javascipt
const x = 1;
```

Correct:

```javascript
const x = 1;
```
````

**Tables not rendering:**

```markdown
Incorrect - missing separator row:
| Header 1 | Header 2 |
| Data 1 | Data 2 |

Correct:
| Header 1 | Header 2 |
| -------- | -------- |
| Data 1 | Data 2 |
```

**Links not working:**

```markdown
Incorrect - missing protocol:
[Visit our site](example.com)

Correct:
[Visit our site](https://example.com)
```

### Frontmatter Issues

**Updates not appearing on home page:**

```yaml
Incorrect - missing required fields:
---
title: "My Update"
---
Correct - all required fields:
---
title: "My Update"
date: "2026-01-05"
summary: "Brief description of the update"
---
```

**Date format errors:**

```yaml
Incorrect formats:
date: "Jan 5, 2026"
date: "05-01-2026"
date: "1/5/2026"

Correct format:
date: "2026-01-05"
```

## Quick Reference

### Banner Syntax Cheat Sheet

```markdown
::info[Title]
Content here. Supports **markdown**.
::info

::warning[Title]
Content here. Supports **markdown**.
::warning

::critical[Title]
Content here. Supports **markdown**.
::critical
```

### Page Frontmatter Template

```yaml
---
title: "Your Page Title"
subtitle: "Optional subtitle"
heroImage: "image-name.jpg"
attributionUrl: "https://source-url.com"
---
```

### Update Frontmatter Template

```yaml
---
title: "Update Title"
date: "YYYY-MM-DD"
summary: "Brief description for listings"
tag: "category-name"
---
```

### Common Text Formatting

```markdown
**Bold**
_Italic_
`Code`
[Link](url)
![Image](path)
```

### File Naming Conventions

**Pages:**

```
pages/getting-started.md
pages/channel-settings.md
pages/knowledgebase/device-guide.md
```

**Updates:**

```
updates/welcome-to-svmesh.md
updates/community-meeting.md
updates/version-2-release.md
```

**Images:**

```
svmesh.client/public/images/hero-mesh-network.jpg
svmesh.client/public/images/device-setup-01.jpg
```
