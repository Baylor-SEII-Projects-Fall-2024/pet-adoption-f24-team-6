import { Typography, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Footer from "@/components/Footer";
import React from "react";

export default function NoAuth() {
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                    textAlign: "center",
                    gap: 2,
                }}
            >
                <LockIcon sx={{ fontSize: 80, color: "#757575" }} />
                <Typography variant="h4" component="h1">
                    Not Authorized
                </Typography>
                <Typography variant="body1">
                    You don't have permission to access this page.
                </Typography>
            </Box>
            <Footer />
        </>
    );
}
