package petadoption.api.tables;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import petadoption.api.models.COLOR_TYPE;
import petadoption.api.models.SPECIES_TYPE;
import petadoption.api.models.USER_TYPE;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = User.TABLE_NAME)
public class User implements UserDetails {


    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    Long id;

    @Column(name = "EMAIL_ADDRESS")
    String emailAddress;

    @Column(name = "PASSWORD")
    String password;

    @Column(name = "USER_TYPE")
    @Enumerated(EnumType.STRING)
    USER_TYPE userType;

    @Column(name = "FIRST_NAME")
    String firstName;

    @Column(name = "LAST_NAME")
    String lastName;

    @Column(name = "SPECIES_PREF")
    SPECIES_TYPE speciesPref;

    @Column(name = "BREED_PREF")
    String breedPref;

    @Column(name = "COLOR_PREF")
    COLOR_TYPE colorPref;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return emailAddress;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}