import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";

const MapboxMap = ({ locations }) => {
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicHJhdGhhbTAyODAiLCJhIjoiY2xpb2N1ZjdqMGV4ZTNyb3h3OHJiOGQ3NiJ9.2rU7SJGpNa5qndCVEID9xg";

    mapboxgl.workerClass =
      require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/pratham0280/cliod1zr0000601o14nto8pys",
      scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
      if (loc.coordinates && loc.coordinates.length === 2) {
        // Add marker
        const el = document.createElement("div");
        el.className = "marker";

        new mapboxgl.Marker({
          element: el,
          anchor: "bottom",
        })
          .setLngLat(loc.coordinates)
          .addTo(map);

        // Add popup
        new mapboxgl.Popup({
          offset: 30,
        })
          .setLngLat(loc.coordinates)
          .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
          .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
      }
    });

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });

    // Add event listener for Ctrl key + mouse scroll on the map container
    document.getElementById("map").addEventListener("wheel", function (e) {
      if (e.ctrlKey) {
        const delta = e.deltaY > 0 ? -1 : 1;
        const zoom = map.getZoom();
        map.setZoom(zoom + delta);
        e.preventDefault();
      }
    });
  }, [locations]);

  return <div id="map"></div>;
};

export default MapboxMap;
