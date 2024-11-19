package petadoption.api.adoptioncenter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import petadoption.api.models.USER_TYPE;
import petadoption.api.repositories.*;
import petadoption.api.service.AdoptionCenterService;
import petadoption.api.service.AdoptionRequestService;
import petadoption.api.tables.AdoptionCenter;
import petadoption.api.tables.AdoptionRequest;
import petadoption.api.tables.Pet;
import petadoption.api.tables.User;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AdoptionRequestServiceTest {

    @Autowired
    private AdoptionRequestService adoptionRequestService;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserInteractionRepository interactionRepository;

    @Autowired
    private UserRepository userRepository;

    private AdoptionCenter testCenter;
    private Pet testPet;
    private User testUser;
    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        petRepository.deleteAll();
        adoptionCenterRepository.deleteAll();
        testCenter = new AdoptionCenter();
        testCenter.setName("TestShelter1");
        testCenter.setDescription("TestDescription1");
        testCenter.setAddress("1234 Real Road");
        testCenter.setContactInfo("555-555-5555");
        adoptionCenterRepository.save(testCenter);
        testUser = new User();
        testUser.setEmailAddress("newuser@example.com");
        testUser.setPassword("password");
        testUser.setUserType(USER_TYPE.CUSTOMER);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        userRepository.save(testUser);
        testPet = new Pet();
        testPet.setName("TestDog1");
        testPet.setSpecies("Dog");
        petRepository.save(testPet);
    }

    @Test
    void testSaveAdoptionRequest() {
        assertEquals(0, adoptionRequestRepository.count());
        AdoptionRequest testRequest = new AdoptionRequest(testUser, testPet, testCenter);
        adoptionRequestRepository.save(testRequest);
        assertEquals(1, adoptionRequestRepository.count());
    }

    @Test
    void testGetAdoptionCenterById() {
        AdoptionRequest testRequest = new AdoptionRequest(testUser, testPet, testCenter);
        adoptionRequestRepository.save(testRequest);
        long id = testRequest.getId();
        assertEquals(testRequest.getRequestDate(), adoptionRequestService.getAdoptionRequestById(id).get().getRequestDate());
    }

    @Test
    void testGetInvalidId() {
        assertFalse(adoptionRequestRepository.findById(-1L).isPresent());
    }

    @Test
    void testGetAdoptionRequestByCenterId() {
        AdoptionCenter testCenter2 = new AdoptionCenter();
        adoptionCenterRepository.save(testCenter2);

        AdoptionRequest testRequest1 = new AdoptionRequest(testUser, testPet, testCenter);
        adoptionRequestRepository.save(testRequest1);
        AdoptionRequest testRequest2 = new AdoptionRequest(testUser, testPet, testCenter2);
        adoptionRequestRepository.save(testRequest2);
        assertEquals(testRequest1, adoptionRequestService.getAdoptionRequestByCenterId(testCenter.getId()).get(0));
        assertEquals(testRequest2, adoptionRequestService.getAdoptionRequestByCenterId(testCenter2.getId()).get(0));
        assertNotEquals(adoptionRequestService.getAdoptionRequestByCenterId(testCenter.getId()), adoptionRequestService.getAdoptionRequestByCenterId(testCenter2.getId()));
    }

    @Test
    void testGetInvalidCenterId() {
        assertFalse(adoptionRequestService.findById(-1L).isPresent());
    }
}