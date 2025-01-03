package petadoption.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import petadoption.api.models.INTERACTION_TYPE;
import petadoption.api.tables.UserInteraction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {

    @Query("SELECT DISTINCT i FROM UserInteraction i WHERE i.user.id = :userId AND i.pet.id = :petId")
    Optional<UserInteraction> findInteraction(@Param("userId") Long userId, @Param("petId") Long petId);

    // Fetch interaction by specific type
    @Query("SELECT i FROM UserInteraction i WHERE i.user.id = :userId AND i.pet.id = :petId AND i.interactionType = :interactionType")
    Optional<UserInteraction> findInteractionByType(@Param("userId") Long userId,
                                                    @Param("petId") Long petId,
                                                    @Param("interactionType") INTERACTION_TYPE interactionType);

    // Fetch interaction by multiple types (LIKE or DISLIKE)
    @Query("SELECT i FROM UserInteraction i WHERE i.user.id = :userId AND i.pet.id = :petId AND i.interactionType IN :interactionTypes")
    Optional<UserInteraction> findInteractionByTypes(@Param("userId") Long userId,
                                                     @Param("petId") Long petId,
                                                     @Param("interactionTypes") List<INTERACTION_TYPE> interactionTypes);


    @Query("SELECT i.pet.id FROM UserInteraction i " +
            "WHERE i.user.id = :userId " +
            "AND (i.interactionType = 'LIKE' OR i.interactionType = 'VIEW')")
    List<Long> findPetsInteractedByUser(@Param("userId") Long userId);

    //This is being Used by Rec Enginge
    @Query("SELECT i.user.id FROM UserInteraction i " +
            "WHERE i.pet.id IN :petIds AND i.user.id != :userId")
    List<Long> findUsersByPetInteractions(@Param("petIds") List<Long> petIds,
                                          @Param("userId") Long userId);

    @Query("SELECT DISTINCT i.user.id FROM UserInteraction i " +
            "WHERE i.pet.id IN :petIds AND i.user.id != :userId")
    List<Long> findSimilarUsers(@Param("petIds") List<Long> petIds,
                                @Param("userId") Long userId);

    //This is being used for viewing Feature
    @Query("SELECT i.pet.id FROM UserInteraction i WHERE i.user.id = :userId AND i.interactionType = 'VIEW'")
    List<Long> findViewedPets(@Param("userId") Long userId);


    @Query("SELECT DISTINCT i.pet.id FROM UserInteraction i " +
            "WHERE i.user.id IN :userIds AND i.pet.id NOT IN :excludedPetIds")
    List<Long> findRecommendedPets(@Param("userIds") List<Long> userIds,
                                   @Param("excludedPetIds") List<Long> excludedPetIds);

//    @Query("SELECT DISTINCT ui.pet.id FROM UserInteraction ui " +
//            "WHERE ui.user.id = :userId AND ui.interactionType IN ('LIKE', 'FAVORITE')")
//    List<Long> findInteractedPetIds(@Param("userId") Long userId);
//
//    @Query("SELECT COUNT(ui) FROM UserInteraction ui " +
//            "WHERE ui.user.id = :userId AND ui.interactionType = 'VIEW' ")
//    long countRecentViews(
//            @Param("userId") Long userId,
//            @Param("thresholdDate") LocalDateTime thresholdDate
//    );

}
