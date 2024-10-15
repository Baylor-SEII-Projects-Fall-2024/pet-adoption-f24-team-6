package petadoption.api.endpoint;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.adoptioncenter.AdoptionCenter;
import petadoption.api.adoptioncenter.AdoptionCenterService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/center")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class CenterController {

    @Autowired
    private AdoptionCenterService adoptionCenterService;

    @Autowired
    private PetService petService;

    @GetMapping("/all")
    public ResponseEntity<List<AdoptionCenter>> getAllCenters() {
        List<AdoptionCenter> centers = adoptionCenterService.getAllAdoptionCenters();
        return ResponseEntity.ok(centers);
    }

    @GetMapping("/{centerId}")
    public ResponseEntity<?> getCenterById(@PathVariable Long centerId) {
        Optional<AdoptionCenter> center = adoptionCenterService.getAdoptionCenterById(centerId);
        if (center.isPresent()) {
            return ResponseEntity.ok(center.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Adoption Center not found with id: " + centerId);
        }
    }


    @PostMapping("/create")
    public ResponseEntity<?> createCenter(@RequestBody AdoptionCenter center) {
        try {
            AdoptionCenter createdCenter = adoptionCenterService.saveAdoptionCenter(center);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCenter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to create adoption center: " + e.getMessage());
        }
    }

    @PutMapping("/update/{centerId}")
    public ResponseEntity<?> updateCenter(@PathVariable Long centerId, @RequestBody AdoptionCenter center) {
        try {
            AdoptionCenter updatedCenter = adoptionCenterService.updateAdoptionCenter(centerId, center);
            return ResponseEntity.ok(updatedCenter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to update adoption center: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{centerId}")
    public ResponseEntity<?> deleteCenter(@PathVariable Long centerId) {
        try {
            adoptionCenterService.deleteAdoptionCenter(centerId);
            return ResponseEntity.ok("Adoption Center deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to delete adoption center: " + e.getMessage());
        }
    }

    @GetMapping("/{centerId}/pets")
    public ResponseEntity<?> getPetsByCenter(@PathVariable Long centerId) {
        List<Pet> pets = petService.getPetsByCenterId(centerId);
        if (pets.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(pets);
        }
    }
}
