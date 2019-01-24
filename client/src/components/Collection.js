import React, { Component } from 'react';
import _ from 'lodash';
import SearchItem from "./SearchItem";
import { DATA_TYPE_RELEASE } from '../constants';
import ReactTooltip from 'react-tooltip';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props,
        };
    }

    onChange = (event) => {
        const {data} = this.props;

        data.filter(vinyl => {
            const artistName = vinyl.artists[0].name.toLowerCase();
            const title = vinyl.title.toLowerCase();
            const searchQuery = event.target.value;

            console.log(vinyl.artists[0].name.toLowerCase().startsWith(event.target.value));
            if (artistName.startsWith(searchQuery) || title.startsWith(searchQuery)) {
                console.log(vinyl);
                return vinyl
              }
        });
    }

    render () {
        const { history, getSpecificResult, setSpecificResult, currentRelease, data, collectionType } = this.props;
        ReactTooltip.rebuild();
        return (
            <div>
                <ReactTooltip id="search-page" />
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} />
                </InputGroup>
                <div className="results-container">
                    {!_.isEmpty(data) && data.map(result => {
                        return (
                            <SearchItem history={history}
                                        release={result}
                                        currentRelease={currentRelease}
                                        collectionType={collectionType}
                                        filterType={DATA_TYPE_RELEASE}
                                        getSpecificResult={getSpecificResult}
                                        setSpecificResult={setSpecificResult}
                                        key={result.id}>
                            </SearchItem>
                        );
                    })
                    }
                </div>
            </div>
        );
    }
}

export default Collection;