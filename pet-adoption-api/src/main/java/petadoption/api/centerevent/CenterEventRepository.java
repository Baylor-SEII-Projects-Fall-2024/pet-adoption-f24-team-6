package petadoption.api.centerevent;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.adoptioncenter.CenterEvent;
import petadoption.api.centerevent.CenterEventService;

import java.util.List;
import java.util.Optional;

public interface CenterEventRepository extends JpaRepository<CenterEvent, Long> {

    List<CenterEvent> findByAdoptionCenterId(Long centerId);
}