import React, {Component, Fragment} from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from 'react-icons/fa';
class Pagination extends Component {

    render() {
        const {data} = this.props;
        console.log(data);
        let pages = [...Array(data.pages)];

        return (
            <div className="pagination-wrapper">
                <FaArrowAltCircleLeft className="icon-arrow left"/>
                <div className="numbers-wrapper">
                    <ButtonToolbar>
                        <ButtonGroup>
                            {pages.map((page, index) => {
                                return (
                                    <div key={index} className="page-number-wrapper">
                                        <Button className="page-number" key={index}>{index + 1}</Button>
                                    </div>);
                            })
                            }
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <FaArrowAltCircleRight className="icon-arrow right" onClick={this.props.getNextPageResult}/>
            </div>
        );
    }
}

export default Pagination;