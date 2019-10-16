import * as React from "react";
import styled from "styled-components";

interface Props {
  answer: boolean | null;
  onChange: Function;
}
interface State {}

const ButtonGroup = styled.div`
  display: flex;
`;

const Button = styled.button<{ active: boolean | null }>`
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
  background-color: ${props => (props.active ? "#268ba0" : "#f1Faff")};
  color: ${props => (props.active ? "#ffffff" : "#333333")};
  border-radius: 4px;
  font-size: 1.2em;
  width: 100px;
  height: 28px;
  margin: 4px;
  cursor: pointer;

`;

class YesNoButton extends React.Component<Props, State> {
  render() {
    const { answer, onChange } = this.props;

    return (
      <ButtonGroup>
        <Button active={answer === true} onClick={() => onChange(true)}>
          Ja
        </Button>
        <Button active={answer === false} onClick={() => onChange(false)}>
          Nee
        </Button>
      </ButtonGroup>
    );
  }
}

export default YesNoButton;
