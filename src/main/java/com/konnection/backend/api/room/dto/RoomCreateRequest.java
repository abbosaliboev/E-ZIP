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
public class RoomCreateRequest {

    @Schema(description = "S3 경로용 업로더 식별자")
    private String uploaderId;

    /* 주소 */
    @Schema(description = "도로명 주소", requiredMode = Schema.RequiredMode.REQUIRED)
    private String address;

    /* 금액 */
    @Schema(description = "월세(만원)", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer monthlyRent;
    @Schema(description = "보증금(만원)", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer deposit;
    @Schema(description = "관리비(원)")
    private Integer maintenanceFee;

    /* 구조/면적 */
    @Schema(description = "방 종류", example = "ONE_ROOM", requiredMode = Schema.RequiredMode.REQUIRED)
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
    private List<MultipartFile> images;
}