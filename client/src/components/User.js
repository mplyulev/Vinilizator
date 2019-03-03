import React, {Component, Fragment} from 'react';
import ReactTooltip from 'react-tooltip';

class User extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    render () {
        const { user } = this.props;

        return (
            <Fragment>
                <div className="user-wrapper" >
                   HIIII
                </div>
            </Fragment>
        );
    }
}

export default User;