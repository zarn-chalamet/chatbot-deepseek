package com.deepseek_openrouter.chatbot.service.impl;

import com.deepseek_openrouter.chatbot.model.Chat;
import com.deepseek_openrouter.chatbot.model.User;
import com.deepseek_openrouter.chatbot.repository.ChatRepository;
import com.deepseek_openrouter.chatbot.request.ChatRequest;
import com.deepseek_openrouter.chatbot.response.ChatResponse;
import com.deepseek_openrouter.chatbot.response.MessageResponse;
import com.deepseek_openrouter.chatbot.service.ChatService;
import com.deepseek_openrouter.chatbot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final UserService userService;
    private final ChatRepository chatRepository;

    @Autowired
    public ChatServiceImpl(UserService userService, ChatRepository chatRepository) {
        this.userService = userService;
        this.chatRepository = chatRepository;
    }

    @Override
    public void createNewChat(ChatRequest chatRequest) {
        User user = userService.findUserById(chatRequest.getUserId());
        Chat chat = new Chat();
        chat.setUser(user);
        chat.setTitle("New Chat");
        chatRepository.save(chat);
    }

    @Override
    public ChatResponse getChatByChatId(Long chatId) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(()-> new RuntimeException("No chat found with id: "+ chatId));

        //Convert messages to message response
        List<MessageResponse> messageResponses = chat.getMessageList()
                .stream()
                .map(message -> {
                    MessageResponse messageResponse = new MessageResponse();
                    messageResponse.setId(message.getId());
                    messageResponse.setRole(message.getRole());
                    messageResponse.setContent(message.getContent());
                    messageResponse.setCreatedAt(message.getCreatedAt());
                    return messageResponse;
                })
                .toList();

        //create chat response
        ChatResponse chatResponse = new ChatResponse();
        chatResponse.setId(chat.getId());
        chatResponse.setTitle(chat.getTitle());
        chatResponse.setCreatedAt(chat.getCreatedAt());
        chatResponse.setUpdatedAt(chat.getUpdatedAt());
        chatResponse.setChatMessages(messageResponses);
        return chatResponse;
    }

    @Override
    public Chat findChatByChatId(Long chatId) {
        return chatRepository.findById(chatId).orElseThrow(()-> new RuntimeException("No chat found with id: "+chatId));
    }
}
