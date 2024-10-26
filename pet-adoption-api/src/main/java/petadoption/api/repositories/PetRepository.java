package petadoption.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.models.Pet;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    List<Pet> findBySpecies(String species);

    List<Pet> findByBreed(String breed);

    List<Pet> findBySize(String size);

    List<Pet> findByGender(String gender);

    List<Pet> findByColor(String color);

    List<Pet> findByFriendlinessGreaterThanEqual(Integer friendliness);

    List<Pet> findByTrainingLevelGreaterThanEqual(Integer trainingLevel);

    List<Pet> findByAdoptionCenter_Id(Long centerId);
}