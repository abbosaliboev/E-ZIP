package com.konnection.backend.api.room.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class RoomSearchRequest {

    @Schema(description = "Location(주소) 부분일치 검색 문자열", example = "강남")
    private String location;

    @Schema(description = "월세 최솟값(만원)", example = "30")
    private Integer monthlyMin;

    @Schema(description = "월세 최댓값(만원)", example = "80")
    private Integer monthlyMax;

    @Schema(description = "보증금 최솟값(만원)", example = "0")
    private Integer depositMin;

    @Schema(description = "보증금 최댓값(만원)", example = "2000")
    private Integer depositMax;

    @Schema(description = "층 필터 (ONE, TWO, THREE_PLUS)", example = "THREE_PLUS")
    private FloorFilter floor = FloorFilter.ANY;

    @Schema(description = "주차 가능만 보기", example = "true")
    private Boolean parkingOnly = false;

    public enum FloorFilter {
        ANY, ONE, TWO, THREE_PLUS;

        public static FloorFilter parse(String s) {
            if (!StringUtils.hasText(s)) return ANY;
            s = s.trim().toUpperCase();
            // "1", "1층" 등도 허용
            if (s.equals("1") || s.equals("1층") || s.equals("ONE")) return ONE;
            if (s.equals("2") || s.equals("2층") || s.equals("TWO")) return TWO;
            if (s.equals("3") || s.equals("3층") || s.equals("3+") || s.equals("3PLUS") || s.equals("THREE_PLUS")) return THREE_PLUS;
            return ANY;
        }
    }
}