package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.repositories.UserInteractionRepository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class UserInteractionService {

    @Autowired
    private UserInteractionRepository interactionRepository;

    /*These are tools I am thinking of using for future stuff im keeping them here
    Because I gutted most of the Rec Engine stuff from here as it is unrelated to user interaction
    as much as it is its own thing.
     */

    // Find pets that the user has interacted with (like or dislike)
    public List<Long> getInteractedPetIds(Long userId) {
        return interactionRepository.findPetsInteractedByUser(userId);
    }

    // Find the most similar users based on likes
    public List<Long> findMostSimilarUsers(Long userId, List<Long> interactedPetIds) {
        // Find all users who interacted with at least one of the user's pets
        List<Long> similarUserIds = interactionRepository.findSimilarUsers(interactedPetIds, userId);

        // Calculate similarity based on common likes
        Map<Long, Integer> userLikeCount = new HashMap<>();
        for (Long similarUserId : similarUserIds) {
            List<Long> similarUserLikes = interactionRepository.findPetsInteractedByUser(similarUserId);
            int commonLikes = (int) similarUserLikes.stream().filter(interactedPetIds::contains).count();
            userLikeCount.put(similarUserId, commonLikes);
        }

        // Sort users by the number of common likes and return top 10 similar users
        return userLikeCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(10) // Top 10 similar users
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
