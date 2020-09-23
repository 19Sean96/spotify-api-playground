import React, { createContext, useEffect, useState } from 'react';


export const WebPlayer = createContext(null)

export default ({children}) => {
    const [tokens, setTokens] = useState([]);
    const [player, setPlayer] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        console.log('context')
        if(window.Spotify){
            const playerInit = window.onSpotifyWebPlaybackSDKReady;
            playerInit(tokens[0])
            setPlayer(window.webPlayer)
            setLoggedIn(true);
        }
    }, [tokens])

    return (
        <WebPlayer.Provider value={{loggedIn, tokens, player, setLogin: setLoggedIn, setPlayer, setTokens}}>
            {children}
        </WebPlayer.Provider>
    )
}