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
        Pageable pageable = PageRequest.of(0, 10);

        return petRepository.findPersonalizedRecommendations(
                viewedPetIds,
                user.getSpeciesPref(),
                user.getBreedPref(),
                user.getColorPref(),
                pageable
        );
    }


}
