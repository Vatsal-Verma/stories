import { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { allStoriesLoader } from '../utils/storyload';
import StoryPopup from './StoryPopup';
import './TestMap.css';

const TestMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (mapInstanceRef.current) return;

    Promise.all([
      import('leaflet'),
      allStoriesLoader(),
    ]).then(([L, allStories]) => {
      const stories = allStories.filter(s => s.map?.geojson);
      setStatus('ready');

      const jenkinsIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/jenkins-infra/stories/refs/heads/main/src/images/jenkins_map_pin-180x180-1.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
      });

      const map = L.map(mapRef.current, {
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        minZoom: 3,
      }).setView([20, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
      }).addTo(map);

      stories.forEach(story => {
        try {
          const geojson = typeof story.map.geojson === 'string'
            ? JSON.parse(story.map.geojson)
            : story.map.geojson;

          const [lng, lat] = geojson.coordinates;
          if (typeof lat !== 'number' || typeof lng !== 'number') return;
          const popupHtml = renderToStaticMarkup(<StoryPopup story={story} />);

          L.marker([lat, lng], { icon: jenkinsIcon })
            .addTo(map)
            .bindPopup(popupHtml, { maxWidth: 300 });
        } catch (e) {
          console.warn('Bad geojson for story:', story.slug, e);
        }
      });

      mapInstanceRef.current = map;
    }).catch(err => {
      setStatus('error');
      console.error(err);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="tmap-container">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      {status === 'error' && (
        <p style={{ color: 'red', padding: '1rem' }}>Failed to load map data.</p>
      )}
      <div ref={mapRef} className="tmap-map" />
    </div>
  );
};

export default TestMap;