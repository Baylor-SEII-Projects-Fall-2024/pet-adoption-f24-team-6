package petadoption.api.models;

public class RegisterPet {
    private String name;
    private Integer age;
    private SPECIES_TYPE species;
    private String breed;
    private String size;
    private GENDER_TYPE gender;
    private String photo;
    private COLOR_TYPE color;
    private Integer friendliness;
    private Integer trainingLevel;
    private Long centerId;

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public SPECIES_TYPE getSpecies() {
        return species;
    }

    public void setSpecies(SPECIES_TYPE species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public GENDER_TYPE getGender() {
        return gender;
    }

    public void setGender(GENDER_TYPE gender) {
        this.gender = gender;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public COLOR_TYPE getColor() { return color; }

    public void setColor(COLOR_TYPE color) {
        this.color = color;
    }

    public Integer getFriendliness() {
        return friendliness;
    }

    public void setFriendliness(Integer friendliness) {
        this.friendliness = friendliness;
    }

    public Integer getTrainingLevel() {
        return trainingLevel;
    }

    public void setTrainingLevel(Integer trainingLevel) {
        this.trainingLevel = trainingLevel;
    }

    public Long getCenterId() {
        return centerId;
    }

    public void setCenterId(Long centerId) {
        this.centerId = centerId;
    }
}