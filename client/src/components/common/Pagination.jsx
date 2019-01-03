import React, {Component, Fragment} from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from 'react-icons/fa';
import {PAGIANTION_PAGES_PER_SLIDE, PAGINATION_WIDTH} from "../../constants";
class Pagination extends Component {
    state = {
        paginationPositionRight: 0
    };

    slideToNextPagination = (nextPage) => {
        this.props.getNextPageResult(nextPage);

        if (nextPage % PAGIANTION_PAGES_PER_SLIDE === 1) {
            this.setState({
                paginationPositionRight: this.state.paginationPositionRight + PAGINATION_WIDTH});
        }
    };

    render() {
        const {data} = this.props;
        let pages = [...Array(data.pages)];

        return (
            <div className="pagination-wrapper">
                <FaArrowAltCircleLeft className="icon-arrow left"
                                      onClick={() => this.slideToNextPagination(data.page -1)} />
                <div className="numbers-wrapper">
                    <ButtonToolbar className="toolbar" style={{right: this.state.paginationPositionRight + 'px'}}>
                        <ButtonGroup>
                            {pages.map((page, index) => {
                                return (
                                    <div key={index} className="page-number-wrapper">
                                        <Button className={`page-number${index + 1 === data.page ? ' active' : ''}`}
                                                onClick={() => this.slideToNextPagination(index + 1)}
                                                key={index}>
                                            {index + 1}
                                        </Button>
                                    </div>);
                            })
                            }
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <FaArrowAltCircleRight className="icon-arrow right" onClick={() => this.slideToNextPagination(data.page + 1)} />
            </div>
        );
    }
}

export default Pagination;