import { Outlet } from "react-router";
import { Suspense } from "react";
import HeaderMenu from "../components/menus/HeaderMenu";
import FooterMenu from "../components/menus/FooterMenu";
import { Stack, CircularProgress, Box } from "@mui/material";

export default function StandardLayout() {
  return (
    <>
      <Stack width={"100vw"} sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <HeaderMenu />
        <Box sx={{ flex: 1 }}>
          <Suspense
            fallback={
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            }
          >
            <Outlet />
          </Suspense>
        </Box>
        <FooterMenu />
      </Stack>
    </>
  );
}
