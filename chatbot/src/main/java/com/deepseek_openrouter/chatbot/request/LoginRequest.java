package com.deepseek_openrouter.chatbot.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
