package com.konnection.backend.api.room.entity;

import com.konnection.backend.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "room")
public class Room extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roomId;

    // 주소/좌표
    @Column(length = 300, nullable = false)
    private String address;        // 도로명 주소 입력값 그대로 저장

    @Column
    private Double latitude;       // y (위도, EPSG:4326)
    @Column
    private Double longitude;      // x (경도, EPSG:4326)

    // 금액
    @Column(nullable = false)
    private Integer monthlyRent;       // 만원
    @Column(nullable = false)
    private Integer deposit;           // 만원
    @Column
    private Integer maintenanceFee;    // 원

    // 구조/면적
    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private RoomType roomType;
    @Column
    private Double areaM2;
    @Column
    private Integer roomCount;
    @Column
    private Integer bathroomCount;

    // 방향/난방/현관
    @Enumerated(EnumType.STRING) @Column(length = 20)
    private Direction direction;
    @Enumerated(EnumType.STRING) @Column(length = 30)
    private HeatingType heatingType;
    @Enumerated(EnumType.STRING) @Column(length = 30)
    private EntranceType entranceType;

    // 건축/승인/층수
    @Column(length = 100)
    private String buildingUse;
    @Column
    private LocalDate approvalDate;
    @Column
    private Integer floor;

    // 주차
    @Column
    private Boolean parkingAvailable;
    @Column
    private Integer totalParkingSpots;

    // 입주/설명
    @Column
    private LocalDate availableFrom;
    @Lob
    private String description;

    // 옵션/보안시설
    @ElementCollection
    @CollectionTable(name = "room_option", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "option_name", length = 100)
    @Builder.Default
    private List<String> options = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "room_security_facility", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "facility_name", length = 100)
    @Builder.Default
    private List<String> securityFacilities = new ArrayList<>();

    // 집주인
    @Column(length = 50)
    private String landlordName;
    @Column(length = 30)
    private String landlordPhone;
    @Column(length = 30)
    private String landlordBusinessRegNo;

    // 이미지
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<RoomImage> images = new ArrayList<>();

    public void addImage(RoomImage image) {
        images.add(image);
        image.setRoom(this);
    }

    /* ===== 부분 수정용 편의 메서드 ===== */
    public void updateAddress(String v) { this.address = v; }
    public void updateLatLon(Double lat, Double lon) { this.latitude = lat; this.longitude = lon; }

    public void updateMonthlyRent(Integer v) { this.monthlyRent = v; }
    public void updateDeposit(Integer v) { this.deposit = v; }
    public void updateMaintenanceFee(Integer v) { this.maintenanceFee = v; }

    public void updateRoomType(RoomType v) { this.roomType = v; }
    public void updateAreaM2(Double v) { this.areaM2 = v; }
    public void updateRoomCount(Integer v) { this.roomCount = v; }
    public void updateBathroomCount(Integer v) { this.bathroomCount = v; }

    public void updateDirection(Direction v) { this.direction = v; }
    public void updateHeatingType(HeatingType v) { this.heatingType = v; }
    public void updateEntranceType(EntranceType v) { this.entranceType = v; }

    public void updateBuildingUse(String v) { this.buildingUse = v; }
    public void updateApprovalDate(LocalDate v) { this.approvalDate = v; }
    public void updateFloor(Integer v) { this.floor = v; }

    public void updateParkingAvailable(Boolean v) { this.parkingAvailable = v; }
    public void updateTotalParkingSpots(Integer v) { this.totalParkingSpots = v; }

    public void updateAvailableFrom(LocalDate v) { this.availableFrom = v; }
    public void updateDescription(String v) { this.description = v; }

    public void replaceOptions(List<String> list) {
        this.options.clear();
        if (list != null) this.options.addAll(list);
    }
    public void replaceSecurityFacilities(List<String> list) {
        this.securityFacilities.clear();
        if (list != null) this.securityFacilities.addAll(list);
    }

    public void updateLandlordName(String v) { this.landlordName = v; }
    public void updateLandlordPhone(String v) { this.landlordPhone = v; }
    public void updateLandlordBizNo(String v) { this.landlordBusinessRegNo = v; }
}