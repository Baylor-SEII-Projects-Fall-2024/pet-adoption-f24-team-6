import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Paper, Box, Typography, Grid } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { useRouter } from 'next/router';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Carousel styling

export default function HomeCarousel() {
    const [scrollY, setScrollY] = useState(1);
    const router = useRouter();
    const [visible, setVisible] = useState({});
    const sectionRefs = useRef([]);

    // Scroll state management
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Add to refs utility
    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    // IntersectionObserver to track visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible((prev) => ({
                            ...prev,
                            [entry.target.dataset.index]: true,
                        }));
                    }
                });
            },
            { threshold: 0.2 }
        );

        sectionRefs.current.forEach((ref) => observer.observe(ref));
        return () => sectionRefs.current.forEach((ref) => observer.unobserve(ref));
    }, []);

    const handleNavigation = (path) => router.push(path);

    // Calculate opacity for the text overlay
    const opacity = Math.max(1 - scrollY / 300, 0);

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Text Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    zIndex: 10,
                    opacity: opacity,
                    transition: 'opacity 0.5s ease-out',
                    pointerEvents: 'none',
                }}
            >
                Adopt Your New Best Friend!
            </div>

            {/* Carousel Component */}
            <Carousel autoPlay infiniteLoop showThumbs={false}>
                <div>
                    <img src="/homepage-1.jpg" alt="Slide 1" />
                </div>
                <div>
                    <img src="/test-1.jpg" alt="Slide 2" />
                </div>
                <div>
                    <img src="/images/slide3.jpg" alt="Slide 3" />
                </div>
            </Carousel>

            {/* Paper Sections in a Responsive Grid */}
            <Box sx={{ padding: '2rem' }}>
                <Grid container spacing={4} justifyContent="center">
                    {[
                        { label: 'Browse Pets', icon: <PetsIcon fontSize="large" />, path: '/browse' },
                        {
                            label: 'Register Adoption Center',
                            icon: <VolunteerActivismIcon fontSize="large" />,
                            path: '/register-adoption-center',
                        },
                        { label: 'Contact Us', icon: <ContactPageIcon fontSize="large" />, path: '/contact-us' },
                    ].map((option, index) => (
                        <Grid item xs={12} sm={6} md={4} key={option.label}>
                            <Paper
                                data-index={index}
                                ref={addToRefs}
                                onClick={() => handleNavigation(option.path)}
                                sx={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    opacity: visible[index] ? 1 : 0,
                                    transform: visible[index] ? 'translateY(0)' : 'translateY(50px)',
                                    transition: 'opacity 1s ease-out, transform 1s ease-out',
                                }}
                            >
                                {option.icon}
                                <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                    {option.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
}
