package petadoption.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.tables.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmailAddress(String emailAddress);
}