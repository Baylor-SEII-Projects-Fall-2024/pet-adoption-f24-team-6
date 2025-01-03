package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.tables.AdoptionCenter;
import petadoption.api.repositories.AdoptionCenterRepository;
import petadoption.api.tables.User;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionCenterService {

    private final AdoptionCenterRepository adoptionCenterRepository;

    @Autowired
    public AdoptionCenterService(AdoptionCenterRepository adoptionCenterRepository) {
        this.adoptionCenterRepository = adoptionCenterRepository;
    }

    public List<AdoptionCenter> getAllAdoptionCenters() {
        return adoptionCenterRepository.findAll();
    }

    public Optional<AdoptionCenter> getAdoptionCenterById(Long id) {
        return adoptionCenterRepository.findById(id);
    }

    public Optional<AdoptionCenter> getAdoptionCenterByEmailAddress(String emailAddress) {
        return adoptionCenterRepository.findByAddress(emailAddress);
    }

    public AdoptionCenter saveAdoptionCenter(AdoptionCenter adoptionCenter) {
        return adoptionCenterRepository.save(adoptionCenter);
    }

    public void deleteAdoptionCenter(Long id) {
        adoptionCenterRepository.deleteById(id);
    }

    public AdoptionCenter updateAdoptionCenter(Long id, AdoptionCenter adoptionCenter) {
        Optional<AdoptionCenter> existingAdoptionCenter = adoptionCenterRepository.findById(id);
        if (existingAdoptionCenter.isPresent()) {
            AdoptionCenter updatedCenter = existingAdoptionCenter.get();
            updatedCenter.setName(adoptionCenter.getName());
            updatedCenter.setDescription(adoptionCenter.getDescription());
            updatedCenter.setAddress(adoptionCenter.getAddress());
            updatedCenter.setContactInfo(adoptionCenter.getContactInfo());
            updatedCenter.setLikes(adoptionCenter.getLikes());
            return adoptionCenterRepository.save(updatedCenter);
        } else {
            throw new RuntimeException("Adoption Center not found");
        }
    }

    public Optional<User> getUserByCenterId(Long centerId) {
        Optional<AdoptionCenter> center = adoptionCenterRepository.findById(centerId);
        return center.map(AdoptionCenter::getUser);
    }


}
