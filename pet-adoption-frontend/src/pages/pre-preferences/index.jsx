import { useRouter } from "next/router";
import { Button, Paper, TextField, Typography, Alert, Box } from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";


export default function PrePreferences() {
    const router = useRouter();
    const [breedPref, setBreedPref] = useState('');
    const [speciesPref, setSpeciesPref] = useState('');
    const [colorPref, setColorPref] = useState('');
    const [step, setStep] = useState(0); // Start at step 0 for the welcome message, adjust as needed
    const [success, setSuccess] = useState(false); // To track success
    const [errorMessage, setErrorMessage] = useState(''); // For error messages


    const handleSubmit = async () => {
        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/setPref`, {
                method: 'POST', // POST for setting preferences
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('authToken'), // Ensure token is correctly passed with "Bearer "
                },
                body: JSON.stringify({
                    breedPref,
                    speciesPref,
                    colorPref,
                }),
            });

            const data = await response.json();



            if (!response.ok) {
                // Check for unsuccessful responses and handle them
                setErrorMessage(data.message || 'Failed to set preferences');
                setSuccess(false);
                return;
            }


            setSuccess(true);
            setErrorMessage('');
            setTimeout(() => {
                router.push('/browse');  // Redirect after success
            }, 2000);
        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
            setSuccess(false);
        }
    };


    const handleNext = () => {
        if (step < 3) { // Go to the next step
            setStep(step + 1);
        } else {
            handleSubmit(); // Submit preferences when on the last step
        }
    };


    const handleBack = () => {
        if (step > 0) { // Go back to the previous step
            setStep(step - 1);
        }
    };


    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '16px' }}>
                        Before getting started, we want to get to know a bit more about you!
                    </Typography>
                );
            case 1:
                return (
                    <TextField
                        label="Preferred Breed"
                        variant="outlined"
                        sx={{ width: '80%' }}
                        onChange={(event) => setBreedPref(event.target.value)}
                        value={breedPref}
                    />
                );
            case 2:
                return (
                    <TextField
                        label="Preferred Species"
                        variant="outlined"
                        sx={{ width: '80%' }}
                        onChange={(event) => setSpeciesPref(event.target.value)}
                        value={speciesPref}
                    />
                );
            case 3:
                return (
                    <TextField
                        label="Preferred Color"
                        variant="outlined"
                        sx={{ width: '80%' }}
                        onChange={(event) => setColorPref(event.target.value)}
                        value={colorPref}
                    />
                );
            default:
                return null;
        }
    };


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '90vh'
        }}>
            <Paper sx={{
                width: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '16px',
                padding: '2rem'
            }} elevation={4}>
                <Typography variant="h5" sx={{ marginBottom: '35px', fontWeight: 'bold' }}>
                    {step === 0 ? "Welcome!" : `Step ${step}: ${step === 1 ? 'Preferred Breed' : step === 2 ? 'Preferred Species' : 'Preferred Color'}`}
                </Typography>


                {success && (
                    <Alert severity="success" onClose={() => setSuccess(false)} style={{ marginBottom: '1rem' }}>
                        Preferences updated successfully! Redirecting...
                    </Alert>
                )}


                {errorMessage && (
                    <Alert severity="error" onClose={() => setErrorMessage('')} style={{ marginBottom: '1rem' }}>
                        {errorMessage}
                    </Alert>
                )}


                {renderStepContent()}
                <Box display="flex" justifyContent="space-between" width="80%" mt={2}>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleBack}
                        sx={{ width: '45%' }}
                        disabled={step === 0}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        sx={{ width: '45%' }}
                    >
                        {step < 3 ? "Next" : "Submit"}
                    </Button>
                </Box>
            </Paper>
        </div>
    );
}
