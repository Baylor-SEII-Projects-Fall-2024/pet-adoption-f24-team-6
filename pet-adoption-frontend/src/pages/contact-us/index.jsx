import React, {useState} from "react";
import {Box, TextField, Button, Typography, Container, Paper, CircularProgress, Alert, AlertTitle} from "@mui/material";
import Head from "next/head";
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Footer from "@/components/Footer";

export default function ContactUs() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {

        setLoading(true);
        try {
            const response = await axios.post(
                "https://api.brevo.com/v3/smtp/email",
                {
                    sender: { name, email },
                    to: [{ email: "mjosephs@customsportssleeves.com", name: "Support Team" }],
                    subject: `New Contact Form Submission from ${name}`,
                    htmlContent: `<p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Message:</strong> ${message}</p>`,
                },
                {
                    headers: {
                        "api-key": "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",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                console.log("Email Sent")
                setSuccess(true)
            } else {
                console.error("Error sending email")
            }
            setLoading(false);
        } catch (error) {
            console.error("Error sending email", error)
        }
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }}
            >
                <CircularProgress size={80} />
            </Box>
        );
    }

    return (
        <>
            <Head>
                <title>Contact Us | Baylor Furries</title>
            </Head>


            <Container
                maxWidth="sm"
                sx={{
                    height: "80vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        borderRadius: 2,
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircleIcon fontSize="inherit" />}>
                            <AlertTitle>Success!</AlertTitle>
                            Your message was sent successfully!
                        </Alert>
                    )}
                    <Typography variant="h4" gutterBottom>
                        Get in Touch
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        Have a question or want to say hi? We'd love to hear from you!
                    </Typography>

                    <Box
                        component="form"
                        sx={{
                            mt: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Your Name"
                            variant="outlined"
                            fullWidth
                            required
                            onChange={(event) => setName(event.target.value)}
                        />
                        <TextField
                            label="Your Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            required
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <TextField
                            label="Message"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            required
                            onChange={(event) => setMessage(event.target.value)}
                        />
                        <Button variant="contained" size="large" type="submit" sx={{ mt: 2 }} onClick={() => handleSubmit()}>
                            Send Message
                        </Button>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </>
    );
}