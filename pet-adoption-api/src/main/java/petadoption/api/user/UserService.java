package petadoption.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public User registerUser(String username, String password, String email, String userType) {
        if(userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("Email already exists");
        }
        // Currently plaintext until we decide on encryption method.
        User user = new User();
        user.setEmailAddress(email);
        user.setPassword(password);
        user.setUserType(userType);

        return userRepository.save(user);
    }
}
