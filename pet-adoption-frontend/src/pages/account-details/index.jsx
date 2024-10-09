import {useRouter} from "next/router";
import {Button, Paper, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
export default function userAcct() {
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

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
                setEmailAddress(data.emailAddress);
                setFirstName(data.firstName);
                setLastName(data.lastName);

            } catch (error) {
                console.error("Error during checkAuth", error);
            }
        };
        getUserDetails()
    }, []);

    const handleSubmit = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('authToken')
            },
            body: JSON.stringify({
                emailAddress: emailAddress,
                firstName: firstName,
                lastName: lastName
            }),
        });

        if (response.status === 404) {
            console.log('Error: Not Found')
        } else if (response.status === 400) {
            console.error("Login failed", response.message);
            alert(response.message || 'Login failed');
        }
        else {
            Cookies.remove('authToken');
            await router.push('/sign-in');
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
                <Typography variant="h5" sx={{marginBottom: '35px', fontWeight: 'bold'}}>Edit Account Details</Typography>
                <TextField id="outlined-basic" label="First Name" variant="outlined" sx={{width: '50%'}} onChange={(event) => setFirstName(event.target.value)} value={firstName} />
                <TextField id="outlined-basic" label="Last Name" variant="outlined" sx={{width: '50%'}} onChange={(event) => setLastName(event.target.value)} value={lastName} />
                <TextField id="outlined-basic" label="Email" variant="outlined" sx={{width: '50%'}} onChange={(event) => setEmailAddress(event.target.value)} value={emailAddress} />

                <Button variant="outlined"
                        size="large"
                        onClick={() => handleSubmit()}
                >Submit</Button>
            </Paper>
        </div>
    );
}
