package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserInteractionRepository;
import petadoption.api.repositories.UserRepository;
import petadoption.api.tables.Pet;
import petadoption.api.tables.UserInteraction;
import petadoption.api.models.INTERACTION_TYPE;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
public class recommendationEngineService {

    @Autowired
    private UserInteractionRepository interactionRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    // Constants for the scoring system
    private static final double LIKE_WEIGHT = 1.0;
    private static final double DISLIKE_WEIGHT = -2.0;
    private static final double LIKE_DISLIKE_SCALE = 20.0;

    private static final double MAX_LIKES = 10.0;
    private static final double MAX_DISLIKES = -10.0;

    // Factors for weighing relevance components
    private static final double LIKE_DISLIKE_WEIGHT = 0.5;
    private static final double SIMILARITY_WEIGHT = 1.5;
    private static final double ATTRIBUTE_BONUS_WEIGHT = 1.0;

    public List<Pet> getPersonalizedRecommendations(Long userId) {
        // Step 1: Get pets the user has interacted with
        List<Long> interactedPetIds = interactionRepository.findPetsInteractedByUser(userId);

        // Step 2: Retrieve all pets (without limiting to similar users)
        List<Pet> allPets = petRepository.findAll();

        // Step 3: Calculate relevance score for each pet
        return allPets.stream()
                .sorted(Comparator.comparingDouble(pet -> -calculateRelevanceScore(pet, userId, interactedPetIds)))
                .collect(Collectors.toList());
    }

    // Step 2 - Find the most similar users based on likes (similarity score)
    private List<Long> findMostSimilarUsers(Long userId, List<Long> interactedPetIds) {
        // Find all users who interacted with at least one of the user's pets
        List<Long> similarUserIds = interactionRepository.findSimilarUsers(interactedPetIds, userId);

        // Calculate similarity based on common likes
        Map<Long, Integer> userLikeCount = new HashMap<>();
        for (Long similarUserId : similarUserIds) {
            List<Long> similarUserLikes = interactionRepository.findPetsInteractedByUser(similarUserId);
            int commonLikes = (int) similarUserLikes.stream().filter(interactedPetIds::contains).count();
            userLikeCount.put(similarUserId, commonLikes);
        }

        // Sort users by the number of common likes
        return userLikeCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(10) // Top 10 similar users
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    // Step 3 - Calculate relevance score for a pet
    private double calculateRelevanceScore(Pet pet, Long userId, List<Long> interactedPetIds) {
        double score = 0.0;

        // Step 1: Handle likes/dislikes normalization
        double petLikeScore = normalizeLikesAndDislikes(pet.getLikes(), pet.getDislikes());
        score += LIKE_DISLIKE_WEIGHT * petLikeScore;

        // Step 2: Handle Similarity score (check how similar users interacted with this pet)
        List<Long> similarUserIds = findMostSimilarUsers(userId, interactedPetIds);
        score += SIMILARITY_WEIGHT * calculateSimilarityScore(pet, similarUserIds);

        // Step 3: Apply additional factors based on pet attributes (e.g., age, training)
        score += ATTRIBUTE_BONUS_WEIGHT * calculatePetAttributesBonus(pet);

        return score;
    }

    // Normalizes likes and dislikes to a range of -10 to 10
    private double normalizeLikesAndDislikes(Integer likes, Integer dislikes) {
        double likeScore = (likes != null) ? (likes / LIKE_DISLIKE_SCALE) * MAX_LIKES : 0.0;
        double dislikeScore = (dislikes != null) ? (dislikes / LIKE_DISLIKE_SCALE) * MAX_DISLIKES : 0.0;
        return likeScore + dislikeScore;
    }

    // Similarity score: +1 for every like from similar users, -2 for every dislike
    private double calculateSimilarityScore(Pet pet, List<Long> similarUserIds) {
        double similarityScore = 0.0;

        for (Long userId : similarUserIds) {
            UserInteraction interaction = interactionRepository.findInteraction(userId, pet.getId()).orElse(null);
            if (interaction != null) {
                if (interaction.getInteractionType() == INTERACTION_TYPE.LIKE) {
                    similarityScore += 1.0; // +1 for like
                } else if (interaction.getInteractionType() == INTERACTION_TYPE.DISLIKE) {
                    similarityScore -= 2.0; // -2 for dislike
                }
            }
        }
        return similarityScore;
    }

    // Training-AGE Bonus
    private double calculatePetAttributesBonus(Pet pet) {
        double bonus = 0.0;

        // Age-based bonus:
        // Young pets (age < 2) get a larger bonus, and older pets have a decaying bonus based on training level.
        double ageBonus = 0.0;

        if (pet.getAge() < 2) {
            // For young pets: Base bonus + training level bonus
            ageBonus = 2.0 + (pet.getTrainingLevel() != null ? pet.getTrainingLevel() * 0.5 : 0.0);
        } else {
            // For older pets: Training level is more significant, but with a decay factor
            ageBonus = (pet.getTrainingLevel() != null) ? (pet.getTrainingLevel() * 0.25) : 0.0;
        }

        // Apply training bonus to age-based bonus
        bonus += ageBonus;

        return bonus;
    }

}
