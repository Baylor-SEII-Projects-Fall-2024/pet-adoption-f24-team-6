package petadoption.api.builders;

import org.springframework.stereotype.Component;
import petadoption.api.models.USER_TYPE;
import petadoption.api.tables.AdoptionCenter;
import petadoption.api.tables.User;

import java.util.Random;

@Component
public class AdoptionCenterBuilder implements Builder<AdoptionCenter> {
    private final String CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private Random rand  = new Random();

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

    public AdoptionCenter create() {
        AdoptionCenter adoptionCenter = new AdoptionCenter();

        adoptionCenter.setName(generateString(4, 25));
        adoptionCenter.setDescription(generateString(5, 50));
        adoptionCenter.setAddress(generateString(5, 50));
        adoptionCenter.setContactInfo(generateString(5, 50));
        adoptionCenter.setLikes(rand.nextInt(100));

        User newUser = new UserBuilder().create();
        newUser.setUserType(USER_TYPE.ADOPTION_CENTER);
        adoptionCenter.setUser(newUser);

        return adoptionCenter;
    }

}
