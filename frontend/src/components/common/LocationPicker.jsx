import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_CENTER = [78.4867, 17.3850]; // Hyderabad

const LocationPicker = ({
  type = 'pickup',
  value,
  onChange,
  height = '320px',
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchTimerRef = useRef(null);

  const [searchText, setSearchText] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  const isPickup = type === 'pickup';

  const markerColor = isPickup ? '#22c55e' : '#ef4444';

  /*
   * OpenFreeMap provides the map tiles.
   * Nominatim is used only for searching/reverse-geocoding locations.
   */
  const mapStyle = 'https://tiles.openfreemap.org/styles/liberty';

  // ---------------------------------------------------------
  // Reverse geocode: coordinates -> readable address
  // ---------------------------------------------------------
  const reverseGeocode = async (lng, lat) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();

      return {
        name:
          data.display_name ||
          `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: Number(lat),
        longitude: Number(lng),
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);

      return {
        name: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: Number(lat),
        longitude: Number(lng),
      };
    }
  };

  // ---------------------------------------------------------
  // Search locations
  // ---------------------------------------------------------
  const searchLocations = async (query) => {
    if (!query.trim() || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error('Location search failed');
      }

      const data = await response.json();

      setSuggestions(
        data.map((item) => ({
          name: item.display_name,
          latitude: Number(item.lat),
          longitude: Number(item.lon),
        }))
      );
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  };

  // ---------------------------------------------------------
  // Create / update marker
  // ---------------------------------------------------------
  const updateMarker = (lng, lat) => {
    if (!mapRef.current) return;

    if (!markerRef.current) {
      const element = document.createElement('div');

      element.style.width = '22px';
      element.style.height = '22px';
      element.style.borderRadius = '50%';
      element.style.background = markerColor;
      element.style.border = '4px solid white';
      element.style.boxShadow = '0 2px 10px rgba(0,0,0,0.45)';
      element.style.cursor = 'grab';

      markerRef.current = new maplibregl.Marker({
        element,
        draggable: true,
      })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      markerRef.current.on('dragend', async () => {
        const position = markerRef.current.getLngLat();

        const location = await reverseGeocode(
          position.lng,
          position.lat
        );

        setSearchText(location.name);

        onChange?.(location);
      });
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
  };

  // ---------------------------------------------------------
  // Initialize map
  // ---------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLng =
      Number(value?.longitude) || DEFAULT_CENTER[0];

    const initialLat =
      Number(value?.latitude) || DEFAULT_CENTER[1];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [initialLng, initialLat],
      zoom: value?.latitude ? 14 : 11,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );

    map.on('load', () => {
      updateMarker(initialLng, initialLat);
    });

    // Click map -> lock location
    map.on('click', async (event) => {
      const { lng, lat } = event.lngLat;

      updateMarker(lng, lat);

      const location = await reverseGeocode(lng, lat);

      setSearchText(location.name);

      onChange?.(location);
    });

    mapRef.current = map;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ---------------------------------------------------------
  // Update marker when parent value changes
  // ---------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;

    if (
      value?.latitude !== undefined &&
      value?.longitude !== undefined
    ) {
      const lng = Number(value.longitude);
      const lat = Number(value.latitude);

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        updateMarker(lng, lat);

        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 800,
        });

        setSearchText(value.name || '');
      }
    }
  }, [
    value?.latitude,
    value?.longitude,
    value?.name,
  ]);

  // ---------------------------------------------------------
  // Search input handler
  // ---------------------------------------------------------
  const handleSearchChange = (event) => {
    const query = event.target.value;

    setSearchText(query);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      searchLocations(query);
    }, 500);
  };

  // ---------------------------------------------------------
  // Select search result
  // ---------------------------------------------------------
  const handleSelectLocation = (location) => {
    setSearchText(location.name);
    setSuggestions([]);

    onChange?.(location);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [
          location.longitude,
          location.latitude,
        ],
        zoom: 15,
        duration: 1000,
      });

      updateMarker(
        location.longitude,
        location.latitude
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Search box */}
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder={
            isPickup
              ? 'Search pickup location...'
              : 'Search drop-off location...'
          }
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 pr-10 text-white focus:outline-none focus:border-sky-500"
        />

        {searching && (
          <div className="absolute right-3 top-3 text-xs text-slate-400">
            Searching...
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
            {suggestions.map((location, index) => (
              <button
                key={`${location.latitude}-${location.longitude}-${index}`}
                type="button"
                onClick={() =>
                  handleSelectLocation(location)
                }
                className="w-full text-left px-4 py-3 hover:bg-slate-800 border-b border-slate-800 last:border-b-0"
              >
                <div className="text-sm text-white">
                  {location.name}
                </div>

                <div className="text-[10px] text-slate-500 mt-1">
                  {location.latitude.toFixed(6)},{' '}
                  {location.longitude.toFixed(6)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div
        ref={mapContainerRef}
        style={{
          height,
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #1e293b',
        }}
      />

      {/* Selected coordinates */}
      {value?.latitude !== undefined &&
        value?.longitude !== undefined && (
          <div className="text-[11px] text-slate-400">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: markerColor }}
            />

            Location locked:

            <span className="text-slate-300 ml-1">
              {Number(value.latitude).toFixed(6)},{' '}
              {Number(value.longitude).toFixed(6)}
            </span>
          </div>
        )}
    </div>
  );
};

export default LocationPicker;