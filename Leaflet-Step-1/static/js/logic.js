var earthquakeMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 4,
  });

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY,
    }
  ).addTo(earthquakeMap);



  var url =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

  
    var legend = L.control
    ({
      position: "bottomright"
    });
  //Get the radius
  d3.json(url).then(init);
  function init(data) {
    console.log(data);
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: Color(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: Radius(feature.properties.mag * 2),
        stroke: true,
        weight: 0.5,
        //coord: Coordinates(feature.geometry.coordinates),
        //depth: Depth(feature.geometry.coordinates[2])
      };
    }
    
    //Set color based on depth
    function Color(depth) {
      switch (true) {
        case depth > 50:
          return "#03221d";
        case depth > 40:
          return "#491433";
        case depth > 30:
          return "#85245d";
        case depth > 20:
          return "#d44f0c";
        case depth > 10:
          return "#b8860b";
        default:
          return "#ffcd53";
      }
    }
    //Set size based on radius
    function Radius(radius) {
      switch (true) {
        case radius > 5:
          return radius * 5;
        case radius > 4:
          return radius * 4;
        case radius > 3:
          return radius * 3;
        case radius > 2:
          return radius * 2;
        case radius > 1:
          return radius * 1.5;
        default:
          return radius;
      }
    }
    //Add marker and bind popup
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "Earthquake Magnitude: " +
            feature.properties.mag +
            "<br>Earthquake Location: " +
            feature.properties.place
        );
      },
    }).addTo(earthquakeMap);
  }
