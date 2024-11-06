import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/router";
import Confetti from "react-confetti";
import Footer from "@/components/Footer";

export default function PetRequestSuccess() {
    const router = useRouter();

    const handleBackToBrowse = () => {
        router.push("/browse");
    };

    return (
        <>
        <Confetti
            width={3000}
            height={1000}
            numberOfPieces={1000}
            recycle={false}
            gravity={.05}
        />
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                textAlign: 'center',
                position: 'relative',
            }}
        >

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, position: 'relative', zIndex: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'green', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Request Successful!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Your contact information has been sent to the adoption center, and they have been notified.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBackToBrowse}
                >
                    Back to Browse Pets
                </Button>
            </Paper>
        </Container>
            <Footer />
            </>
    );
}
