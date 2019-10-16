import * as React from "react";
import styled from "styled-components";

interface Props {
  activeLabel: null | "A" | "B" | "C" | "D" | "E";
}
interface State {
  animate: boolean;
}

const OrderedList = styled.ol`
  padding: 0 0 10px 0;
  list-style-type: none;
`;
const ListItem = styled.li`
  margin: 4px 0 0 0;
`;

const LabelsContainer = styled.div`
  position: relative;
  height: 225px;
  display: flex;
`;

const Arrow = styled.div<{ animate: boolean, bottom: number }>`
  position: absolute;
  left: 140px;
  font-weight: 800;
  font-size: 2em;
  transition: bottom 2s;
  bottom: ${props => (props.animate ? props.bottom : 176)}px;
`;

const labels = [
  { label: "A", fill: "#1b7f33", width: 130, bottom: 172 },
  { label: "B", fill: "#3e9c37", width: 110, bottom: 136 },
  { label: "C", fill: "#faeb13", width: 90, bottom: 96 },
  { label: "D", fill: "#e48c1a", width: 70, bottom: 66 },
  { label: "E", fill: "#bf1f20", width: 50, bottom: 26 }
];

class Labels extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animate: false
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        animate: true
      });      
    }, 100);
  }
  render() {
    
    const { activeLabel } = this.props;
    const { animate } = this.state;
    const listItems = labels.map(label => {
      return (
        <ListItem key={label.label}>
          <svg
            style={{ fill: label.fill }}
            width={labels[0].width + 50}
            height="30"
          >
            <polygon
              points={`
                  0,0 
                  ${label.width - 15},0 
                  ${label.width},15 
                  ${label.width - 15},30 
                  0,30`}
            />
            <text style={{ fill: "white", fontWeight: "bold" }} x="5" y="21">
              {label.label}
            </text>
          </svg>
        </ListItem>
      );
    });
    const arrowBottom = labels.find(l => l.label === activeLabel)!.bottom;

    return (
      <LabelsContainer>
        <OrderedList>{listItems}</OrderedList>
        <Arrow animate={animate} bottom={arrowBottom}>&larr;</Arrow>
      </LabelsContainer>
    );
  }
}

export default Labels;
