import { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class RecipeDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleConfirm = () => {
    const { item, handleConfirm } = this.props;
    handleConfirm(item);
  };

  render() {
    const { item, handleClose } = this.props;
    const title = "Smazat recept";

    return (
      <Modal show={true} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Chcete smazat recept "{item.name}"?</Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={this.handleConfirm}>
            Smazat
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Zrušit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RecipeDelete;
