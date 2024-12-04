import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Paper, CircularProgress, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions,} from '@mui/material';
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import axios from "axios";

const PetCard = ({ pet, router, userId, handleRequestAdoption }) => (
    <Paper
        style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            marginBottom: '10px',
            width: '35%',
        }}
    >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
                src={pet?.photo}
                alt={pet?.name}
                style={{
                    width: '80%',
                    height: '40%',
                    objectFit: 'cover',
                    marginBottom: '10px',
                }}
                onClick={() => router.push(`/pet/${pet?.id}`)}
            />
            <h3 style={{ margin: 0 }}>{pet?.name}</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <IconButton color="success" onClick={() => HandleLike(pet?.id, userId)}>
                <ThumbUpIcon />
            </IconButton>
            <IconButton color="error" onClick={() => HandleDisLike(pet?.id, userId)}>
                <ThumbDownIcon />
            </IconButton>

            <IconButton color='primary' onClick={() => handleRequestAdoption(pet)}>
                <PhoneForwardedIcon />
            </IconButton>
        </div>
    </Paper>
);

const HandleLike = async (id, userId) => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, petId: id }),
        });
    } catch (error) {
        console.error('Error while liking:', error.response?.data || error.message);
    }
};

const HandleDisLike = async (id, userId) => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/dislike`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, petId: id }),
        });
    } catch (error) {
        console.error('Error while disliking:', error.response?.data || error.message);
    }
};

const ForYouPage = () => {
    const [pets, setPets] = useState([]);
    const [currentPetIndex, setCurrentPetIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewCount, setViewCount] = useState(0);
    const [userId, setUserId] = useState(-1);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState('');
    const email = 'mark_josephs1@baylor.edu'
    const [selectedPet, setSelectedPet] = useState(null);
    const authToken = Cookies.get('authToken');
    const startY = useRef(0);
    const lastScrollTime = useRef(0);
    const router = useRouter();
    const { petID } = router.query;

    useEffect(() => {
        if (!authToken) {
            router.push('/sign-in');
            return;
        }
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`);
                const data = await response.json();
                if (response.ok) {
                    setUserId(data.userID);
                } else {
                    console.error('Failed to fetch user type:', response.statusText);
                }
            } catch (error) {
                console.error("Error fetching user type:", error);
            }
        };
        checkAuth();
    }, [authToken, router]);

    useEffect(() => {
        if (userId !== -1) fetchPets();
    }, [userId]);

    const fetchPets = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/user/${userId}`);
            const data = await response.json();
            setPets((prevPets) => [...prevPets, ...data]);
        } catch (error) {
            console.error("Failed to fetch pets:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendEmail = async () => {
        try {
            const response = await axios.post(
                "https://api.brevo.com/v3/smtp/email",
                {
                    sender: { name, email },
                    to: [{ email: "mjosephs@customsportssleeves.com", name: "Support Team" }],
                    subject: `New Adoption Request from Customer ${userId}`,
                    htmlContent: `
                    <p><strong>Pet Name:</strong> ${name}</p>
                    <p><strong>Customer:</strong> ${userId}</p>`,
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

    const handleRequestAdoption = (pet) => {
        setSelectedPet(pet);
        setMessageOpen(true);
    };

    const handleSendMessage = async () => {
        const payload = {
            senderId: userId,
            receiverId: pet.adoptionCenter.id,
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
            userId: userId,
            petId: petID,
            adoptionCenterId: adoptionCenter.id
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/adoptionRequest/request`, requestData);

            await sendEmail()

            if (response.status === 200) {
                router.push('/pet/requested');
            }
        } catch (error) {
            console.error('Error while requesting adoption:', error.response?.data || error.message);
        }
    };

    const goToNextPet = useCallback(() => {
        if (currentPetIndex < pets.length - 1) {
            setCurrentPetIndex((prevIndex) => prevIndex + 1);
            setViewCount((prevCount) => prevCount + 1);
        }
    }, [currentPetIndex, pets]);

    const goToPreviousPet = useCallback(() => {
        if (currentPetIndex > 0) {
            setCurrentPetIndex((prevIndex) => prevIndex - 1);
        }
    }, [currentPetIndex]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'ArrowDown') goToNextPet();
            if (e.key === 'ArrowUp') goToPreviousPet();
        },
        [goToNextPet, goToPreviousPet]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleWheel = useCallback((e) => {
        const now = new Date().getTime();

        if (now - lastScrollTime.current > 1500) {
            if (e.deltaY > 0) {
                goToNextPet();
            } else if (e.deltaY < 0) {
                goToPreviousPet();
            }
            lastScrollTime.current = now;
        }
    }, [goToNextPet, goToPreviousPet]);

    useEffect(() => {
        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    useEffect(() => {
        if (viewCount === 3) {
            fetchPets();
            setViewCount(0); // Reset the count after fetching new pets
        }
    }, [viewCount]);

    const handleTouchMove = (e) => {
        if (!startY.current) return;
        const deltaY = startY.current - e.touches[0].clientY;
        if (deltaY > 50) goToNextPet();
        else if (deltaY < -50) goToPreviousPet();
        startY.current = 0;
    };

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{ overflow: 'hidden' }}
        >
            {loading ? (
                <CircularProgress
                    style={{ position: 'absolute', top: '50%', left: '50%' }}
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PetCard
                        pet={pets[currentPetIndex]}
                        router={router}
                        userId={userId}
                        handleRequestAdoption={handleRequestAdoption}
                    />
                </div>
            )}

            {/* Message Dialog */}
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
                    <Button onClick={() => setMessageOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSendMessage} color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


export default ForYouPage;
