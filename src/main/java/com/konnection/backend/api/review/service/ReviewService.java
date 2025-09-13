package com.konnection.backend.api.review.service;

import com.konnection.backend.api.review.dto.ReviewCreateRequest;
import com.konnection.backend.api.review.dto.ReviewResponse;
import com.konnection.backend.api.review.dto.ReviewUpdateRequest;
import com.konnection.backend.api.review.entity.Review;
import com.konnection.backend.api.review.repository.ReviewRepository;
import com.konnection.backend.api.room.entity.Room;
import com.konnection.backend.api.room.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public ReviewResponse create(ReviewCreateRequest req) {
        if (req.getRoomId() == null) {
            throw new IllegalArgumentException("roomId는 필수입니다.");
        }
        Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 방입니다. id=" + req.getRoomId()));

        Review review = Review.builder()
                .room(room)
                .name(req.getName())
                .reviewed(req.isReviewed())
                .content(req.getContent())
                .build();

        return ReviewResponse.from(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse update(Long reviewId, ReviewUpdateRequest req) {
        Review r = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다. id=" + reviewId));

        if (req.getName() != null) r.updateName(req.getName());
        r.updateReviewed(req.getReviewed());
        if (req.getContent() != null) r.updateContent(req.getContent());

        return ReviewResponse.from(r);
    }

    @Transactional
    public void delete(Long reviewId) {
        Review r = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다. id=" + reviewId));
        reviewRepository.delete(r);
    }

    /** 이름으로만 조회(필수). roomId가 있으면 추가로 방 기준도 함께 필터. 최신순 */
    @Transactional
    public List<ReviewResponse> listByName(String name, Integer roomId) {
        if (!StringUtils.hasText(name)) {
            throw new IllegalArgumentException("name 파라미터는 필수입니다.");
        }

        List<Review> reviews = (roomId == null)
                ? reviewRepository.findByNameOrderByCreatedAtDesc(name)
                : reviewRepository.findByNameAndRoom_RoomIdOrderByCreatedAtDesc(name, roomId);

        return reviews.stream().map(ReviewResponse::from).toList();
    }
}