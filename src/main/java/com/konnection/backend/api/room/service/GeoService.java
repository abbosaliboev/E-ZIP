package com.konnection.backend.api.room.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeoService {

    private final WebClient.Builder webClientBuilder;

    @Value("${geo.apikey}")
    private String apiKey;

    /** 도로명 주소 → EPSG:4326 좌표(위도/경도). 실패 시 null */
    public Coord geocodeRoadAddress(String address) {
        try {
            WebClient client = webClientBuilder.baseUrl("https://api.vworld.kr").build();

            VWorldResponse res = client.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/req/address")
                            .queryParam("service", "address")
                            .queryParam("request", "GetCoord")
                            .queryParam("version", "2.0")
                            .queryParam("format", "json")
                            .queryParam("crs", "epsg:4326")
                            .queryParam("type", "ROAD")
                            .queryParam("address", address)
                            .queryParam("refine", "true")
                            .queryParam("simple", "false")
                            .queryParam("key", apiKey)
                            .build())
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .bodyToMono(VWorldResponse.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (res == null || res.response == null) return null;
            if (!"OK".equalsIgnoreCase(res.response.status)) return null;
            if (res.response.result == null || res.response.result.point == null) return null;

            double lon = Double.parseDouble(res.response.result.point.x); // x=경도
            double lat = Double.parseDouble(res.response.result.point.y); // y=위도
            return new Coord(lat, lon);

        } catch (Exception e) {
            log.warn("Geocoding failed. address={}, msg={}", address, e.getMessage());
            return null;
        }
    }

    /** 위도/경도 DTO */
    public record Coord(Double lat, Double lon) {}

    /** VWorld 응답 최소 파서 */
    @Data
    public static class VWorldResponse {
        private Resp response;

        @Data public static class Resp {
            private String status;
            private Result result;
        }
        @Data public static class Result {
            private String crs;
            private Point point;
        }
        @Data public static class Point {
            private String x; // 경도
            private String y; // 위도
        }
    }
}