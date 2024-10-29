package petadoption.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import petadoption.api.tables.UserInteraction;

import java.util.List;
import java.util.Optional;

public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {

    @Query("SELECT i FROM UserInteraction i WHERE i.user.id = :userId AND i.pet.id = :petId")
    Optional<UserInteraction> findInteraction(@Param("userId") Long userId, @Param("petId") Long petId);

    // 1. Fetch all pet IDs the user has interacted with.
    @Query("SELECT i.pet.id FROM UserInteraction i " +
            "WHERE i.user.id = :userId " +
            "AND (i.interactionType = 'LIKE' OR i.interactionType = 'VIEW')")
    List<UserInteraction> findPetsInteractedByUser(@Param("userId") Long userId);

    // 2. Fetch users who interacted with the same pets as the current user.
    @Query("SELECT DISTINCT i.user.id FROM UserInteraction i " +
            "WHERE i.pet.id IN :petIds AND i.user.id != :userId")
    List<Long> findSimilarUsers(@Param("petIds") List<Long> petIds,
                                @Param("userId") Long userId);

    // 3. Fetch new pets liked or viewed by similar users that the current user hasn't interacted with.
    @Query("SELECT DISTINCT i.pet.id FROM UserInteraction i " +
            "WHERE i.user.id IN :userIds AND i.pet.id NOT IN :excludedPetIds")
    List<Long> findRecommendedPets(@Param("userIds") List<Long> userIds,
                                   @Param("excludedPetIds") List<Long> excludedPetIds);


}
