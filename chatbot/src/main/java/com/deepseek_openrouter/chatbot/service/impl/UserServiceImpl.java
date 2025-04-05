package com.deepseek_openrouter.chatbot.service.impl;

import com.deepseek_openrouter.chatbot.model.User;
import com.deepseek_openrouter.chatbot.repository.UserRepository;
import com.deepseek_openrouter.chatbot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User findUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found with id: "+userId));
    }
}
