package petadoption.api.endpoint;

import org.hibernate.annotations.DialectOverride;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import petadoption.api.model.CheckAuthorization;
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
    public String registerUser(@RequestBody RegisterEndpoint registerEndpoint) {
        userService.registerUser(
                registerEndpoint.getEmailAddress(),
                registerEndpoint.getPassword(),
                registerEndpoint.getUserType(),
                registerEndpoint.getName()
        );
        System.out.println("inside");
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginEndpoint loginEndpoint) {
        User user = userService.findUserByEmail(loginEndpoint.getEmailAddress());
        if (user == null) {
            throw new IllegalStateException("User not found");
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
            return ResponseEntity.ok().body(response); // JSON response with token
        } catch (Exception e) {
            Map<String, Boolean> response = new HashMap<>();
            response.put("Authorized", false);
            return ResponseEntity.ok().body(response); // JSON response with token
        }
    }
}
