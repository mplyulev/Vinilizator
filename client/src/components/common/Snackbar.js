import React, { Component } from 'react';
import { SNACKBAR_CLOSE_TIMEOUT, SNACKBAR_TYPE_SUCCESS } from '../../constants';

class Snackbar extends Component {
    constructor(props) {
        super(props);

        this.timeout = null;
    }

    // componentDidMount() {
    //     setTimeout(() => this.snackbar.classList.add('mounted'), 0);
    //     this.timeout = setTimeout(() => {
    //         this.props.closeSnackbar();
    //     }, 3000);
    // }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.snackbarOptions.isOpened !== this.props.snackbarOptions.isOpened && nextProps.snackbarOptions.isOpened) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.props.closeSnackbar();
            }, SNACKBAR_CLOSE_TIMEOUT);
        }
    }

    render() {
        const { snackbarOptions } = this.props;

        return (
            <div className={`snackbar${snackbarOptions.type === SNACKBAR_TYPE_SUCCESS ? ' success' : ' fail'}${snackbarOptions.isOpened ? ' opened' : ''}`}>
                <span>{snackbarOptions.msg}</span>
            </div>
        );
    }
}

export default Snackbar;