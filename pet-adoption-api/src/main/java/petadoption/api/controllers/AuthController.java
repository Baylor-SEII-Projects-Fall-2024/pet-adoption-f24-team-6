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
            response.put("userID", user.getId());
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

            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("emailAddress", user.getEmailAddress());
            userDetails.put("firstName", user.getFirstName());
            userDetails.put("lastName", user.getLastName());
            userDetails.put("userType", user.getUserType().toString());
            userDetails.put("breedPref", user.getBreedPref());
            userDetails.put("speciesPref", user.getSpeciesPref());
            userDetails.put("colorPref", user.getColorPref());

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

    @PostMapping("/setPref")
    public ResponseEntity<?> setPreferences(@RequestHeader("Authorization") String authToken, @RequestBody UpdateUser updateUser) {
        try {
            // Clean the token by removing "Bearer " prefix if it exists
            String token = authToken.replace("Bearer ", "");


            // Extract the username from the token (email address in this case)
            String currentUserEmail = authService.extractUsername(token);


            // Retrieve the user by email
            User user = userService.findUserByEmail(currentUserEmail);


            // Validate the token
            if (!authService.isTokenValid(token, user)) {
                throw new IllegalStateException("Invalid or expired token");
            }


            // Call service to update user preferences
            User updatedUser = userService.setPreferences(currentUserEmail, updateUser);


            // Return the updated user details in response
            return ResponseEntity.ok(updatedUser);
        } catch(IllegalArgumentException e) {
            // In case preferences are already set
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Preferences are already set for this user.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update preferences: " + e.getMessage());
        }
    }




    // Getting User Preferences
    @GetMapping("/getPref")
    public ResponseEntity<?> getPreferences(@RequestHeader("Authorization") String authToken) {
        try {
            // Remove "Bearer " prefix from token
            String token = authToken.replace("Bearer ", "");


            // Extract email from token
            String currentUserEmail = authService.extractUsername(token);


            // Retrieve user by email
            User user = userService.findUserByEmail(currentUserEmail);


            // Validate the token
            if (!authService.isTokenValid(token, user)) {
                throw new IllegalStateException("Invalid or expired token");
            }


            // Prepare the user preferences response
            Map<String, Object> preferences = new HashMap<>();
            preferences.put("breedPref", user.getBreedPref());
            preferences.put("speciesPref", user.getSpeciesPref());
            preferences.put("colorPref", user.getColorPref());


            return ResponseEntity.ok(preferences);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve preferences: " + e.getMessage());
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


    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to delete user: " + e.getMessage());
        }
    }
}
