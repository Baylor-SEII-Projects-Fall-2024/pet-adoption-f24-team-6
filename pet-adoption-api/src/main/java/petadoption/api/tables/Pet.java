package petadoption.api.tables;

import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.models.GENDER_TYPE;

@Data
@Entity
@Table(name = Pet.TABLE_NAME)
public class Pet {
    public static final String TABLE_NAME = "PETS";

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
    GENDER_TYPE gender;

    @Column(name = "PHOTO", columnDefinition = "TEXT")
    @Lob
    String photo;

    @Column(name = "COLOR")
    String color;

    @Column(name = "FRIENDLINESS")
    Integer friendliness;

    @Column(name = "TRAINING_LEVEL")
    Integer trainingLevel;

    @Column(name = "LIKES")
    Integer likes = 0;

    @Column(name = "DISLIKES")
    Integer dislikes = 0;

    @Column(name = "VIEWS")
    Integer views = 0;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "CENTER_ID", referencedColumnName = "CENTER_ID")
    private AdoptionCenter adoptionCenter;
}
