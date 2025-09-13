package com.konnection.backend.api.review.repository;

import com.konnection.backend.api.review.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = "room")
    List<Review> findByNameOrderByCreatedAtDesc(String name);

    @EntityGraph(attributePaths = "room")
    List<Review> findByNameAndRoom_RoomIdOrderByCreatedAtDesc(String name, Integer roomId);
}