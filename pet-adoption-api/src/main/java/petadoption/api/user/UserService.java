package petadoption.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.model.USER_TYPE;
import petadoption.api.model.UpdateUser;

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

        return userRepository.save(user);
    }

    public User updateUser(String email, UpdateUser updateUser, String currentUserEmail) {
        User existingUser = userRepository.findByEmailAddress(email);
        if (existingUser == null) {
            throw new IllegalStateException("User not found");
        }

        // Ensure the user can only update their own details
        if (!email.equals(currentUserEmail)) {
            throw new IllegalStateException("You do not have permission to update this user's details");
        }

        // Update the user details
        if (updateUser.getFirstName() != null && !updateUser.getFirstName().isEmpty()) {
            existingUser.setFirstName(updateUser.getFirstName());
        }
        if (updateUser.getLastName() != null && !updateUser.getLastName().isEmpty()) {
            existingUser.setLastName(updateUser.getLastName());
        }
        if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
            existingUser.setPassword(updateUser.getPassword()); // Hash if needed
        }

        return userRepository.save(existingUser);
    }


    public User findUserByEmail(String email) {
        return userRepository.findByEmailAddress(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return rawPassword.equals(encodedPassword);
    }
}
