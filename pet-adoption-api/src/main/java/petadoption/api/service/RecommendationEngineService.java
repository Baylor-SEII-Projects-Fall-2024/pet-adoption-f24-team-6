package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
public class RecommendationEngineService {

    @Autowired
    private UserInteractionRepository interactionRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Pet> getPersonalizedRecommendations(Long userId) {
        User user = userRepository.findById(userId).orElse(new User());
        List<Long> viewedPetIds = petRepository.findViewedPetIds(userId);
        Pageable pageable = PageRequest.of(0, 5);

        List<Pet> reccommendations = petRepository.findPersonalizedRecommendationsSpeciesAndBreed(
                viewedPetIds,
                user.getSpeciesPref(),
                user.getBreedPref(),
                pageable
        );

        if (reccommendations.size() < 5){
            List<Pet> moreReccs = petRepository.findPersonalizedRecommendationsSpecies(
                    viewedPetIds,
                    user.getSpeciesPref(),
                    //user.getBreedPref(),
                    //user.getColorPref(),
                    PageRequest.of(0, 3)
            );

            reccommendations.addAll(moreReccs);
        }

        return reccommendations;
    }


}
