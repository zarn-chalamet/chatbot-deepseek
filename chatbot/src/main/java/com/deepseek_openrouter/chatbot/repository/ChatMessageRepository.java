package com.deepseek_openrouter.chatbot.repository;

import com.deepseek_openrouter.chatbot.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    @Query("SELECT c FROM ChatMessage c ORDER BY c.id DESC")
    List<ChatMessage> findLatestMessages();
}
