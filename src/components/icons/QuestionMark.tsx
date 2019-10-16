import * as React from "react";
import styled from "styled-components";
import Popover from "../Popover";

interface Props {
  content: any;
}
interface State {
  showPopover: boolean;
}

const QuestionMarkWrapper = styled.div`
  display: inline-flex;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

class QuestionMarkIcon extends React.Component<Props, State> {
  private questionMarkRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);

    this.state = {
      showPopover: false
    };

    this.showPopover = this.showPopover.bind(this);
    this.hidePopover = this.hidePopover.bind(this);
  }

  showPopover() {
    this.setState({
      showPopover: true
    });
  }

  hidePopover() {
    this.setState({
      showPopover: false
    });
  }

  render() {
    const { content } = this.props;
    const { showPopover } = this.state;
    const node = this.questionMarkRef.current;
    return (
      <QuestionMarkWrapper
        onMouseOver={this.showPopover}
        onMouseOut={this.hidePopover}
        ref={this.questionMarkRef}
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          style={{ width: "100%", height: "100%" }}
        >
          <g>
            <rect fill="#FFFFFF" x="0" y="0" width="20" height="20"></rect>
            <path
              d="M10,20 C4.4771525,20 0,15.5228475 0,10 C0,4.4771525 4.4771525,0 10,0 C15.5228475,0 20,4.4771525 20,10 C20,15.5228475 15.5228475,20 10,20 Z M10,17.8947368 C14.3601428,17.8947368 17.8947368,14.3601428 17.8947368,10 C17.8947368,5.63985724 14.3601428,2.10526316 10,2.10526316 C5.63985724,2.10526316 2.10526316,5.63985724 2.10526316,10 C2.10526316,14.3601428 5.63985724,17.8947368 10,17.8947368 Z"
              fill="#0E7296"
            ></path>
            <path
              d="M10.9540086,12.5708208 L9.0395909,12.5708208 C9.03458586,12.2955437 9.03208338,12.1278774 9.03208338,12.067817 C9.03208338,11.4471922 9.13468513,10.9366859 9.33989172,10.5362828 C9.54509831,10.1358797 9.95550533,9.68543293 10.5711251,9.18492905 C11.1867449,8.68442518 11.5546097,8.35660006 11.6747306,8.20144386 C11.8599171,7.95619696 11.9525089,7.68592892 11.9525089,7.39063163 C11.9525089,6.98021845 11.7885963,6.62861976 11.4607663,6.33582499 C11.1329362,6.04303022 10.6912482,5.89663503 10.1356889,5.89663503 C9.60014976,5.89663503 9.15220551,6.04928643 8.79184272,6.35459379 C8.43147993,6.65990115 8.18373423,7.12536278 8.04859818,7.75099262 L6.11165787,7.51075196 C6.16671329,6.61485003 6.54834177,5.85409555 7.25655476,5.2284657 C7.96476774,4.60283586 8.89443974,4.29002563 10.0455987,4.29002563 C11.256818,4.29002563 12.2202735,4.60658958 12.9359941,5.23972698 C13.6517146,5.87286439 14.0095695,6.60984529 14.0095695,7.4506918 C14.0095695,7.9161604 13.8781892,8.35659721 13.6154247,8.77201542 C13.3526602,9.18743364 12.790853,9.75299453 11.9299863,10.4687151 C11.4845379,10.8390879 11.2080136,11.1368833 11.1004053,11.36211 C10.992797,11.5873368 10.9439986,11.9902363 10.9540086,12.5708208 Z M9.0395909,15.4086636 L9.0395909,13.2990503 L11.1492042,13.2990503 L11.1492042,15.4086636 L9.0395909,15.4086636 Z"
              fill="#0E7296"
            ></path>
          </g>
        </svg>
        {node ? (
          <Popover x={node.offsetLeft + 25} y={node.offsetTop}>
            {showPopover ? content : null}
          </Popover>
        ) : null}
      </QuestionMarkWrapper>
    );
  }
}

export default QuestionMarkIcon;
