package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserInteractionRepository;
import petadoption.api.repositories.UserRepository;
import petadoption.api.tables.Pet;
import petadoption.api.tables.User;
import petadoption.api.tables.UserInteraction;
import petadoption.api.models.INTERACTION_TYPE;

import java.util.*;
import java.util.stream.Collectors;
import java.util.Random;

@Service
public class recommendationEngineService {

    @Autowired
    private UserInteractionRepository interactionRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    // Constants for the scoring system - how important are likes and dislikes
    private static final double LIKE_DISLIKE_SCALE = 20.0;
    private static final double MAX_LIKES = 10.0;
    private static final double MAX_DISLIKES = -10.0;

    // Factors for weighing relevance components
    private static final double LIKE_DISLIKE_WEIGHT = 0.5;
    private static final double SIMILARITY_WEIGHT = 1.5;
    private static final double ATTRIBUTE_BONUS_WEIGHT = 1.0;

    // Constant for the threshold of viewed pets
    private static final int VIEWED_THRESHOLD = 3;




    //Part 1 Get all the pets that should be shown.
    public List<Pet> getPersonalizedRecommendations(Long userId) {
        // Step 1: Get pets the user has interacted with, including viewed pets
        List<Long> interactedPetIds = interactionRepository.findPetsInteractedByUser(userId);

        // Get all the pets the user has already viewed
        List<Long> viewedPetIds = interactionRepository.findViewedPets(userId);

        // Check if the number of viewed pets exceeds the limit
        if (viewedPetIds.size() > VIEWED_THRESHOLD) {
            // Randomly select one pet to delete its interaction (unviewed)
            Random random = new Random();
            Long petToDeleteId = viewedPetIds.get(random.nextInt(viewedPetIds.size()));

            // Find the UserInteraction entry for this pet
            UserInteraction interaction = interactionRepository.findInteraction(userId, petToDeleteId).orElse(null);
            if (interaction != null) {
                // Delete the interaction record from the database
                interactionRepository.delete(interaction);  // Delete interaction from the DB
                viewedPetIds.remove(petToDeleteId);  // Remove the deleted pet from the list
            }
        }

        // Step 2: Retrieve all pets (without limiting to similar users)
        List<Pet> allPets = petRepository.findAll();

        // Step 3: Calculate relevance score for each pet and exclude viewed pets
        return allPets.stream()
                .filter(pet -> !viewedPetIds.contains(pet.getId())) // Exclude viewed pets
                .sorted(Comparator.comparingDouble(pet -> -calculateRelevanceScore(pet, userId, interactedPetIds)))
                .collect(Collectors.toList());
    }


    // Part 2 - Find the most similar users based on likes (similarity score)
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

    // Part 3 - Calculate relevance score for a pet
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

        // Step 4: Apply bonuses for matching user preferences (species, breed, color)
        score += calculatePreferenceMatchBonus(pet, userId);

        return score;
    }

    // New Method - Calculate bonus for matching user preferences (species, breed, color)
    private double calculatePreferenceMatchBonus(Pet pet, Long userId) {
        double bonus = 0.0;

        // Fetch user preferences from the repository
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return bonus; // No preferences found

        User user = userOpt.get();

        // Apply bonus for species match
        if (user.getSpeciesPref() != null && user.getSpeciesPref().equalsIgnoreCase(pet.getSpecies())) {
            bonus += 15; // Adjusted species match bonus
        }

        // Apply bonus for breed match
        if (user.getBreedPref() != null && user.getBreedPref().equalsIgnoreCase(pet.getBreed())) {
            bonus += 7; // Adjusted breed match bonus
        }

        // Apply bonus for color match
        if (user.getColorPref() != null && user.getColorPref().equalsIgnoreCase(pet.getColor())) {
            bonus += 5; // Adjusted color match bonus
        }

        return bonus;
    }


    //Stuff that is used for Calculation \/

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
