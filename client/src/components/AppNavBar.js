import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import YouTube from 'react-youtube';
import { FaPauseCircle, FaVolumeMute, FaStepForward, FaVolume, FaPlayCircle } from 'react-icons/fa';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav
} from 'reactstrap';
import {
    ROUTE_COLLECTION,
    ROUTE_WISHLIST,
    ROUTE_SEARCH,
    ROUTE_SIGN_IN,
    ROUTE_ACCOUNT,
    ROUTE_FOR_SELL,
    ROUTE_MARKET,
    ROUTE_USERS, COLLECTION_TYPE_COLLECTION
} from '../constants';

let player = null;

class AppNavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlayerPlaying: true,
            isPlayerMuted: false
        };


    }


    play = () => {
        player.playVideo();
        console.log(player)
        this.setState({ isPlayerPlaying: true });
    };

    mute = () => {
        player.mute();
        this.setState({ isPlayerMuted: true });
    };

    unmute = () => {
        player.unMute();
        this.setState({ isPlayerMuted: false });
    };

    pause = () => {
        player.getVideoEmbedCode()
        player.pauseVideo();
        this.setState({ isPlayerPlaying: false });
    };

    onReady = (e) => {
        player = e.target;
    };

    render() {
        const opts = {
            height: '220',
            width: '220',
            videoId: this.props.videoId,
            videoEmbeddable: true,
            playerVars: {
                autoplay: 1,
                videoEmbeddable: true,
            }
        };

        const { showPlayer, playerTitle, playerRelease, setSpecificResult, getRandomTrack, videoId, playTracksFromCollection } = this.props;

        return (
            <div>
                <Navbar color="dark"
                        light expand="sm"
                        className={`mb-5 navbar${this.props.isVisible ? ' visible' : ''}`}>
                    <NavbarBrand href="/">VYNILIZATOR</NavbarBrand>
                    <NavbarToggler color="dark" onClick={() => this.props.toggleNavBar(false)} />
                    <Collapse isOpen={this.props.isNavBarOpened} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavLink to={ROUTE_SEARCH}
                                     activeClassName="selected">
                                SEARCH
                            </NavLink>
                            <NavLink to={ROUTE_COLLECTION}
                                     activeClassName="selected">
                                COLLECTION
                            </NavLink>
                            <NavLink to={ROUTE_WISHLIST}
                                     activeClassName="selected">
                                WISHLIST
                            </NavLink>
                            <NavLink to={ROUTE_FOR_SELL}
                                     activeClassName="selected">
                                FOR SELL
                            </NavLink>
                            <NavLink to={ROUTE_MARKET}
                                     activeClassName="selected">
                                MARKET
                            </NavLink>
                            <NavLink to={ROUTE_ACCOUNT}
                                     activeClassName="selected">
                                ACCOUNT
                            </NavLink>
                            <NavLink to={ROUTE_USERS}
                                     activeClassName="selected">
                                USERS
                            </NavLink>
                            <a href={ROUTE_SIGN_IN} onClick={this.props.logout}>
                                LOGOUT
                            </a>
                        </Nav>
                    </Collapse>
                    <YouTube
                        className="player"
                        videoId={videoId}
                        opts={opts}
                        onError={getRandomTrack}
                        onReady={this.onReady}
                    />
                    <span className="player-title" onClick={() => setSpecificResult(playerRelease, COLLECTION_TYPE_COLLECTION)}>{playerTitle}</span>
                    <div className={`player-controls-wrapper${showPlayer ? ' visible' : ''}`}>
                        {!this.state.isPlayerPlaying
                            ? <FaPlayCircle onClick={this.play} className="player-icon"></FaPlayCircle>
                            : <FaPauseCircle onClick={this.pause} className="player-icon"></FaPauseCircle>
                        }
                        <FaStepForward onClick={getRandomTrack} className="player-icon"></FaStepForward>
                        {this.state.isPlayerMuted
                            ? <FaVolumeMute onClick={this.unmute} className="player-icon"></FaVolumeMute>
                            : <FaVolume onClick={this.mute} className="player-icon"></FaVolume>
                        }
                    </div>
                </Navbar>
            </div>
        );
    }
}



export default AppNavBar;