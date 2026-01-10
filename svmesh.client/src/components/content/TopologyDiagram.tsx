import { Box, Card, Typography, useTheme } from "@mui/material";
import RouterIcon from "@mui/icons-material/Router";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeIcon from "@mui/icons-material/Home";

interface DiagramNode {
  type: "ingress" | "base" | "backbone";
  label: string;
}

type DiagramColumn = DiagramNode | null;

// Static diagram configuration with column alignment
const STATIC_DIAGRAM_STRUCTURE: { columns: DiagramColumn[]; hasHorizontalConnections: boolean }[] =
  [
    {
      // Top row shifted right by one column
      columns: [
        null,
        null,
        { type: "backbone", label: "ROUTER" },
        { type: "base", label: "CLIENT_BASE" },
        { type: "ingress", label: "CLIENT_MUTE" },
      ],
      hasHorizontalConnections: true,
    },
    {
      // Bottom row with backbone in same column as top backbone
      columns: [
        { type: "ingress", label: "CLIENT_MUTE" },
        { type: "base", label: "CLIENT_BASE" },
        { type: "backbone", label: "ROUTER" },
        { type: "base", label: "CLIENT_BASE" },
        { type: "ingress", label: "CLIENT_MUTE" },
      ],
      hasHorizontalConnections: true,
    },
  ];

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
  direction?: "down" | "horizontal" | "bidirectional" | "vertical-bidirectional";
}) => {
  const theme = useTheme();

  if (direction === "vertical-bidirectional") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 1,
          color: theme.palette.text.secondary,
        }}
      >
        <Box
          sx={{
            width: 2,
            height: 40,
            bgcolor: "currentColor",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -6,
              left: -4,
              width: 0,
              height: 0,
              borderBottom: `6px solid currentColor`,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
            },
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
  }

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

export default function TopologyDiagram() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        my: 4,
        bgcolor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.02)",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        overflowX: "auto",
        overflowY: "hidden",
        "&::-webkit-scrollbar": {
          height: 8,
        },
        "&::-webkit-scrollbar-track": {
          bgcolor:
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor:
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
          borderRadius: 4,
          "&:hover": {
            bgcolor:
              theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          minWidth: "min-content",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {STATIC_DIAGRAM_STRUCTURE.map((level, levelIndex) => (
            <Box key={levelIndex}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 0,
                }}
              >
                {level.columns.map((node, nodeIndex) => (
                  <Box
                    key={`${levelIndex}-${nodeIndex}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0,
                    }}
                  >
                    {node ? (
                      <NodeCard node={node} />
                    ) : (
                      <Box sx={{ minWidth: { xs: 140, sm: 160 }, maxWidth: 200 }} />
                    )}
                    {nodeIndex < level.columns.length - 1 &&
                      (level.hasHorizontalConnections ? (
                        // Only draw horizontal arrows between real nodes
                        level.columns[nodeIndex] && level.columns[nodeIndex + 1] ? (
                          <ConnectionArrow direction="horizontal" />
                        ) : (
                          <Box sx={{ width: 40, mx: 1 }} />
                        )
                      ) : (
                        <Box sx={{ width: 40, mx: 1 }} />
                      ))}
                  </Box>
                ))}
              </Box>
              {levelIndex < STATIC_DIAGRAM_STRUCTURE.length - 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {level.columns.map((node, nodeIndex) => {
                    const nextLevelColumns = STATIC_DIAGRAM_STRUCTURE[levelIndex + 1].columns;

                    // Only show vertical arrows between backbone nodes aligned in the same column
                    const backboneColumnIndex = level.columns.findIndex(
                      (col) => col?.type === "backbone"
                    );

                    // Only show vertical arrows between backbone nodes aligned in the backbone column
                    const showBidirectional =
                      nodeIndex === backboneColumnIndex &&
                      node?.type === "backbone" &&
                      nodeIndex < nextLevelColumns.length &&
                      nextLevelColumns[nodeIndex]?.type === "backbone";

                    return (
                      <Box
                        key={`arrow-${levelIndex}-${nodeIndex}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            minWidth: { xs: 140, sm: 160 },
                            maxWidth: 200,
                          }}
                        >
                          {showBidirectional && (
                            <ConnectionArrow direction="vertical-bidirectional" />
                          )}
                        </Box>
                        {nodeIndex < level.columns.length - 1 && <Box sx={{ width: 40, mx: 1 }} />}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
