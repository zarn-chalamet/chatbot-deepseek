package com.deepseek_openrouter.chatbot.repository;

import com.deepseek_openrouter.chatbot.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Chat,Long> {
}
