package petadoption.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.models.InteractionRequest;
import petadoption.api.models.INTERACTION_TYPE;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserInteractionRepository;
import petadoption.api.repositories.UserRepository;
import petadoption.api.service.RecommendationEngineService;
import petadoption.api.service.UserInteractionService;
import petadoption.api.tables.Pet;
import petadoption.api.tables.User;
import petadoption.api.tables.UserInteraction;

import java.util.List;

@RestController
@RequestMapping("/api/interaction")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class UserInteractionController {

    @Autowired
    private RecommendationEngineService recommendationService;

    @Autowired
    private UserInteractionRepository userInteractionRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Pet>> getPersonalizedRecommendations(@PathVariable Long userId) {
        List<Pet> recommendedPets = recommendationService.getPersonalizedRecommendations(userId);
        return ResponseEntity.ok(recommendedPets);
    }

    @PostMapping("/like")
    public ResponseEntity<String> likePet(@RequestBody InteractionRequest request) {

        User user = userRepository.findById(request.getUserId()).orElse(new User());
        Pet pet = petRepository.findById(request.getPetId()).orElse(new Pet());
        pet.setLikes((pet.getLikes() + 1));
        pet = petRepository.save(pet);

        UserInteraction interaction = new UserInteraction(
                user, pet, INTERACTION_TYPE.LIKE
        );
        userInteractionRepo.save(interaction);
        return ResponseEntity.ok("Pet liked successfully");
    }

    @PostMapping("/dislike")
    public ResponseEntity<String> dislikePet(@RequestBody InteractionRequest request) {

        User user = userRepository.findById(request.getUserId()).orElse(new User());
        Pet pet = petRepository.findById(request.getPetId()).orElse(new Pet());

        pet.setDislikes((pet.getDislikes() + 1));
        pet = petRepository.save(pet);

        UserInteraction interaction = new UserInteraction(
                user, pet, INTERACTION_TYPE.DISLIKE
        );
        userInteractionRepo.save(interaction);
        return ResponseEntity.ok("Pet disliked successfully");
    }

    @PostMapping("/view")
    public ResponseEntity<String> viewPet(@RequestBody InteractionRequest request) {

        User user = userRepository.findById(request.getUserId()).orElse(new User());
        Pet pet = petRepository.findById(request.getPetId()).orElse(new Pet());

        pet.setViews((pet.getViews() + 1));
        pet = petRepository.save(pet);

        UserInteraction interaction = new UserInteraction(
                user, pet, INTERACTION_TYPE.VIEW
        );
        userInteractionRepo.save(interaction);
        return ResponseEntity.ok("Pet viewed successfully");
    }
}
