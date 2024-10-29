package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserInteractionRepository;
import petadoption.api.tables.Pet;

import java.util.List;

@Service
public class UserInteractionService {

    @Autowired
    private UserInteractionRepository interactionRepository;

    @Autowired
    private PetRepository petRepository;

    public List<Pet> getPersonalizedRecommendations(Long userId) {
        List<Long> interactedPetIds = interactionRepository.findPetsInteractedByUser(userId);

        List<Long> similarUserIds = interactionRepository.findSimilarUsers(interactedPetIds, userId);

        List<Long> recommendedPetIds;
        if(similarUserIds.isEmpty()){
            recommendedPetIds = interactedPetIds;
        }else {
            recommendedPetIds = interactionRepository.findRecommendedPets(similarUserIds, interactedPetIds);
        }

        List<Pet> recommendedPets = petRepository.findAllById(recommendedPetIds);

        return recommendedPets;
    }
}