import React, { useState, useRef, useContext, useEffect } from 'react'
import {WebPlayerContext} from '../context';
import styled from 'styled-components'

const StyledProgressbar = styled.div`
    .player--progressbar {

        &--current {
             width: ${props => `${(props.currentTime / props.totalTime) * 100}%`}
        }
    }
`

export default (props) => {
    const {player, connected } = useContext(WebPlayerContext)
    // console.log(getCurrentState())

    /* time = {
        current: <CURRENT>
        total: <TOTAL>
    }
    */
    const [time, getTime] = useState({
        current: 0,
        total: 0
    })


    useEffect(() => {
        console.log(connected);
        connected && 
        player?.isLoaded && 
            player.getCurrentState().then(res => {
                console.log(res)
                getTime(() => {
                return {
                    current: res.position,
                    total: res.duration
                }
            })
        })
    }, [connected])

    return (
        <section className="player">
            <div className="player--controls">
                <StyledProgressbar className="player--progressbar" currentTime={time.current} totalTime={time.total}>
                    <div className="player--progressbar--full"></div>
                    <div className="player--progressbar--current">
                        <div className="player--progressbar--current__thumb"></div>
                    </div>
                </StyledProgressbar>
            </div>
        </section>
    )
}