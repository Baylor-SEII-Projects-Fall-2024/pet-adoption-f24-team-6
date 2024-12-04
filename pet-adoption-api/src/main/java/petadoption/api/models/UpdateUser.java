package petadoption.api.models;

public class UpdateUser {
    private String emailAddress;
    private String password;
    private String firstName;
    private String lastName;
    private String breedPref;
    private SPECIES_TYPE speciesPref;
    private COLOR_TYPE colorPref;

    // Getters and setters
    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBreedPref() {return breedPref;}

    public void setBreedPref(String breedPref) {this.breedPref = breedPref;}

    public SPECIES_TYPE getSpeciesPref() {return speciesPref;}

    public void setSpeciesPref(SPECIES_TYPE speciesPref) {this.speciesPref = speciesPref;}

    public COLOR_TYPE getColorPref() {return colorPref;}

    public void setColorPref(COLOR_TYPE colorPref) {this.colorPref = colorPref;}

}
