package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.model.Message;

public interface MessageService {
    Message saveMessageAndFlush(Message message);
}
