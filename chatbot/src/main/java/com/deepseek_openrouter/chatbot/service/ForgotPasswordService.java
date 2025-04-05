package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.request.ResetPasswordRequest;

public interface ForgotPasswordService {
    void requestForgotPasswordLink(String email);

    void updateNewPassword(ResetPasswordRequest resetPasswordRequest);
}
