package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.repositories.AdoptionRequestRepository;
import petadoption.api.tables.AdoptionRequest;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionRequestService {

    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;


    public Optional<AdoptionRequest> getAdoptionRequestById(Long id) {
        return adoptionRequestRepository.findById(id);
    }

    public List<AdoptionRequest> getAdoptionRequestByCenterId(Long id) {
        return adoptionRequestRepository.findByAdoptionCenter_Id(id);
    }

    public AdoptionRequest saveAdoptionRequest(AdoptionRequest request) {
        return adoptionRequestRepository.save(request);
    }

    public Optional<AdoptionRequest> findById(Long id) {
        return adoptionRequestRepository.findById(id);
    }


}
