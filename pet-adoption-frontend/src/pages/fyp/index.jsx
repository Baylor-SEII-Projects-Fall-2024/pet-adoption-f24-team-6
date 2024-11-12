import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Button, CircularProgress } from '@mui/material';

const PetCard = ({ pet, handleLike, handleDislike }) => (
    <Paper
        style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            boxSizing: 'border-box',
        }}
    >
        <img
            src={pet.photo}
            alt={pet.name}
            style={{ width: '100%', height: '80%', objectFit: 'cover' }}
        />
        <h3>{pet.name}</h3>
        <div>
            <Button onClick={() => handleLike(pet.id)}>Like</Button>
            <Button onClick={() => handleDislike(pet.id)}>Dislike</Button>
        </div>
    </Paper>
);

const ForYouPage = () => {
    const [pets, setPets] = useState([]);
    const [currentPetIndex, setCurrentPetIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const startY = useRef(0); // Track initial touch Y position
    const scrollTimeout = useRef(null);
    const lastScrollTime = useRef(0); // Keep track of the last scroll event

    // Fetch pets initially
    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/getAll`); // Fetch a batch of pets
                const data = await response.json();
                setPets(data);
            } catch (error) {
                console.error("Failed to fetch pets", error);
            }
            setLoading(false);
        };
        fetchPets();
    }, []);

    // Scroll or Arrow Key Navigation Function
    const goToNextPet = useCallback(() => {
        if (currentPetIndex < pets.length - 1) {
            setCurrentPetIndex((prevIndex) => prevIndex + 1);
        }
    }, [currentPetIndex, pets]);

    const goToPreviousPet = useCallback(() => {
        if (currentPetIndex > 0) {
            setCurrentPetIndex((prevIndex) => prevIndex - 1);
        }
    }, [currentPetIndex]);

    // Handle Arrow Key Events
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowDown') goToNextPet();
        if (e.key === 'ArrowUp') goToPreviousPet();
    }, [goToNextPet, goToPreviousPet]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Handle Wheel Events for Scroll Navigation
    const handleWheel = useCallback((e) => {
        const now = new Date().getTime();

        // Only proceed if the scroll event is far enough apart to avoid rapid changes
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

    // Handle Touch Events for Mobile
    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        if (!startY.current) return;
        const deltaY = startY.current - e.touches[0].clientY;
        if (deltaY > 50) goToNextPet();
        else if (deltaY < -50) goToPreviousPet();
        startY.current = 0;
    };

    const handleLike = (id) => {
        console.log("Liked pet with ID:", id);
        // Implement like logic here
    };

    const handleDislike = (id) => {
        console.log("Disliked pet with ID:", id);
        // Implement dislike logic here
    };

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{
                overflow: 'hidden',
            }}
        >
            {loading ? (
                <CircularProgress
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PetCard
                        pet={pets[currentPetIndex]}
                        handleLike={handleLike}
                        handleDislike={handleDislike}
                    />
                </div>
            )}
        </div>
    );
};

export default ForYouPage;
