package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.model.Chat;
import com.deepseek_openrouter.chatbot.request.ChatRequest;
import com.deepseek_openrouter.chatbot.response.ChatResponse;

public interface ChatService {
    void createNewChat(ChatRequest chatRequest);

    ChatResponse getChatByChatId(Long chatId);

    Chat findChatByChatId(Long chatId);
}
