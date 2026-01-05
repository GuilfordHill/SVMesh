import { Box, Card, Typography, useTheme } from "@mui/material";
import RouterIcon from "@mui/icons-material/Router";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeIcon from "@mui/icons-material/Home";

interface DiagramNode {
  type: "ingress" | "base" | "backbone";
  label: string;
}

interface DiagramLevel {
  nodes: DiagramNode[];
  hasConnections: boolean; // Whether nodes at this level are connected horizontally
  columnPositions?: number[]; // Column index for each node
}

interface NetworkDiagramProps {
  content: string;
}

// Parse the ASCII diagram to extract node structure
function parseDiagram(content: string): DiagramLevel[] {
  const lines = content.split("\n");

  // Track which rows contain nodes with their column positions
  interface NodeWithPosition {
    type: "ingress" | "base" | "backbone";
    label: string;
    columnStart: number;
    columnEnd: number;
    rowIndex: number;
  }

  const allNodes: NodeWithPosition[] = [];

  // Find all node boxes with their positions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Check if this line contains a node label (with │ character)
    if (
      (lowerLine.includes("ingress") ||
        lowerLine.includes("base") ||
        lowerLine.includes("backbone")) &&
      line.includes("│")
    ) {
      // Find all node boxes on this line with their positions
      const nodeMatches = [...line.matchAll(/│[^│]*?(ingress|base|backbone)[^│]*?│/gi)];

      // Extract label from current or next line
      const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
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

      // Process each node found
      for (const match of nodeMatches) {
        const nodeBox = match[0];
        const nodeBoxLower = nodeBox.toLowerCase();

        let type: DiagramNode["type"] = "base";
        if (nodeBoxLower.includes("ingress")) {
          type = "ingress";
        } else if (nodeBoxLower.includes("backbone")) {
          type = "backbone";
        } else if (nodeBoxLower.includes("base")) {
          type = "base";
        }

        // Use default labels based on type if not found
        let nodeLabel = label;
        if (!nodeLabel) {
          nodeLabel =
            type === "ingress" ? "Your device" : type === "base" ? "Rooftop node" : "Tower node";
        }

        allNodes.push({
          type,
          label: nodeLabel,
          columnStart: match.index || 0,
          columnEnd: (match.index || 0) + nodeBox.length,
          rowIndex: i,
        });
      }
    }
  }

  // Build a global set of column bins across all rows
  const columnCenters = new Map<number, number[]>();
  for (const node of allNodes) {
    const center = Math.round((node.columnStart + node.columnEnd) / 2);
    if (!columnCenters.has(node.rowIndex)) {
      columnCenters.set(node.rowIndex, []);
    }
    columnCenters.get(node.rowIndex)!.push(center);
  }

  // Merge all column centers to create global column bins
  const allCenters = Array.from(columnCenters.values()).flat();
  const globalBins: number[] = [];
  const binTolerance = 20;

  for (const center of allCenters.sort((a, b) => a - b)) {
    let foundBin = false;
    for (let i = 0; i < globalBins.length; i++) {
      if (Math.abs(globalBins[i] - center) < binTolerance) {
        globalBins[i] = (globalBins[i] + center) / 2; // Average the positions
        foundBin = true;
        break;
      }
    }
    if (!foundBin) {
      globalBins.push(center);
    }
  }
  globalBins.sort((a, b) => a - b);

  // Group nodes by row
  const rowGroups: Map<number, NodeWithPosition[]> = new Map();
  for (const node of allNodes) {
    if (!rowGroups.has(node.rowIndex)) {
      rowGroups.set(node.rowIndex, []);
    }
    rowGroups.get(node.rowIndex)!.push(node);
  }

  // Build levels with global column assignments
  const levels: DiagramLevel[] = [];
  const sortedRows = Array.from(rowGroups.keys()).sort((a, b) => a - b);

  for (const rowIndex of sortedRows) {
    const rowNodes = rowGroups.get(rowIndex)!;
    const nodesWithColumns: (DiagramNode & { columnIndex: number })[] = [];
    const columnIndices: number[] = [];

    // Assign each node to its global column bin
    for (const node of rowNodes) {
      const center = (node.columnStart + node.columnEnd) / 2;
      const columnIndex = globalBins.findIndex((bin) => Math.abs(center - bin) < binTolerance);

      nodesWithColumns.push({
        type: node.type,
        label: node.label,
        columnIndex: columnIndex >= 0 ? columnIndex : 0,
      });
      columnIndices.push(columnIndex >= 0 ? columnIndex : 0);
    }

    // Check for horizontal connections
    const line = lines[rowIndex];
    const hasConnections = line.includes("◄") || line.includes("►");

    levels.push({
      nodes: nodesWithColumns.map(({ columnIndex, ...n }) => n),
      hasConnections,
      columnPositions: columnIndices,
    });
  }

  return levels;
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

export default function NetworkDiagram({ content }: NetworkDiagramProps) {
  const nodes = parseDiagram(content);
  const theme = useTheme();

  // Check if there's a vertical connection between consecutive backbone levels
  const hasVerticalBackboneConnection = (levelIndex: number): boolean => {
    if (levelIndex >= nodes.length - 1) return false;
    const currentLevel = nodes[levelIndex];
    const nextLevel = nodes[levelIndex + 1];

    // Check if both levels have at least one backbone node
    const currentHasBackbone = currentLevel.nodes.some((n) => n.type === "backbone");
    const nextHasBackbone = nextLevel.nodes.some((n) => n.type === "backbone");

    if (currentHasBackbone && nextHasBackbone) {
      // Check if there are vertical arrow characters in the content between these levels
      const lines = content.split("\n");
      return lines.some((line) => line.includes("▲") || line.includes("▼"));
    }
    return false;
  };

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
          {nodes.map((level, levelIndex) => {
            // Get column positions for this level
            const columnPositions = level.columnPositions || [];

            // Find the maximum column index across all levels to create a proper grid
            const maxColumn = Math.max(...nodes.flatMap((l) => l.columnPositions || []), -1);

            // Create a full row with spacers for missing columns
            const fullRow: (DiagramNode | null)[] = new Array(maxColumn + 1).fill(null);
            for (let i = 0; i < columnPositions.length; i++) {
              fullRow[columnPositions[i]] = level.nodes[i];
            }

            return (
              <Box key={levelIndex}>
                {level.nodes.length === 1 && columnPositions[0] === 0 ? (
                  // Single node in first column only (centered layout)
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <NodeCard node={level.nodes[0]} />
                    {levelIndex < nodes.length - 1 &&
                      (hasVerticalBackboneConnection(levelIndex) ? (
                        <ConnectionArrow direction="vertical-bidirectional" />
                      ) : (
                        <ConnectionArrow direction="down" />
                      ))}
                  </Box>
                ) : (
                  // Grid layout with proper column alignment
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0,
                      }}
                    >
                      {fullRow.map((node, colIndex) => (
                        <Box
                          key={`col-${colIndex}`}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                          }}
                        >
                          {node ? (
                            <>
                              <NodeCard node={node} />
                              {colIndex < maxColumn &&
                                (level.hasConnections ? (
                                  <ConnectionArrow direction="horizontal" />
                                ) : (
                                  <Box sx={{ width: 40, mx: 1 }} />
                                ))}
                            </>
                          ) : (
                            <>
                              {/* Empty column - same width as node card + arrow/spacer */}
                              <Box sx={{ minWidth: { xs: 140, sm: 160 }, maxWidth: 200 }} />
                              {colIndex < maxColumn && <Box sx={{ width: 40, mx: 1 }} />}
                            </>
                          )}
                        </Box>
                      ))}
                    </Box>
                    {levelIndex < nodes.length - 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 0,
                        }}
                      >
                        {fullRow.map((node, colIndex) => {
                          // Only show vertical arrows for backbone nodes with bidirectional connection
                          const showArrow =
                            node &&
                            hasVerticalBackboneConnection(levelIndex) &&
                            node.type === "backbone";

                          return (
                            <Box
                              key={`down-arrow-${colIndex}`}
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
                                {showArrow && (
                                  <ConnectionArrow direction="vertical-bidirectional" />
                                )}
                              </Box>
                              {colIndex < maxColumn && <Box sx={{ width: 40, mx: 1 }} />}
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
