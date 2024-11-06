package petadoption.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.models.Register;
import petadoption.api.models.RegisterAdoptionRequestInput;
import petadoption.api.service.AdoptionCenterService;
import petadoption.api.service.AdoptionRequestService;
import petadoption.api.service.PetService;
import petadoption.api.service.UserService;
import petadoption.api.tables.AdoptionCenter;
import petadoption.api.tables.AdoptionRequest;
import petadoption.api.tables.Pet;
import petadoption.api.tables.User;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adoptionRequest")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class AdoptionRequestController {

    @Autowired
    private AdoptionRequestService adoptionRequestService;
    @Autowired
    private UserService userService;
    @Autowired
    private PetService petService;
    @Autowired
    private AdoptionCenterService adoptionCenterService;


    @PostMapping("/request")
    public ResponseEntity<?> registerAdminUser(@RequestBody RegisterAdoptionRequestInput input) {
        Optional<User> user = userService.findUser(input.userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid User ID");
        }

        Optional<Pet> pet = petService.findPet(input.petId);
        if (pet == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Pet ID");
        }

        Optional<AdoptionCenter> center = adoptionCenterService.getAdoptionCenterById(input.adoptionCenterId);
        if (center == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Adoption Center ID");
        }

        AdoptionRequest adoptionRequest = new AdoptionRequest(user.orElse(new User()), pet.orElse(new Pet()), center.orElse(new AdoptionCenter()));
        adoptionRequestService.saveAdoptionRequest(adoptionRequest);

        return ResponseEntity.ok("Adoption Request Registered Successfully");
    }

    @GetMapping("/center/{centerId}")
    public ResponseEntity<List<AdoptionRequest>> getAdoptionRequestsByCenterId(@PathVariable Long centerId) {
        List<AdoptionRequest> requests = adoptionRequestService.getAdoptionRequestByCenterId(centerId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/requestRead/{requestId}")
    public ResponseEntity<AdoptionRequest> markRequestRead(@PathVariable Long requestId){
        AdoptionRequest request = adoptionRequestService.findById(requestId).orElse(new AdoptionRequest());
        request.setIsRead(true);

        return ResponseEntity.ok(adoptionRequestService.saveAdoptionRequest(request));


    }

}
