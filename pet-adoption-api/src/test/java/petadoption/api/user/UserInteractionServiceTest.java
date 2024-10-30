package petadoption.api.user;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserInteractionRepository;
import petadoption.api.repositories.UserRepository;
import petadoption.api.service.UserInteractionService;
import petadoption.api.tables.Pet;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserInteractionServiceTest {

    @InjectMocks
    private UserInteractionService userInteractionService;

    @Mock
    private UserInteractionRepository interactionRepository;

    @Mock
    private PetRepository petRepository;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getPersonalizedRecommendations() {
        Long userId = 1L;
        List<Long> interactedPetIds = Arrays.asList(1L, 2L);
        List<Long> similarUserIds = Arrays.asList(3L, 4L);
        List<Long> recommendedPetIds = Arrays.asList(5L, 6L);

        // Mock interactions
        when(interactionRepository.findPetsInteractedByUser(userId)).thenReturn(interactedPetIds);
        when(interactionRepository.findSimilarUsers(interactedPetIds, userId)).thenReturn(similarUserIds);
        when(interactionRepository.findRecommendedPets(similarUserIds, interactedPetIds)).thenReturn(recommendedPetIds);
        when(petRepository.findAllById(recommendedPetIds)).thenReturn(Arrays.asList(new Pet(), new Pet())); // Mock Pet objects

        // Execute the service method
        List<Pet> recommendations = userInteractionService.getPersonalizedRecommendations(userId);

        // Verify and assert
        verify(interactionRepository).findPetsInteractedByUser(userId);
        verify(interactionRepository).findSimilarUsers(interactedPetIds, userId);
        verify(interactionRepository).findRecommendedPets(similarUserIds, interactedPetIds);
        verify(petRepository).findAllById(recommendedPetIds);

        // Assert results
        assertEquals(2, recommendations.size()); // Assuming you expect 2 pets to be returned
    }
}
