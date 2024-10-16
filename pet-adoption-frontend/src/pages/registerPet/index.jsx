import React, { useState } from 'react';
import {
    TextField, Button, FormControl, InputLabel, Select, MenuItem,
    RadioGroup, FormControlLabel, Radio, Slider, Box, Typography,
    FormLabel, Grid, Paper
} from '@mui/material';
import axios from 'axios';

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
        centerId: 1,
    });

    const colors = ['Black', 'White', 'Brown', 'Golden', 'Mixed'];
    const sizes = ['Puppy', 'Adult', 'Senior'];
    const speciesList = ['Dog', 'Cat', 'Bird', 'Rabbit'];

    const [file, setFile] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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

            setSuccess(response.data);

            setPhotoUrl(response)
            console.log(photoUrl)
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

        // Step 4: Upload the image and get the URL
        const testing = await uploadFile();


        try {
            // Step 5: Send the pet data with the image URL to the backend
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/register`, {
                ...petData,
                photo: photoUrl.toString(),
            });

            console.log('Pet registered successfully:', response.data);

            // setPetData({
            //     name: '',
            //     age: '',
            //     species: '',
            //     breed: '',
            //     size: '',
            //     gender: '',
            //     color: '',
            //     friendliness: 5,
            //     trainingLevel: 10,
            //     centerId: 1,
            // });
            setFile(null);
            setPhotoUrl(null)
        } catch (error) {
            console.error('Error registering pet:', error);
        }
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
                            onChange={handleChange}
                        >
                            {colors.map((color) => (
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
        </Grid>
    );
}
