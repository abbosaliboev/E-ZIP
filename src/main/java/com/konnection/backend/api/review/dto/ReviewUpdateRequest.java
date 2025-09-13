package com.konnection.backend.api.review.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReviewUpdateRequest {

    @Schema(description = "작성자명", example = "임꺽정")
    private String name;

    @Schema(description = "검수 여부", example = "false")
    private Boolean reviewed; // null이면 변경 안 함

    @Schema(description = "리뷰 본문")
    private String content;
}