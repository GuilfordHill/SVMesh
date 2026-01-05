import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { forwardRef } from "react";
import type { LinkProps } from "@mui/material/Link";

const BaseLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  fontWeight: 500,
  borderBottom: `1px solid transparent`,
  transition: "all 0.2s ease-in-out",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  "&:hover": {
    color: theme.palette.primary.dark,
    borderBottomColor: "currentColor",
    textDecoration: "none",
  },
}));

const LinkIcon = styled(OpenInNewRoundedIcon)({
  fontSize: "1rem",
  color: "currentColor",
  opacity: 0.75,
});

// Add a small open-in-new style indicator to make links stand out
const StyledLink = forwardRef<HTMLAnchorElement, LinkProps>(function StyledLink(
  { children, ...props },
  ref
) {
  return (
    <BaseLink ref={ref} {...props}>
      <span>{children}</span>
      <LinkIcon />
    </BaseLink>
  );
});

export default StyledLink;
