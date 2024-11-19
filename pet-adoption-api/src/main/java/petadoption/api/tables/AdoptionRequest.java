package petadoption.api.tables;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import petadoption.api.models.RequestStatus;

import java.time.LocalDateTime;


@Data
@Entity
@Table(name = AdoptionRequest.TABLE_NAME)
@NoArgsConstructor
public class AdoptionRequest {

    public static final String TABLE_NAME = "AdoptionRequest";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REQUEST_ID")
    private Long id;

    @Column(name = "REQUESTED_DATE")
    private LocalDateTime requestDate;

    @Column(name = "isRead", nullable = false)
    private Boolean isRead;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id", referencedColumnName = "PET_ID")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "CENTER_ID", referencedColumnName = "CENTER_ID")
    private AdoptionCenter adoptionCenter;

    public AdoptionRequest(User user, Pet pet, AdoptionCenter adoptionCenter) {
        this.requestDate = LocalDateTime.now();
        this.isRead = false;
        this.user = user;
        this.pet = pet;
        this.adoptionCenter = adoptionCenter;
    }

}

