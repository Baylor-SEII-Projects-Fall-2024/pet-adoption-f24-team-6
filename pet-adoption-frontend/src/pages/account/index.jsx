import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import PetsIcon from '@mui/icons-material/Pets';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import Footer from "@/components/Footer";

export default function Account() {
    const router = useRouter();
    const [userType, setUserType] = useState(null);
    const [centerId, setCenterId] = useState(null);
    const authToken = Cookies.get('authToken');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (authToken) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`);
                    const data = await response.json();

                    if (!response.ok) {
                        console.error('Failed to fetch user type:', response.statusText);
                        return;
                    }
                    setUserType(data.userType);
                } else {
                    router.push('/not-authorized');
                }
            } catch (error) {
                console.error("Error fetching user type:", error);
            }
        };

        checkAuth();
    }, [authToken, router]);

    useEffect(() => {
        const fetchCenterId = async () => {
            if (authToken) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/getCenterID?authToken=${authToken}`);
                const centerData = await response.json();

                if (response.ok) {
                    console.log(centerData)
                    setCenterId(centerData.centerID);
                } else {
                    console.error("Failed to fetch center ID:", response.statusText);
                }
            }
        };

        fetchCenterId();
    }, [authToken]);

    const handleLogout = () => {
        Cookies.remove('authToken');
        router.push('/');
    };

    return (
        <>
            <Head>
                <title>Account | Baylor Furries</title>
            </Head>

            <Typography variant="h4" align="center" sx={{ mt: 5 }}>
                ACCOUNT
            </Typography>

            <Box sx={{ flexGrow: 1, mt: 3, mx: 4, marginBottom: '20px', height: '60vh' }}>
                <Grid container spacing={3} justifyContent="center">
                    {userType === "CUSTOMER" && (
                        <>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={() => router.push('/preferences')}>
                                        <SettingsIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">Preferences</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={() => router.push('/account-details')}>
                                        <AccountCircleIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">My Account</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={handleLogout}>
                                        <LogoutIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">Logout</Typography>
                                </Paper>
                            </Grid>
                        </>
                    )}

                    {userType === "ADOPTION_CENTER" && (
                        <>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={() => router.push('/registerPet')}>
                                        <PetsIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">Register Pet</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={() => router.push('/my-pets')}>
                                        <PetsIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">My Pets</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={() => router.push('/account-details')}>
                                        <AccountCircleIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">My Account</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={handleLogout}>
                                        <LogoutIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">Logout</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={() => centerId && router.push(`/requests/${centerId}`)}>
                                        <LogoutIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">Adoption Requests</Typography>
                                </Paper>
                            </Grid>
                        </>
                    )}

                    {userType === "ADMIN" && (
                        <>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={() => router.push('/all-users')}>
                                        <PeopleIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">All Users</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={() => router.push('/account-details')}>
                                        <AccountCircleIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">My Account</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                    <IconButton onClick={handleLogout}>
                                        <LogoutIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h6">Logout</Typography>
                                </Paper>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>
            <Footer />
        </>
    );
}
