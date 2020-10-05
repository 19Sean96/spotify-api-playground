import React, { useState, useRef, useContext, useEffect } from "react";
import { WebPlayerContext } from "../context";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFastBackward,
	faFastForward,
	faUndoAlt,
	faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";

import { MorphPlayPauseSVG } from "./SVG";

// transition: width .5s linear;
const StyledProgressbar = styled.div`
	.player--progressbar {
		&--current {
			width: ${(props) => `${props.width * 100}%`};
		}
	}
`;

let timeout;

export default (props) => {
	const {
		player,
		connected,
		isPlaying,
		setIsPlaying,
		track,
		tokens,
		time,
		setTime,
		device,
		currentBarWidth
	} = useContext(WebPlayerContext);

	const controlThumb = useRef(null);
	const controlBar = useRef(null);
	const timeRequestRef = useRef();
	const prevAnimTime = useRef();
	const [thumbStart, setThumbStart] = useState();
	const [currentThumbPos, setCurrentThumbPos] = useState();
	const [prevThumbPos, setPrevThumbPos] = useState();
	const [isDragging, setDragging] = useState(false);

	// const updateBarWidth = (animTime) => {
	// 	// console.log(timeRequestRef);
	// 	// console.log(animTime);

	// 	if (isPlaying && !isDragging && device) {
	// 		console.log("THE SONG IS PLAYING");

	// 		// console.log(`Time before request: ${Date.now()}`);
	// 		player.getCurrentState().then((res) => {


	// 			timeRequestRef.current = requestAnimationFrame(() =>
	// 				updateBarWidth(res.position)
	// 			);
	// 		});
	// 	}
	// 	if (isDragging) {
	// 		player.pause();
	// 	} else {
	// 		// console.log("THE SONG IS *****NOT****** PLAYING");
	// 		timeRequestRef.current = requestAnimationFrame(() =>
	// 			updateBarWidth(time.current)
	// 		);
	// 	}
	// };

	// useEffect(() => {
	// 	timeRequestRef.current = requestAnimationFrame(() =>
	// 		updateBarWidth(time.current)
	// 	);

	// 	return () => cancelAnimationFrame(timeRequestRef.current);
	// }, [isPlaying]);

	// useEffect(() => {
	//     console.log(player);

	// 	if (isPlaying) {
	//         console.log("THE SONG IS PLAYING")
	//         timeRequestRef.current = requestAnimationFrame(updateBarWidth)
	// 		// timeout = setTimeout(() => {
	// 			// setTime(() => {
	// 			// 	return {
	// 			// 		current: time.current + 500,
	// 			// 		total: time.total,
	// 			// 	};
	//             // });
	//             // setCurrentBarWidth(res.position / res.duration)
	// 		// }, 500);
	// 	} else {
	//         console.log("THE SONG IS *NOT* PLAYING")
	//         return () => cancelAnimationFrame(timeRequestRef.current);
	//     }
	// }, [isPlaying, time]);


	return (
		<main className="dashboard">
			<div className="current">
				{track && (
					<>
						<h2 className="current--song">
							{track.current_track.name}
						</h2>
						<h2 className="current--artist">
							{track.current_track.artists[0].name}
						</h2>
					</>
				)}
			</div>
			<section className="player">
				<div className="player--controls">
					<div className="player--controls--buttons">
						<div className="player--skip-back player--controls--button__wrapper">
							<button
								onClick={() => player.previousTrack()}
								className="player--skip-back__button player--controls--button"
							>
								<FontAwesomeIcon icon={faFastBackward} />
							</button>
						</div>
						<div className="player--back-30 player--controls--button__wrapper">
							<button
								onClick={() => {
									let newTime;
									if (time.current <= 30000) {
										newTime = 0;
									} else newTime = time.current - 30000;
									player.seek(newTime);
								}}
								className="player--back-30__button player--controls--button"
							>
								<span className="thirty">30</span>
								<FontAwesomeIcon icon={faUndoAlt} />
							</button>
						</div>
						<div className="player--play player--controls--button__wrapper">
							<button
								onClick={() => {
									player
										.togglePlay()
										.then(
											() =>
												!isPlaying &&
												cancelAnimationFrame(
													timeRequestRef.current
												)
										);
								}}
								className="player--play__button player--controls--button"
							>
								{/* <FontAwesomeIcon icon={faPlay} ref={playIcon}/> */}
								<MorphPlayPauseSVG isPlaying={isPlaying} />
							</button>
						</div>
						<div className="player--forward-30 player--controls--button__wrapper">
							<button
								onClick={() =>
									player.seek(time.current + 30000)
								}
								className="player--forward-30__button player--controls--button"
							>
								{" "}
								<span className="thirty">30</span>
								<FontAwesomeIcon icon={faRedoAlt} />
							</button>
						</div>
						<div className="player--skip-forward player--controls--button__wrapper">
							<button
								onClick={() =>
									player.nextTrack().then(() => {
										player
											.getCurrentState()
											.then((response) => {
												console.log(response);
												setTime(() => ({
													current: response.position,
													total: response.duration,
												}));
												clearTimeout(timeout);
												console.log(
													"THE NEW WIDTH: ",
													time.current / time.total
												);

											});
									})
								}
								className="player--skip-forward__button player--controls--button"
							>
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
							<div
								draggable="true"
								// onMouseDown={e => {

								// }}

								onDragStart={(e) => {

									setThumbStart(e.clientX);
									setCurrentThumbPos(e.clientX);
									setPrevThumbPos(e.clientX);
									setDragging(true);
								}}
								onDrag={(e) => {
									setCurrentThumbPos(e.clientX);
									const changeInWidth =
										(currentThumbPos - prevThumbPos) /
										controlBar.current.clientWidth;

									setPrevThumbPos(currentThumbPos);
								}}
								onDragEnd={(e) => {
									setDragging(false);
									player.seek(time.total * currentBarWidth);
								}}
								ref={controlThumb}
								className="player--progressbar--current__thumb"
							></div>
						</div>
					</StyledProgressbar>
				</div>
			</section>
			<div className="scales">
				<div className="scales--item scales__volume"></div>
				<div className="scales--item scales__zoom"></div>
			</div>
		</main>
	);
};
