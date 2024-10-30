package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserInteractionRepository;
import petadoption.api.repositories.UserRepository;
import petadoption.api.tables.Pet;

import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
public class UserInteractionService {

    @Autowired
    private UserInteractionRepository interactionRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    private final double likeWeight = 1.0;
    private final double viewWeight = 0.5;
    private final double dislikeWeight = -1.0;

    public List<Pet> getPersonalizedRecommendations(Long userId) {
        // Step 1: Get pets interacted with by the user
        List<Long> interactedPetIds = interactionRepository.findPetsInteractedByUser(userId);

        // Step 2: Find users with similar interactions
        List<Long> similarUserIds = interactionRepository.findSimilarUsers(interactedPetIds, userId);

        // Step 3: Find pets interacted by similar users, excluding the user's own interactions
        List<Long> recommendedPetIds;
        if (similarUserIds.isEmpty()) {
            recommendedPetIds = interactedPetIds;
        } else {
            recommendedPetIds = interactionRepository.findRecommendedPets(similarUserIds, interactedPetIds);
        }

        // Step 4: Retrieve and rank recommended pets
        List<Pet> recommendedPets = petRepository.findAllById(recommendedPetIds);

        return recommendedPets.stream()
                .sorted(Comparator.comparingDouble(pet -> -calculateRelevanceScore(pet, userId)))
                .collect(Collectors.toList());
    }

    // Calculates the relevance score for a pet based on user interactions
    private double calculateRelevanceScore(Pet pet, Long userId) {
        int likes = pet.getLikes() != null ? pet.getLikes() : 0;
        int views = pet.getViews() != null ? pet.getViews() : 0;
        int dislikes = pet.getDislikes() != null ? pet.getDislikes() : 0;

        // Apply weights to each interaction type
        double relevanceScore = Math.sqrt(
                Math.pow(likeWeight * likes, 2) +
                        Math.pow(viewWeight * views, 2) +
                        Math.pow(dislikeWeight * dislikes, 2)
        );

        return relevanceScore;
    }
}
