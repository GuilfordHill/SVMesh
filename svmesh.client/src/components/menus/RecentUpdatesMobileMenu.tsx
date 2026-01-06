import { useState } from "react";
import { Box, Card, CardContent, Drawer, IconButton, Stack, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { StyledText } from "../ui";
import UpdateCard from "../updates/UpdateCard";
import type { UpdatePost } from "../../utils/markdown";

interface RecentUpdatesMobileMenuProps {
  posts: UpdatePost[];
  error?: string | null;
}

export default function RecentUpdatesMobileMenu({ posts, error }: RecentUpdatesMobileMenuProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  if (error) {
    return (
      <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 2 }}>
          <StyledText type="subheading" sx={{ mb: 1 }}>
            Recent Updates
          </StyledText>
          <StyledText type="body" sx={{ color: "error.main", fontSize: "0.9rem" }}>
            Error loading updates
          </StyledText>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 2 }}>
          <StyledText type="subheading" sx={{ mb: 1 }}>
            Recent Updates
          </StyledText>
          <StyledText
            type="body"
            sx={{ color: "text.secondary", fontStyle: "italic", fontSize: "0.9rem" }}
          >
            No updates available
          </StyledText>
        </CardContent>
      </Card>
    );
  }

  const latestPost = posts[0];
  const formatDate = (dateString: string) => {
    // Parse the date string as YYYY-MM-DD and create a date at midnight local time
    // to avoid timezone offset issues
    const [year, month, day] = dateString.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <>
      <Card
        onClick={handleOpenDrawer}
        sx={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <StyledText type="subheading">Recent Updates</StyledText>
            <ChevronRightIcon sx={{ color: "primary.main" }} />
          </Box>

          <Box>
            <StyledText type="body" sx={{ fontWeight: 600, mb: 0.5, fontSize: "0.95rem" }}>
              {latestPost.metadata.title}
            </StyledText>
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              <Chip
                label={formatDate(latestPost.metadata.date)}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: "20px" }}
              />
              {latestPost.metadata.tag && (
                <Chip
                  label={latestPost.metadata.tag}
                  size="small"
                  color="primary"
                  sx={{ fontSize: "0.7rem", height: "20px" }}
                />
              )}
            </Box>
            <StyledText
              type="body"
              sx={{
                color: "text.secondary",
                fontSize: "0.85rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {latestPost.metadata.summary}
            </StyledText>
          </Box>
        </CardContent>
      </Card>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            maxHeight: "85vh",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <StyledText type="subheading">Recent Updates</StyledText>
            <IconButton onClick={handleCloseDrawer} size="small" sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Stack spacing={2} sx={{ overflowY: "auto", flex: 1, p: 2 }}>
          {posts.map((post) => (
            <UpdateCard key={post.slug} post={post} showFullContent={false} />
          ))}
        </Stack>
      </Drawer>
    </>
  );
}
