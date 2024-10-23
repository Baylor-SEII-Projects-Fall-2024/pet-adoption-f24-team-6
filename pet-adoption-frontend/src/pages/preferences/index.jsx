import {useRouter} from "next/router";
import {Button, Paper, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

export default function preferences() {
    const router = useRouter();

    const [breedPref, setBreedPref] = useState('');
    const [speciesPref, setSpeciesPref] = useState('');

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

                // Assuming the response contains the fields emailAddress, firstName, and lastName
                setBreedPref(data.breedPref);
                setSpeciesPref(data.speciesPref);

            } catch (error) {
                console.error("Error during checkAuth", error);
            }
        };
        getUserDetails()
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
                speciesPref: speciesPref
            }),
        });

        if (response.status === 404) {
            console.log('Error: Not Found')
        } else if (response.status === 400) {
            console.error("Login failed", response.message);
            alert(response.message || 'Login failed');
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
                height: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '16px'
            }} elevation={4}>
                <Typography variant="h5" sx={{marginBottom: '35px', fontWeight: 'bold'}}>Edit Preferences</Typography>
                <TextField id="outlined-basic" label="Breed" variant="outlined" sx={{width: '50%'}} onChange={(event) => setBreedPref(event.target.value)} value={breedPref} />
                <TextField id="outlined-basic" label="Species" variant="outlined" sx={{width: '50%'}} onChange={(event) => setSpeciesPref(event.target.value)} value={speciesPref} />

                <Button variant="outlined"
                        size="large"
                        onClick={() => handleSubmit()}
                >Submit</Button>
            </Paper>
        </div>
    );
}
