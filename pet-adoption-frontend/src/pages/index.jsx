import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router'
import Head from 'next/head'
import ImageCarousel from '../components/imageCarousel'
import {Box, Grid, Paper, Typography} from '@mui/material'
import Footer from "@/components/Footer";
import PetsIcon from "@mui/icons-material/Pets";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ContactPageIcon from "@mui/icons-material/ContactPage";

export default function HomePage() {
    const router = useRouter();
    const [visible, setVisible] = useState({});
    const sectionRefs = useRef([]);
    const [scrollY, setScrollY] = useState(1);
    const opacity = Math.max(2 - scrollY / 300, 0);

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

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

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
      <>
          <Head>
              <title>Home Page | Baylor Furries</title>
          </Head>

          <Box sx={{height: "20px"}}></Box>
          <ImageCarousel/>

          <div
              style={{
                  position: 'absolute',
                  top: '132%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  zIndex: 10,
                  opacity: opacity,
                  transition: 'opacity 1s ease-out',
                  pointerEvents: 'none',
              }}
          >
              Adopt Your New Best Friend!
          </div>

          <Box sx={{padding: '2rem', marginTop: '5rem'}}>
              <Grid container spacing={4} justifyContent="center">
                  {[
                      {
                          label: 'Browse Pets',
                          icon: <PetsIcon fontSize="large"/>,
                          path: '/browse'
                      },
                      {
                          label: 'Register Adoption Center',
                          icon: <VolunteerActivismIcon fontSize="large"/>,
                          path: '/register-ADCenter',
                      },
                      {
                          label: 'Contact Us',
                          icon: <ContactPageIcon fontSize="large"/>,
                          path: '/contact-us'
                      },
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
                                  transition: 'opacity 3.5s ease-out, transform 3.5s ease-out',
                                  height: '40vh'
                              }}
                              elevation={5}
                          >
                              <div style={{marginTop: '35px'}}>
                                  {option.icon}
                              </div>

                              <Typography variant="h6" sx={{marginTop: '50px'}}>
                                  {option.label}
                              </Typography>
                          </Paper>
                      </Grid>
                  ))}
              </Grid>
          </Box>

          <Footer/>

      </>
  );
}
