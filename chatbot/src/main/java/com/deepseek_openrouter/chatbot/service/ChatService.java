package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.model.Chat;
import com.deepseek_openrouter.chatbot.request.UpdateTitleRequest;
import com.deepseek_openrouter.chatbot.response.ChatResponse;
import com.deepseek_openrouter.chatbot.response.CreatedResponse;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface ChatService {
    CreatedResponse createNewChat(UserDetails userDetails);

    ChatResponse getChatByChatId(Long chatId);

    Chat findChatByChatId(Long chatId);

    List<ChatResponse> getAllChatsByUser(UserDetails userDetails);

    void deleteChatById(Long chatId);

    void updateChatTitle(Long chatId, UpdateTitleRequest updateTitleRequest);
}
