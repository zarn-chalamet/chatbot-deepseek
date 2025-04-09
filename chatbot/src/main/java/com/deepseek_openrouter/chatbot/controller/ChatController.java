package com.deepseek_openrouter.chatbot.controller;

import com.deepseek_openrouter.chatbot.request.ChatRequest;
import com.deepseek_openrouter.chatbot.request.UpdateTitleRequest;
import com.deepseek_openrouter.chatbot.response.ChatResponse;
import com.deepseek_openrouter.chatbot.response.CreatedResponse;
import com.deepseek_openrouter.chatbot.response.MessageResponse;
import com.deepseek_openrouter.chatbot.service.ChatService;
import com.deepseek_openrouter.chatbot.service.OpenRouterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.security.Principal;
import java.util.List;
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

    @GetMapping()
    public @ResponseBody List<ChatResponse> getAllChatsOfPrincipal(@AuthenticationPrincipal UserDetails userDetails){
        return chatService.getAllChatsByUser(userDetails);
    }

    @PostMapping()
    public CreatedResponse createChat(@AuthenticationPrincipal UserDetails userDetails){
        return chatService.createNewChat(userDetails);
    }

    @GetMapping("/{chatId}")
    public @ResponseBody ChatResponse getChatById(@PathVariable("chatId") Long chatId){
        return chatService.getChatByChatId(chatId);
    }

    @PostMapping("/{chatId}")
    public MessageResponse messageWithAi(@RequestBody Map<String, String> request, @PathVariable("chatId") Long chatId) {
        String userMessage = request.get("message");
        return openRouterService.messageWithAI(userMessage,chatId);
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<?> deleteById(@PathVariable("chatId") Long chatId){
        chatService.deleteChatById(chatId);
        return ResponseEntity.ok("Deleted chat by id: "+chatId);
    }

    @PutMapping("/{chatId}")
    public ResponseEntity<?> updateTitleById(@PathVariable("chatId") Long chatId, @RequestBody UpdateTitleRequest updateTitleRequest){
        chatService.updateChatTitle(chatId,updateTitleRequest);
        return ResponseEntity.ok("Updated chat by id: "+chatId);
    }
}
