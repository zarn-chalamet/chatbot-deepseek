package com.deepseek_openrouter.chatbot.controller;

import com.deepseek_openrouter.chatbot.response.UserDataResponse;
import com.deepseek_openrouter.chatbot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public @ResponseBody UserDataResponse getUserData(@AuthenticationPrincipal UserDetails userDetails){
        return userService.getUserData(userDetails);
    }
}
