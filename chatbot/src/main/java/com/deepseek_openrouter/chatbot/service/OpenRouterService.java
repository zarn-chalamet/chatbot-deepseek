package com.deepseek_openrouter.chatbot.service;

import com.deepseek_openrouter.chatbot.model.Chat;
import com.deepseek_openrouter.chatbot.model.ChatMessage;
import com.deepseek_openrouter.chatbot.model.Message;
import com.deepseek_openrouter.chatbot.repository.ChatMessageRepository;
import com.deepseek_openrouter.chatbot.response.MessageResponse;
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
    private final ChatService chatService;
    private final MessageService messageService;

    @Autowired
    public OpenRouterService(ChatMessageRepository chatMessageRepository, ChatService chatService, MessageService messageService) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatService = chatService;
        this.messageService = messageService;
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

    public MessageResponse messageWithAI(String userMessage, Long chatId) {
        //find chat by chat id and save the userMessage to the chat
        Chat chat = chatService.findChatByChatId(chatId);

        Message message = new Message();
        message.setChat(chat);
        message.setRole("user");
        message.setContent(userMessage);
        Message savedMessage = messageService.saveMessageAndFlush(message);

        //get all the chat messages

        // get messages for context
        List<Map<String, String>> messages = chat.getMessageList()
                .stream()
                .map(msg -> Map.of("role", msg.getRole(), "content", msg.getContent()))
                .toList();

        System.out.println("=============================================================");
        System.out.println(messages);
        System.out.println("=============================================================");

        List<Map<String, String>> messagesWithContext = new ArrayList<>(messages);
        messagesWithContext.add(Map.of("role", "system", "content",
                "Here is the chat history between the user and the assistant. Use the history to answer the latest question from the user. " +
                        "Do not repeat any answers already given. Focus only on providing a response to the new question." +
                        " Make sure to only refer to the necessary parts of the conversation."
        ));

        System.out.println("message with context============================================================");
        System.out.println(messagesWithContext);
        System.out.println("=============================================================");


        Map<String, Object> request = Map.of(
                "model", "deepseek/deepseek-chat",
                "messages", messagesWithContext
        );

        // Call the WebClient asynchronously and block to get the response
        JsonNode response = webClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();  // Block here to get the actual result

        // Extract the AI's response from the result
        String aiResponse = response.get("choices").get(0).get("message").get("content").asText();

        // Create a new message with the AI's response
        Message replyMessage = new Message();
        replyMessage.setChat(chat);
        replyMessage.setRole("assistant");
        replyMessage.setContent(aiResponse);

        // Save the reply message
        Message newSavedMessage = messageService.saveMessageAndFlush(replyMessage);

        // Create and return a MessageResponse based on the new saved message
        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setId(newSavedMessage.getId());
        messageResponse.setRole(newSavedMessage.getRole());
        messageResponse.setContent(newSavedMessage.getContent());
        messageResponse.setCreatedAt(newSavedMessage.getCreatedAt());
        return messageResponse;

//        return webClient.post()
//                .header("Authorization", "Bearer " + apiKey)
//                .bodyValue(request)
//                .retrieve()
//                .bodyToMono(JsonNode.class)
//                .map(response -> {
//                    String aiResponse = response.get("choices").get(0).get("message").get("content").asText();
//                    Message replyMessage = new Message();
//                    replyMessage.setChat(chat);
//                    replyMessage.setRole("assistant");
//                    replyMessage.setContent(aiResponse);
//                    return messageService.saveMessageAndFlush(replyMessage);
//
//                });
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
