package petadoption.api.user;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.model.USER_TYPE;
import petadoption.api.model.UpdateUser;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional             // make these tests revert their DB changes after the test is complete
public class UserTests {

    @Autowired
    private UserService userService;

    @Test
    void testUserCreate() {
        User newUser = new User();
        newUser.userType = USER_TYPE.CUSTOMER;
        newUser.emailAddress = "example@example.com";
        newUser.password = "password";

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);

        Optional<User> foundUserOpt = userService.findUser(savedUser.id);
        assertTrue(foundUserOpt.isPresent());
        User foundUser = foundUserOpt.get();

        assertEquals(newUser.userType, foundUser.userType);
        assertEquals(newUser.emailAddress, foundUser.emailAddress);
        assertEquals(newUser.password, foundUser.password);
    }

    @Test
    void testUserFind() {
        Optional<User> user1 = userService.findUser(1L);
        assertTrue(user1.isEmpty());
    }

    @Test
    void testUserUpdate() {
        // Create a new user
        User newUser = new User();
        newUser.setEmailAddress("updatetest@example.com");
        newUser.setPassword("password");
        newUser.setFirstName("OriginalFirst");
        newUser.setLastName("OriginalLast");
        newUser.setUserType(USER_TYPE.CUSTOMER);

        // Save the user
        User savedUser = userService.saveUser(newUser);

        // Prepare updated details
        UpdateUser updateUser = new UpdateUser();
        updateUser.setFirstName("UpdatedFirst");
        updateUser.setLastName("UpdatedLast");
        updateUser.setEmailAddress("updated@example.com");

        // Update the user details
        User updatedUser = userService.updateUser(savedUser.getEmailAddress(), updateUser, savedUser.getEmailAddress());

        // Verify the updated fields
        assertEquals("UpdatedFirst", updatedUser.getFirstName());
        assertEquals("UpdatedLast", updatedUser.getLastName());
        assertEquals("updated@example.com", updatedUser.getEmailAddress());
    }

    @Test
    void testFindUserByEmail() {
        String email = "findme@example.com";
        String password = "password";
        userService.registerUser(email, password, USER_TYPE.CUSTOMER, "First", "Last");

        User foundUser = userService.findUserByEmail(email);
        assertNotNull(foundUser);
        assertEquals(email, foundUser.getEmailAddress());
    }

    @Test
    void testUpdateUserPreferences() {
        String email = "prefuser@example.com";
        String password = "password";
        User registeredUser = userService.registerUser(email, password, USER_TYPE.CUSTOMER, "First", "Last");

        UpdateUser updateUser = new UpdateUser();
        updateUser.setSpeciesPref("Dog");
        updateUser.setBreedPref("Golden Retriever");

        User updatedUser = userService.updatePreferences(email, updateUser, email);

        assertEquals("Dog", updatedUser.getSpeciesPref());
        assertEquals("Golden Retriever", updatedUser.getBreedPref());
    }

    @Test
    void testPasswordValidation() {
        String rawPassword = "password123";
        String encodedPassword = "password123";

        assertTrue(userService.checkPassword(rawPassword, encodedPassword));
    }

    @Test
    void testDuplicateEmailRegistration() {
        String email = "duplicate@example.com";
        String password = "password";
        USER_TYPE userType = USER_TYPE.CUSTOMER;

        userService.registerUser(email, password, userType, "First", "Last");

        Exception exception = assertThrows(IllegalStateException.class, () -> {
            userService.registerUser(email, password, userType, "AnotherFirst", "AnotherLast");
        });

        assertEquals("Email is already registered", exception.getMessage());
    }

    @Test
    void testUserRegister() {
        String email = "newuser@example.com";
        String password = "newPassword";
        USER_TYPE userType = USER_TYPE.CUSTOMER;
        String firstName = "John";
        String lastName = "Doe";

        User registeredUser = userService.registerUser(email, password, userType, firstName, lastName);

        assertNotNull(registeredUser);
        assertEquals(email, registeredUser.getEmailAddress());
        assertEquals(userType, registeredUser.getUserType());
        assertEquals(firstName, registeredUser.getFirstName());
        assertEquals(lastName, registeredUser.getLastName());

        Optional<User> foundUser = userService.findUser(registeredUser.getId());
        assertTrue(foundUser.isPresent());
    }


}


