package petadoption.api.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserInteractionRepository;
import petadoption.api.repositories.UserRepository;
import petadoption.api.tables.Pet;
import petadoption.api.tables.User;
import petadoption.api.tables.UserInteraction;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RecommendationEngineServiceTest {

    @InjectMocks
    private recommendationEngineService recommendationService;

    @Mock
    private UserInteractionRepository interactionRepository;

    @Mock
    private PetRepository petRepository;

    @Mock
    private UserRepository userRepository;

    private Long userId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userId = 1L; // Mock user ID for testing
    }

    @Test
    void testGetPersonalizedRecommendations() {
        // Given
        Pet pet1 = new Pet(1L, "Dog", "Golden Retriever", "Yellow", 2, 5, 0, 10);
        Pet pet2 = new Pet(2L, "Cat", "Persian", "White", 4, 15, 0, 20);
        Pet pet3 = new Pet(3L, "Dog", "Bulldog", "Brown", 1, 2, 0, 5);

        List<Pet> allPets = Arrays.asList(pet1, pet2, pet3);

        List<Long> interactedPetIds = Arrays.asList(1L);  // User has interacted with pet1

        List<Long> viewedPetIds = Arrays.asList(3L); // User has viewed pet3

        when(interactionRepository.findPetsInteractedByUser(userId)).thenReturn(interactedPetIds);
        when(interactionRepository.findViewedPets(userId)).thenReturn(viewedPetIds);
        when(petRepository.findAll()).thenReturn(allPets);

        // When
        List<Pet> recommendations = recommendationService.getPersonalizedRecommendations(userId);

        // Then
        assertEquals(2, recommendations.size());
        assertFalse(recommendations.contains(pet3));  // Pet3 should be excluded as viewed
        assertTrue(recommendations.contains(pet1));  // Pet1 should be included
        assertTrue(recommendations.contains(pet2));  // Pet2 should be included
    }


}
