package petadoption.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import petadoption.api.models.GeocodingResponse;
import petadoption.api.tables.CenterEvent;
import petadoption.api.repositories.CenterEventRepository;
import petadoption.api.utils.GeoUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CenterEventService {

    private final CenterEventRepository centerEventRepository;

    @Autowired
    public CenterEventService(CenterEventRepository centerEventRepository) {
        this.centerEventRepository = centerEventRepository;
    }

    public List<CenterEvent> getAllCenterEvents() {
        return centerEventRepository.findAll();
    }

    public Optional<CenterEvent> getCenterEventById(Long id) {
        return centerEventRepository.findById(id);
    }

    public List<CenterEvent> getEventsByAdoptionCenter(Long centerId) {
        return centerEventRepository.findByAdoptionCenterId(centerId);
    }

    public CenterEvent saveCenterEvent(CenterEvent centerEvent) {
        setCoordinates(centerEvent);
        return centerEventRepository.save(centerEvent);
    }

    public void deleteCenterEvent(Long id) {
        centerEventRepository.deleteById(id);
    }

    public CenterEvent updateCenterEvent(Long id, CenterEvent centerEvent) {
        Optional<CenterEvent> existingCenterEvent = centerEventRepository.findById(id);

        if (existingCenterEvent.isPresent()) {
            CenterEvent updatedEvent = existingCenterEvent.get();

            updatedEvent.setDescription(centerEvent.getDescription());
            updatedEvent.setDate(centerEvent.getDate());
            updatedEvent.setAdoptionCenter(centerEvent.getAdoptionCenter());
            updatedEvent.setName(centerEvent.getName());
            updatedEvent.setPhoto(centerEvent.getPhoto());

            if (!updatedEvent.getAddress().equals(centerEvent.getAddress())) {
                updatedEvent.setAddress(centerEvent.getAddress());
                setCoordinates(updatedEvent);
            }

            return centerEventRepository.save(updatedEvent);
        } else {
            throw new RuntimeException("Center Event not found");
        }
    }

    public List<CenterEvent> getPetsByCenterId(Long centerId) {
        return centerEventRepository.findByAdoptionCenter_Id(centerId);
    }

    private void setCoordinates(CenterEvent centerEvent) {
        try {
            double[] coordinates = geocodeAddress(centerEvent.getAddress());
            centerEvent.setLatitude(coordinates[0]);
            centerEvent.setLongitude(coordinates[1]);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to set coordinates for address: " + centerEvent.getAddress(), e);
        }
    }

    public List<CenterEvent> getClosestEvents(double userLat, double userLon, int limit) {
        List<CenterEvent> allEvents = centerEventRepository.findAll();

        List<CenterEvent> sortedEvents = sortEventsByDistance(allEvents, userLat, userLon);

        return getLimitedEvents(sortedEvents, limit);
    }

    private List<CenterEvent> sortEventsByDistance(List<CenterEvent> events, double userLat, double userLon) {
        List<CenterEvent> sortedEvents = new ArrayList<>(events);

        sortedEvents.sort(new Comparator<CenterEvent>() {
            @Override
            public int compare(CenterEvent event1, CenterEvent event2) {
                double distance1 = calculateEventDistance(event1, userLat, userLon);
                double distance2 = calculateEventDistance(event2, userLat, userLon);
                return Double.compare(distance1, distance2);
            }
        });

        return sortedEvents;
    }

    private List<CenterEvent> getLimitedEvents(List<CenterEvent> events, int limit) {
        int actualLimit = Math.min(limit, events.size());
        return events.subList(0, actualLimit);
    }

    private double calculateEventDistance(CenterEvent event, double userLat, double userLon) {
        return GeoUtils.calculateDistance(userLat, userLon, event.getLatitude(), event.getLongitude());
    }

    private double[] geocodeAddress(String address) {
        String apiKey = "AIzaSyArMWipIBs5IlbXsoO4b5qwnx_Uu0xhVIM";
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
