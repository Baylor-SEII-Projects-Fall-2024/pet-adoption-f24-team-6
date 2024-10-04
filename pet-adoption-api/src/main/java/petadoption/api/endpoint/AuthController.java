package petadoption.api.endpoint;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import petadoption.api.model.Register;
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
