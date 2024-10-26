package petadoption.api.pet;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import petadoption.api.models.AdoptionCenter;
import petadoption.api.models.Pet;
import petadoption.api.repositories.AdoptionCenterRepository;
import petadoption.api.models.GENDER_TYPE;
import petadoption.api.repositories.PetRepository;
import petadoption.api.service.PetService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class PetServicesTest {

    @Autowired
    private PetService petService;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    private AdoptionCenter adoptionCenter;

    @BeforeEach
    void setUp() {
        adoptionCenter = new AdoptionCenter();
        adoptionCenter.setName("Test Adoption Center");
        adoptionCenter = adoptionCenterRepository.save(adoptionCenter);
    }

    @Test
    void testSavePet() {
        Pet pet = new Pet();
        pet.setName("TestDog1");
        pet.setSpecies("Dog");

        Pet savedPet = petService.savePet(pet);
        assertNotNull(savedPet.getId());
        assertEquals("TestDog1", savedPet.getName());
    }

    @Test
    void testFindPet() {
        Pet pet = new Pet();
        pet.setName("TestDog2");
        pet.setSpecies("Dog");
        pet = petRepository.save(pet);

        Optional<Pet> foundPet = petService.findPet(pet.getId());
        assertTrue(foundPet.isPresent());
        assertEquals("TestDog2", foundPet.get().getName());
    }

    @Test
    void testRegisterPetWithValidCenter() {
        Pet registeredPet = petService.registerPet("TestDog3", 2, "Dog", "Labrador", "Large",
                GENDER_TYPE.MALE, "photoUrl", "Black", 8, 7, adoptionCenter.getId());

        assertNotNull(registeredPet.getId());
        assertEquals("TestDog3", registeredPet.getName());
        assertEquals(adoptionCenter.getId(), registeredPet.getAdoptionCenter().getId());
    }

    @Test
    void testRegisterPetWithInvalidCenter() {
        Long invalidCenterId = (long) -999999L;

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            petService.registerPet("TestDog4", 3, "Dog", "Beagle", "Medium",
                    GENDER_TYPE.FEMALE, "photoUrl", "Brown", 9, 6, invalidCenterId);
        });

        assertEquals("Adoption Center not found with id: " + invalidCenterId, exception.getMessage());
    }

    @Test
    void testUpdatePet() {
        Pet pet = new Pet();
        pet.setName("TestCat1");
        pet.setSpecies("Cat");
        pet = petRepository.save(pet);

        Pet updatedPet = new Pet();
        updatedPet.setName("TestCat1");
        updatedPet.setSpecies("Dog");

        Pet result = petService.updatePet(pet.getId(), updatedPet);
        assertEquals("TestCat1", result.getName());
        assertEquals("Dog", result.getSpecies());
    }

    @Test
    void testUpdateNonExistentPet() {
        Long nonExistentPetId = 9999L;

        Pet updatedPet = new Pet();
        updatedPet.setName("");

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            petService.updatePet(nonExistentPetId, updatedPet);
        });

        assertEquals("Pet not found", exception.getMessage());
    }

    @Test
    void testGetAllPets() {
        Pet pet1 = new Pet();
        pet1.setName("TestDog5");
        pet1.setSpecies("Dog");

        Pet pet2 = new Pet();
        pet2.setName("TestCat2");
        pet2.setSpecies("Cat");

        petRepository.save(pet1);
        petRepository.save(pet2);

        List<Pet> pets = petService.getAllPets();
        assertTrue(pets.size() >= 2);
    }

    @Test
    void testDeletePet() {
        Pet pet = new Pet();
        pet.setName("TestDog6");
        pet.setSpecies("Dog");
        pet = petRepository.save(pet);

        petService.deletePet(pet.getId());

        Optional<Pet> deletedPet = petRepository.findById(pet.getId());
        assertTrue(deletedPet.isEmpty());
    }

    @Test
    void testDeleteNonExistentPet() {
        Long nonExistentPetId = -9999L;

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            petService.deletePet(nonExistentPetId);
        });

        assertEquals("Pet not found", exception.getMessage());
    }

    @Test
    void testGetPetsByCenterId() {
        Pet pet = new Pet();
        pet.setName("TestDog7");
        pet.setSpecies("Dog");
        pet.setAdoptionCenter(adoptionCenter);
        petRepository.save(pet);

        List<Pet> pets = petService.getPetsByCenterId(adoptionCenter.getId());
        assertFalse(pets.isEmpty());
        assertEquals("TestDog7", pets.get(0).getName());
    }
}