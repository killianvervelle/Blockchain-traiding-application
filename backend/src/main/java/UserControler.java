import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:8080") //because front and back hosted on different domains
@RestController
public class UserControler {
    @Autowired
    private UserRepository repository;
    @SuppressWarnings("null")
    @PostMapping("/saveUser")
    public ResponseEntity<String> saveUser(@RequestBody User user){
        repository.save(user);
        return new ResponseEntity<String>("User registered", HttpStatus.OK);
    }
}
