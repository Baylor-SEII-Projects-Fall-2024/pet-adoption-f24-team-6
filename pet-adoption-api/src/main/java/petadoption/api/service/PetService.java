package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.models.SPECIES_TYPE;
import petadoption.api.tables.AdoptionCenter;
import petadoption.api.models.GENDER_TYPE;
import petadoption.api.models.COLOR_TYPE;
import petadoption.api.tables.Pet;
import petadoption.api.repositories.AdoptionCenterRepository;
import petadoption.api.repositories.PetRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    public Optional<Pet> findPet(Long petId) {
        return petRepository.findById(petId);
    }

    public Pet savePet(Pet pet) {
        return petRepository.save(pet);
    }

    public Pet registerPet(String name, Integer age, SPECIES_TYPE species, String breed, String size, GENDER_TYPE gender, String photo, COLOR_TYPE color, Integer friendliness, Integer trainingLevel, Long centerId) {
        Pet pet = new Pet();
        pet.setName(name);
        pet.setAge(age);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setSize(size);
        pet.setGender(gender);
        pet.setPhoto(photo);
        pet.setColor(color);
        pet.setFriendliness(friendliness);
        pet.setTrainingLevel(trainingLevel);

        if (centerId != null) {
            Optional<AdoptionCenter> adoptionCenterOptional = adoptionCenterRepository.findById(centerId);
            if (adoptionCenterOptional.isPresent()) {
                pet.setAdoptionCenter(adoptionCenterOptional.get());
            } else {
                throw new IllegalStateException("Adoption Center not found with id: " + centerId);
            }
        }

        return petRepository.save(pet);
    }

    public Pet updatePet(Long petId, Pet updatedPet) {
        Optional<Pet> existingPetOptional = petRepository.findById(petId);
        if (existingPetOptional.isEmpty()) {
            throw new IllegalStateException("Pet not found");
        }

        Pet existingPet = existingPetOptional.get();

        if (updatedPet.getName() != null && !updatedPet.getName().isEmpty()) {
            existingPet.setName(updatedPet.getName());
        }

        if (updatedPet.getAge() != null) {
            existingPet.setAge(updatedPet.getAge());
        }

        if (updatedPet.getSpecies() != null) {
            existingPet.setSpecies(updatedPet.getSpecies());
        }

        if (updatedPet.getBreed() != null && !updatedPet.getBreed().isEmpty()) {
            existingPet.setBreed(updatedPet.getBreed());
        }

        if (updatedPet.getSize() != null && !updatedPet.getSize().isEmpty()) {
            existingPet.setSize(updatedPet.getSize());
        }

        if (updatedPet.getGender() != null) {
            existingPet.setGender(updatedPet.getGender());
        }

        if (updatedPet.getPhoto() != null && !updatedPet.getPhoto().isEmpty()) {
            existingPet.setPhoto(updatedPet.getPhoto());
        }

        if (updatedPet.getColor() != null) {
            existingPet.setColor(updatedPet.getColor());
        }

        if (updatedPet.getFriendliness() != null) {
            existingPet.setFriendliness(updatedPet.getFriendliness());
        }

        if (updatedPet.getTrainingLevel() != null) {
            existingPet.setTrainingLevel(updatedPet.getTrainingLevel());
        }

        return petRepository.save(existingPet);
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public void deletePet(Long petId) {
        Optional<Pet> existingPetOptional = petRepository.findById(petId);
        if (existingPetOptional.isEmpty()) {
            throw new IllegalStateException("Pet not found");
        }
        petRepository.delete(existingPetOptional.get());
    }

    public List<Pet> getPetsByCenterId(Long centerId) {
        return petRepository.findByAdoptionCenter_Id(centerId);
    }
}