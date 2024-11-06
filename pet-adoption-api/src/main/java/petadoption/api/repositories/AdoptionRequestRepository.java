package petadoption.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.tables.AdoptionRequest;
import petadoption.api.tables.CenterEvent;

import java.util.List;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long>  {

    List<AdoptionRequest> findByAdoptionCenter_Id(Long centerId);

}
