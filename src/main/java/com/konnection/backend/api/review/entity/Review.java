package com.konnection.backend.api.review.entity;

import com.konnection.backend.api.room.entity.Room;
import com.konnection.backend.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "review")
public class Review extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    private String name;
    private boolean reviewed;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String content;

    // 편의 메서드
    public void updateName(String v) { this.name = v; }
    public void updateReviewed(Boolean v) { if (v != null) this.reviewed = v; }
    public void updateContent(String v) { this.content = v; }
}