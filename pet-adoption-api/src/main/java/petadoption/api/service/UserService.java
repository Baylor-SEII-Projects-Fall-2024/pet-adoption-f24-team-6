package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User registerUser(String email, String password, USER_TYPE userType, String firstName, String lastName) {
        User existingUser = userRepository.findByEmailAddress(email);
        if (existingUser != null) {
            throw new IllegalStateException("Email is already registered");
        }

        User user = new User();
        user.setEmailAddress(email);
        user.setPassword(password);
        user.setUserType(userType);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setBreedPref("N/A");
        user.setSpeciesPref("N/A");

        return userRepository.save(user);
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
            existingUser.setPassword(updateUser.getPassword());
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

        if (updateUser.getSpeciesPref() != null && !updateUser.getSpeciesPref().isEmpty()) {
            existingUser.setSpeciesPref(updateUser.getSpeciesPref());
        }

        if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
            existingUser.setPassword(updateUser.getPassword());
        }

        return userRepository.save(existingUser);
    }



    public User findUserByEmail(String email) {
        return userRepository.findByEmailAddress(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return rawPassword.equals(encodedPassword);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
