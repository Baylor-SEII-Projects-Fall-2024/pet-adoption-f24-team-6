import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Container, Paper, Typography, Box, Grid, Avatar, CircularProgress, Alert, Button, Stack, Card, CardMedia, CardContent
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import Cookies from "js-cookie";

export default function PetDetails() {
    const router = useRouter();
    const { petID } = router.query;
    const authToken = Cookies.get("authToken")

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [otherPets, setOtherPets] = useState([]);

    useEffect(() => {
        if (petID) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/${petID}`)
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
    }, [petID]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/getAll`)
            .then((response) => {
                setOtherPets(response.data.slice(0, 3)); // Top 3 pets
            })
            .catch((err) => console.error("Failed to fetch other pets", err));
    }, []);

    if (loading) {
        return <CircularProgress sx={{ mt: 5, display: 'block', mx: 'auto' }} />;
    }

    if (error || !pet) {
        return <Alert severity="error" sx={{ mt: 2 }}>Failed to load pet details.</Alert>;
    }

    const {
        name, age, species, breed, size, gender, photo, color, friendliness, trainingLevel, adoptionCenter,
    } = pet;

    const handleRequestInfo = async () => {
        if(!authToken){
            router.push('/sign-in')
        }
        const requestData = {
            userId: '1',
            petId: petID,
            adoptionCenterId: adoptionCenter.id
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/adoptionRequest/request`, requestData);

            if(response.status === 200){
                router.push('/pet/requested');
            }
        } catch (error) {
            console.error('Error while requesting adoption:', error.response?.data || error.message);
        }

    };

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
                onClick={() => router.push("/browse")}
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
                        <Typography variant="body1" color="textSecondary">
                            {species} • {breed} • {gender} • {size}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            <strong>Age:</strong> {age} years
                        </Typography>
                        <Typography variant="body2">
                            <strong>Color:</strong> {color}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Friendliness:</strong> {friendliness}/10
                        </Typography>
                        <Typography variant="body2">
                            <strong>Training Level:</strong> {trainingLevel}/10
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

                    {/* Request More Info Button */}
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={() => handleRequestInfo()}
                        startIcon={<PhoneForwardedIcon />}
                    >
                        Request Adoption
                    </Button>
                </Box>
            </Paper>


            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" gutterBottom>See Other Pets</Typography>
                <Grid container spacing={2}>
                    {otherPets.map((otherPet) => (
                        <Grid item xs={12} sm={4} key={otherPet.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={otherPet.photo}
                                    alt={otherPet.name}
                                />
                                <CardContent>
                                    <Typography variant="h6">{otherPet.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {otherPet.species} • {otherPet.breed}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}
