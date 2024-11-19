package petadoption.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import petadoption.api.tables.AdoptionCenter;

import java.util.Optional;

public interface AdoptionCenterRepository extends JpaRepository<AdoptionCenter, Long> {

    Optional<AdoptionCenter> findByAddress(String email);

    @Query(value = "SELECT * FROM adoption_center ORDER BY RAND() LIMIT 1", nativeQuery = true)
    AdoptionCenter getRandomAdoptionCenter();

}
