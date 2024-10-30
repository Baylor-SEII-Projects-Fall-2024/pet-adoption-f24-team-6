package petadoption.api.tables;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import petadoption.api.models.INTERACTION_TYPE;

@Data
@Entity
@Table(name = UserInteraction.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
public class UserInteraction {

    public static final String TABLE_NAME = "UserInteraction";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "PET_ID", referencedColumnName = "PET_ID")
    private Pet pet;

    @Enumerated(EnumType.STRING)
    private INTERACTION_TYPE interactionType;

    public UserInteraction(User user, Pet pet, INTERACTION_TYPE interactionType) {
        this.user = user;
        this.pet = pet;
        this.interactionType = interactionType;
    }

    public void setInteractionType(INTERACTION_TYPE interactionType) {
        this.interactionType = interactionType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public INTERACTION_TYPE getInteractionType() {
        return interactionType;
    }

}
