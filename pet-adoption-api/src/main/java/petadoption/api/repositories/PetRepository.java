package petadoption.api.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.models.SPECIES_TYPE;
import petadoption.api.tables.Pet;

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
    @Query("SELECT p FROM Pet p " +
            "WHERE p.id NOT IN :viewedPetIds " +
            "AND (" +
            "   (COALESCE(:speciesPref, '') = '' OR p.species = :speciesPref) AND " +
            "   (COALESCE(:breedPref, '') = '' OR p.breed = :breedPref)" +
            //"   (COALESCE(:colorPref, '') = '' OR p.color = :colorPref)" +
            ") " +
            "ORDER BY (" +
            "   COALESCE(p.likes, 0) - COALESCE(p.dislikes, 0) + " +
            "   CASE WHEN p.species = :speciesPref THEN 15.0 ELSE 0 END + " +
            "   CASE WHEN p.breed = :breedPref THEN 7.0 ELSE 0 END" +
            //"   CASE WHEN p.color = :colorPref THEN 5.0 ELSE 0 END" +
            ") DESC")
    List<Pet> findPersonalizedRecommendationsSpeciesAndBreed(
            @Param("viewedPetIds") List<Long> viewedPetIds,
            @Param("speciesPref") SPECIES_TYPE speciesPref,
            @Param("breedPref") String breedPref,
            //@Param("colorPref") String colorPref,
            Pageable pageable
    );

    @Query("SELECT p FROM Pet p " +
            "WHERE p.id NOT IN :viewedPetIds " +
            "AND (" +
            "   (COALESCE(:speciesPref, '') = '' OR p.species = :speciesPref)" +
            //"   (COALESCE(:breedPref, '') = '' OR p.breed = :breedPref)" +
            //"   (COALESCE(:colorPref, '') = '' OR p.color = :colorPref)" +
            ") " +
            "ORDER BY (" +
            "   COALESCE(p.likes, 0) - COALESCE(p.dislikes, 0) + " +
            "   CASE WHEN p.species = :speciesPref THEN 15.0 ELSE 0 END" +
            //"   CASE WHEN p.breed = :breedPref THEN 7.0 ELSE 0 END + " +
            //"   CASE WHEN p.color = :colorPref THEN 5.0 ELSE 0 END" +
            ") DESC")
    List<Pet> findPersonalizedRecommendationsSpecies(
            @Param("viewedPetIds") List<Long> viewedPetIds,
            @Param("speciesPref") SPECIES_TYPE speciesPref,
            //@Param("breedPref") String breedPref,
            //@Param("colorPref") String colorPref,
            Pageable pageable
    );

    @Query("SELECT p.id FROM Pet p " +
            "JOIN UserInteraction ui ON ui.pet.id = p.id " +
            "WHERE ui.user.id = :userId AND ui.interactionType = 'VIEW'")
    List<Long> findViewedPetIds(@Param("userId") Long userId);

}