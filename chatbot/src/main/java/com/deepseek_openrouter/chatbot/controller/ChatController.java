package com.deepseek_openrouter.chatbot.controller;

import com.deepseek_openrouter.chatbot.request.ChatRequest;
import com.deepseek_openrouter.chatbot.response.ChatResponse;
import com.deepseek_openrouter.chatbot.service.ChatService;
import com.deepseek_openrouter.chatbot.service.OpenRouterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;
    private final OpenRouterService openRouterService;

    @Autowired
    public ChatController(ChatService chatService, OpenRouterService openRouterService) {
        this.chatService = chatService;
        this.openRouterService = openRouterService;
    }

    @PostMapping()
    public ResponseEntity<?> createChat(@RequestBody ChatRequest chatRequest ){
        chatService.createNewChat(chatRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{chatId}")
    public @ResponseBody ChatResponse getChatById(@PathVariable("chatId") Long chatId){
        return chatService.getChatByChatId(chatId);
    }

    @PostMapping("/{chatId}")
    public Mono<Map<String, String>> messageWithAi(@RequestBody Map<String, String> request,@PathVariable("chatId") Long chatId) {
        String userMessage = request.get("message");
        return openRouterService.messageWithAI(userMessage,chatId)
                .map(response -> Map.of("response", response));
    }
}
