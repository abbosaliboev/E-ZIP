package com.konnection.backend.api.room.service;

import com.konnection.backend.api.aws.s3.S3Service;
import com.konnection.backend.api.room.service.GeoService;
import com.konnection.backend.api.room.dto.RoomCreateRequest;
import com.konnection.backend.api.room.dto.RoomResponse;
import com.konnection.backend.api.room.dto.RoomUpdateRequest;
import com.konnection.backend.api.room.entity.Room;
import com.konnection.backend.api.room.entity.RoomImage;
import com.konnection.backend.api.room.repository.RoomImageRepository;
import com.konnection.backend.api.room.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomImageRepository roomImageRepository;
    private final S3Service s3Service;
    private final GeoService geoService;

    @Transactional
    public RoomResponse create(RoomCreateRequest req) throws IOException {
        if (req.getAddress() == null || req.getAddress().isBlank())
            throw new IllegalArgumentException("주소는 필수입니다.");

        // 주소→좌표
        GeoService.Coord coord = geoService.geocodeRoadAddress(req.getAddress());

        Room room = Room.builder()
                .address(req.getAddress())
                .latitude(coord != null ? coord.lat() : null)
                .longitude(coord != null ? coord.lon() : null)
                .monthlyRent(req.getMonthlyRent())
                .deposit(req.getDeposit())
                .maintenanceFee(req.getMaintenanceFee())
                .roomType(req.getRoomType())
                .areaM2(req.getAreaM2())
                .roomCount(req.getRoomCount())
                .bathroomCount(req.getBathroomCount())
                .direction(req.getDirection())
                .heatingType(req.getHeatingType())
                .entranceType(req.getEntranceType())
                .buildingUse(req.getBuildingUse())
                .approvalDate(req.getApprovalDate())
                .floor(req.getFloor())
                .parkingAvailable(req.getParkingAvailable())
                .totalParkingSpots(req.getTotalParkingSpots())
                .availableFrom(req.getAvailableFrom())
                .description(req.getDescription())
                .options(req.getOptions() == null ? new ArrayList<>() : new ArrayList<>(req.getOptions()))
                .securityFacilities(req.getSecurityFacilities() == null ? new ArrayList<>() : new ArrayList<>(req.getSecurityFacilities()))
                .landlordName(req.getLandlordName())
                .landlordPhone(req.getLandlordPhone())
                .landlordBusinessRegNo(req.getLandlordBusinessRegNo())
                .build();

        roomRepository.save(room);

        // 이미지 업로드
        List<MultipartFile> files = req.getImages();
        if (!CollectionUtils.isEmpty(files)) {
            String uploader = (req.getUploaderId() != null && !req.getUploaderId().isBlank())
                    ? req.getUploaderId() : "room-" + room.getRoomId();

            List<String> urls = s3Service.uploadMemoImages(uploader, files);
            int i = 0;
            for (String url : urls) {
                room.addImage(RoomImage.builder()
                        .url(url)
                        .thumbnail(i == 0)
                        .sortOrder(i++)
                        .room(room)
                        .build());
            }
        }

        return toResponse(roomRepository.save(room));
    }

    @Transactional
    public RoomResponse update(Integer roomId, RoomUpdateRequest req) throws IOException {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 매물입니다. id=" + roomId));

        // 주소 변경 → 좌표 재계산
        if (req.getAddress() != null && !req.getAddress().isBlank()) {
            room.updateAddress(req.getAddress());
            GeoService.Coord coord = geoService.geocodeRoadAddress(req.getAddress());
            if (coord != null) room.updateLatLon(coord.lat(), coord.lon());
            else room.updateLatLon(null, null);
        }

        if (req.getMonthlyRent() != null) room.updateMonthlyRent(req.getMonthlyRent());
        if (req.getDeposit() != null) room.updateDeposit(req.getDeposit());
        if (req.getMaintenanceFee() != null) room.updateMaintenanceFee(req.getMaintenanceFee());

        if (req.getRoomType() != null) room.updateRoomType(req.getRoomType());
        if (req.getAreaM2() != null) room.updateAreaM2(req.getAreaM2());
        if (req.getRoomCount() != null) room.updateRoomCount(req.getRoomCount());
        if (req.getBathroomCount() != null) room.updateBathroomCount(req.getBathroomCount());

        if (req.getDirection() != null) room.updateDirection(req.getDirection());
        if (req.getHeatingType() != null) room.updateHeatingType(req.getHeatingType());
        if (req.getEntranceType() != null) room.updateEntranceType(req.getEntranceType());

        if (req.getBuildingUse() != null) room.updateBuildingUse(req.getBuildingUse());
        if (req.getApprovalDate() != null) room.updateApprovalDate(req.getApprovalDate());
        if (req.getFloor() != null) room.updateFloor(req.getFloor());

        if (req.getParkingAvailable() != null) room.updateParkingAvailable(req.getParkingAvailable());
        if (req.getTotalParkingSpots() != null) room.updateTotalParkingSpots(req.getTotalParkingSpots());

        if (req.getAvailableFrom() != null) room.updateAvailableFrom(req.getAvailableFrom());
        if (req.getDescription() != null) room.updateDescription(req.getDescription());

        if (req.getOptions() != null) room.replaceOptions(req.getOptions());
        if (req.getSecurityFacilities() != null) room.replaceSecurityFacilities(req.getSecurityFacilities());

        if (req.getLandlordName() != null) room.updateLandlordName(req.getLandlordName());
        if (req.getLandlordPhone() != null) room.updateLandlordPhone(req.getLandlordPhone());
        if (req.getLandlordBusinessRegNo() != null) room.updateLandlordBizNo(req.getLandlordBusinessRegNo());

        // 이미지 삭제
        if (!CollectionUtils.isEmpty(req.getDeleteImageIds())) {
            var images = roomImageRepository.findAllById(req.getDeleteImageIds());
            for (var img : images) {
                if (img.getRoom().getRoomId() != roomId) continue;
                s3Service.deleteFile(img.getUrl());
                room.getImages().remove(img);
                roomImageRepository.delete(img);
            }
        }

        // 이미지 추가
        if (!CollectionUtils.isEmpty(req.getNewImages())) {
            String uploader = (req.getUploaderId() != null && !req.getUploaderId().isBlank())
                    ? req.getUploaderId() : "room-" + room.getRoomId();
            int startOrder = room.getImages().size();
            List<String> urls = s3Service.uploadMemoImages(uploader, req.getNewImages());
            int i = 0;
            for (String url : urls) {
                room.addImage(RoomImage.builder()
                        .url(url)
                        .thumbnail(false)
                        .sortOrder(startOrder + (i++))
                        .room(room)
                        .build());
            }
        }

        return toResponse(roomRepository.save(room));
    }

    @Transactional
    public void delete(Integer roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 매물입니다. id=" + roomId));
        room.getImages().forEach(img -> s3Service.deleteFile(img.getUrl()));
        roomRepository.delete(room);
    }

    @Transactional
    public RoomResponse get(Integer roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 매물입니다. id=" + roomId));
        return toResponse(room);
    }

    @Transactional
    public List<RoomResponse> list() {
        return roomRepository.findAll().stream().map(this::toResponse).toList();
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .roomId(room.getRoomId())
                .address(room.getAddress())
                .latitude(room.getLatitude())
                .longitude(room.getLongitude())
                .monthlyRent(room.getMonthlyRent())
                .deposit(room.getDeposit())
                .maintenanceFee(room.getMaintenanceFee())
                .roomType(room.getRoomType())
                .areaM2(room.getAreaM2())
                .roomCount(room.getRoomCount())
                .bathroomCount(room.getBathroomCount())
                .direction(room.getDirection())
                .heatingType(room.getHeatingType())
                .entranceType(room.getEntranceType())
                .buildingUse(room.getBuildingUse())
                .approvalDate(room.getApprovalDate())
                .floor(room.getFloor())
                .parkingAvailable(room.getParkingAvailable())
                .totalParkingSpots(room.getTotalParkingSpots())
                .availableFrom(room.getAvailableFrom())
                .description(room.getDescription())
                .options(room.getOptions())
                .securityFacilities(room.getSecurityFacilities())
                .landlordName(room.getLandlordName())
                .landlordPhone(room.getLandlordPhone())
                .landlordBusinessRegNo(room.getLandlordBusinessRegNo())
                .images(room.getImages().stream()
                        .map(img -> RoomResponse.ImageDTO.builder()
                                .id(img.getId())
                                .url(img.getUrl())
                                .thumbnail(img.isThumbnail())
                                .sortOrder(img.getSortOrder())
                                .build())
                        .toList())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }
}