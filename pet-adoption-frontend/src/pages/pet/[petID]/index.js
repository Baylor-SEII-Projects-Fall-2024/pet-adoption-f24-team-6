import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Avatar,
    CircularProgress,
    Alert,
    Button,
    Stack,
    Card,
    CardMedia,
    CardContent,
    DialogTitle, TextField, DialogActions, Dialog, DialogContent
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import ThumbsUpIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbsDownIcon from "@mui/icons-material/ThumbDownOffAlt";
import SendIcon from '@mui/icons-material/Send';
import ThumbsDownFilledIcon from '@mui/icons-material/ThumbDown';
import Cookies from "js-cookie";

export default function PetDetails() {
    const router = useRouter();
    const { petID } = router.query;
    const authToken = Cookies.get("authToken")
    const email = 'mark_josephs1@baylor.edu'

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [otherPets, setOtherPets] = useState([]);
    const [userID, setUserID] = useState(1);
    const [clicked, setClicked] = useState();
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState("");

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

    const sendEmail = async () => {
        try {
            const response = await axios.post(
                "https://api.brevo.com/v3/smtp/email",
                {
                    sender: { name, email },
                    to: [{ email: "mjosephs@customsportssleeves.com", name: "Support Team" }],
                    subject: `New Adoption Request from Customer ${userID}`,
                    htmlContent: `
                    <p><strong>Pet Name:</strong> ${name}</p>
                    <p><strong>Customer:</strong> ${userID}</p>`,
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

            } else {
                console.error("Error sending email")
            }
        } catch (error) {
            console.error("Error sending email", error)
        }
    }

    const handleRequestInfo = async () => {
        if(!authToken){
            router.push('/sign-in')
        }else {
            setMessageOpen(true);
        }
    };

    const handleLike = async () => {
        if(!authToken){
            router.push('/sign-in')
        }else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userID,
                        petId: petID
                    }),
                });

                if(response.status === 200){
                    setIsLiked((prev) => !prev);
                }
            } catch (error) {
                console.error('Error while liking:', error.response?.data || error.message);
            }
        }
    };

    const handleDislike = async () => {
        if(!authToken){
            router.push('/sign-in')
        }else {
            const requestData = {
                userId: userID,
                petId: petID
            };

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/dislike`, requestData);

                if(response.status === 200){
                    console.log();
                    setIsDisliked((prev) => !prev);
                }
            } catch (error) {
                console.error('Error while disliking:', error.response?.data || error.message);
            }
        }
    };

    const   handleSendMessage = async () => {
        const payload = {
            senderId: userID,
            receiverId: pet.adoptionCenter.user.id,
            content: messageText
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/messages/send`, payload);
            if (response.status === 200) {
                console.log("Message sent successfully!");
                setMessageOpen(false);
                setMessageText("");
            } else {
                console.error("Failed to send message:", response.statusText);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }

        const requestData = {
            userId: userID,
            petId: petID,
            adoptionCenterId: adoptionCenter.id
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/adoptionRequest/request`, requestData);

            await sendEmail()

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

                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => handleRequestInfo()}
                        startIcon={<PhoneForwardedIcon />}
                    >
                        Request Adoption
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={() => handleLike()}
                        startIcon={isLiked ? <ThumbsUpFilledIcon /> : <ThumbsUpIcon/>}
                    >
                        Like
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        sx={{ mt: 2 }}
                        onClick={() => handleDislike()}
                        startIcon={isDisliked ? <ThumbsDownFilledIcon /> : <ThumbsDownIcon />}
                    >
                        Dislike
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => {
                            if(!authToken) {
                                router.push('/sign-in')
                            }
                            setMessageOpen(true)
                        }}
                        startIcon={<SendIcon />}
                    >
                        Send Message
                    </Button>
                </Box>
            </Paper>

            <Dialog open={messageOpen} onClose={() => setMessageOpen(false)}>
                <DialogTitle>Send Message</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={4}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMessageOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleSendMessage} color="primary">Send Message</Button>
                </DialogActions>
            </Dialog>


            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" gutterBottom>See Other Pets</Typography>
                <Grid container spacing={2}>
                    {otherPets.map((otherPet) => (
                        <Grid item xs={12} sm={4} key={otherPet.id}>
                            <Card onClick={() => router.push(`/pet/${otherPet.id}`)}>
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
