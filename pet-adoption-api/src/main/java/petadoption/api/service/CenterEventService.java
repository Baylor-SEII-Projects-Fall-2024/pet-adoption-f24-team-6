package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.models.CenterEvent;
import petadoption.api.repositories.CenterEventRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CenterEventService {

    private final CenterEventRepository centerEventRepository;

    @Autowired
    public CenterEventService(CenterEventRepository centerEventRepository) {
        this.centerEventRepository = centerEventRepository;
    }

    public List<CenterEvent> getAllCenterEvents() {
        return centerEventRepository.findAll();
    }

    public Optional<CenterEvent> getCenterEventById(Long id) {
        return centerEventRepository.findById(id);
    }

    public List<CenterEvent> getEventsByAdoptionCenter(Long centerId) {
        return centerEventRepository.findByAdoptionCenterId(centerId);
    }

    public CenterEvent saveCenterEvent(CenterEvent centerEvent) {
        return centerEventRepository.save(centerEvent);
    }

    public void deleteCenterEvent(Long id) {
        centerEventRepository.deleteById(id);
    }

    public CenterEvent updateCenterEvent(Long id, CenterEvent centerEvent) {
        Optional<CenterEvent> existingCenterEvent = centerEventRepository.findById(id);
        if (existingCenterEvent.isPresent()) {
            CenterEvent updatedEvent = existingCenterEvent.get();
            updatedEvent.setDescription(centerEvent.getDescription());
            updatedEvent.setAddress(centerEvent.getAddress());
            updatedEvent.setDate(centerEvent.getDate());
            updatedEvent.setAdoptionCenter(centerEvent.getAdoptionCenter());
            updatedEvent.setName(centerEvent.getName());
            updatedEvent.setPhoto(centerEvent.getPhoto());
            return centerEventRepository.save(updatedEvent);
        } else {
            throw new RuntimeException("Center Event not found");
        }
    }

    public List<CenterEvent> getPetsByCenterId(Long centerId) {
        return centerEventRepository.findByAdoptionCenter_Id(centerId);
    }
}
