import React, { createContext, useEffect, useState } from 'react';


export const WebPlayer = createContext(null)

export default ({children}) => {
    const [tokens, setTokens] = useState([]);
    const [player, setPlayer] = useState({});

    useEffect(() => {
        if(window.Spotify){
            const playerInit = window.onSpotifyWebPlaybackSDKReady;
            playerInit(tokens[0])
            setPlayer(window.webPlayer)
        }
    }, [tokens])

    return (
        <WebPlayer.Provider value={{tokens, player, setPlayer, setTokens}}>
            {children}
        </WebPlayer.Provider>
    )
}