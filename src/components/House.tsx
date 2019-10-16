import * as React from "react";
import styled from "styled-components";
import HouseKT from "./HouseKT";
import HouseLT from "./HouseLT";

const EXPERT_EMAIL_ADDRESS = "nog.niet.ingesteld@domain.com";

interface Props {}
interface State {
  measureType: "LT" | "KT";
}

const ButtonsBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MeasureButtons = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  margin: 20px;
`;

const MeasureButton = styled.button<{ active: boolean }>`
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
  font-weight: 600;
  background-color: ${props => (props.active ? "#258BA0" : "transparent")};
  color: ${props => (props.active ? "#fff" : "#333")};
  border: 3px solid #258ba0;
  border-radius: 10px;
  font-size: 0.8em;
  width: 294px;
  height: 48px;
  margin: 4px;
  text-transform: uppercase;
  cursor: pointer;
`;

const ContactButton = styled.button`
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
  font-weight: 600;
  background-color: #258ba0;
  color: #fff;
  border: 3px solid #258ba0;
  border-radius: 10px;
  font-size: 0.8em;
  width: 200px;
  height: 48px;
  margin: 20px;
  text-transform: uppercase;
  cursor: pointer;
`;

class House extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      measureType: "KT"
    };
  }

  render() {
    const { measureType } = this.state;
    const house = measureType === "LT" ? <HouseLT /> : <HouseKT />;
    return (
      <div>
        <ButtonsBar>
          <MeasureButtons>
            <MeasureButton
              onClick={() => this.setState({ measureType: "KT" })}
              active={measureType === "KT"}
            >
              Toon korte termijn maatregelen
            </MeasureButton>
            <MeasureButton
              onClick={() => this.setState({ measureType: "LT" })}
              active={measureType === "LT"}
            >
              Toon lange termijn maatregelen
            </MeasureButton>
          </MeasureButtons>
          <ContactButton
            onClick={() => window.open(`mailto:${EXPERT_EMAIL_ADDRESS}`)}
          >
            Contact met expert
          </ContactButton>
        </ButtonsBar>
        {house}
      </div>
    );
  }
}

export default House;
