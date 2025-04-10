package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.model.User;
import com.deepseek_openrouter.chatbot.request.LoginRequest;
import com.deepseek_openrouter.chatbot.request.RegisterRequest;
import com.deepseek_openrouter.chatbot.response.UserDataResponse;
import com.deepseek_openrouter.chatbot.security.jwt.JwtAuthenticationResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    User findUserById(Long userId);

    void registerNewUser(RegisterRequest registerRequest);

    JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest);

    User findUserByEmail(String email);

    void updatePassword(User user, String newPassword);

    UserDataResponse getUserData(UserDetails userDetails);
}
