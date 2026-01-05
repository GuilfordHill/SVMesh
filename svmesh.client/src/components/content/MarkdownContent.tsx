import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { StyledText, StyledLink, WarningBanner } from "../ui";
import { Box } from "@mui/material";

interface MarkdownContentProps {
  content: string;
}

interface ContentPart {
  type: "markdown" | "warning";
  content: string;
  warningType?: "warning" | "critical" | "info";
  title?: string;
}

// Process custom warning syntax into separate parts
function processWarnings(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  let lastIndex = 0;

  // Find all warning blocks
  const warningRegex = /::(warning|critical|info)(?:\[(.*?)\])?\n([\s\S]*?)::\1/g;
  let match;

  while ((match = warningRegex.exec(content)) !== null) {
    // Add markdown content before this warning
    if (match.index > lastIndex) {
      const markdownContent = content.slice(lastIndex, match.index).trim();
      if (markdownContent) {
        parts.push({ type: "markdown", content: markdownContent });
      }
    }

    // Add the warning
    parts.push({
      type: "warning",
      content: match[3].trim(),
      warningType: match[1] as "warning" | "critical" | "info",
      title: match[2] || undefined,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining markdown content
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      parts.push({ type: "markdown", content: remaining });
    }
  }

  return parts;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const contentParts = processWarnings(content);

  // Define shared markdown components
  const markdownComponents = {
    h1: ({ children }: any) => (
      <StyledText type="heading" component="h1" sx={{ mt: 0, mb: 3 }}>
        {children}
      </StyledText>
    ),
    h2: ({ children }: any) => (
      <StyledText
        type="heading"
        component="h2"
        sx={{ mt: 0, mb: 2.5, fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.65rem" } }}
      >
        {children}
      </StyledText>
    ),
    h3: ({ children }: any) => (
      <StyledText
        type="subheading"
        component="h3"
        sx={{ mt: 3, mb: 2, fontSize: { xs: "1.1rem", sm: "1.15rem", md: "1.25rem" } }}
      >
        {children}
      </StyledText>
    ),
    p: ({ children }: any) => (
      <StyledText type="body-large" sx={{ mb: 2.5 }}>
        {children}
      </StyledText>
    ),
    a: ({ href, children }: any) => (
      <StyledLink href={href || "#"} target={href?.startsWith("http") ? "_blank" : undefined}>
        {children}
      </StyledLink>
    ),
    ul: ({ children }: any) => (
      <Box component="ul" sx={{ pl: 3, mb: 2.5 }}>
        {children}
      </Box>
    ),
    ol: ({ children }: any) => (
      <Box component="ol" sx={{ pl: 3, mb: 2.5 }}>
        {children}
      </Box>
    ),
    li: ({ children }: any) => (
      <StyledText type="body-large" component="li" sx={{ mb: 0.5 }}>
        {children}
      </StyledText>
    ),
    blockquote: ({ children }: any) => (
      <Box
        sx={{
          borderLeft: 4,
          borderColor: "primary.main",
          pl: 3,
          py: 1,
          mb: 2.5,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        {children}
      </Box>
    ),
    code: ({ children }: any) => (
      <Box
        component="code"
        sx={{
          fontFamily: "monospace",
          bgcolor: "background.paper",
          px: 1,
          py: 0.5,
          borderRadius: 0.5,
          fontSize: "0.9em",
        }}
      >
        {children}
      </Box>
    ),
    table: ({ children }: any) => (
      <Box sx={{ overflowX: "auto", mb: 2.5 }}>
        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            bgcolor: "background.paper",
            "& th": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 600,
              p: 1.5,
              textAlign: "left",
              borderBottom: 2,
              borderColor: "divider",
            },
            "& td": {
              p: 1.5,
              borderBottom: 1,
              borderColor: "divider",
            },
            "& tr:last-child td": {
              borderBottom: 0,
            },
            "& tr:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          {children}
        </Box>
      </Box>
    ),
    thead: ({ children }: any) => <Box component="thead">{children}</Box>,
    tbody: ({ children }: any) => <Box component="tbody">{children}</Box>,
    tr: ({ children }: any) => <Box component="tr">{children}</Box>,
    th: ({ children }: any) => (
      <Box component="th">
        <StyledText type="body-large" component="span" sx={{ fontWeight: 600, color: "inherit" }}>
          {children}
        </StyledText>
      </Box>
    ),
    td: ({ children }: any) => (
      <Box component="td">
        <StyledText type="body" component="span">
          {children}
        </StyledText>
      </Box>
    ),
  };

  return (
    <Box>
      {contentParts.map((part, index) => {
        if (part.type === "warning") {
          return (
            <WarningBanner key={index} type={part.warningType!} title={part.title}>
              <ReactMarkdown
                components={{
                  p: ({ children }: any) => (
                    <StyledText type="body" sx={{ mb: 0 }}>
                      {children}
                    </StyledText>
                  ),
                }}
              >
                {part.content}
              </ReactMarkdown>
            </WarningBanner>
          );
        }

        return (
          <ReactMarkdown remarkPlugins={[remarkGfm]} key={index} components={markdownComponents}>
            {part.content}
          </ReactMarkdown>
        );
      })}
    </Box>
  );
}
