import React, { createContext, useEffect, useState, useRef } from 'react';
import axios from "axios";
import { getAudioAnalysis, getAudioFeatures, setCurrentDevice } from '../functions'

export const WebPlayerContext = createContext(null)


export default ({children}) => {

    const requestRef = useRef(null)
    
    const [timeTracker, setTimeTracker] = useState(0)
    const [tokens, setTokens] = useState([]);
    const [player, setPlayer] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const [connected, setConnected] = useState(false);
    const [device, setDevice] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false);
    const [track,setTrack] = useState();
    const [currentBarWidth, setCurrentBarWidth] = useState();

    const [audioDetails, setAudioDetails] = useState({
        features: undefined,
        analysis: undefined
    })
    const [time, setTime] = useState({
		current: 0,
		total: 0,
    });
    
    const handleSDKLoaded = () => {
        return new Promise((resolve) => {
            if (window.Spotify) {
                resolve();
            } else {
                window.onSpotifyWebPlaybackSDKReady = resolve;
            }
        });
    }

    const getSongTimeStamp = () => {
        player.getCurrentState().then((res) => {
            if (res?.position && res?.duration) {
                setTime(() => {
                    return {
                        current: res.position,
                        total: res.duration,
                    };
                });
                setCurrentBarWidth(res.position / res.duration);
            }
        })

    }

    const trackSongTime = t => {
        // console.log(t);
        if (!isPlaying) {
            console.log("IT IS NOT PLAYING");
            requestRef.current = null;
            return cancelAnimationFrame(requestRef.current);
        }

        if (isPlaying) {

            getSongTimeStamp();
            requestAnimationFrame(trackSongTime)
        } 
    }

    useEffect(() => {
        if (requestRef.current == null) {
            requestRef.current = requestAnimationFrame(trackSongTime)
        }

        return () => cancelAnimationFrame(requestRef.current)
    }, [isPlaying])


    useEffect(() => {
        
		if (track) {
            const { id } = track.current_track;
            getSongTimeStamp();
            getAudioAnalysis(id,tokens[0]).then((analysis) => getAudioFeatures(id,tokens[0]).then(features => setAudioDetails({features,analysis})))   
        }
        
    }, [track]);

    useEffect(() => {

        if (tokens.length > 1) {
            handleSDKLoaded().then(() => {
                setPlayer(
                    new window.Spotify.Player({
                        name: 'Chromesthetics',
                        getOAuthToken: cb => cb(tokens[0]),
                        volume: .05
                    })
                )
                setLoggedIn(true);
            })
        }
    }, [tokens])

    useEffect(() => {

        if(player){
            // Error handling
            player.addListener('initialization_error', ({ message }) => { console.error(`init error: ${message}`); });
            player.addListener('authentication_error', ({ message }) => { console.error(`auth error: ${message}`); });
            player.addListener('account_error', ({ message }) => { console.error(`account error: ${message}`); });
            player.addListener('playback_error', ({ message }) => { console.error(`play error: ${message}`); });

            // Playback status updates
            player.addListener('player_state_changed', state => {
                console.log("*STATE*", state);
                if (state !== null) {
                    if (!connected) {
                        setConnected(true)
                    }

                    setTrack(state.track_window)
                    setIsPlaying(!state.paused)
                }
                else {
                    setConnected(false);
                }

            });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                if (!device) {
                    setCurrentDevice(tokens[0], device_id).then((res) => {
                        console.log(res);
                        setDevice(res)
                        // setIsPlaying(true)
                    })
                }
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                setConnected(false)
            });

            // Connect to the player!
            player.connect().then(connected => {
                setConnected(true)
                console.log(connected);
            });
        }
    }, [player])

    return (
        <WebPlayerContext.Provider value={{connected, loggedIn, tokens,setIsPlaying, isPlaying, player, setLoggedIn, setPlayer, setTokens, setConnected, track, audioDetails, time, setTime, device, currentBarWidth}}>
            {children}
        </WebPlayerContext.Provider>
    )
}