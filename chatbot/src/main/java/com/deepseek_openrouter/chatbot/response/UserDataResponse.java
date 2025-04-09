package com.deepseek_openrouter.chatbot.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDataResponse {
    private String name;
    private String email;
    private LocalDateTime createdAt;
}
