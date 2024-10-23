package petadoption.api.service;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.Storage.SignUrlOption;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/pic")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class GcsSignedUrlController {

    private final Storage storage;
    private final String bucketName;

    public GcsSignedUrlController(
            @Value("${spring.cloud.gcp.storage.bucket}") String bucketName) throws IOException {
        try (InputStream serviceAccountStream = getClass().getClassLoader().getResourceAsStream("advance-sonar-434701-g4-174f26b320fc.json")) {
            if (serviceAccountStream == null) {
                throw new FileNotFoundException("Service account JSON file not found in resources.");
            }

            this.storage = StorageOptions.newBuilder()
                    .setCredentials(
                            com.google.auth.oauth2.ServiceAccountCredentials.fromStream(serviceAccountStream)
                    )
                    .build()
                    .getService();
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize Google Cloud Storage", e);
        }
        this.bucketName = bucketName;
    }

    @GetMapping("/generate-signed-url")
    public String generateSignedUrl(@RequestParam String filename) {
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, filename).build();
        URL signedUrl = storage.signUrl(blobInfo, 15, TimeUnit.MINUTES, SignUrlOption.withV4Signature());
        return signedUrl.toString();
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        try {

            String filename = file.getOriginalFilename();

            BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, filename)
                    .setContentType(file.getContentType())
                    .build();

            storage.create(blobInfo, file.getBytes());


            URL signedUrl = storage.signUrl(
                    BlobInfo.newBuilder(bucketName, filename).build(),
                    15, TimeUnit.MINUTES,
                    SignUrlOption.withV4Signature()
            );

            return signedUrl.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "File upload failed: " + e.getMessage();
        }
    }
}
