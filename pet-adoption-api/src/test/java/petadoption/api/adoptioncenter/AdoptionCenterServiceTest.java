package petadoption.api.adoptioncenter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import petadoption.api.models.AdoptionCenter;
import petadoption.api.repositories.PetRepository;
import petadoption.api.repositories.AdoptionCenterRepository;
import petadoption.api.service.AdoptionCenterService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AdoptionCenterServiceTest {

    @Autowired
    private AdoptionCenterService adoptionCenterService;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    @Autowired
    private PetRepository petRepository;

    @BeforeEach
    void setUp() {
        petRepository.deleteAll();
        adoptionCenterRepository.deleteAll();
    }

    @Test
    void testSaveAdoptionCenter() {
        AdoptionCenter center = new AdoptionCenter();
        center.setName("TestShelter1");
        center.setDescription("TestDescription1");
        center.setAddress("1234 Real Road");
        center.setContactInfo("555-555-5555");

        AdoptionCenter savedCenter = adoptionCenterService.saveAdoptionCenter(center);
        assertNotNull(savedCenter.getId());
        assertEquals("TestShelter1", savedCenter.getName());
    }

    @Test
    void testGetAdoptionCenterById() {
        AdoptionCenter center = new AdoptionCenter();
        center.setName("TestShelter2");
        center.setDescription("TestDescription2");
        center.setAddress("1236 Real Road");
        center.setContactInfo("555-555-5556");
        center = adoptionCenterRepository.save(center);

        Optional<AdoptionCenter> foundCenter = adoptionCenterService.getAdoptionCenterById(center.getId());
        assertTrue(foundCenter.isPresent());
        assertEquals("TestShelter2", foundCenter.get().getName());
    }

    @Test
    void testUpdateAdoptionCenter() {
        AdoptionCenter center = new AdoptionCenter();
        center.setName("TestShelter3");
        center.setDescription("TestDescription3");
        center.setAddress("1238 Real Road");
        center.setContactInfo("555-555-5557");
        center = adoptionCenterRepository.save(center);

        AdoptionCenter updateCenter = new AdoptionCenter();
        updateCenter.setName("Updated TestShelter3");
        updateCenter.setDescription("Updated description3");
        updateCenter.setAddress("1238 Real Lane");
        updateCenter.setContactInfo("555-555-55575");
        updateCenter.setLikes(10);

        AdoptionCenter updatedCenter = adoptionCenterService.updateAdoptionCenter(center.getId(), updateCenter);
        assertEquals("Updated TestShelter3", updatedCenter.getName());
        assertEquals("Updated description3", updatedCenter.getDescription());
        assertEquals("1238 Real Lane", updatedCenter.getAddress());
        assertEquals("555-555-55575", updatedCenter.getContactInfo());
        assertEquals(10, updatedCenter.getLikes());
    }

    @Test
    void testDeleteAdoptionCenter() {
        AdoptionCenter center = new AdoptionCenter();
        center.setName("TestShelter4");
        center.setDescription("TestDescription4");
        center.setAddress("1240 Real Road");
        center.setContactInfo("555-555-5558");
        center = adoptionCenterRepository.save(center);

        adoptionCenterService.deleteAdoptionCenter(center.getId());

        Optional<AdoptionCenter> deletedCenter = adoptionCenterRepository.findById(center.getId());
        assertFalse(deletedCenter.isPresent());
    }

    @Test
    void testGetAllAdoptionCenters() {
        AdoptionCenter center1 = new AdoptionCenter();
        center1.setName("TestShelter5");
        center1.setDescription("TestDescription5");
        center1.setAddress("1242 Real Road");
        center1.setContactInfo("555-555-5559");

        adoptionCenterRepository.save(center1);

        AdoptionCenter center2 = new AdoptionCenter();
        center2.setName("TestShelter6");
        center2.setDescription("TestDescription6");
        center2.setAddress("1244 Real Road");
        center2.setContactInfo("555-555-5560");

        adoptionCenterRepository.save(center2);


        List<AdoptionCenter> centers = adoptionCenterService.getAllAdoptionCenters();
        assertEquals(2, centers.size());
    }

    @Test
    void testUpdateNonExistentAdoptionCenter() {
        AdoptionCenter updateCenter = new AdoptionCenter();
        updateCenter.setName("Doesn't Exist");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adoptionCenterService.updateAdoptionCenter(999L, updateCenter);
        });

        assertEquals("Adoption Center not found", exception.getMessage());
    }
}
