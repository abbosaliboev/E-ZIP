package com.konnection.backend.api.chat.service;

import com.konnection.backend.api.chat.dto.ChatRequestDTO;
import com.konnection.backend.api.chat.dto.ChatRequestMessageDTO;
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

    public Mono<ChatResponseDTO> sendTranslateMessage(ChatRequestDTO chatRequestDTO) {
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

    public Mono<ChatResponseDTO> sendMessage(ChatRequestMessageDTO chatRequestMessageDTO) {
        if (chatRequestMessageDTO == null || !StringUtils.hasText(chatRequestMessageDTO.getMessage())) {
            return Mono.error(new IllegalArgumentException("message는 필수입니다."));
        }

        final String userMsg = chatRequestMessageDTO.getMessage().trim();

        // 페르소나 프롬프트
        final String persona = """
            당신은 대한민국에서 주거용 월세 매물을 보유한 임대인/중개인 역할의 상담원입니다.
            목표: 사용자가 편하게 느끼는 자연스러운 한국어 대화를 제공합니다.

            [스타일 가이드]
            - 반드시 한국어로만, 존댓말로 짧고 구어체(사람 말투)로 답합니다.
            - 문장은 1~3문장 이내로, 필요하면 마지막에 "한 가지"만 간단히 되묻습니다.
            - 사용자가 인사하면 같은 인사로 시작합니다. (예: "안녕하세요" → "안녕하세요!")
            - 사용자가 “볼 수 있을까요/가능할까요/남아있나요?” 라고 물으면, 먼저 짧게 “네/아직 가능합니다/남아 있어요”로 대답하고,
              다음 행동(방문 일정/원하는 시간대/연락 방법 등)을 한 문장으로 제안합니다.
            - 과장/장황한 소개, 스크립트 같은 톤, 불필요한 안내문구(예: 장문의 조건 나열/법률 고지)는 피합니다.
            - 이미 사용자가 말한 정보는 반복하지 않습니다. 이모티콘/이모지는 사용하지 않습니다.

            [대화 예시]
            - 사용자: "안녕하세요"
              당신: "안녕하세요! 어느 동네 쪽으로 보시나요?"
            - 사용자: "혹시 방 매물 볼 수 있을까요?"
              당신: "네, 아직 남아 있어요. 언제 한번 보러 오시겠어요?"
            - 사용자: "주변에 지하철 있어요?"
              당신: "네, 2호선 OOO역 도보 7분이에요. 역세권 원하시면 다른 매물도 같이 보여드릴까요?"
            - 사용자: "보증금 낮추고 월세 올리는 거 가능해요?"
              당신: "네, 일정 범위에서 조정 가능해요. 희망 보증금/월세를 대략 어느 정도로 생각하시나요?"

            이제 아래 '사용자 메시지'에 자연스럽게 답하세요.
            - 답변은 간단명료하게 1~3문장.
            - 마지막에 필요한 경우에만 짧게 한 가지만 물어보기.
            """;

        final String prompt = persona + "\n\n[사용자 메시지]\n" + userMsg;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", prompt))
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.5, // 대화 톤에 약간의 자연스러움
                        "topK", 40,
                        "topP", 0.95,
                        "maxOutputTokens", 400  // 짧게 답
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
                                    return Mono.error(new IllegalStateException("채팅 서비스 호출 중 오류가 발생했습니다."));
                                })
                )
                .bodyToMono(GeminiResponse.class)
                .timeout(Duration.ofSeconds(30))
                .map(this::extractText)
                .filter(StringUtils::hasText)
                .switchIfEmpty(Mono.error(new IllegalStateException("유효한 답변을 받지 못했습니다.")))
                .map(txt -> ChatResponseDTO.builder().message(txt.trim()).build())
                .onErrorMap(WebClientResponseException.class,
                        e -> {
                            log.error("Gemini API status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString(), e);
                            return new IllegalStateException("채팅 서비스 호출 중 오류가 발생했습니다.", e);
                        })
                .onErrorMap(e -> {
                    log.error("Chat failed", e);
                    return new IllegalStateException("채팅 처리에 실패했습니다.", e);
                });
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