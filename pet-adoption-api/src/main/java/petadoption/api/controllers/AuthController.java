package petadoption.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import petadoption.api.tables.AdoptionCenter;
import petadoption.api.service.AdoptionCenterService;
import petadoption.api.models.LoginEndpoint;
import petadoption.api.models.Register;
import petadoption.api.models.USER_TYPE;
import petadoption.api.models.UpdateUser;
import petadoption.api.service.JwtService;
import petadoption.api.tables.User;
import petadoption.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService authService;

    @Autowired
    private AdoptionCenterService adoptionCenterService;

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

    @PostMapping("/registerAdmin")
    public ResponseEntity<?> registerAdminUser(@RequestBody Register registerEndpoint) {
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
            return ResponseEntity.ok().body(response);
        }

        return ResponseEntity.badRequest().body("Invalid Credentials");
    }

    @GetMapping("/checkAuth")
    public ResponseEntity<?> checkAuthentication(@RequestParam String authToken) {
        try {
            String test = authService.extractUsername(authToken);

            User user = userService.findUserByEmail(test);

            authService.isTokenValid(authToken, user);

            Map<String, Object> response = new HashMap<>();
            response.put("userType", user.getUserType());
            response.put("Authorized", true);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, Boolean> response = new HashMap<>();
            response.put("Authorized", false);
            return ResponseEntity.ok().body(response);
        }
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String authToken) {
        try {
            String token = authToken.replace("Bearer ", "");

            String currentUserEmail = authService.extractUsername(token);

            User user = userService.findUserByEmail(currentUserEmail);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            Map<String, String> userDetails = new HashMap<>();
            userDetails.put("emailAddress", user.getEmailAddress());
            userDetails.put("firstName", user.getFirstName());
            userDetails.put("lastName", user.getLastName());
            userDetails.put("userType", user.getUserType().toString());
            userDetails.put("breedPref", user.getBreedPref());
            userDetails.put("speciesPref", user.getSpeciesPref());

            return ResponseEntity.ok(userDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to retrieve user: " + e.getMessage());
        }
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAllUser() {
        try {
            List<User> allUsers = userService.getAllUsers();

            return ResponseEntity.ok(allUsers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to retrieve user: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String authToken, @RequestBody UpdateUser updateUser) {
        try {
            String token = authToken.replace("Bearer ", "");

            String currentUserEmail = authService.extractUsername(token);

            User user = userService.findUserByEmail(currentUserEmail);

            if (!authService.isTokenValid(token, user)) {
                throw new IllegalStateException("Invalid or expired token");
            }

            User updatedUser = userService.updateUser(currentUserEmail, updateUser, currentUserEmail);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update user: " + e.getMessage());
        }
    }

    @PutMapping("/updatePref")
    public ResponseEntity<?> updatePref(@RequestHeader("Authorization") String authToken, @RequestBody UpdateUser updateUser) {
        try {
            String token = authToken.replace("Bearer ", "");

            String currentUserEmail = authService.extractUsername(token);

            User user = userService.findUserByEmail(currentUserEmail);

            if (!authService.isTokenValid(token, user)) {
                throw new IllegalStateException("Invalid or expired token");
            }

            User updatedUser = userService.updatePreferences(currentUserEmail, updateUser, currentUserEmail);

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

    @GetMapping("/getCenterID")
    public ResponseEntity<?> getAdoptionCenterIDByAuthToken(@RequestParam String authToken) {
        try {
            String emailAddress = authService.extractUsername(authToken);
            User user = userService.findUserByEmail(emailAddress);
            USER_TYPE userType = user.getUserType();

            if(authService.isTokenValid(authToken, user) && userType == USER_TYPE.ADOPTION_CENTER) {
                Optional<AdoptionCenter> center = adoptionCenterService.getAdoptionCenterByEmailAddress(emailAddress);
                Map<String, Object> response = new HashMap<>();
                response.put("centerID", center.get().getId());
                return ResponseEntity.ok().body(response);
            }

            return ResponseEntity.badRequest().body("Not Valid Auth Token");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: check logs");
        }
    }

}