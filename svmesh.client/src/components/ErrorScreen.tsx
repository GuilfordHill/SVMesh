import { Box, Button } from "@mui/material";
import { useRouteError, useNavigate } from "react-router";
import { StyledText } from "./ui";
import svmeshLogo from "../assets/svmesh.png";

interface ErrorScreenProps {
  error?: Error;
  resetError?: () => void;
}

export default function ErrorScreen({ error: propError }: ErrorScreenProps) {
  const routeError = useRouteError();
  const navigate = useNavigate();
  
  // Get error message from either the prop or the route error
  const error = propError || (routeError instanceof Error ? routeError : null);
  const errorMessage = error?.message || (typeof routeError === 'string' ? routeError : 'Unknown error');

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        zIndex: 9999,
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: "600px" }}>
        <StyledText
          type="heading"
          component="h1"
          sx={{
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
          }}
        >
          Whoops!
        </StyledText>

        <StyledText
          type="subheading"
          component="h2"
          sx={{
            color: "text.secondary",
            mb: 3,
          }}
        >
          Something unexpected happened.
        </StyledText>

        <StyledText
          type="body-large"
          sx={{
            color: "text.secondary",
            mb: 4,
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          We're sorry, but it looks like something went wrong.
        </StyledText>

        {errorMessage && (
          <Box
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "8px",
              p: 2,
              mb: 4,
              textAlign: "left",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              color: "text.secondary",
              overflow: "auto",
              maxHeight: "200px",
            }}
          >
            <StyledText
              type="body"
              sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
            >
              <strong>Error Details:</strong>
              <br />
              {errorMessage}
            </StyledText>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Go to Home
        </Button>
      </Box>

      {/* Logo at bottom of screen */}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src={svmeshLogo}
          alt="SVMesh Logo"
          style={{
            height: "60px",
            width: "auto",
            borderRadius: "8px",
          }}
        />
      </Box>
    </Box>
  );
}
