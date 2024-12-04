import { useRouter } from "next/router";
import { Button, Paper, TextField, Typography, Alert, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";

export default function PrePreferences() {
    const router = useRouter();
    const [breedPref, setBreedPref] = useState('');
    const [speciesPref, setSpeciesPref] = useState('');
    const [colorPref, setColorPref] = useState('');
    const [step, setStep] = useState(0);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const COLOR_CHOICES = [
        'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BROWN',
        'BLACK', 'WHITE', 'GRAY', 'CYAN', 'MAGENTA', 'BEIGE', 'TEAL', 'MAROON',
        'NAVY', 'LIME', 'CORAL', 'LAVENDER', 'GOLD', 'SILVER', 'BRONZE', 'PEACH',
        'MINT', 'TURQUOISE', 'INDIGO', 'CREAM', 'OCHRE', 'MUSTARD'
    ];

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/setPref`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('authToken'),
                },
                body: JSON.stringify({
                    breedPref,
                    speciesPref,
                    colorPref,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Failed to set preferences');
                setSuccess(false);
                return;
            }

            setSuccess(true);
            setErrorMessage('');
            setTimeout(() => {
                router.push('/browse');
            }, 2000);

        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
            setSuccess(false);
        }
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) {
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
                    <FormControl variant="outlined" sx={{ width: '80%' }}>
                        <InputLabel>Preferred Color</InputLabel>
                        <Select
                            value={colorPref}
                            onChange={(event) => setColorPref(event.target.value)}
                            label="Preferred Color"
                        >
                            {COLOR_CHOICES.map((color) => (
                                <MenuItem key={color} value={color}>
                                    {color}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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