import Head from "next/head";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "@/components/Footer";
import React from "react";

export default function FAQ() {
    const faqData = [
        {
            question: "What is the adoption process?",
            answer: "The adoption process typically includes filling out an application, meeting the pet, and completing an adoption agreement."
        },
        {
            question: "What fees are associated with adoption?",
            answer: "Adoption fees vary depending on the type of pet and can cover vaccinations, spaying/neutering, and microchipping."
        },
        {
            question: "Can I return an adopted pet?",
            answer: "Yes, we have a return policy that allows you to return the pet if it does not fit well into your home."
        },
        {
            question: "Are there any age restrictions for adoption?",
            answer: "You must be at least 18 years old to adopt a pet from our center."
        },
        {
            question: "Do I need to bring anything to adopt a pet?",
            answer: "It’s helpful to bring your ID and any necessary paperwork, such as proof of residence."
        },
    ];

    return (
        <>
            <Head>
                <title>FAQ | Baylor Furries</title>
            </Head>

            <Box sx={{ maxWidth: '600px', margin: '0 auto', height: '80vh'}}>
                <Typography variant="h4" align="center" gutterBottom>
                    Frequently Asked Questions
                </Typography>
                {faqData.map((item, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{item.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{item.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
            <Footer />
        </>
    );
}
