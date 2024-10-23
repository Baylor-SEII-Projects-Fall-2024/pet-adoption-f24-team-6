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
@Table(name = CenterEvent.TABLE_NAME)
public class CenterEvent {
    public static final String TABLE_NAME = "CenterEvent";

    public Long getId() {
        return id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EVENT_ID")
    Long id;

    @Column(name = "NAME")
    String name;

    @Column(name = "DESCRIPTION")
    String description;

    @Column(name = "ADDRESS")
    String address;

    @Column(name = "DATE")
    String date;

    @Column(name = "PHOTO", columnDefinition = "TEXT")
    @Lob
    String photo;

    @ManyToOne
    @JoinColumn(name = "CENTER_ID", referencedColumnName = "CENTER_ID")
    private AdoptionCenter adoptionCenter;


}
