package com.konnection.backend.api.chat.controller;

import com.konnection.backend.api.chat.dto.ChatRequestDTO;
import com.konnection.backend.api.chat.dto.ChatResponseDTO;
import com.konnection.backend.api.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public Mono<ResponseEntity<ChatResponseDTO>> sendMessage(@RequestBody ChatRequestDTO chatRequestDTO) {
        return chatService.sendMessage(chatRequestDTO)
                .map(ResponseEntity::ok);
    }
}