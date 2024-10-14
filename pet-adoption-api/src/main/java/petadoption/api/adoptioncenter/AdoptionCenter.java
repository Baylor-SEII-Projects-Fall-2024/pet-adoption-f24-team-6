package petadoption.api.adoptioncenter;

import jakarta.persistence.*;
import lombok.Data;
import org.checkerframework.checker.units.qual.C;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import petadoption.api.model.USER_TYPE;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = AdoptionCenter.TABLE_NAME)
public class AdoptionCenter {
    public static final String TABLE_NAME = "AdoptionCenter";

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
