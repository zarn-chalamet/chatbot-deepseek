package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.model.ChatMessage;
import com.deepseek_openrouter.chatbot.repository.ChatMessageRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OpenRouterService {

    @Value("${open-router.api.key}")
    private String apiKey;

    private final WebClient webClient;
    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public OpenRouterService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.webClient = WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1/chat/completions")
                .defaultHeader("Content-Type", "application/json")
                .build();

    }


    public Mono<String> chatWithAI(String userMessage) {
        // Save user message
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(userMessage);
        chatMessage.setRole("user");
        chatMessageRepository.saveAndFlush(chatMessage);

        // Fetch last 10 messages for context
        List<Map<String, String>> messages = chatMessageRepository.findLatestMessages()
                .stream()
                .map(msg -> Map.of("role", msg.getRole(), "content", msg.getContent()))
                .collect(Collectors.toList());

        // Prepare API request
//        Map<String, Object> request = Map.of(
//                "model", "deepseek/deepseek-chat",
//                "messages", "here are the chat history of you(ai assistant) and user. you can use this history to answer the latest question."+ messages
//        );

        List<Map<String, String>> messagesWithContext = new ArrayList<>(messages);
        messagesWithContext.add(Map.of("role", "system", "content",
                "Here is the chat history between the user and the assistant. Use the history to answer the latest question from the user. " +
                        "Do not repeat any answers already given. Focus only on providing a response to the new question." +
                        " Make sure to only refer to the necessary parts of the conversation."
        ));

        System.out.println("=======================================");
        System.out.println(messagesWithContext);
        System.out.println("=======================================");

        Map<String, Object> request = Map.of(
                "model", "deepseek/deepseek-chat",
                "messages", messagesWithContext
        );

        return webClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(response -> {
                    String aiResponse = response.get("choices").get(0).get("message").get("content").asText();
                    chatMessageRepository.save(new ChatMessage(null, "assistant", aiResponse));
                    return aiResponse;
                });
    }

//    public Mono<String> chatWithAI(String userMessage) {
//        // Save user message
//        ChatMessage chatMessage = new ChatMessage();
//        chatMessage.setContent(userMessage);
//        chatMessage.setRole("user");
//        chatMessageRepository.saveAndFlush(chatMessage);
//
//        // Prepare API request with only the latest message
//        Map<String, Object> request = Map.of(
//                "model", "deepseek/deepseek-chat",
//                "messages", List.of(Map.of("role", "user", "content", userMessage))
//        );
//
//        return webClient.post()
//                .header("Authorization", "Bearer " + apiKey)
//                .bodyValue(request)
//                .retrieve()
//                .bodyToMono(JsonNode.class)
//                .map(response -> {
//                    String aiResponse = response.get("choices").get(0).get("message").get("content").asText();
//                    chatMessageRepository.save(new ChatMessage(null, "assistant", aiResponse));
//                    return aiResponse;
//                });
//    }

}
