package petadoption.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import petadoption.api.models.GeocodingResponse;
import petadoption.api.tables.CenterEvent;
import petadoption.api.service.CenterEventService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class CenterEventController {

    private final CenterEventService centerEventService;

    @Autowired
    public CenterEventController(CenterEventService centerEventService) {
        this.centerEventService = centerEventService;
    }

    // Get all events
    @GetMapping
    public List<CenterEvent> getAllEvents() {
        return centerEventService.getAllCenterEvents();
    }

    // Get an event by its ID
    @GetMapping("/{id}")
    public ResponseEntity<CenterEvent> getEventById(@PathVariable Long id) {
        Optional<CenterEvent> event = centerEventService.getCenterEventById(id);
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/closest/user/{userId}")
    public ResponseEntity<List<CenterEvent>> getClosestEventsToUser(@PathVariable int userId) {
        try {
            List<CenterEvent> closestEvents = centerEventService.getClosestEventsToUser(userId);
            return ResponseEntity.ok(closestEvents);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/closest/{address}")
    public ResponseEntity<List<CenterEvent>> getClosestEvents(
            @PathVariable String address,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            // Geocode the address to get latitude and longitude
            double[] coordinates = geocodeAddress(address);
            double latitude = coordinates[0];
            double longitude = coordinates[1];

            // Find the closest events using the geocoded coordinates
            List<CenterEvent> closestEvents = centerEventService.getClosestEvents(latitude, longitude, limit);

            return ResponseEntity.ok(closestEvents);
        } catch (IllegalStateException e) {
            // Handle exceptions like invalid address or geocoding errors
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Get events by adoption center ID
    @GetMapping("/center/{centerId}")
    public List<CenterEvent> getEventsByAdoptionCenter(@PathVariable Long centerId) {
        return centerEventService.getEventsByAdoptionCenter(centerId);
    }

    // Create a new event
    @PostMapping("/create")
    public ResponseEntity<CenterEvent> createEvent(@RequestBody CenterEvent centerEvent) {
        CenterEvent createdEvent = centerEventService.saveCenterEvent(centerEvent);
        return ResponseEntity.ok(createdEvent);
    }

    // Update an existing event
    @PutMapping("/{id}")
    public ResponseEntity<CenterEvent> updateEvent(@PathVariable Long id, @RequestBody CenterEvent centerEvent) {
        try {
            CenterEvent updatedEvent = centerEventService.updateCenterEvent(id, centerEvent);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete an event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        centerEventService.deleteCenterEvent(id);
        return ResponseEntity.noContent().build();
    }

    private double[] geocodeAddress(String address) {
        String apiKey = "AIzaSyC9TTghzDIAuRpkSRuEVtlVgLPBXV_dQEQ";
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        GeocodingResponse response = restTemplate.getForObject(url, GeocodingResponse.class);

        if (!"OK".equals(response.getStatus()) || response.getResults().isEmpty()) {
            throw new IllegalStateException("Unable to geocode address: " + response.getStatus());
        }

        GeocodingResponse.Location location = response.getResults().get(0).getGeometry().getLocation();
        return new double[]{location.getLat(), location.getLng()};
    }
}
