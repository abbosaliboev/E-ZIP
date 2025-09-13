package com.konnection.backend.api.chat.controller;

import com.konnection.backend.api.chat.dto.ChatRequestDTO;
import com.konnection.backend.api.chat.dto.ChatResponseDTO;
import com.konnection.backend.api.chat.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponseDTO> sendMessage(@RequestBody ChatRequestDTO chatRequestDTO) {

        ChatResponseDTO chatResponseDTO = chatService.sendMessage(chatRequestDTO);
        return ResponseEntity.ok(chatResponseDTO);
    }
}
