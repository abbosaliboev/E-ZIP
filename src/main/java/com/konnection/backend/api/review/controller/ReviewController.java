package com.konnection.backend.api.review.controller;

import com.konnection.backend.api.review.dto.ReviewCreateRequest;
import com.konnection.backend.api.review.dto.ReviewResponse;
import com.konnection.backend.api.review.dto.ReviewUpdateRequest;
import com.konnection.backend.api.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Review", description = "리뷰 관련 API 입니다.")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "리뷰 작성", description = "roomId를 지정하여 해당 방에 대한 리뷰를 작성합니다.")
    @PostMapping
    public ResponseEntity<ReviewResponse> create(@RequestBody ReviewCreateRequest request) {
        return ResponseEntity.ok(reviewService.create(request));
    }

    @Operation(summary = "리뷰 수정", description = "리뷰 내용을 수정합니다.")
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> update(@PathVariable Long reviewId,
                                                 @RequestBody ReviewUpdateRequest request) {
        return ResponseEntity.ok(reviewService.update(reviewId, request));
    }

    @Operation(summary = "리뷰 삭제", description = "리뷰를 삭제합니다.")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> delete(@PathVariable Long reviewId) {
        reviewService.delete(reviewId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "리뷰 목록 조회(이름으로 필터, 최신순)",
            description = "name(필수)으로 해당 작성자의 리뷰만 최신순으로 반환. roomId가 있으면 해당 방으로 추가 필터합니다."
    )
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> list(@RequestParam String name,
                                                     @RequestParam(required = false) Integer roomId) {
        return ResponseEntity.ok(reviewService.listByName(name, roomId));
    }
}