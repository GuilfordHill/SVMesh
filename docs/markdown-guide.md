# SVMesh Markdown Guide

This guide explains the markdown formatting features available for SVMesh pages and updates, including special banner components for warnings, errors, and information.

## Table of Contents

- [Basic Markdown Syntax](#basic-markdown-syntax)
- [Special Banner Components](#special-banner-components)
- [Frontmatter Configuration](#frontmatter-configuration)
- [Page vs Update Structure](#page-vs-update-structure)
- [Best Practices](#best-practices)

## Basic Markdown Syntax

SVMesh supports all standard markdown formatting with enhanced styling through Material-UI components.

### Headings

```markdown
# Heading 1 (Main Title)
## Heading 2 (Section)
### Heading 3 (Subsection)
```

**Rendered as:**
- **H1**: Large heading with top margin spacing
- **H2**: Medium heading with section spacing  
- **H3**: Smaller subheading with reduced spacing

### Text Formatting

```markdown
**Bold text**
*Italic text*
`Inline code`
[Link text](https://example.com)
[Internal link](./other-page)
```

**Features:**
- Links automatically open in new tabs if they start with `http`
- Internal links stay in the same tab (ex. `/getting-started`)
- Inline code gets monospace font with background highlighting

### Lists

```markdown
- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested numbered item
   2. Another nested item
```

**Features:**
- Proper spacing and indentation
- Support for nested lists
- Consistent bullet styling

### Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
> 
> And include multiple paragraphs
```

**Styling:**
- Left border in primary theme color
- Background highlighting
- Proper padding and spacing

### Code Blocks

```markdown
\```javascript
function example() {
  console.log("Code block example");
}
\```

\```bash
# Shell commands
npm install package-name
\```
```

**Features:**
- Syntax highlighting (language-specific)
- Monospace font
- Background highlighting for readability

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

Pages are static content like guides, documentation, or reference materials:

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

Updates are time-sensitive posts like news, announcements, or community updates:

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

::warning[Time Change]
Please note this month's meeting is 30 minutes earlier than usual.
::warning
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
├── 2025-12-15-meeting.md   # Date-prefixed updates
├── 2025-12-10-release.md   # Version releases
└── 2025-12-07-welcome.md   # Announcements
```

### Common Formatting Examples

**Tables** (standard markdown):
```markdown
| Device | Battery Life | GPS | Price |
|--------|-------------|-----|--------|
| T1000-E | 7 days | Yes | $89 |
| R1 Neo | 5 days | Yes | $129 |
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

| Setting | Value | Notes |
|---------|--------|--------|
| Name | "LongFast" | Default channel |
| Frequency | 915MHz | US frequency |

::critical[Important]
Never use channels that interfere with emergency services.
::critical

Your device is now ready for mesh networking!
```

This documentation should help content creators understand all the available formatting options and use them effectively to create engaging, well-structured content for the SVMesh platform.