// src/utils/geoFallback.js
// Address ichidan shahar/provinsiya nomini qidirib, lat/lng qaytaradi.
// Eslatma: bu faqat fallback, aniq manzil uchun backend geocoding zarur.
const DB = [
    { key: 'seoul', lat: 37.5665, lng: 126.9780 },
    { key: 'busan', lat: 35.1796, lng: 129.0756 },
    { key: 'incheon', lat: 37.4563, lng: 126.7052 },
    { key: 'daegu', lat: 35.8714, lng: 128.6014 },
    { key: 'daejeon', lat: 36.3504, lng: 127.3845 },
    { key: 'gwangju', lat: 35.1595, lng: 126.8526 },
    { key: 'ulsan', lat: 35.5384, lng: 129.3114 },
    { key: 'sejong', lat: 36.4800, lng: 127.2890 },
    { key: 'cheongju', lat: 36.6424, lng: 127.4890 },
    { key: 'cheonan', lat: 36.8151, lng: 127.1139 },
    { key: 'jeonju', lat: 35.8242, lng: 127.1480 },
    { key: 'yeosu', lat: 34.7604, lng: 127.6622 },
    { key: 'pohang', lat: 36.0190, lng: 129.3435 },
    { key: 'gyeongju', lat: 35.8562, lng: 129.2247 },
    { key: 'changwon', lat: 35.2281, lng: 128.6811 },
    { key: 'gimhae', lat: 35.2285, lng: 128.8890 },
    { key: 'jeju', lat: 33.4996, lng: 126.5312 },
    { key: 'seogwipo', lat: 33.2539, lng: 126.5600 },
    // Seoul ichidagi mashhur hududlar (qo‘shimcha qulaylik)
    { key: 'gangnam', lat: 37.4979, lng: 127.0276 },
    { key: 'hongdae', lat: 37.5563, lng: 126.9237 },
    { key: 'jamsil', lat: 37.5133, lng: 127.1002 },
    // Busan hududlari
    { key: 'haeundae', lat: 35.1631, lng: 129.1635 },
    { key: 'gwangan', lat: 35.1532, lng: 129.1187 },
    { key: 'seomyeon', lat: 35.1576, lng: 129.0597 },
  ];
  
  export function geocodeFallback(address) {
    if (!address) return null;
    const a = address.toLowerCase();
    const hit = DB.find(({ key }) => a.includes(key));
    return hit ? { lat: hit.lat, lng: hit.lng } : null;
  }