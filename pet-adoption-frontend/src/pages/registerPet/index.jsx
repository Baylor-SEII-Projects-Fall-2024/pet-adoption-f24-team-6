// Import necessary Material-UI components
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
        photo: '',
        color: '',
        friendliness: 5,
        trainingLevel: 10,
        centerId: '',
    });

    const colors = ['Black', 'White', 'Brown', 'Golden', 'Mixed'];
    const sizes = ['Puppy', 'Adult', 'Senior'];
    const speciesList = ['Dog', 'Cat', 'Bird', 'Rabbit'];

    const [selectedFile, setSelectedFile] = useState(null); // Track the selected file
    const [isUploading, setIsUploading] = useState(false); // Upload status

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (name) => (e, value) => {
        setPetData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Store the selected file
    };

    const uploadImageToGCS = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload');
            return null;
        }

        try {
            setIsUploading(true);

            // Step 1: Get signed URL from the backend
            const { data } = await axios.get('/generate-signed-url', {
                params: { filename: selectedFile.name },
            });

            // Step 2: Upload the image to GCS using the signed URL
            await axios.put(data.url, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type, // Set content type correctly
                },
            });

            // Step 3: Return the public URL for the uploaded file
            const publicUrl = `https://storage.googleapis.com/your-bucket-name/${selectedFile.name}`;
            setIsUploading(false);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            setIsUploading(false);
            return null;
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Step 4: Upload the image and get the URL
        const photoUrl = await uploadImageToGCS();
        if (!photoUrl) return; // Stop if the upload failed

        try {
            // Step 5: Send the pet data with the image URL to the backend
            const response = await axios.post('/api/register-pet', {
                ...petData,
                photo: photoUrl, // Include the uploaded image URL
            });

            console.log('Pet registered successfully:', response.data);

            // Reset form after successful registration
            setPetData({
                name: '',
                age: '',
                species: '',
                breed: '',
                size: '',
                gender: '',
                photo: '',
                color: '',
                friendliness: 5,
                trainingLevel: 10,
                centerId: '',
            });
            setSelectedFile(null);
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
                        {isUploading && <Typography>Uploading...</Typography>}
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                        Register Pet
                    </Button>
                </form>
            </Paper>
        </Grid>
    );
}
