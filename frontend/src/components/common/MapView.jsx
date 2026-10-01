import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/**
 * Reusable MapLibre GL component using OpenFreeMap Liberty style
 */
export const MapView = ({
  center = [-122.4194, 37.7749], // [longitude, latitude]
  zoom = 12,
  markers = [], // [{ lng, lat, title, description, color, isVehicle }]
  routeCoordinates = null, // [[lng, lat], ...]
  onLocationSelect = null, // (coords: { lat, lng, name }) => void
  interactive = true,
  height = '400px',
  className = '',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre map with OpenFreeMap liberty style
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: center,
      zoom: zoom,
      attributionControl: false,
    });

    // Add navigation and zoom controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    // Add custom attribution as required
    map.addControl(
      new maplibregl.AttributionControl({
        customAttribution: '© <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }),
      'bottom-right'
    );

    mapInstanceRef.current = map;

    // Handle interactive coordinate picking if handler provided
    if (onLocationSelect) {
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onLocationSelect({
          latitude: Math.round(lat * 10000) / 10000,
          longitude: Math.round(lng * 10000) / 10000,
          name: `Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        });
      });
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
    };
  }, []);

  // Update center when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.easeTo({
        center: center,
        duration: 1000,
      });
    }
  }, [center[0], center[1], zoom]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markers.forEach((m) => {
      if (!m.lng || !m.lat) return;

      const el = document.createElement('div');
      el.className = 'custom-map-marker';

      if (m.isVehicle) {
        el.innerHTML = `
          <div style="background: #0284c7; border: 2px solid #ffffff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px #38bdf8; transform: scale(1); transition: all 0.3s ease;">
            <span style="font-size: 20px;">🚗</span>
          </div>
        `;
      } else {
        const markerColor = m.color || '#0ea5e9';
        el.innerHTML = `
          <div style="background: ${markerColor}; border: 2px solid #ffffff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        `;
      }

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: inherit;">
          <h4 style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #f8fafc;">${m.title || 'Location'}</h4>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">${m.description || `Lat: ${m.lat.toFixed(4)}, Lng: ${m.lng.toFixed(4)}`}</p>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([m.lng, m.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [markers]);

  // Draw Route Polyline if provided
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !routeCoordinates || routeCoordinates.length < 2) return;

    const drawRoute = () => {
      if (map.getSource('route')) {
        map.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        });
      } else {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates,
            },
          },
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#0ea5e9',
            'line-width': 5,
            'line-opacity': 0.85,
            'line-dasharray': [1, 1.5],
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      drawRoute();
    } else {
      map.on('load', drawRoute);
    }
  }, [routeCoordinates]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}>
      <div ref={mapContainerRef} style={{ width: '100%', height }} />
    </div>
  );
};
