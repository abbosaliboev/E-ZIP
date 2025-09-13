package com.konnection.backend.api.review.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReviewCreateRequest {

    @Schema(description = "리뷰 대상 방 ID", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer roomId;

    @Schema(description = "작성자명", example = "홍길동")
    private String name;

    @Schema(description = "검수 여부", example = "true")
    private boolean reviewed;

    @Schema(description = "리뷰 본문")
    private String content;
}