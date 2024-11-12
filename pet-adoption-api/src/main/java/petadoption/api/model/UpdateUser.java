package petadoption.api.model;

public class UpdateUser {
    private String emailAddress;
    private String password;
    private String firstName;
    private String lastName;
    private String breedPref;
    private String speciesPref;
    private String colorPref;

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

    public String getSpeciesPref() {return speciesPref;}

    public void setSpeciesPref(String speciesPref) {this.speciesPref = speciesPref;}

    public String getColorPref() {return colorPref;}

    public void setColorPref(String colorPref) {this.colorPref = colorPref;}
}
