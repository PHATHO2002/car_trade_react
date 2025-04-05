import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { getCoordinatesApi } from '~/api/address'; // Hàm lấy tọa độ từ API

const TomTomMap = ({ address }) => {
    const mapElement = useRef(null);
    const mapRef = useRef(null);
    const [position, setPosition] = useState(null);
    const apiKey = process.env.REACT_APP_TOMTOM_API_KEY;
    const defaultLocation = [106.660172, 10.762622]; // Tọa độ mặc định (HCM)

    useEffect(() => {
        const fetchCoordinates = async () => {
            if (!address) return;
            try {
                const pos = await getCoordinatesApi(address);
                setPosition([pos.lon, pos.lat]); // Lưu tọa độ [lng, lat]
            } catch (error) {
                console.error('Lỗi lấy tọa độ:', error);
            }
        };

        fetchCoordinates();
    }, [address]);

    useEffect(() => {
        if (!mapElement.current) return;

        const center = position || defaultLocation;

        // Nếu map đã tồn tại, chỉ cập nhật center
        if (mapRef.current) {
            mapRef.current.setCenter(center);
            return;
        }

        const map = tt.map({
            key: apiKey,
            container: mapElement.current,
            center: center,
            zoom: 12,
        });

        mapRef.current = map;

        // 🏷️ Tạo icon marker
        const iconElement = document.createElement('div');
        iconElement.style.backgroundImage = "url('" + process.env.PUBLIC_URL + "/images/location_icon.png')";
        iconElement.style.width = '2rem';
        iconElement.style.height = '2rem';
        iconElement.style.backgroundSize = 'cover';

        // 📍 Thêm marker vào bản đồ
        new tt.Marker({ element: iconElement }).setLngLat(center).addTo(map);

        // 📌 Sự kiện click vào bản đồ
        map.on('click', (event) => {
            const { lng, lat } = event.lngLat;
            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [position]);

    return (
        <div
            ref={mapElement}
            style={{
                width: '100%',
                height: '40rem',
                marginTop: '1rem',
                padding: '1rem', // Khoảng cách bên trong
                border: '0.2rm solid #ccc', // Viền màu xám nhạt
                borderRadius: '1rem', // Bo góc nhẹ
                boxShadow: '0 0.4rem 0.8rem rgba(0, 0, 0, 0.1)', // Hiệu ứng đổ bóng
            }}
        />
    );
};

export default TomTomMap;
