package com.deepseek_openrouter.chatbot.controller;

import com.deepseek_openrouter.chatbot.request.ResetPasswordRequest;
import com.deepseek_openrouter.chatbot.service.ForgotPasswordService;
import com.deepseek_openrouter.chatbot.service.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class ForgotPasswordController {

    private final UserService userService;
    private final ForgotPasswordService forgotPasswordService;

    @Autowired
    public ForgotPasswordController(UserService userService, ForgotPasswordService forgotPasswordService) {
        this.userService = userService;
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/password-request")
    public ResponseEntity<?> requestForgotPassword(@RequestParam("email") String email){
        forgotPasswordService.requestForgotPasswordLink(email);
        return ResponseEntity.ok("Password request link is sent to your email : "+ email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest){
        forgotPasswordService.updateNewPassword(resetPasswordRequest);
        return ResponseEntity.ok("New Password Updated");
    }
}
