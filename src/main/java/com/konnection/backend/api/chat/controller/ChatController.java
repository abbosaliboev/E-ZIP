package com.konnection.backend.api.chat.controller;

import com.konnection.backend.api.chat.dto.ChatRequestDTO;
import com.konnection.backend.api.chat.dto.ChatRequestMessageDTO;
import com.konnection.backend.api.chat.dto.ChatResponseDTO;
import com.konnection.backend.api.chat.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "채팅 관련 API 입니다.")
public class ChatController {

    private final ChatService chatService;

    @Operation(
            summary = "채팅 번역 API",
            description = "원하는 언어로 채팅을 번역합니다."
    )
    @PostMapping("/translate")
    public Mono<ResponseEntity<ChatResponseDTO>> sendTranslateMessage(@RequestBody ChatRequestDTO chatRequestDTO) {
        return chatService.sendTranslateMessage(chatRequestDTO)
                .map(ResponseEntity::ok);
    }

    @Operation(
            summary = "AI(페르소나) 채팅 API",
            description = "가상의 AI(임대인)과의 채팅을 진행합니다."
    )
    @PostMapping
    public Mono<ResponseEntity<ChatResponseDTO>> sendMessage(@RequestBody ChatRequestMessageDTO chatRequestMessageDTO) {
        return chatService.sendMessage(chatRequestMessageDTO)
                .map(ResponseEntity::ok);
    }
}