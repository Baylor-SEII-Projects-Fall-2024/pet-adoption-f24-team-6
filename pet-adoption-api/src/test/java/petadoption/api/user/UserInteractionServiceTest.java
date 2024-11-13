package petadoption.api.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.UserRepository;
import petadoption.api.tables.Pet;
import petadoption.api.tables.User;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class recommendationEngineServiceTest {

    @InjectMocks
    private petadoption.api.service.recommendationEngineService recommendationEngineService;

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

        // Mock data
        User user = new User();
        user.setId(userId);
        user.setBreedPref("Bulldog");
        user.setColorPref("Brown");
        user.setSpeciesPref("Dog");

        Pet pet1 = new Pet();
        pet1.setId(1L);
        pet1.setBreed("Bulldog");
        pet1.setColor("Brown");
        pet1.setSpecies("Dog");
        pet1.setLikes(10);
        pet1.setDislikes(2);

        Pet pet2 = new Pet();
        pet2.setId(2L);
        pet2.setBreed("Bulldog");
        pet2.setColor("Black");
        pet2.setSpecies("Dog");
        pet2.setLikes(5);
        pet2.setDislikes(3);

        List<Pet> pets = Arrays.asList(pet1, pet2);

        // Mock the user repository and pet repository
        when(userRepository.findById(userId)).thenReturn(java.util.Optional.of(user));
        when(petRepository.findAll()).thenReturn(pets);

        // Execute the service method
        List<Pet> recommendations = recommendationEngineService.sortPetsByRecommendation(pets, user);

        // Verify the interactions
        verify(userRepository).findById(userId);
        verify(petRepository).findAll();

        // Assert that pet1 should be recommended first because it matches the user's preferences better
        assertEquals(2, recommendations.size());
        assertEquals(pet1, recommendations.get(0)); // Pet1 should be the top recommendation
        assertEquals(pet2, recommendations.get(1)); // Pet2 should be the second recommendation
    }
}
