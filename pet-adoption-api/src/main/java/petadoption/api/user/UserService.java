package petadoption.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public User registerUser(String email, String password, String userType) {
        User existingUser = userRepository.findByEmailAddress(email);
        if (existingUser != null) {
            throw new IllegalStateException("Email is already registered");
        }

        User user = new User();
        user.setEmailAddress(email);
        user.setPassword(password);
        user.setUserType(userType);

        return userRepository.save(user);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmailAddress(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return rawPassword.equals(encodedPassword);
    }
}
