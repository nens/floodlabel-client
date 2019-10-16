import * as React from "react";
import styled from "styled-components";
import * as GeoJSONType from "geojson";
import { Map, TileLayer, GeoJSON, WMSTileLayer } from "react-leaflet";

interface Props {
  center: any;
  feature: GeoJSONType.Feature;
}
interface State {
  wmsId: number;
}

const MapWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Legend = styled.div<{ gradient: string }>`
  pointer-events: none;
  position: absolute;
  width: 60px;
  height: 100px;
  background: ${props => props.gradient};
  z-index: 10002;
  bottom: 40px;
  right: 10px;
  border: 1px solid #aca49d;
`;

const Controls = styled.div`
  position: absolute;
  top: 170px;
  z-index: 99999;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  pointer-events: none;
`;
const Button = styled.div`
  display: flex;
  text-align: center;
  margin: 12px;
  cursor: pointer;
  pointer-events: all;
`;
const Title = styled.div`
  pointer-events: none;
  z-index: 10000;
  text-align: center;
  width: 100%;
  top: 20px;
  position: absolute;
  font-size: 2em;
  font-weight: 600;
  color: #fff;
  text-shadow: -1px -1px 0 #ccc, 1px -1px 0 #ccc, -1px 1px 0 #ccc,
    1px 1px 0 #ccc;
`;

const wmsLayers = [
  {
    layer: (
      <WMSTileLayer
        layers={
          "nelen-schuurmans:cas-klimaateffectenatlas-waterdiepte-1-100-jaar"
        }
        opacity={0.85}
        url={"/wms/"}
        attribution={"Klimaateffectenatlas.nl"}
      />
    ),
    title: "Neerslag",
    legend: {
      gradient:
        "linear-gradient(to top, rgb(247, 251, 255), rgb(222, 235, 247), rgb(198, 219, 239), rgb(158, 202, 225), rgb(107, 174, 214), rgb(66, 146, 198), rgb(33, 113, 181), rgb(8, 81, 156), rgb(8, 48, 107))",
      from: {
        label: "0.00 m"
      },
      to: {
        label: "0.300 m"
      }
    }
  },
  {
    layer: (
      <WMSTileLayer
        layers={"intern:nl:rws:nwm:ghg_ref2015_gem"}
        opacity={0.85}
        url={"/wms/"}
      />
    ),
    title: "Grondwater",
    legend: {
      gradient:
        "linear-gradient(to top, rgb(8, 29, 88), rgb(37, 52, 148), rgb(34, 94, 168), rgb(29, 145, 192), rgb(65, 182, 196), rgb(127, 205, 187), rgb(199, 233, 180), rgb(237, 248, 177), rgb(255, 255, 217));",
      from: {
        label: "0.00 mMV"
      },
      to: {
        label: "1.50 mMV"
      }
    }
  },
  {
    layer: (
      <WMSTileLayer
        layers={"intern:nl:kea:overstromingsdiepte:primair"}
        opacity={0.85}
        url={"/wms/"}
        attribution={"Klimaateffectenatlas.nl"}
      />
    ),
    title: "Rivieroverstroming",
    legend: {
      gradient:
        "linear-gradient(to top, rgb(247, 251, 255), rgb(222, 235, 247), rgb(198, 219, 239), rgb(158, 202, 225), rgb(107, 174, 214), rgb(66, 146, 198), rgb(33, 113, 181), rgb(8, 81, 156), rgb(8, 48, 107));",
      from: {
        label: "0.00 m"
      },
      to: {
        label: "6.00 m"
      }
    }
  }
];

class MiniMap extends React.Component<Props, State> {
  private mapRef = React.createRef();
  constructor(props: Props) {
    super(props);
    this.state = {
      wmsId: 0
    };
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }
  handlePrev() {
    const { wmsId } = this.state;
    if (wmsId > 0) {
      this.setState({
        wmsId: wmsId - 1
      });
    }
  }
  handleNext() {
    const { wmsId } = this.state;
    if (wmsId < wmsLayers.length - 1) {
      this.setState({
        wmsId: wmsId + 1
      });
    }
  }
  render() {
    const { feature, center } = this.props;
    const { wmsId } = this.state;

    return (
      <MapWrapper>
        <Title>{wmsLayers[wmsId].title}</Title>
        <Map
          ref={this.mapRef}
          center={[
            center.geometry.coordinates[1],
            center.geometry.coordinates[0]
          ]}
          zoom={19}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png"
          />
          {wmsLayers[wmsId].layer}
          <GeoJSON data={feature} />
        </Map>
        <Controls>
          <Button onClick={this.handlePrev} title="Vorige laag">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 50, height: 50, fill: "#fff" }}
              viewBox="0 0 320 512"
            >
              <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" />
            </svg>
          </Button>
          <Button onClick={this.handleNext} title="Volgende laag">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 50, height: 50, fill: "#fff" }}
              viewBox="0 0 320 512"
            >
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </Button>
        </Controls>
        <Legend gradient={wmsLayers[wmsId].legend.gradient}>
          <div
            style={{
              position: "absolute",
              top: -20,
              background: "rgba(204, 204, 204, 0.5)",
              fontSize: 12,
              width: "100%"
            }}
          >
            {wmsLayers[wmsId].legend.to.label}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -20,
              background: "rgba(204, 204, 204, 0.5)",
              fontSize: 12,
              width: "100%"
            }}
          >
            {wmsLayers[wmsId].legend.from.label}
          </div>
        </Legend>
      </MapWrapper>
    );
  }
}

export default MiniMap;
