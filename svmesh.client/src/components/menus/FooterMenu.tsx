import { Box, Container, Stack, Link } from "@mui/material";
import { StyledText } from "../ui";
import { SOCIAL_LINKS } from "../../config/social";

export default function FooterMenu() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 4 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 4 }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Stack spacing={0.5}>
            <StyledText type="body" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
              SVMesh
            </StyledText>
            <StyledText type="body" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
              Building community mesh networks in the Susquehanna Valley
            </StyledText>
          </Stack>

          <Stack direction="row" spacing={3} alignItems="center">
            <Link
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "text.primary",
                textDecoration: "none",
                fontSize: "0.875rem",
                "&:hover": { color: "primary.main" },
              }}
            >
              Discord
            </Link>
            <Link
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "text.primary",
                textDecoration: "none",
                fontSize: "0.875rem",
                "&:hover": { color: "primary.main" },
              }}
            >
              Facebook
            </Link>
          </Stack>

          <StyledText
            type="body"
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
            }}
          >
            © {currentYear} SVMesh
          </StyledText>
        </Stack>
      </Container>
    </Box>
  );
}
