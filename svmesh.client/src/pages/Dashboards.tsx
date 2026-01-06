import { Box, Typography, Card, CardContent, CardActionArea } from "@mui/material";
import { StyledText, SimpleHero, StyledLink } from "../components/ui";
import susquehannaImage from "../assets/susquehanna-valley.jpg";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import mallaDashImage from "../assets/malla-dash.png";
import meshmonitorDashImage from "../assets/meshmonitor-dash.png";
import meshviewDashImage from "../assets/meshview-dash.png";
import susmeshDashImage from "../assets/susmesh-dash.jpg";

// Page data for the Dashboards page
const pageData = {
  title: "Mesh Dashboards",
  subtitle: "Explore the Susquehanna Valley mesh network through interactive dashboards",
  heroImage: susquehannaImage,
  rightImage: "",
  rightImageAlt: "",
  attributionUrl:
    "https://commons.wikimedia.org/wiki/File:Ridges_and_valleys_near_the_West_Branch_Susquehanna_River.jpg",
};

const dashboards = [
  {
    title: "Malla Dashboard",
    description: "Logs Meshtastic packets from the Susquehanna Valley mesh network.",
    url: "https://malla.susme.sh/map",
    id: "coverage-map",
    image: mallaDashImage,
  },
  {
    title: "Mesh Monitor",
    description: "Map of nodes seen in the Susquehanna Valley mesh network.",
    url: "https://meshmonitor.susme.sh/#nodes",
    id: "node-monitor",
    image: meshmonitorDashImage,
  },
  {
    title: "MeshView",
    description: "Simple map of nodes and conversations in the Susquehanna Valley mesh network.",
    url: "https://meshview.susme.sh/map",
    id: "topology-map",
    image: meshviewDashImage,
  },
  {
    title: "Backbone Map",
    description:
      "Current and upcoming backbone nodes on the mesh network, showing the infrastructure that maintains connectivity across the Susquehanna Valley.",
    url: "https://susme.sh/",
    id: "backbone-map",
    image: susmeshDashImage,
  },
];

export default function Dashboards() {
  return (
    <>
      <SimpleHero
        backgroundImage={pageData.heroImage}
        title={pageData.title}
        subtitle={pageData.subtitle}
        backgroundPosition="center 60%"
        height="30vh"
        attributionUrl={pageData.attributionUrl}
      />

      <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <StyledText type="body-large" sx={{ mb: 2, textAlign: "center" }}>
            The SVMesh group maintains multiple tools for monitoring and diagnosing mesh issues. You
            can view the mesh network in real time with these interactive dashboards. Each dashboard
            provides different insights into coverage, node status, and packet flow so you can see
            exactly what is happening across the network, and could be useful in some scenarios for
            troubleshooting your own nodes.{" "}
            <b>
              However, since Meshtastic is imperfect and each dashboard uses its own node for
              ingress, not all nodes may appear on these dashboards.
            </b>
          </StyledText>
          <StyledText type="body" sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}>
            Malla is the most fully-featured, logging every packet sent across the mesh. Mesh
            Monitor and MeshView are lighter-weight visualizations of the nodes across the mesh,
            better for a quick overview of active nodes.
          </StyledText>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 2, md: 3 },
            }}
          >
            {dashboards.map((dashboard) => (
              <Card
                key={dashboard.id}
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
                  href={dashboard.url}
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
                  <Box
                    component="img"
                    src={dashboard.image}
                    alt={dashboard.title}
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
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
                        {dashboard.title}
                      </Typography>
                      <OpenInNewIcon sx={{ fontSize: 20, color: "primary.main" }} />
                    </Box>
                    <StyledText type="body" sx={{ color: "text.secondary", flexGrow: 1 }}>
                      {dashboard.description}
                    </StyledText>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>

          <StyledText
            type="body"
            sx={{
              mt: 4,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Need help interpreting the data? Join us by visiting our{" "}
            <StyledLink href="/socials">socials page</StyledLink>, and chat with the community!
          </StyledText>
        </Box>
      </Box>
    </>
  );
}
