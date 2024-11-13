package petadoption.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.models.MessageInput;
import petadoption.api.service.MessageService;
import petadoption.api.service.UserService;
import petadoption.api.tables.Message;
import petadoption.api.tables.User;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://${PUBLIC_IP:localhost}:3000")
public class MessageController {

    @Autowired
    private MessageService messageService;
    @Autowired
    private UserService userService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageInput input) {
        User sender = userService.findUser(input.getSenderId()).orElse(null);
        User receiver = userService.findUser(input.getReceiverId()).orElse(null);

        if (sender == null || receiver == null) {
            return ResponseEntity.badRequest().body("Invalid sender or receiver ID");
        }

        Message message = messageService.sendMessage(sender, receiver, input.getContent());
        return ResponseEntity.ok("Message sent successfully");
    }

    @GetMapping("/received/{receiverId}")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable Long receiverId) {
        List<Message> messages = messageService.getReceivedMessages(receiverId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/read/{messageId}")
    public ResponseEntity<?> markMessageAsRead(@PathVariable Long messageId) {
        messageService.markMessageAsRead(messageId);
        return ResponseEntity.ok("Message marked as read");
    }
}
