package petadoption.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.models.CenterEvent;

import java.util.List;

public interface CenterEventRepository extends JpaRepository<CenterEvent, Long> {

    List<CenterEvent> findByAdoptionCenterId(Long centerId);

    List<CenterEvent> findByAdoptionCenter_Id(Long centerId);
}