package com.konnection.backend.api.room.spec;

import com.konnection.backend.api.room.dto.RoomSearchRequest;
import com.konnection.backend.api.room.entity.Room;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public final class RoomSpecifications {

    private RoomSpecifications() {}

    public static Specification<Room> filter(RoomSearchRequest req) {
        return (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            // Location LIKE (address 컬럼)
            if (StringUtils.hasText(req.getLocation())) {
                String like = "%" + req.getLocation().trim().toLowerCase() + "%";
                preds.add(cb.like(cb.lower(root.get("address")), like));
            }

            // 월세 구간
            if (req.getMonthlyMin() != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("monthlyRent"), req.getMonthlyMin()));
            }
            if (req.getMonthlyMax() != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("monthlyRent"), req.getMonthlyMax()));
            }

            // 보증금 구간
            if (req.getDepositMin() != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("deposit"), req.getDepositMin()));
            }
            if (req.getDepositMax() != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("deposit"), req.getDepositMax()));
            }

            // 층 필터
            RoomSearchRequest.FloorFilter floor = req.getFloor();
            if (floor != null) {
                switch (floor) {
                    case ONE -> preds.add(cb.equal(root.get("floor"), 1));
                    case TWO -> preds.add(cb.equal(root.get("floor"), 2));
                    case THREE_PLUS -> preds.add(cb.greaterThanOrEqualTo(root.get("floor"), 3));
                    case ANY -> { /* no-op */ }
                }
            }

            // 주차 가능만 보기
            if (Boolean.TRUE.equals(req.getParkingOnly())) {
                preds.add(cb.isTrue(root.get("parkingAvailable")));
            }

            return cb.and(preds.toArray(new Predicate[0]));
        };
    }
}