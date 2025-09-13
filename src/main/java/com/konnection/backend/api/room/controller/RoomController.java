package com.konnection.backend.api.room.controller;

import com.konnection.backend.api.room.dto.RoomCreateRequest;
import com.konnection.backend.api.room.dto.RoomResponse;
import com.konnection.backend.api.room.dto.RoomUpdateRequest;
import com.konnection.backend.api.room.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@Tag(name = "Room", description = "매물 관련 API 입니다.")
public class RoomController {

    private final RoomService roomService;

    @Operation(summary = "매물 등록", description = "주소 기반으로 위도/경도를 자동 저장합니다. (이미지는 multipart/form-data)")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RoomResponse> create(@ModelAttribute RoomCreateRequest request) throws IOException {
        return ResponseEntity.ok(roomService.create(request));
    }

    @Operation(summary = "매물 상세 조회", description = "roomId로 매물 상세를 조회합니다.")
    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> get(@PathVariable Integer roomId) {
        return ResponseEntity.ok(roomService.get(roomId));
    }

    @Operation(summary = "매물 목록 조회", description = "매물 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<RoomResponse>> list() {
        return ResponseEntity.ok(roomService.list());
    }

    @Operation(summary = "매물 수정", description = "주소 변경 시 좌표를 재계산합니다. (이미지 추가/삭제 가능, multipart/form-data)")
    @PutMapping(value = "/{roomId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RoomResponse> update(@PathVariable Integer roomId,
                                               @ModelAttribute RoomUpdateRequest request) throws IOException {
        return ResponseEntity.ok(roomService.update(roomId, request));
    }

    @Operation(summary = "매물 삭제", description = "연결된 이미지도 S3에서 함께 삭제합니다.")
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> delete(@PathVariable Integer roomId) {
        roomService.delete(roomId);
        return ResponseEntity.noContent().build();
    }
}