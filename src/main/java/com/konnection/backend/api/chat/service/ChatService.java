package com.konnection.backend.api.chat.service;

import com.konnection.backend.api.chat.dto.ChatRequestDTO;
import com.konnection.backend.api.chat.dto.ChatResponseDTO;
import com.konnection.backend.api.chat.dto.GeminiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {

    private final WebClient geminiWebClient;

    @Value("${google.ai.api-key}")
    private String apiKey;

    public Mono<ChatResponseDTO> sendMessage(ChatRequestDTO chatRequestDTO) {
        try {
            validate(chatRequestDTO);
        } catch (IllegalArgumentException e) {
            return Mono.error(e);
        }

        String targetLang = chatRequestDTO.getTranslateLanguage().trim();
        String original   = chatRequestDTO.getMessage().trim();

        String prompt = """
                You are a precise translator.
                Translate the following text into %s.
                Output ONLY the translation text. Do NOT add quotes, notes, or explanations.

                Text:
                %s
                """.formatted(targetLang, original);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", prompt))
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.2
                )
        );

        return geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/gemini-1.5-flash-latest:generateContent")
                        .queryParam("key", apiKey)
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus(
                        http -> http.is4xxClientError() || http.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .flatMap(err -> {
                                    log.error("Gemini API error body: {}", err);
                                    return Mono.error(new IllegalStateException("번역 서비스 호출 중 오류가 발생했습니다."));
                                })
                )
                .bodyToMono(GeminiResponse.class)
                .timeout(Duration.ofSeconds(30))
                .map(this::extractText)
                .filter(StringUtils::hasText)
                .switchIfEmpty(Mono.error(new IllegalStateException("Gemini가 유효한 번역을 반환하지 않았습니다.")))
                .map(txt -> ChatResponseDTO.builder().message(txt.trim()).build())
                .onErrorMap(WebClientResponseException.class,
                        e -> {
                            log.error("Gemini API status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString(), e);
                            return new IllegalStateException("번역 서비스 호출 중 오류가 발생했습니다.", e);
                        })
                .onErrorMap(e -> {
                    // 디버깅 편하게 원인 로깅
                    log.error("Translation failed", e);
                    return new IllegalStateException("번역 처리에 실패했습니다.", e);
                });
    }

    private void validate(ChatRequestDTO chatRequestDTO) {
        if (chatRequestDTO == null ||
                !StringUtils.hasText(chatRequestDTO.getTranslateLanguage()) ||
                !StringUtils.hasText(chatRequestDTO.getMessage())) {
            throw new IllegalArgumentException("translateLanguage와 message는 필수입니다.");
        }
    }

    private String extractText(GeminiResponse geminiResponse) {
        if (geminiResponse == null || geminiResponse.getCandidates() == null || geminiResponse.getCandidates().isEmpty())
            return null;

        GeminiResponse.Candidate c = geminiResponse.getCandidates().get(0);
        if (c.getContent() == null || c.getContent().getParts() == null || c.getContent().getParts().isEmpty())
            return null;

        return c.getContent().getParts().get(0).getText();
    }
}