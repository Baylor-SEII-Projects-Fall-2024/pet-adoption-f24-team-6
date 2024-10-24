import React from 'react';
import { Box, Grid, Link, Typography } from '@mui/material';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#e0e0e0',
                padding: '2rem',
                width: '100%',
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom>
                        General
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link href="/contact-us" underline="hover">
                            Contact Us
                        </Link>
                        <Link href="/FAQ" underline="hover">
                            FAQ
                        </Link>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom>
                        User Account
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link href="/login" underline="hover">
                            Login
                        </Link>
                        <Link href="/browse" underline="hover">
                            Browse
                        </Link>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom>
                        Adoption Center
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link href="/register" underline="hover">
                            Register Adoption Center
                        </Link>
                    </Box>
                </Grid>
            </Grid>

            <Typography variant="body2" sx={{ textAlign: 'right', marginTop: '1rem' }}>
                &copy; {new Date().getFullYear()} Baylor Furries. All rights reserved.
            </Typography>
        </Box>
    );
}

export default Footer;