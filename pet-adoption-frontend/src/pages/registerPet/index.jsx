import React, {useEffect, useState} from 'react';
import {
    TextField, Button, FormControl, InputLabel, Select, MenuItem,
    RadioGroup, FormControlLabel, Radio, Slider, Box, Typography,
    FormLabel, Grid, Paper, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions
} from '@mui/material';
import axios from 'axios';
import {router} from "next/router";
import Cookies from "js-cookie";

export default function RegisterPet() {
    const [petData, setPetData] = useState({
        name: '',
        age: '',
        species: '',
        breed: '',
        size: '',
        gender: '',
        color: '',
        friendliness: 5,
        trainingLevel: 10,
    });

    const COLOR_CHOICES = [
        'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BROWN',
        'BLACK', 'WHITE', 'GRAY', 'CYAN', 'MAGENTA', 'BEIGE', 'TEAL', 'MAROON',
        'NAVY', 'LIME', 'CORAL', 'LAVENDER', 'GOLD', 'SILVER', 'BRONZE', 'PEACH',
        'MINT', 'TURQUOISE', 'INDIGO', 'CREAM', 'OCHRE', 'MUSTARD'
    ];
    const sizes = ['Puppy', 'Adult', 'Senior'];
    const speciesList = ['Dog', 'Cat', 'Fish', 'Bird', 'Hamster', 'Rabbit', 'Lizard', 'Turtle', 'GuineaPig', 'Snake'];

    const [file, setFile] = useState(null);
    let photoUrl = null;
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const authToken = Cookies.get('authToken');

    useEffect(() => {
        const checkAuth = async () => {
            if (!authToken) {
                router.push('/not-authorized'); // Redirect if no token.
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`);
                const data = await response.json();

                if (!response.ok || data.userType !== "ADOPTION_CENTER") {
                    router.push('/not-authorized');
                }
            } catch (error) {
                console.error("Auth check failed", error);
                router.push('/not-authorized');
            }
        }
        checkAuth()
    })

    const getCenterId = async (e) => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/getCenterID?authToken=${authToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setSuccess(false);
                setErrorMessage('Registration Failed');
            } else {
                return data?.centerID
            }
        } catch (error) {
            console.error("Error during register", error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(null); // Reset error state
    };

    const uploadFile = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pic/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                photoUrl = response.data;
                console.log('Uploaded photo URL:', response.data);
            }
        } catch (err) {
            setError('Failed to upload the file.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (name) => (e, value) => {
        setPetData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await uploadFile(); // Ensure file upload completes
        const centerID = await getCenterId();

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/register`, {
                ...petData,
                photo: photoUrl,
                centerId: centerID,
            });

            console.log('Pet registered successfully:', response.data);

            // Reset form and show success dialog
            setPetData({
                name: '',
                age: '',
                species: '',
                breed: '',
                size: '',
                gender: '',
                color: '',
                friendliness: 5,
                trainingLevel: 10,
            });
            setFile(null);
            photoUrl = null;
            setSuccess(true); // Open success dialog
        } catch (error) {
            console.error('Error registering pet:', error);
        }
    };

    const handleCloseSuccessDialog = () => {
        setSuccess(false); // Close the dialog
        router.push('/');
    };

    const handleColorChange = (e) => {
        // Update color directly in petData
        setPetData((prev) => ({ ...prev, color: e.target.value }));
    };

    return (
        <Grid container justifyContent="center" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
                <Typography variant="h4" gutterBottom>Register a Pet</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={petData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Age"
                        name="age"
                        type="number"
                        value={petData.age}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Species</InputLabel>
                        <Select
                            name="species"
                            value={petData.species}
                            onChange={handleChange}
                        >
                            {speciesList.map((species) => (
                                <MenuItem key={species} value={species}>
                                    {species}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Breed"
                        name="breed"
                        value={petData.breed}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Size</InputLabel>
                        <Select
                            name="size"
                            value={petData.size}
                            onChange={handleChange}
                        >
                            {sizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup
                            row
                            name="gender"
                            value={petData.gender}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="MALE" control={<Radio />} label="Male" />
                            <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Color</InputLabel>
                        <Select
                            name="color"
                            value={petData.color}
                            onChange={handleColorChange}
                        >
                            {COLOR_CHOICES.map((color) => (
                                <MenuItem key={color} value={color}>
                                    {color}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ mt: 3 }}>
                        <Typography gutterBottom>Friendliness: {petData.friendliness}</Typography>
                        <Slider
                            value={petData.friendliness}
                            onChange={handleSliderChange('friendliness')}
                            step={1}
                            marks
                            min={1}
                            max={10}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Typography gutterBottom>Training Level: {petData.trainingLevel}</Typography>
                        <Slider
                            value={petData.trainingLevel}
                            onChange={handleSliderChange('trainingLevel')}
                            step={1}
                            marks
                            min={1}
                            max={10}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                    <Box margin="normal">
                        <Typography gutterBottom>Upload Photo</Typography>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {loading && <Typography>Uploading...</Typography>}
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                        Register Pet
                    </Button>
                </form>
            </Paper>

            {/* Success Dialog */}
            <Dialog open={success} onClose={handleCloseSuccessDialog}>
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The pet has been successfully registered!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccessDialog} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
