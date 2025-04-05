package com.deepseek_openrouter.chatbot.controller;

import com.deepseek_openrouter.chatbot.service.OpenRouterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatMessageController {

    private final OpenRouterService openRouterService;

    @PostMapping
    public Mono<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        return openRouterService.chatWithAI(userMessage)
                .map(response -> Map.of("response", response));
    }
}
