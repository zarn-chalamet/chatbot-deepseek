package com.deepseek_openrouter.chatbot.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageResponse {
    private Long id;
    private String role;
    private String content;
    private LocalDateTime createdAt;
}
