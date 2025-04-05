package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.model.Chat;
import com.deepseek_openrouter.chatbot.request.ChatRequest;
import com.deepseek_openrouter.chatbot.response.ChatResponse;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface ChatService {
    void createNewChat(UserDetails userDetails);

    ChatResponse getChatByChatId(Long chatId);

    Chat findChatByChatId(Long chatId);

    List<ChatResponse> getAllChatsByUser(UserDetails userDetails);
}
