import React, { createContext, useEffect, useState } from 'react';


export const WebPlayerContext = createContext(null)

export default ({children}) => {
    const [tokens, setTokens] = useState([]);
    const [player, setPlayer] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const [connected, setConnected] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false)
    const handleSDKLoaded = () => {
        return new Promise((resolve) => {
            if (window.Spotify) {
                resolve();
            } else {
                window.onSpotifyWebPlaybackSDKReady = resolve;
            }
        });
    }

    useEffect(() => {
        console.log(tokens);
        console.log('setting player')
        if (tokens.length > 1) {
            handleSDKLoaded().then(() => {
                setPlayer(
                    new window.Spotify.Player({
                        name: 'Chromesthetics',
                        getOAuthToken: cb => cb(tokens[0]),
                        volume: .1
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
                console.log(state);
                setIsPlaying(!state.paused)
                setConnected(state !== null ? true : false);
            });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            player.connect().then(connected => {
                console.log(connected);
            });
        }
    }, [player])

    return (
        <WebPlayerContext.Provider value={{connected, loggedIn, tokens, isPlaying, player, setLoggedIn, setPlayer, setTokens, setConnected}}>
            {children}
        </WebPlayerContext.Provider>
    )
}