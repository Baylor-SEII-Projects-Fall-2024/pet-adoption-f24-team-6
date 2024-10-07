package petadoption.api.endpoint;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import petadoption.api.model.Register;
import petadoption.api.model.UpdateUser;
import petadoption.api.service.JwtService;
import petadoption.api.user.User;
import petadoption.api.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Register registerEndpoint) {
        userService.registerUser(
                registerEndpoint.getEmailAddress(),
                registerEndpoint.getPassword(),
                registerEndpoint.getUserType(),
                registerEndpoint.getFirstName(),
                registerEndpoint.getLastName()
        );
        System.out.println("inside");
        return ResponseEntity.ok("User Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginEndpoint loginEndpoint) {
        User user = userService.findUserByEmail(loginEndpoint.getEmailAddress());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid Credentials");
        }

        if (userService.checkPassword(loginEndpoint.getPassword(), user.getPassword())) {
            String token = authService.generateToken(user);
            Map<String, String> response = new HashMap<>();
            response.put("authToken", token);
            return ResponseEntity.ok().body(response); // JSON response with token
        }

        return ResponseEntity.badRequest().body("Invalid Credentials");
    }

    @GetMapping("/checkAuth")
    public ResponseEntity<?> checkAuthentication(@RequestParam String authToken) {
        try {
            String test = authService.extractUsername(authToken);

            User user = userService.findUserByEmail(test);

            authService.isTokenValid(authToken, user);

            Map<String, Boolean> response = new HashMap<>();
            response.put("Authorized", true);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, Boolean> response = new HashMap<>();
            response.put("Authorized", false);
            return ResponseEntity.ok().body(response);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestParam String email, @RequestBody UpdateUser updateUser, @RequestParam String authToken) {
        try {
            // Extract the username from the token
            String currentUserEmail = authService.extractUsername(authToken);

            // Find the user based on the email extracted from the token
            User user = userService.findUserByEmail(currentUserEmail);

            // Validate the token for the user
            if (!authService.isTokenValid(authToken, user)) {
                throw new IllegalStateException("Invalid or expired token");
            }

            // Ensure the user is allowed to update their details
            if (!email.equals(currentUserEmail)) {
                throw new IllegalStateException("You do not have permission to update this user's details");
            }

            // Proceed to update user details
            User updatedUser = userService.updateUser(email, updateUser, currentUserEmail);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update user: " + e.getMessage());
        }
    }



    @GetMapping("/getNames")
    public ResponseEntity<?> getNames(@RequestParam String authToken) {
        try {
            String userEmailAddress = authService.extractUsername(authToken);
            User user = userService.findUserByEmail(userEmailAddress);

            if(authService.isTokenValid(authToken, user)){
                String firstName = authService.extractFirstName(authToken);
                String lastName = authService.extractLastName(authToken);

                String initials = firstName.charAt(0) + "" + lastName.charAt(0);

                initials = initials.toUpperCase();

                Map<String, String> response = new HashMap<>();
                response.put("firstName", firstName);
                response.put("lastName", lastName);
                response.put("initials", initials);
                return ResponseEntity.ok().body(response);
            }

            return ResponseEntity.badRequest().body("User Not Valid");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
