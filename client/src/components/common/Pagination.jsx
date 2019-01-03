import React, {Component, Fragment} from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from 'react-icons/fa';
import {PAGINATION_PAGES_PER_SLIDE, PAGINATION_WIDTH} from "../../constants";
class Pagination extends Component {
    state = {
        paginationPositionRight: 0
    };

    slideToNextPagination = (nextPage, type, shouldBlockSlide, slideToTheLeft) => {
        this.props.getNextPageResult(nextPage, type);

        if (!shouldBlockSlide) {
            if (nextPage % PAGINATION_PAGES_PER_SLIDE === 1 && !slideToTheLeft) {
                this.setState({ paginationPositionRight: this.state.paginationPositionRight + PAGINATION_WIDTH});
            }

            if (nextPage % PAGINATION_PAGES_PER_SLIDE === 0 && slideToTheLeft) {
                this.setState({ paginationPositionRight: this.state.paginationPositionRight - PAGINATION_WIDTH});
            }
        }
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.filterType !== this.props.filterType) {
            this.setState({ paginationPositionRight: 0 });
        }
    }

    render() {
        const { data, filterType } = this.props;
        let pages = [...Array(data.pages)];

        return (
            <div className="pagination-wrapper">
                <FaArrowAltCircleLeft className={`icon-arrow left${data.page === 1 ? ' disabled' : ''}`}
                                      onClick={() => this.slideToNextPagination(data.page -1, filterType, false, true)} />
                <div className="numbers-wrapper">
                    <ButtonToolbar className="toolbar" style={{right: this.state.paginationPositionRight + 'px'}}>
                        <ButtonGroup>
                            {pages.map((page, index) => {
                                return (
                                    <div key={index} className="page-number-wrapper">
                                        <Button className={`page-number${index + 1 === data.page ? ' active' : ''}`}
                                                onClick={() => this.slideToNextPagination(index + 1, filterType, true)}
                                                key={index}>
                                            {index + 1}
                                        </Button>
                                    </div>);
                            })
                            }
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <FaArrowAltCircleRight className={`icon-arrow right${data.page === data.pages ? ' disabled' : ''}`}
                                       onClick={() => this.slideToNextPagination(data.page + 1, filterType, false)} />
            </div>
        );
    }
}

export default Pagination;