package com.deepseek_openrouter.chatbot.controller;

import com.deepseek_openrouter.chatbot.request.LoginRequest;
import com.deepseek_openrouter.chatbot.request.RegisterRequest;
import com.deepseek_openrouter.chatbot.security.jwt.JwtAuthenticationResponse;
import com.deepseek_openrouter.chatbot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        userService.registerNewUser(registerRequest);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        JwtAuthenticationResponse response = userService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}
