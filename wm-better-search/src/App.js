import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
// ES6
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoib2htYXR0aGV3IiwiYSI6ImNqOXJnNzJlMDBnYmkzMmw3c2xvYXJvNXcifQ.PWg2zdi3eSci_U0lDqfopA"
});

class App extends Component {
  render() {
    return (
      <div className="App" idName="mapbox">
        <Map
          style="mapbox://styles/mapbox/dark-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
          center={[-0.481747846041145, 51.3233379650232]}
          >
            <Layer
              type="symbol"
              id="marker"
              layout={{ "icon-image": "marker-15" }}>
              <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
            </Layer>
        </Map>
      </div>
    );
  }
}


export default App;
