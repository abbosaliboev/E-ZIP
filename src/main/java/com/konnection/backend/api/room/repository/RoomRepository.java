package com.konnection.backend.api.room.repository;

import com.konnection.backend.api.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Integer> {

}