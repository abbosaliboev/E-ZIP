package com.konnection.backend.api.room.repository;

import com.konnection.backend.api.room.entity.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
    List<RoomImage> findByRoom_RoomId(Integer roomId);
}