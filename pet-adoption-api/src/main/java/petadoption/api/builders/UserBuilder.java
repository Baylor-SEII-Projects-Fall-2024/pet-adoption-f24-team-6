package petadoption.api.builders;

import org.springframework.stereotype.Component;
import petadoption.api.models.USER_TYPE;
import petadoption.api.tables.User;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class UserBuilder implements Builder<User> {
    private final String CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final List<String> species = new ArrayList<>(Arrays.asList("Dog", "Cat", "Fish", "Bird", "Hamster", "Rabbit", "Lizard", "Turtle", "Guinea Pig", "Snake"));
    private final List<String> breeds = new ArrayList<>(Arrays.asList("Golden Retriever", "Persian Cat", "Betta Fish", "Cockatiel", "Syrian Hamster", "Holland Lop Rabbit", "Bearded Dragon", "Box Turtle", "Labrador Retriever", "Maine Coon", "Parakeet", "Dwarf Hamster", "Chihuahua", "Siberian Husky", "Corgi", "Leopard Gecko", "African Grey Parrot", "Ragdoll Cat", "French Bulldog", "Yorkshire Terrier"));
    private final List<String> colors = new ArrayList<>(Arrays.asList("Black", "White", "Brown", "Gray", "Golden", "Tan", "Spotted", "Striped", "Cream", "Red"));
    private final Random rand = new Random();

    private String generateString(int origin, int bound) {
        StringBuilder sb = new StringBuilder();
        String str;
        int size = rand.nextInt(origin, bound);
        for (int i = 0; i < size; i++) {
            sb.append(CHARSET.charAt(rand.nextInt(CHARSET.length())));
        }
        str = sb.toString();
        return str;
    }


    @Override
    public User create() {
        User user = new User();

        user.setEmailAddress(generateString(5, 12) + "@" + generateString(3, 6) + ".com");
        user.setPassword(generateString(6, 30));
        user.setUserType(USER_TYPE.CUSTOMER);
        user.setFirstName(generateString(4, 12));
        user.setLastName(generateString(4, 12));
//        user.setSpeciesPref(species.get(rand.nextInt(species.size())));
//        user.setBreedPref(breeds.get(rand.nextInt(breeds.size())));
//        user.setColorPref(colors.get(rand.nextInt(colors.size())));

        return user;
    }
}
