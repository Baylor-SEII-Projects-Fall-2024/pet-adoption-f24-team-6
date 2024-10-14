package petadoption.api.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}