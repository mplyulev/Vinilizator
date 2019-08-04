import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import YouTube from 'react-youtube';
import { FaPauseCircle, FaVolumeMute, FaStepForward, FaVolume, FaPlayCircle } from 'react-icons/fa';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

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
    ROUTE_SOLD,
    ROUTE_ACCOUNT,
    ROUTE_FOR_SELL,
    ROUTE_MARKET,
    ROUTE_USERS
} from '../constants';

let player = null;

class AppNavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlayerPlaying: true,
            isPlayerMuted: false,
            volume: 50,
            savedVolume: 50
        };
    }

    setVolume = (volume) => {
        if (volume === 0)  {
            this.setState({ isPlayerMuted: true });
        } else if (volume !== 0 && this.state.isPlayerMuted) {
            this.setState({ isPlayerMuted: false });
            player.unMute();
        }

        this.setState({ volume: volume });
        player.setVolume(volume);
    };

    play = () => {
        player.playVideo();
        this.setState({ isPlayerPlaying: true });
    };

    mute = () => {
        this.setState({ isPlayerMuted: true, savedVolume: this.state.volume});
        player.mute();
        this.setVolume(0)
    };

    unmute = () => {
        const { savedVolume } = this.state;
        if (savedVolume > 0) {
            player.unMute();
            this.setState({ isPlayerMuted: false, volume: savedVolume });
            this.setVolume(savedVolume )
        }
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
                autoplay: this.state.isPlayerPlaying ? 1 : 0,
                videoEmbeddable: true,
            }
        };

        const { isPlayerPlaying, isPlayerMuted, volume } = this.state;

        const {
            showPlayer,
            playerTitle,
            playerRelease,
            isNavBarOpened,
            setSpecificResult,
            isVisible,
            toggleNavBar,
            getRandomTrack,
            videoId,
            logout,
            randomTrackRequestPending
        } = this.props;

        return (
            <div>
                <Navbar color="dark"
                        light expand="sm"
                        className={`mb-5 navbar${isVisible ? ' visible' : ''}`}>
                    <NavbarBrand href="/">VYNILIZATOR</NavbarBrand>
                    <NavbarToggler color="dark" onClick={() => toggleNavBar(false)} />
                    <Collapse isOpen={isNavBarOpened} navbar>
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
                            <NavLink to={ROUTE_SOLD}
                                     activeClassName="selected">
                                SOLD
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
                            <a href={ROUTE_SIGN_IN} onClick={logout}>
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
                    <div className={`player-wrapper${showPlayer ? ' visible' : ''}`}>
                        <div className={randomTrackRequestPending ? 'loading' : ''} onClick={() => setSpecificResult(playerRelease)} >
                            <img className="release-thumbnail" src={playerRelease && playerRelease.thumb} />
                            <span className="player-title">{playerTitle}</span>
                        </div>
                        <div className={`player-controls-wrapper${showPlayer ? ' visible' : ''}`}>
                            {!isPlayerPlaying
                                ? <FaPlayCircle onClick={this.play} className="player-icon"></FaPlayCircle>
                                : <FaPauseCircle onClick={this.pause} className="player-icon"></FaPauseCircle>
                            }
                            <FaStepForward onClick={getRandomTrack} className="player-icon"></FaStepForward>
                            {isPlayerMuted
                                ? <FaVolumeMute onClick={this.unmute} className="player-icon volume"></FaVolumeMute>
                                : <FaVolume onClick={this.mute} className="player-icon volume"></FaVolume>
                            }
                            <Slider className="volume-slider"
                                    min={0} max={100}
                                    value={volume}
                                    onChange={(volume) => this.setVolume(volume)}
                                    defaultValue={50}   />
                        </div>
                    </div>
                </Navbar>
            </div>
        );
    }
}



export default AppNavBar;