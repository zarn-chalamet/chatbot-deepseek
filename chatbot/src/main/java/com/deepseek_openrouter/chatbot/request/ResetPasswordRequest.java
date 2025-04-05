package com.deepseek_openrouter.chatbot.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String newPassword;
    private String token;
}
