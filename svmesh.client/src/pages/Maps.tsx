import { Box, Typography, Card, CardContent, CardActionArea } from "@mui/material";
import { StyledText } from "../components/ui";
import HeroSection from "../components/ui/HeroSection";
import susquehannaImage from "../assets/susquehanna-valley.jpg";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 2, md: 3 },
            }}
          >
            {maps.map((map) => (
              <Card
                key={map.id}
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  component="a"
                  href={map.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                        }}
                      >
                        {map.title}
                      </Typography>
                      <OpenInNewIcon
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                    </Box>
                    <StyledText
                      type="body"
                      sx={{ color: "text.secondary", flexGrow: 1 }}
                    >
                      {map.description}
                    </StyledText>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
