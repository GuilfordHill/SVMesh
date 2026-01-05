import { Box, Card, Typography, useTheme } from "@mui/material";
import RouterIcon from "@mui/icons-material/Router";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeIcon from "@mui/icons-material/Home";
import { StyledText } from "../ui";

interface DiagramNode {
  type: "ingress" | "base" | "backbone";
  label: string;
}

interface NetworkDiagramProps {
  content: string;
}

// Parse the ASCII diagram to extract node structure
function parseDiagram(content: string): DiagramNode[][] {
  const lines = content.split("\n");
  const nodes: DiagramNode[][] = [];
  const allNodes: DiagramNode[] = [];

  // First pass: find all nodes by looking for the pattern
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : "";

    // Look for lines that contain node type keywords
    const lowerLine = line.toLowerCase();

    // Check if this line contains a type
    if (
      (lowerLine.includes("ingress") ||
        lowerLine.includes("base") ||
        lowerLine.includes("backbone")) &&
      line.includes("│")
    ) {
      let type: DiagramNode["type"] = "base";

      // Determine type
      if (lowerLine.includes("ingress")) {
        type = "ingress";
      } else if (lowerLine.includes("backbone")) {
        type = "backbone";
      } else if (lowerLine.includes("base")) {
        type = "base";
      }

      // Count how many node boxes are on this line by counting closing boxes "└" or "┘"
      // or by counting the pattern │...│ occurrences
      const boxPattern = /│[^│]+?│/g;
      const boxes = line.match(boxPattern);
      const boxCount = boxes ? boxes.length : 1;

      // Extract label from parentheses in current or next line
      let label = "";
      const labelMatch = line.match(/\((.*?)\)/);
      if (labelMatch) {
        label = labelMatch[1];
      } else if (nextLine) {
        const nextLabelMatch = nextLine.match(/\((.*?)\)/);
        if (nextLabelMatch) {
          label = nextLabelMatch[1];
        }
      }

      // Use default labels if not found
      if (!label) {
        label =
          type === "ingress" ? "Your device" : type === "base" ? "Rooftop node" : "Tower node";
      }

      // Add the appropriate number of nodes based on box count
      for (let j = 0; j < boxCount; j++) {
        allNodes.push({ type, label });
      }
    }
  }

  // Group nodes by levels (ingress -> base -> backbone -> base -> ingress)
  if (allNodes.length > 0) {
    let currentIndex = 0;

    // First ingress
    if (allNodes[currentIndex]?.type === "ingress") {
      nodes.push([allNodes[currentIndex]]);
      currentIndex++;
    }

    // First base
    if (allNodes[currentIndex]?.type === "base") {
      nodes.push([allNodes[currentIndex]]);
      currentIndex++;
    }

    // Backbone nodes (collect all sequential backbone nodes)
    const backboneNodes: DiagramNode[] = [];
    while (currentIndex < allNodes.length && allNodes[currentIndex].type === "backbone") {
      backboneNodes.push(allNodes[currentIndex]);
      currentIndex++;
    }
    if (backboneNodes.length > 0) {
      nodes.push(backboneNodes);
    }

    // Other base nodes (collect all sequential base nodes)
    const baseNodes: DiagramNode[] = [];
    while (currentIndex < allNodes.length && allNodes[currentIndex].type === "base") {
      baseNodes.push(allNodes[currentIndex]);
      currentIndex++;
    }
    if (baseNodes.length > 0) {
      nodes.push(baseNodes);
    }

    // Other ingress nodes (collect remaining ingress nodes)
    const ingressNodes: DiagramNode[] = [];
    while (currentIndex < allNodes.length && allNodes[currentIndex].type === "ingress") {
      ingressNodes.push(allNodes[currentIndex]);
      currentIndex++;
    }
    if (ingressNodes.length > 0) {
      nodes.push(ingressNodes);
    }
  }

  return nodes;
}

const NodeCard = ({ node }: { node: DiagramNode }) => {
  const theme = useTheme();

  const getNodeConfig = (type: DiagramNode["type"]) => {
    switch (type) {
      case "ingress":
        return {
          icon: PhoneAndroidIcon,
          color: theme.palette.info.main,
          bgColor: theme.palette.info.light,
          borderColor: theme.palette.info.dark,
        };
      case "base":
        return {
          icon: HomeIcon,
          color: theme.palette.success.main,
          bgColor: theme.palette.success.light,
          borderColor: theme.palette.success.dark,
        };
      case "backbone":
        return {
          icon: RouterIcon,
          color: theme.palette.primary.main,
          bgColor: theme.palette.primary.light,
          borderColor: theme.palette.primary.dark,
        };
    }
  };

  const config = getNodeConfig(node.type);
  const Icon = config.icon;

  return (
    <Card
      sx={{
        p: 2,
        minWidth: { xs: 140, sm: 160 },
        maxWidth: 200,
        border: 2,
        borderColor: config.borderColor,
        bgcolor: config.bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <Icon sx={{ fontSize: 40, color: config.color }} />
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color={config.color}
        textAlign="center"
        textTransform="capitalize"
      >
        {node.type} Node
      </Typography>
      <Typography variant="caption" textAlign="center" color="text.secondary">
        {node.label}
      </Typography>
    </Card>
  );
};

const ConnectionArrow = ({
  direction = "down",
}: {
  direction?: "down" | "horizontal" | "bidirectional";
}) => {
  const theme = useTheme();

  if (direction === "bidirectional") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mx: 2,
          color: theme.palette.text.secondary,
        }}
      >
        <Box
          sx={{
            width: { xs: 30, sm: 50 },
            height: 2,
            bgcolor: "currentColor",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              left: -6,
              top: -4,
              width: 0,
              height: 0,
              borderRight: `6px solid currentColor`,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              right: -6,
              top: -4,
              width: 0,
              height: 0,
              borderLeft: `6px solid currentColor`,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
            },
          }}
        />
      </Box>
    );
  }

  if (direction === "horizontal") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mx: 1,
          color: theme.palette.text.secondary,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 2,
            bgcolor: "currentColor",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              right: -6,
              top: -4,
              width: 0,
              height: 0,
              borderLeft: `6px solid currentColor`,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        mt: 1,
        mb: 1,
        color: theme.palette.text.secondary,
      }}
    >
      <Box
        sx={{
          width: 2,
          height: 40,
          bgcolor: "currentColor",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -6,
            left: -4,
            width: 0,
            height: 0,
            borderTop: `6px solid currentColor`,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
          },
        }}
      />
    </Box>
  );
};

export default function NetworkDiagram({ content }: NetworkDiagramProps) {
  const nodes = parseDiagram(content);
  const theme = useTheme();

  return (
    <Box
      sx={{
        my: 4,
        p: 3,
        bgcolor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.02)",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      <StyledText
        type="subheading"
        component="h4"
        sx={{ mb: 3, textAlign: "center", fontSize: "1.1rem" }}
      >
        Network Topology
      </StyledText>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {nodes.map((level, levelIndex) => (
          <Box key={levelIndex}>
            {level.length === 1 ? (
              // Single node in level
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <NodeCard node={level[0]} />
                {levelIndex < nodes.length - 1 && <ConnectionArrow direction="down" />}
              </Box>
            ) : (
              // Multiple nodes in level - show side by side with bidirectional arrows
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  {level.map((node, nodeIndex) => (
                    <>
                      <NodeCard key={`node-${nodeIndex}`} node={node} />
                      {nodeIndex < level.length - 1 && (
                        <ConnectionArrow key={`arrow-${nodeIndex}`} direction="bidirectional" />
                      )}
                    </>
                  ))}
                </Box>
                {levelIndex < nodes.length - 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: { xs: 2, sm: 0 },
                    }}
                  >
                    {level.map((_, nodeIndex) => (
                      <>
                        <Box
                          key={`down-arrow-${nodeIndex}`}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            minWidth: { xs: 140, sm: 160 },
                            maxWidth: 200,
                          }}
                        >
                          <ConnectionArrow direction="down" />
                        </Box>
                        {nodeIndex < level.length - 1 && (
                          <Box
                            key={`spacer-${nodeIndex}`}
                            sx={{
                              width: { xs: 30, sm: 50 },
                              mx: 2,
                            }}
                          />
                        )}
                      </>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneAndroidIcon sx={{ color: theme.palette.info.main }} />
          <Typography variant="caption">Ingress (Portable)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HomeIcon sx={{ color: theme.palette.success.main }} />
          <Typography variant="caption">Base (Rooftop)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RouterIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="caption">Backbone (Tower)</Typography>
        </Box>
      </Box>
    </Box>
  );
}
