package petadoption.api.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import petadoption.api.model.USER_TYPE;
import petadoption.api.model.UpdateUser;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void testSaveUser() {
        User user = new User();
        user.setEmailAddress("newuser@example.com");
        user.setPassword("password");
        user.setUserType(USER_TYPE.CUSTOMER);
        user.setFirstName("John");
        user.setLastName("Doe");

        User savedUser = userService.saveUser(user);
        assertNotNull(savedUser.getId());
        assertEquals("newuser@example.com", savedUser.getEmailAddress());
    }

    @Test
    void testFindUser() {
        User user = new User();
        user.setEmailAddress("testuser@example.com");
        user.setPassword("password123");
        user.setUserType(USER_TYPE.ADMIN);
        user.setFirstName("Jane");
        user.setLastName("Doe");
        user = userRepository.save(user);

        Optional<User> foundUser = userService.findUser(user.getId());
        assertTrue(foundUser.isPresent());
        assertEquals("testuser@example.com", foundUser.get().getEmailAddress());
    }

    @Test
    void testRegisterUserWithUniqueEmail() {
        User registeredUser = userService.registerUser("unique@example.com", "password",
                USER_TYPE.CUSTOMER, "James", "Doe");

        assertNotNull(registeredUser.getId());
        assertEquals("unique@example.com", registeredUser.getEmailAddress());
    }

    @Test
    void testRegisterUserWithExistingEmail() {
        userService.registerUser("duplicate@example.com", "password", USER_TYPE.CUSTOMER,
                "Jill", "Doe");

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            userService.registerUser("duplicate@example.com", "newPassword",
                    USER_TYPE.CUSTOMER, "Johhny", "Doe");
        });

        assertEquals("Email is already registered", exception.getMessage());
    }

    @Test
    void testUpdateUser() {
        User user = userService.registerUser("update@example.com", "oldPassword",
                USER_TYPE.CUSTOMER, "Janet", "Doe");

        UpdateUser updateUser = new UpdateUser();
        updateUser.setFirstName("Jancy");
        updateUser.setLastName("Doen't");
        updateUser.setPassword("newPassword");

        // Update the user
        User updatedUser = userService.updateUser(user.getEmailAddress(), updateUser,
                user.getEmailAddress());

        assertEquals("Jancy", updatedUser.getFirstName());
        assertEquals("Doen't", updatedUser.getLastName());
        assertEquals("newPassword", updatedUser.getPassword());
    }

    @Test
    void testUpdateUserNotFound() {
        UpdateUser updateUser = new UpdateUser();
        updateUser.setFirstName("");

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            userService.updateUser("nonexistent@example.com", updateUser, "nonexistent@example.com");
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testUpdateUserWithoutPermission() {
        User user1 = userService.registerUser("user1@example.com", "password",
                USER_TYPE.CUSTOMER, "Joseph", "Doe");
        User user2 = userService.registerUser("user2@example.com", "password",
                USER_TYPE.CUSTOMER, "Julian", "Doe");

        UpdateUser updateUser = new UpdateUser();
        updateUser.setFirstName("Jameson");

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            userService.updateUser(user1.getEmailAddress(), updateUser, user2.getEmailAddress());
        });

        assertEquals("You do not have permission to update this user's details", exception.getMessage());
    }

    @Test
    void testFindUserByEmail() {
        userService.registerUser("findbyemail@example.com", "password",
                USER_TYPE.CUSTOMER, "Jackson", "Doe");

        User foundUser = userService.findUserByEmail("findbyemail@example.com");
        assertNotNull(foundUser);
        assertEquals("Jackson", foundUser.getFirstName());
    }

    @Test
    void testCheckPassword() {
        String rawPassword = "myPassword";
        String encodedPassword = "myPassword";

        boolean isMatch = userService.checkPassword(rawPassword, encodedPassword);
        assertTrue(isMatch);
    }

    @Test
    void testGetAllUsers() {
        userService.registerUser("user1@example.com", "password1",
                USER_TYPE.CUSTOMER, "Johnston", "Doe");
        userService.registerUser("user2@example.com", "password2",
                USER_TYPE.ADMIN, "Jamie", "Doe");

        List<User> users = userService.getAllUsers();
        assertEquals(2, users.size());
    }
}