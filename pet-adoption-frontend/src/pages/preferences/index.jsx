import { useRouter } from "next/router";
import { Button, Paper, TextField, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Preferences() {
    const router = useRouter();

    const [breedPref, setBreedPref] = useState('');
    const [speciesPref, setSpeciesPref] = useState('');
    const [colorPref, setColorPref] = useState('')
    const [success, setSuccess] = useState(false); // To track success status

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/getUser`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Cookies.get('authToken')
                    },
                });

                if (!response.ok) {
                    console.error('Authentication failed', response.statusText);
                }

                const data = await response.json();

                // Pre-fill user preferences if available
                setBreedPref(data.breedPref || '');
                setSpeciesPref(data.speciesPref || '');
                setColorPref(data.colorPref || '');

            } catch (error) {
                console.error("Error during checkAuth", error);
            }
        };
        getUserDetails();
    }, []);

    const handleSubmit = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/updatePref`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('authToken')
            },
            body: JSON.stringify({
                breedPref: breedPref,
                speciesPref: speciesPref,
                colorPref: colorPref
            }),
        });

        if (response.ok) {
            setSuccess(true);
            // Redirect to /account after showing success message
            setTimeout(() => {
                router.push('/account');
            }, 2000);
        } else {
            console.error("Failed to save preferences", response.statusText);
            alert("Failed to save preferences. Please try again.");
        }
    }

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
                height: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '16px',
                padding: '2rem'
            }} elevation={4}>
                <Typography variant="h5" sx={{ marginBottom: '35px', fontWeight: 'bold' }}>
                    Edit Preferences
                </Typography>

                {success && (
                    <Alert severity="success" onClose={() => setSuccess(false)} style={{ marginBottom: '1rem' }}>
                        Preferences saved! Redirecting to account...
                    </Alert>
                )}

                <TextField
                    label="Breed"
                    variant="outlined"
                    sx={{ width: '50%' }}
                    onChange={(event) => setBreedPref(event.target.value)}
                    value={breedPref}
                />
                <TextField
                    label="Species"
                    variant="outlined"
                    sx={{ width: '50%' }}
                    onChange={(event) => setSpeciesPref(event.target.value)}
                    value={speciesPref}
                />
                <TextField
                    label="Color"
                    variant="outlined"
                    sx={{ width: '50%' }}
                    onChange={(event) => setColorPref(event.target.value)}
                    value={colorPref}
                />

                <Button
                    variant="outlined"
                    size="large"
                    onClick={handleSubmit}
                    sx={{ marginTop: '16px' }}
                >
                    Submit
                </Button>
            </Paper>
        </div>
    );
}
