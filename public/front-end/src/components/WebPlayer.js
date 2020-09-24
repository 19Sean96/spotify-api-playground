import React, { useState, useRef, useContext, useEffect } from "react";
import { WebPlayerContext } from "../context";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faFastBackward, faFastForward, faUndoAlt, faRedoAlt} from '@fortawesome/free-solid-svg-icons'
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(MorphSVGPlugin)

// transition: width .5s linear;
const StyledProgressbar = styled.div`
	.player--progressbar {
		&--current {
			width: ${(props) =>
				`${(props.width * 100)}%`};
		}
	}
`;

export default (props) => {
	const { player, connected, isPlaying } = useContext(WebPlayerContext);
	// console.log(getCurrentState())

	/* time = {
        current: <CURRENT>
        total: <TOTAL>
    }
    */
   const controlThumb = useRef(null)
   const controlBar = useRef(null)
    const [thumbStart, setThumbStart] = useState()
    const [currentThumbPos, setCurrentThumbPos] = useState()
    const [prevThumbPos, setPrevThumbPos] = useState()
    const [isDragging, setDragging] = useState(false)
    const [barWidth, getBarWidth] = useState()
    const [currentBarWidth, setCurrentBarWidth] = useState()
	const [time, setTime] = useState({
		current: 0,
		total: 0,
	});

	useEffect(() => {
		console.log(connected);
		connected &&
			player?.isLoaded &&
			player.getCurrentState().then((res) => {
				console.log(res);
				setTime(() => {
					return {
						current: res.position,
						total: res.duration,
					};
                });
                setCurrentBarWidth(res.position / res.duration)
			});
	}, [connected]);

	useEffect(() => {
        console.log(player);
        let timeout;

		if (isPlaying) {
            console.log("THE SONG IS PLAYING")
			timeout = setTimeout(() => {
				setTime(() => {
					return {
						current: time.current + 500,
						total: time.total,
					};
                });
                setCurrentBarWidth(time.current / time.total)

			}, 500);
		} else {
            console.log("THE SONG IS *NOT* PLAYING")
            return () => clearTimeout(timeout);
        }
	}, [isPlaying, time]);

    let prevDragX;
    
	return (
		<section className="player">
			<div className="player--controls">
                <div className="player--controls--buttons">
                    <div className="player--skip-back player--controls--button__wrapper">
                        <button onClick={() => player.previousTrack()} className="player--skip-back__button player--controls--button">
                            <FontAwesomeIcon icon={faFastBackward} />
                        </button>
                    </div>
                    <div className="player--back-30 player--controls--button__wrapper">
                        <button className="player--back-30__button player--controls--button">
                            <FontAwesomeIcon icon={faUndoAlt} />
                        </button>
                    </div>
                    <div className="player--play player--controls--button__wrapper">
                        <button onClick={() => player.togglePlay()} className="player--play__button player--controls--button">
                            <FontAwesomeIcon icon={faPlay} />
                        </button>
                    </div>
                    <div className="player--forward-30 player--controls--button__wrapper">                        
                        <button className="player--forward-30__button player--controls--button">
                            <FontAwesomeIcon icon={faRedoAlt} />
                        </button></div>
                    <div className="player--skip-forward player--controls--button__wrapper">
                        <button onClick={() => player.nextTrack()} className="player--skip-forward__button player--controls--button">
                            <FontAwesomeIcon icon={faFastForward} />
                        </button>
                    </div>
                </div>
				<StyledProgressbar
					className="player--progressbar"
                    ref={controlBar}
                    width={currentBarWidth}
				>
					<div className="player--progressbar--full"></div>
					<div className="player--progressbar--current">
                        <div draggable="true" onDragStart={e => {
                            console.log("REACT EVENT =>", e)
                            console.log("NATIVE EVENT => ", e.nativeEvent);
                            setThumbStart(e.clientX)
                            setCurrentThumbPos(e.clientX)
                            setPrevThumbPos(e.clientX)
                            setDragging(true)
                            getBarWidth(controlBar.current.clientWidth)

                        }} onDrag={e => {
                            setCurrentThumbPos(e.clientX)
                            const changeInWidth = (currentThumbPos - prevThumbPos) / controlBar.current.clientWidth
                            // console.log("REACT EVENT =>", e)
                            // console.log("NATIVE EVENT => ", e.nativeEvent);
                            // console.log("THUMB REF => ", controlThumb)
                            console.log("CHANGE IN WIDTH (decimal) ", changeInWidth)
                            setCurrentBarWidth(currentBarWidth + changeInWidth)
                            setPrevThumbPos(currentThumbPos)
                        }} onDragEnd={e => {
                            setDragging(false)
                        }}
                        ref={controlThumb}
                        className="player--progressbar--current__thumb"></div>
					</div>
				</StyledProgressbar>
			</div>
		</section>
	);
};
