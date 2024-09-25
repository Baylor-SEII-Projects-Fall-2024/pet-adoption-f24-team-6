package petadoption.api.endpoint;

public class LoginEndpoint {
    private String emailAddress;
    private String password;

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
}