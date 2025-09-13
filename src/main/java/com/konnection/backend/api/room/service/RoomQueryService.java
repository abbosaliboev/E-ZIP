package com.konnection.backend.api.room.service;

import com.konnection.backend.api.room.dto.RoomResponse;
import com.konnection.backend.api.room.dto.RoomSearchRequest;
import com.konnection.backend.api.room.entity.Room;
import com.konnection.backend.api.room.repository.RoomRepository;
import com.konnection.backend.api.room.spec.RoomSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomQueryService {

    private final RoomRepository roomRepository;

    /** 페이지네이션 제거: 전체 리스트 반환 + createdAt DESC 정렬 */
    public List<RoomResponse> search(RoomSearchRequest request) {
        List<Room> rooms = roomRepository.findAll(
                RoomSpecifications.filter(request),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return rooms.stream()
                .map(RoomResponse::from)
                .toList();
    }
}