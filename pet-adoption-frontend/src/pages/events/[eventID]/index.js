import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Container, Paper, Typography, Box, Grid, Avatar, CircularProgress, Alert, Button, Stack, Card, CardMedia, CardContent
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import ThumbsUpIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbsDownIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbsUpFilledIcon from '@mui/icons-material/ThumbUp';
import ThumbsDownFilledIcon from '@mui/icons-material/ThumbDown';
import Cookies from "js-cookie";

export default function PetDetails() {
    const router = useRouter();
    const { eventID } = router.query;
    const authToken = Cookies.get("authToken")

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [otherPets, setOtherPets] = useState([]);
    const [userID, setUserID] = useState(1);

    useEffect(() => {
        if (eventID) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/events/${eventID}`)
                .then((response) => {
                    setPet(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [eventID]);

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
                    setUserID(data.userID);
                }
            } catch (error) {
                console.error("Error fetching user type:", error);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/events`)
            .then((response) => {
                setOtherPets(response.data.slice(0, 3)); // Top 3 events
            })
            .catch((err) => console.error("Failed to fetch other events", err));
    }, []);

    if (loading) {
        return <CircularProgress sx={{ mt: 5, display: 'block', mx: 'auto' }} />;
    }

    if (error || !pet) {
        return <Alert severity="error" sx={{ mt: 2 }}>Failed to load pet details.</Alert>;
    }

    const {
        address, date, description, adoptionCenter, name, photo
    } = pet;


    return (
        <Container
            maxWidth="xl"
            sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 4 }}
        >
            {/* Back Button */}
            <Button
                startIcon={<ArrowBackIcon />}
                variant="contained"
                sx={{ mb: 3, width: '8%' }}
                onClick={() => router.push("/events")}
            >
                Back
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 5 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Avatar
                            src={photo}
                            alt={name}
                            variant="square"
                            sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={8}>
                        <Typography variant="h4" gutterBottom>{name}</Typography>
                        {/*<Typography variant="body1" color="textSecondary">*/}
                        {/*    {species} • {breed} • {gender} • {size}*/}
                        {/*</Typography>*/}
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            <strong>Date:</strong> {date}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Address:</strong> {address}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Description:</strong> {description}
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography variant="h6">Adoption Center</Typography>
                    <Typography variant="body1">
                        <strong>Name:</strong> {adoptionCenter.name}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Description:</strong> {adoptionCenter.description}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Email:</strong> {adoptionCenter.address}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Contact:</strong> {adoptionCenter.contactInfo}
                    </Typography>

                </Box>
            </Paper>


            {/*<Box sx={{ mt: 5 }}>*/}
            {/*    <Typography variant="h5" gutterBottom>See Other Pets</Typography>*/}
            {/*    <Grid container spacing={2}>*/}
            {/*        {otherPets.map((otherPet) => (*/}
            {/*            <Grid item xs={12} sm={4} key={otherPet.id}>*/}
            {/*                <Card>*/}
            {/*                    <CardMedia*/}
            {/*                        component="img"*/}
            {/*                        height="140"*/}
            {/*                        image={otherPet.photo}*/}
            {/*                        alt={otherPet.name}*/}
            {/*                    />*/}
            {/*                    <CardContent>*/}
            {/*                        <Typography variant="h6">{otherPet.name}</Typography>*/}
            {/*                        <Typography variant="body2" color="textSecondary">*/}
            {/*                            {otherPet.species} • {otherPet.breed}*/}
            {/*                        </Typography>*/}
            {/*                    </CardContent>*/}
            {/*                </Card>*/}
            {/*            </Grid>*/}
            {/*        ))}*/}
            {/*    </Grid>*/}
            {/*</Box>*/}
        </Container>
    );
}
