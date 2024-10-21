package petadoption.api.endpoint;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.adoptioncenter.CenterEvent;
import petadoption.api.centerevent.CenterEventService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
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

    // Get events by adoption center ID
    @GetMapping("/center/{centerId}")
    public List<CenterEvent> getEventsByAdoptionCenter(@PathVariable Long centerId) {
        return centerEventService.getEventsByAdoptionCenter(centerId);
    }

    // Create a new event
    @PostMapping
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
}
