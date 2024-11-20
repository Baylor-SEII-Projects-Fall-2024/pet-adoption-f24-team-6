package petadoption.api.builders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import petadoption.api.models.GENDER_TYPE;
import petadoption.api.repositories.AdoptionCenterRepository;
import petadoption.api.tables.AdoptionCenter;
import petadoption.api.tables.Pet;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class PetBuilder implements Builder<Pet> {

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    List<String> names = new ArrayList<>(Arrays.asList("Buddy", "Luna", "Max", "Bella", "Charlie", "Daisy", "Rocky", "Molly", "Cooper", "Lucy", "Bailey", "Sadie", "Tucker", "Ruby", "Bentley", "Chloe", "Jack", "Sophie", "Milo", "Lily", "Finn", "Rosie", "Bear", "Coco", "Oliver", "Nala", "Duke", "Penny", "Zeus", "Ellie", "Oscar", "Ginger", "Leo", "Maggie", "Hunter", "Misty", "Harley", "Jasper", "Willow", "Simba", "Holly", "Toby", "Pepper", "Riley", "Hazel", "Murphy", "Zoe", "Archie", "Maple", "Shadow", "Sunny"));
    List<String> species = new ArrayList<>(Arrays.asList("Dog", "Cat", "Fish", "Bird", "Hamster", "Rabbit", "Lizard", "Turtle", "Guinea Pig", "Snake"));
    List<String> breeds = new ArrayList<>(Arrays.asList("Golden Retriever", "Persian Cat", "Betta Fish", "Cockatiel", "Syrian Hamster", "Holland Lop Rabbit", "Bearded Dragon", "Box Turtle", "Labrador Retriever", "Maine Coon", "Parakeet", "Dwarf Hamster", "Chihuahua", "Siberian Husky", "Corgi", "Leopard Gecko", "African Grey Parrot", "Ragdoll Cat", "French Bulldog", "Yorkshire Terrier"));
    List<String> sizes = new ArrayList<>(Arrays.asList("Tiny", "Small", "Medium", "Large", "Big", "Huge"));
    List<String> colors = new ArrayList<>(Arrays.asList("Black", "White", "Brown", "Gray", "Golden", "Tan", "Spotted", "Striped", "Cream", "Red"));

    @Override
    public Pet create() {
        Pet pet = new Pet();
        Random rand = new Random();

        pet.setName(names.get(rand.nextInt(names.size())));
        pet.setAge(rand.nextInt(15));
        pet.setSpecies(species.get(rand.nextInt(species.size())));
        pet.setBreed(breeds.get(rand.nextInt(breeds.size())));
        pet.setSize(sizes.get(rand.nextInt(sizes.size())));
        pet.setGender((rand.nextBoolean() ? GENDER_TYPE.MALE : GENDER_TYPE.FEMALE));
        //pet.setPhoto(photo);
        pet.setColor(colors.get(rand.nextInt(colors.size())));
        pet.setFriendliness(rand.nextInt(10));
        pet.setTrainingLevel(rand.nextInt(10));

        while (pet.getAdoptionCenter() == null) {
            AdoptionCenter adoptionCenter = adoptionCenterRepository.getRandomAdoptionCenter();
            System.out.println(adoptionCenter.getName());
            pet.setAdoptionCenter(adoptionCenter);
        }

        return pet;
    }
}