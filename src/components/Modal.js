import React from "react";
import "./Modal.css";
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: "",
      display: "none",
    };
  }
  openModal() {
    this.setState({
      modalShow: "show",
      display: "block",
    });
  }

  closeModal() {
    this.setState({
      modalShow: "",
      display: "none",
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className=".modal">
          <div className=".modal-main">myModal</div>
        </div>
      </React.Fragment>
    );
  }
}
export default Modal;
