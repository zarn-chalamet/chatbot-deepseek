package com.deepseek_openrouter.chatbot.service.impl;

import com.deepseek_openrouter.chatbot.model.Chat;
import com.deepseek_openrouter.chatbot.model.User;
import com.deepseek_openrouter.chatbot.repository.ChatRepository;
import com.deepseek_openrouter.chatbot.request.UpdateTitleRequest;
import com.deepseek_openrouter.chatbot.response.ChatResponse;
import com.deepseek_openrouter.chatbot.response.CreatedResponse;
import com.deepseek_openrouter.chatbot.response.MessageResponse;
import com.deepseek_openrouter.chatbot.service.ChatService;
import com.deepseek_openrouter.chatbot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

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
    public CreatedResponse createNewChat(UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        Chat chat = new Chat();
        chat.setUser(user);
        chat.setTitle("New Chat");
        Chat createdChat = chatRepository.saveAndFlush(chat);

        CreatedResponse createdResponse = new CreatedResponse();
        createdResponse.setId(createdChat.getId());

        return createdResponse;
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

    @Override
    public List<ChatResponse> getAllChatsByUser(UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        List<Chat> chats = chatRepository.findAllByUser(user);
        return chats.stream().map(
                chat -> {

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

                    ChatResponse chatResponse = new ChatResponse();
                    chatResponse.setId(chat.getId());
                    chatResponse.setTitle(chat.getTitle());
                    chatResponse.setChatMessages(messageResponses);
                    chatResponse.setCreatedAt(chat.getCreatedAt());
                    chatResponse.setUpdatedAt(chat.getUpdatedAt());

                    return chatResponse;
                }
        ).toList();
    }

    @Override
    public void deleteChatById(Long chatId) {
        chatRepository.deleteById(chatId);
    }

    @Override
    public void updateChatTitle(Long chatId, UpdateTitleRequest updateTitleRequest) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(()-> new RuntimeException("No chat found with id: "+ chatId));
        chat.setTitle(updateTitleRequest.getNewTitle());
        chatRepository.saveAndFlush(chat);
    }
}
