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
            searchQuery: '',
            filteredCollection: null
        };
    }

    onChange = (event) => {
        const { data } = this.props;
        this.setState({ searchQuery: event.target.value.split(' ').join('') });
        const filteredCollection = data.filter(vinyl => {
            const artistName = vinyl.artists[0].name.toLowerCase().split(' ').join('');
            const title = vinyl.title.toLowerCase().split(' ').join('');
            const searchQuery = event.target.value;
            artistName.split(' ')

            if (artistName.startsWith(searchQuery) || title.startsWith(searchQuery)) {
                return vinyl
            }
        });

        if (filteredCollection.length > 0) {
            this.setState({ filteredCollection });
        }
    };

    render () {
        const {
            history,
            getSpecificResult,
            setSpecificResult,
            currentRelease,
            data,
            clearCurrentRelease,
            collectionType
        } = this.props;

        const { filteredCollection } = this.state;
        ReactTooltip.rebuild();

        return (
            <div>
                <ReactTooltip id="search-page" />
                <InputGroup className="search-bar">
                    <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
                    <Input onChange={this.onChange} />
                </InputGroup>
                <div className="results-container">
                    {!_.isEmpty(data) && (filteredCollection || data).map(result => {
                        return (
                            <SearchItem history={history}
                                        release={result}
                                        currentRelease={currentRelease}
                                        clearCurrentRelease={clearCurrentRelease}
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