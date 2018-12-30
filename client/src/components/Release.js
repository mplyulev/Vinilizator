import React, { Component } from 'react';

class Release extends Component {

    render () {
        const {data} = this.props;

        return (
            <div className="release-data-container">
                <img className="release-cover" src={data.cover_image} />
                <span className="release-title">{data.title}</span>
            </div>
        );
    }
}

export default Release;