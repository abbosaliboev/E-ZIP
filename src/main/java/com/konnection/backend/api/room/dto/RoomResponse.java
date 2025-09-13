package com.konnection.backend.api.room.dto;

import com.konnection.backend.api.room.entity.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class RoomResponse {

    private Integer roomId;

    // 주소/좌표
    private String address;
    private Double latitude;
    private Double longitude;

    // 금액
    private Integer monthlyRent;
    private Integer deposit;
    private Integer maintenanceFee;

    // 구조/면적
    private RoomType roomType;
    private Double areaM2;
    private Integer roomCount;
    private Integer bathroomCount;

    // 방향/난방/현관
    private Direction direction;
    private HeatingType heatingType;
    private EntranceType entranceType;

    // 건축/승인/층수
    private String buildingUse;
    private LocalDate approvalDate;
    private Integer floor;

    // 주차
    private Boolean parkingAvailable;
    private Integer totalParkingSpots;

    // 입주/설명
    private LocalDate availableFrom;
    private String description;

    // 옵션/보안시설
    private List<String> options;
    private List<String> securityFacilities;

    // 집주인
    private String landlordName;
    private String landlordPhone;
    private String landlordBusinessRegNo;

    // 이미지
    private List<ImageDTO> images;

    // 메타
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Builder
    public static class ImageDTO {
        private Long id;
        private String url;
        private boolean thumbnail;
        private int sortOrder;
    }
}