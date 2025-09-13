package com.konnection.backend.api.room.dto;

import com.konnection.backend.api.room.entity.*;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter
public class RoomUpdateRequest {

    /* 주소(변경 시 좌표 재계산) */
    private String address;

    /* 금액 */
    private Integer monthlyRent;
    private Integer deposit;
    private Integer maintenanceFee;

    /* 구조/면적 */
    private RoomType roomType;
    private Double areaM2;
    private Integer roomCount;
    private Integer bathroomCount;

    /* 방향/난방/현관 */
    private Direction direction;
    private HeatingType heatingType;
    private EntranceType entranceType;

    /* 건축/승인/층수 */
    private String buildingUse;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate approvalDate;
    private Integer floor;

    /* 주차 */
    private Boolean parkingAvailable;
    private Integer totalParkingSpots;

    /* 입주/설명 */
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate availableFrom;
    private String description;

    /* 옵션/보안시설 */
    private List<String> options;
    private List<String> securityFacilities;

    /* 집주인 */
    private String landlordName;
    private String landlordPhone;
    private String landlordBusinessRegNo;

    /* 이미지 */
    @ArraySchema(schema = @Schema(type = "string", format = "binary"))
    private List<MultipartFile> newImages;
    private List<Long> deleteImageIds;

    /* S3 경로용 */
    private String uploaderId;
}