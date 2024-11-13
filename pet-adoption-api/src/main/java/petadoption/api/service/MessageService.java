package petadoption.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.repositories.MessageRepository;
import petadoption.api.tables.Message;
import petadoption.api.tables.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message sendMessage(User sender, User receiver, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        return messageRepository.save(message);
    }

    public List<Message> getReceivedMessages(Long receiverId) {
        return messageRepository.findByReceiverId(receiverId);
    }

    public List<Message> getSentMessages(Long senderId) {
        return messageRepository.findBySenderId(senderId);
    }

    public void markMessageAsRead(Long messageId) {
        Optional<Message> message = messageRepository.findById(messageId);
        message.ifPresent(m -> {
            m.setRead(true);
            messageRepository.save(m);
        });
    }

    public long countUnreadMessages(Long receiverId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(receiverId);
    }
}
