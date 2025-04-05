package com.deepseek_openrouter.chatbot.service.impl;

import com.deepseek_openrouter.chatbot.model.Message;
import com.deepseek_openrouter.chatbot.repository.MessageRepository;
import com.deepseek_openrouter.chatbot.response.MessageResponse;
import com.deepseek_openrouter.chatbot.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    @Autowired
    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public Message saveMessageAndFlush(Message message) {
        return messageRepository.saveAndFlush(message);
    }
}
