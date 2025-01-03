package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import petadoption.api.models.GeocodingResponse;
import petadoption.api.models.USER_TYPE;
import petadoption.api.models.UpdateUser;
import petadoption.api.repositories.UserRepository;
import petadoption.api.tables.User;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;  // Injected password encoder

    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User registerUser(String email, String rawPassword, USER_TYPE userType, String firstName, String lastName, String address) {
        User existingUser = userRepository.findByEmailAddress(email);
        if (existingUser != null) {
            throw new IllegalStateException("Email is already registered");
        }

        // Encode the raw password before saving
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = new User();
        user.setEmailAddress(email);
        user.setPassword(encodedPassword);
        user.setUserType(userType);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAddress(address);

        double[] coordinates = geocodeAddress(address);
        user.setLatitude(coordinates[0]);
        user.setLongitude(coordinates[1]);

        // Setting the default preferences of the User
        user.setBreedPref(null);
        user.setSpeciesPref(null);
        user.setColorPref(null);

        return userRepository.save(user);
    }

    private double[] geocodeAddress(String address) {
        String apiKey = "AIzaSyC9TTghzDIAuRpkSRuEVtlVgLPBXV_dQEQ";
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        GeocodingResponse response = restTemplate.getForObject(url, GeocodingResponse.class);

        if (!"OK".equals(response.getStatus()) || response.getResults().isEmpty()) {
            throw new IllegalStateException("Unable to geocode address: " + response.getStatus());
        }

        GeocodingResponse.Location location = response.getResults().get(0).getGeometry().getLocation();
        return new double[]{location.getLat(), location.getLng()};
    }



    public User updateUser(String email, UpdateUser updateUser, String currentUserEmail) {
        User existingUser = userRepository.findByEmailAddress(email);
        if (existingUser == null) {
            throw new IllegalStateException("User not found");
        }

        if (!email.equals(currentUserEmail)) {
            throw new IllegalStateException("You do not have permission to update this user's details");
        }

        if (updateUser.getFirstName() != null && !updateUser.getFirstName().isEmpty()) {
            existingUser.setFirstName(updateUser.getFirstName());
        }

        if (updateUser.getLastName() != null && !updateUser.getLastName().isEmpty()) {
            existingUser.setLastName(updateUser.getLastName());
        }

        if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
        }

        if (updateUser.getEmailAddress() != null && !updateUser.getEmailAddress().isEmpty()) {
            User userWithNewEmail = userRepository.findByEmailAddress(updateUser.getEmailAddress());
            if (userWithNewEmail != null && !userWithNewEmail.getId().equals(existingUser.getId())) {
                throw new IllegalStateException("Email address is already taken");
            }

            existingUser.setEmailAddress(updateUser.getEmailAddress());
        }

        return userRepository.save(existingUser);
    }

    public User updatePreferences(String email, UpdateUser updateUser, String currentUserEmail) {
        User existingUser = userRepository.findByEmailAddress(email);
        if (existingUser == null) {
            throw new IllegalStateException("User not found");
        }

        if (!email.equals(currentUserEmail)) {
            throw new IllegalStateException("You do not have permission to update this user's details");
        }

        if (updateUser.getBreedPref() != null && !updateUser.getBreedPref().isEmpty()) {
            existingUser.setBreedPref(updateUser.getBreedPref());
        }

        if (updateUser.getSpeciesPref() != null) {
            existingUser.setSpeciesPref(updateUser.getSpeciesPref());
        }

        if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    public User setPreferences(String email, UpdateUser updateUser) {
        User user = findUserByEmail(email);

        if (user.getBreedPref() == null && user.getSpeciesPref() == null && user.getColorPref() == null) {
            user.setBreedPref(updateUser.getBreedPref());
            user.setSpeciesPref(updateUser.getSpeciesPref());
            user.setColorPref(updateUser.getColorPref());
            return userRepository.save(user);  // Save the updated user with initial preferences
        } else {
            throw new IllegalStateException("Preferences are already set for this user.");
        }
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmailAddress(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long userId) {
        Optional<User> existingUserOptional = userRepository.findById(userId);
        if (existingUserOptional.isEmpty()) {
            throw new IllegalStateException("User not found");
        }
        userRepository.delete(existingUserOptional.get());
    }
}
