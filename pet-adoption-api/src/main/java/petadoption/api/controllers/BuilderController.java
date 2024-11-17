package petadoption.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.repositories.AdoptionCenterRepository;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserRepository;
import petadoption.api.tables.AdoptionCenter;
import petadoption.api.tables.Pet;
import petadoption.api.tables.User;
import petadoption.api.builders.AdoptionCenterBuilder;
import petadoption.api.builders.PetBuilder;
import petadoption.api.builders.UserBuilder;

@RestController
@RequestMapping("/api/build")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class BuilderController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserBuilder userBuilder;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    @Autowired
    private AdoptionCenterBuilder adoptionCenterBuilder;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PetBuilder petBuilder;

    @PostMapping("/User/{count}")
    public ResponseEntity<Integer> createUsers(@PathVariable int count) {
        long startCount = userRepository.count();

        if (count <= 0) {
            return ResponseEntity.badRequest().body(-1);
        }

        for (int i = 0; i < count; i++) {
            User curUser = userBuilder.create();
            userRepository.save(curUser);
        }

        long endCount = userRepository.count();

        return ResponseEntity.ok((int) (endCount - startCount));
    }

    @PostMapping("/Pet/{count}")
    public ResponseEntity<Integer> createPets(@PathVariable int count) {
        long startCount = petRepository.count();

        if (count <= 0) {
            return ResponseEntity.badRequest().body(-1);
        }

        for (int i = 0; i < count; i++) {
            Pet curPet = petBuilder.create();
            petRepository.save(curPet);
        }

        long endCount = petRepository.count();

        return ResponseEntity.ok((int) (endCount - startCount));
    }

    @PostMapping("/Center/{count}")
    public ResponseEntity<Integer> createAdoptionCenters(@PathVariable int count) {
        long startCount = adoptionCenterRepository.count();

        if (count <= 0) {
            return ResponseEntity.badRequest().body(-1);
        }

        for (int i = 0; i < count; i++) {
            AdoptionCenter curAdoptionCenter = adoptionCenterBuilder.create();
            userRepository.save(curAdoptionCenter.getUser());
            adoptionCenterRepository.save(curAdoptionCenter);
        }

        long endCount = adoptionCenterRepository.count();

        return ResponseEntity.ok((int) (endCount - startCount));
    }

}
