package com.deepseek_openrouter.chatbot.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String name;
    private String password;
}
