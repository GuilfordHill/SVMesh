import { Box, Alert, AlertTitle } from "@mui/material";

interface WarningBannerProps {
  type: "warning" | "critical" | "info";
  title?: string;
  children: React.ReactNode;
}

export function WarningBanner({ type, title, children }: WarningBannerProps) {
  const getSeverity = () => {
    switch (type) {
      case "critical":
        return "error" as const;
      case "warning":
        return "warning" as const;
      case "info":
        return "info" as const;
      default:
        return "info" as const;
    }
  };

  return (
    <Alert
      severity={getSeverity()}
      sx={{
        mb: 3,
        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
    >
      {title && (
        <AlertTitle sx={{ fontWeight: "bold", mb: 1 }}>{title}</AlertTitle>
      )}
      <Box sx={{ "& > *:last-child": { mb: 0 } }}>{children}</Box>
    </Alert>
  );
}
