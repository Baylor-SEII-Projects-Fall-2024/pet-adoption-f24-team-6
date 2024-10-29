package petadoption.api.user;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.models.USER_TYPE;
import petadoption.api.tables.User;
import petadoption.api.service.UserService;

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
        newUser.setUserType(USER_TYPE.CUSTOMER);
        newUser.setEmailAddress("example@example.com");
        newUser.setPassword("password");

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.getId());

        Optional<User> foundUserOpt = userService.findUser(savedUser.getId());
        assertTrue(foundUserOpt.isPresent());
        User foundUser = foundUserOpt.get();

        assertEquals(newUser.getUserType(), foundUser.getUserType());
        assertEquals(newUser.getEmailAddress(), foundUser.getEmailAddress());
        assertEquals(newUser.getPassword(), foundUser.getPassword());
    }

    @Test
    void testUserFind() {
        Optional<User> user1 = userService.findUser(1L);
        assertTrue(user1.isEmpty());
    }
}
