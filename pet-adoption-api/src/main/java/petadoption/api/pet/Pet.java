package petadoption.api.pet;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import petadoption.api.adoptioncenter.AdoptionCenter;
import petadoption.api.model.USER_TYPE;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = Pet.TABLE_NAME)
public class Pet {
    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PET_ID")
    Long id;

    @Column(name = "NAME")
    String name;

    @Column(name = "AGE")
    Integer age;

    @Column(name = "SPECIES")
    String species;

    @Column(name = "BREED")
    String breed;
    //change to enum later probably
    @Column(name = "SIZE")
    String size;

    @Column(name = "GENDER")
    @Enumerated(EnumType.STRING)
    String gender;
    //link to photo maybe?
    @Column(name = "PHOTO")
    String photo;

    @Column(name = "COLOR")
    String color;

    @Column(name = "FRIENDLINESS")
    Integer friendliness;

    @Column(name = "TRAINING_LEVEL")
    Integer trainingLevel;

    @ManyToOne
    @JoinColumn(name = "CENTER_ID", referencedColumnName = "CENTER_ID")
    private AdoptionCenter adoptionCenter;
}
