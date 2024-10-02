package petadoption.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@SpringBootApplication
public class PetAdoptionApplication {
	public static void main(String[] args) {
		SpringApplication.run(PetAdoptionApplication.class, args);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.csrf().disable()
				.authorizeHttpRequests()
				.requestMatchers("/api/**").permitAll()  // Allow public access to authentication routes
				.anyRequest().authenticated()
				.and()
				.build();
	}

}
