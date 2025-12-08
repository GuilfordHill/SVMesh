import { Box, Paper, Typography } from "@mui/material";
import { StyledText } from "../components/ui";
import HeroSection from "../components/ui/HeroSection";
import susquehannaImage from "../assets/susquehanna-valley.jpg";

// Page data for the Maps page
const pageData = {
  title: "Network Maps",
  subtitle:
    "Explore the Susquehanna Valley mesh network through interactive maps",
  heroImage: susquehannaImage,
  rightImage: "",
  rightImageAlt: "",
  attributionUrl: "",
};

const maps = [
  {
    title: "Malla Dashboard",
    description:
      "Logs Meshtastic packets from the Susquehanna Valley mesh network.",
    url: "https://malla.susme.sh/map",
    id: "coverage-map",
  },
  {
    title: "Mesh Monitor",
    description: "Map of nodes seen in the Susquehanna Valley mesh network.",
    url: "https://meshmonitor.susme.sh/#nodes",
    id: "node-monitor",
  },
  {
    title: "MeshView",
    description:
      "Simple map of nodes and conversations in the Susquehanna Valley mesh network.",
    url: "https://meshview.susme.sh/map",
    id: "topology-map",
  },
];

export default function Maps() {
  return (
    <>
      <HeroSection
        backgroundImage={pageData.heroImage}
        title={pageData.title}
        subtitle={pageData.subtitle}
        rightImage={pageData.rightImage}
        rightImageAlt={pageData.rightImageAlt}
        attributionUrl={pageData.attributionUrl}
      />

      <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <StyledText type="body-large" sx={{ mb: 4, textAlign: "center" }}>
            Explore our mesh network through these interactive maps. Each map
            provides different insights into our network coverage, node status,
            and topology.
          </StyledText>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 3, md: 4 },
            }}
          >
            {maps.map((map) => (
              <Paper
                key={map.id}
                elevation={3}
                sx={{
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "background.paper" }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: "primary.main",
                    }}
                  >
                    {map.title}
                  </Typography>
                  <StyledText
                    type="body"
                    sx={{ mb: 2, color: "text.secondary" }}
                  >
                    {map.description}
                  </StyledText>
                </Box>

                <Box
                  sx={{
                    height: { xs: "400px", md: "500px" },
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <iframe
                    src={map.url}
                    title={map.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                    }}
                    allowFullScreen
                    loading="lazy"
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
