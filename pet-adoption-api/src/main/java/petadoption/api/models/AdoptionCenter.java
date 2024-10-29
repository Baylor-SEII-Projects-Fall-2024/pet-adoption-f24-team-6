package petadoption.api.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = AdoptionCenter.TABLE_NAME)
public class AdoptionCenter {
    public static final String TABLE_NAME = "AdoptionCenter";

    public Long getId() {
        return id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CENTER_ID")
    Long id;

    @Column(name = "NAME")
    String name;

    @Column(name = "DESCRIPTION")
    String description;

    @Column(name = "ADDRESS")
    String address;

    @Column(name = "CONTACTINFO")
    String contactInfo;

    @Column(name = "LIKES")
    Integer likes;


}
