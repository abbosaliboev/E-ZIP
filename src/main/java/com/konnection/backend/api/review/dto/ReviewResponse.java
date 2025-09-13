package com.konnection.backend.api.review.dto;

import com.konnection.backend.api.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
public class ReviewResponse {

    private Long reviewId;

    private Integer roomId;

    /** 이제 "시/도 + 시 + 구/군"까지 반환 (예: "서울특별시 강남구", "충청북도 청주시 흥덕구") */
    private String roomAddressGuDong;

    private String name;
    private boolean reviewed;
    private String content;

    private LocalDateTime createdAt;

    public static ReviewResponse from(Review r) {
        return ReviewResponse.builder()
                .reviewId(r.getReviewId())
                .roomId(r.getRoom().getRoomId())
                .roomAddressGuDong(extractRegionUpToGu(r.getRoom().getAddress()))
                .name(r.getName())
                .reviewed(r.isReviewed())
                .content(r.getContent())
                .createdAt(r.getCreatedAt())
                .build();
    }

    /**
     * 주소에서 "시/도 + 시 + 구/군"까지 추출해서 반환.
     *
     * 규칙:
     *  - 괄호(...) 안 내용 제거
     *  - 토큰을 공백으로 분리
     *  - 선두의 "대한민국"은 무시
     *  - "구" 또는 "군"을 처음 만나는 시점까지의 토큰을 그대로 합쳐 반환
     *  - "구/군"이 없으면 "시"까지 반환 (예: "세종특별자치시", "제주시")
     *  - 그것도 없으면 원본(괄호 제거, 공백 정리된) 주소를 반환
     *
     * 예)
     *  - "서울시 강남구 봉은사로 524" -> "서울시 강남구"
     *  - "서울특별시 강남구 봉은사로" -> "서울특별시 강남구"
     *  - "충청북도 청주시 흥덕구 덕암로108번길 44" -> "충청북도 청주시 흥덕구"
     *  - "대한민국 제주특별자치도 제주시 애월읍 ..." -> "제주특별자치도 제주시"
     */
    static String extractRegionUpToGu(String address) {
        if (address == null || address.isBlank()) return null;

        // 1) 괄호 제거
        String cleaned = address.replaceAll("\\(.*?\\)", "");
        // 2) 공백 정리
        cleaned = cleaned.replaceAll("\\s+", " ").trim();

        String[] tokens = cleaned.split(" ");
        if (tokens.length == 0) return cleaned;

        List<String> collected = new ArrayList<>();
        for (String t : tokens) {
            if (t.equals("대한민국")) continue; // 국가 이름은 제외
            collected.add(t);
            if (t.endsWith("구") || t.endsWith("군")) {
                // "구/군"을 만나면 거기까지 반환
                return String.join(" ", collected);
            }
        }

        // "구/군"이 없으면 "시"까지 반환 시도
        int siIdx = -1;
        for (int i = 0; i < tokens.length; i++) {
            String t = tokens[i];
            if (t.equals("대한민국")) continue;
            if (t.endsWith("시")) {
                siIdx = i;
                break;
            }
        }
        if (siIdx >= 0) {
            List<String> upToSi = new ArrayList<>();
            for (int i = 0; i <= siIdx; i++) {
                if (!tokens[i].equals("대한민국")) {
                    upToSi.add(tokens[i]);
                }
            }
            if (!upToSi.isEmpty()) {
                return String.join(" ", upToSi);
            }
        }

        // 최후: 구/군/시 못 찾으면 정리된 주소 전체 반환
        return cleaned;
    }
}