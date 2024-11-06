package petadoption.api.adoptioncenter;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional             // make these tests revert their DB changes after the test is complete
public class AdoptionCenterTests {

    @Autowired
    private AdoptionCenterService adoptionCenterService;

    @Test
    void testSaveAdoptionCenter() {
        // Create a new AdoptionCenter
        AdoptionCenter center = new AdoptionCenter();
        center.setName("Happy Paws");
        center.setDescription("A place for happy pets.");
        center.setAddress("123 Paw Street");
        center.setContactInfo("123-456-7890");
        center.setLikes(0);

        // Save the adoption center
        AdoptionCenter savedCenter = adoptionCenterService.saveAdoptionCenter(center);
        assertNotNull(savedCenter.getId());
        assertEquals(center.getName(), savedCenter.getName());
        assertEquals(center.getDescription(), savedCenter.getDescription());
    }

    @Test
    void testGetAdoptionCenterById() {
        // Create and save a new AdoptionCenter
        AdoptionCenter center = new AdoptionCenter();
        center.setName("Happy Paws");
        center.setDescription("A place for happy pets.");
        center.setAddress("123 Paw Street");
        center.setContactInfo("123-456-7890");
        center.setLikes(0);

        AdoptionCenter savedCenter = adoptionCenterService.saveAdoptionCenter(center);

        // Retrieve the adoption center by ID
        Optional<AdoptionCenter> foundCenterOpt = adoptionCenterService.getAdoptionCenterById(savedCenter.getId());
        assertTrue(foundCenterOpt.isPresent());
        AdoptionCenter foundCenter = foundCenterOpt.get();

        assertEquals(savedCenter.getId(), foundCenter.getId());
        assertEquals(savedCenter.getName(), foundCenter.getName());
    }

    @Test
    void testUpdateAdoptionCenter() {
        // Create and save a new AdoptionCenter
        AdoptionCenter center = new AdoptionCenter();
        center.setName("Happy Paws");
        center.setDescription("A place for happy pets.");
        center.setAddress("123 Paw Street");
        center.setContactInfo("123-456-7890");
        center.setLikes(0);

        AdoptionCenter savedCenter = adoptionCenterService.saveAdoptionCenter(center);

        // Prepare updated adoption center details
        center.setName("Joyful Paws");
        center.setDescription("A happy place for pets.");

        // Update the adoption center
        AdoptionCenter updatedCenter = adoptionCenterService.updateAdoptionCenter(savedCenter.getId(), center);

        assertEquals("Joyful Paws", updatedCenter.getName());
        assertEquals("A happy place for pets.", updatedCenter.getDescription());
    }

    @Test
    void testDeleteAdoptionCenter() {
        // Create and save a new AdoptionCenter
        AdoptionCenter center = new AdoptionCenter();
        center.setName("Happy Paws");
        center.setDescription("A place for happy pets.");
        center.setAddress("123 Paw Street");
        center.setContactInfo("123-456-7890");
        center.setLikes(0);

        AdoptionCenter savedCenter = adoptionCenterService.saveAdoptionCenter(center);

        // Delete the adoption center
        adoptionCenterService.deleteAdoptionCenter(savedCenter.getId());

        // Verify it has been deleted
        Optional<AdoptionCenter> foundCenterOpt = adoptionCenterService.getAdoptionCenterById(savedCenter.getId());
        assertFalse(foundCenterOpt.isPresent());
    }

    @Test
    void testGetAdoptionCenterByAddress() {
        // Create and save a new AdoptionCenter
        AdoptionCenter center = new AdoptionCenter();
        center.setName("Happy Paws");
        center.setDescription("A place for happy pets.");
        center.setAddress("123 Paw Street");
        center.setContactInfo("123-456-7890");
        center.setLikes(0);

        adoptionCenterService.saveAdoptionCenter(center);

        // Retrieve the adoption center by address
        Optional<AdoptionCenter> foundCenterOpt = adoptionCenterService.getAdoptionCenterByEmailAddress("123 Paw Street");
        assertTrue(foundCenterOpt.isPresent());
        assertEquals(center.getName(), foundCenterOpt.get().getName());
    }
}
