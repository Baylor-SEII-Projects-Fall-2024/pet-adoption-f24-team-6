package petadoption.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import petadoption.api.models.RegisterPet;
import petadoption.api.models.Pet;
import petadoption.api.service.PetService;

@RestController
@RequestMapping("/api/pet")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class PetController {

    @Autowired
    private PetService petService;

    @PostMapping("/register")
    public ResponseEntity<?> registerPet(@RequestBody RegisterPet registerPet) {
        try {
            Pet pet = petService.registerPet(
                    registerPet.getName(),
                    registerPet.getAge(),
                    registerPet.getSpecies(),
                    registerPet.getBreed(),
                    registerPet.getSize(),
                    registerPet.getGender(),
                    registerPet.getPhoto(),
                    registerPet.getColor(),
                    registerPet.getFriendliness(),
                    registerPet.getTrainingLevel(),
                    registerPet.getCenterId() // Pass the centerId to the service
            );
            return ResponseEntity.ok(pet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register pet: " + e.getMessage());
        }
    }

    @GetMapping("/{petId}")
    public ResponseEntity<?> getPet(@PathVariable Long petId) {
        try {
            Pet pet = petService.findPet(petId).orElseThrow(() -> new IllegalStateException("Pet not found"));
            return ResponseEntity.ok(pet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to retrieve pet: " + e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllPets() {
        try {
            return ResponseEntity.ok(petService.getAllPets());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve pets: " + e.getMessage());
        }
    }

    @PutMapping("/update/{petId}")
    public ResponseEntity<?> updatePet(@PathVariable Long petId, @RequestBody RegisterPet updatedPet) {
        try {
            Pet pet = new Pet();
            pet.setName(updatedPet.getName());
            pet.setAge(updatedPet.getAge());
            pet.setSpecies(updatedPet.getSpecies());
            pet.setBreed(updatedPet.getBreed());
            pet.setSize(updatedPet.getSize());
            pet.setGender(updatedPet.getGender());
            pet.setPhoto(updatedPet.getPhoto());
            pet.setColor(updatedPet.getColor());
            pet.setFriendliness(updatedPet.getFriendliness());
            pet.setTrainingLevel(updatedPet.getTrainingLevel());

            Pet updated = petService.updatePet(petId, pet);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update pet: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{petId}")
    public ResponseEntity<?> deletePet(@PathVariable Long petId) {
        try {
            petService.deletePet(petId);
            return ResponseEntity.ok("Pet deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to delete pet: " + e.getMessage());
        }
    }
}
