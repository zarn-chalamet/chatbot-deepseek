package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.model.User;

public interface UserService {
    User findUserById(Long userId);
}
