package petadoption.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.models.AdoptionCenter;

import java.util.Optional;

public interface AdoptionCenterRepository extends JpaRepository<AdoptionCenter, Long> {

    Optional<AdoptionCenter> findByAddress(String email);

}
