import * as React from "react";

interface Props {
  activeLabel: null | "A" | "B" | "C" | "D" | "E";
}
interface State {}

const labels = [
  { label: "A", fill: "#1b7f33", width: 90 },
  { label: "B", fill: "#3e9c37", width: 90 },
  { label: "C", fill: "#faeb13", width: 90 },
  { label: "D", fill: "#e48c1a", width: 90 },
  { label: "E", fill: "#bf1f20", width: 90 }
];

class Label extends React.Component<Props, State> {
  render() {
    const { activeLabel } = this.props;
    const label = labels.find(l => l.label === activeLabel);

    return (
      <svg
        style={{ fill: label!.fill }}
        width={labels[0].width + 50}
        height="30"
      >
        <polygon
          points={`
              0,0 
              ${label!.width - 15},0 
              ${label!.width},15 
              ${label!.width - 15},30 
              0,30`}
        />
        <text style={{ fill: "white", fontWeight: "bold" }} x="5" y="21">
          {label!.label}
        </text>
      </svg>
    );
  }
}

export default Label;
