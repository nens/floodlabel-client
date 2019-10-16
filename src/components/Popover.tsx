import * as React from "react";
import ReactDOM from "react-dom";

interface Props {
  x: number;
  y: number;
}

class Popover extends React.Component<Props> {
  portalRoot: HTMLElement | null;
  el: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.portalRoot = document.getElementById("portal");
    this.el = document.createElement("div");
  }

  componentDidMount = () => {
    this.portalRoot!.appendChild(this.el);
    this.el.style.position = 'absolute';
    this.el.style.left = `${this.props.x}px`;
    this.el.style.top = `${this.props.y}px`;
  };

  componentWillUnmount = () => {
    this.portalRoot!.removeChild(this.el);
  };

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.el);
  }
}

export default Popover;
