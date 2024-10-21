package petadoption.api.adoptioncenter;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdoptionCenterRepository extends JpaRepository<AdoptionCenter, Long> {

    Optional<AdoptionCenter> findByAddress(String email);

}
