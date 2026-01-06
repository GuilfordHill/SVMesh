import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { forwardRef } from "react";
import type { LinkProps } from "@mui/material/Link";

const BaseLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: "underline",
  fontWeight: 500,
  borderBottom: `1px solid transparent`,
  transition: "all 0.2s ease-in-out",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  "&:hover": {
    color: theme.palette.primary.dark,
    borderBottomColor: "currentColor",
    textDecoration: "underline",
  },
}));

const LinkIcon = styled(OpenInNewRoundedIcon)({
  fontSize: "1rem",
  color: "currentColor",
  opacity: 0.75,
});

const StyledLink = forwardRef<HTMLAnchorElement, LinkProps>(function StyledLink(
  { children, href, ...props },
  ref
) {
  const isExternalLink = href?.startsWith("http://") || href?.startsWith("https://");

  return (
    <BaseLink ref={ref} href={href} {...props}>
      <span>{children}</span>
      {isExternalLink && <LinkIcon />}
    </BaseLink>
  );
});

export default StyledLink;
