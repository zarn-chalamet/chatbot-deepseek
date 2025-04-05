package com.deepseek_openrouter.chatbot.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatResponse {
    private Long id;
    private String title;
    private List<MessageResponse> chatMessages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
