package com.konnection.backend.api.chat.controller;

import com.konnection.backend.api.chat.dto.ChatRequestDTO;
import com.konnection.backend.api.chat.dto.ChatRequestMessageDTO;
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

    @PostMapping("/translate")
    public Mono<ResponseEntity<ChatResponseDTO>> sendTranslateMessage(@RequestBody ChatRequestDTO chatRequestDTO) {
        return chatService.sendTranslateMessage(chatRequestDTO)
                .map(ResponseEntity::ok);
    }

    @PostMapping
    public Mono<ResponseEntity<ChatResponseDTO>> sendMessage(@RequestBody ChatRequestMessageDTO chatRequestMessageDTO) {
        return chatService.sendMessage(chatRequestMessageDTO)
                .map(ResponseEntity::ok);
    }
}