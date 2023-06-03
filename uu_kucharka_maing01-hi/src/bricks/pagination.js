import { Component } from "react";

import Pagination from "react-bootstrap/Pagination";
import "./pagination.css";

class PaginationComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log("PAGINATION props", this.props.data);

    const { pageNumber, totalPages } = this.props.data;
    const { onPageChange } = this.props;

    const isFirst = pageNumber <= 1;
    const isLast = pageNumber >= totalPages;

    return (
      <Pagination>
        <Pagination.First onClick={() => onPageChange(1)} disabled={isFirst} />
        <Pagination.Prev onClick={() => onPageChange(pageNumber - 1)} disabled={isFirst} />
        {pageNumber > 2 && (
          <Pagination.Item onClick={() => onPageChange(pageNumber - 2)}>{pageNumber - 2}</Pagination.Item>
        )}
        {pageNumber > 1 && (
          <Pagination.Item onClick={() => onPageChange(pageNumber - 1)}>{pageNumber - 1}</Pagination.Item>
        )}
        <Pagination.Item active>{pageNumber}</Pagination.Item>
        {pageNumber < totalPages && (
          <Pagination.Item onClick={() => onPageChange(pageNumber + 1)}>{pageNumber + 1}</Pagination.Item>
        )}
        {pageNumber + 1 < totalPages && (
          <Pagination.Item onClick={() => onPageChange(pageNumber + 2)}>{pageNumber + 2}</Pagination.Item>
        )}
        <Pagination.Next onClick={() => onPageChange(pageNumber + 1)} disabled={isLast} />
        <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={isLast} />
      </Pagination>
    );
  }
}

export default PaginationComponent;
