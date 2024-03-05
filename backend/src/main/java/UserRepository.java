import org.springframework.data.jpa.repository.JpaRepository;

//Interact with a database using JPA (Java peristence API) without the need for extensive code production.
public interface UserRepository extends JpaRepository<User, Long> {
    
}