import React, {Component, Fragment} from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from 'react-icons/fa';
import {PAGINATION_PAGES_PER_SLIDE, PAGINATION_WIDTH} from "../../constants";
class Pagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paginationPositionRight: 0,
            prevProps: props
        };
    }

    slideToNextPagination = (nextPage, type, shouldBlockSlide, slideToTheLeft) => {
        if (this.props.data.page !== nextPage) {
            this.props.getNextPageResult(nextPage, type);

            if (!shouldBlockSlide) {
                if (nextPage % PAGINATION_PAGES_PER_SLIDE === 1 && !slideToTheLeft) {
                    this.setState({ paginationPositionRight: this.state.paginationPositionRight + PAGINATION_WIDTH});
                }

                if (nextPage % PAGINATION_PAGES_PER_SLIDE === 0 && slideToTheLeft) {
                    this.setState({ paginationPositionRight: this.state.paginationPositionRight - PAGINATION_WIDTH});
                }
            }
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const { filterType } = prevState.prevProps;

        if (nextProps.filterType !== filterType) {
            return {
                paginationPositionRight: 0,
                prevProps: nextProps,
            }
        }

        return null;
    }

    render() {
        const { data, filterType, isVisible } = this.props;
        let pages;
        if (data) {
            pages = [...Array(data.pages)];
        }

        return (
            <div className={`pagination-wrapper${!isVisible ? ' hidden' : ''}`}>
                {data && data.pages > 1 ?
                    <Fragment>
                        {data && data.pages > 6 &&
                        <FaArrowAltCircleLeft className={`icon-arrow left${data.page === 1 ? ' disabled' : ''}`}
                                              onClick={() => this.slideToNextPagination(data.page - 1, filterType, false, true)} />}
                        <div className="numbers-wrapper">
                            <ButtonToolbar className={`toolbar${data.pages <= 6 ? ' center' : ''}`}
                                           style={{ right: this.state.paginationPositionRight + 'px' }}>
                                <ButtonGroup>
                                    {pages.map((page, index) => {
                                        return (
                                            <div key={index} className="page-number-wrapper">
                                                <Button
                                                    className={`page-number${index + 1 === data.page ? ' active' : ''}`}
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
                        {data && data.pages > 6 &&
                        <FaArrowAltCircleRight
                            className={`icon-arrow right${data.page === data.pages ? ' disabled' : ''}`}
                            onClick={() => this.slideToNextPagination(data.page + 1, filterType, false)} />}
                    </Fragment> : null}
            </div>

        );
    }
}

export default Pagination;