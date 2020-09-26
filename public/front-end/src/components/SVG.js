import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import styled from "styled-components";

gsap.registerPlugin(MorphSVGPlugin);

const StyledSVG = styled.svg`
    transform: ${props => !props.isPlaying ? "translate(-42.5%,-40%)" : "translate(-50%,-50%)"};
`

const MorphPlayPauseSVG = (props) => {
	const pausePath = useRef();
	const playPath = useRef();

	useEffect(() => {
		if (!props.isPlaying) {
			gsap.to(pausePath.current, {
				morphSVG: playPath.current,
				duration: 0.125,
			});
		} else {
			gsap.to(pausePath.current, {
				morphSVG: pausePath.current,
				duration: 0.125,
			});
		}
	}, [props.isPlaying]);
	return (
		<StyledSVG
			xmlns="http://www.w3.org/2000/svg"
			// width="31.5"
			// height="31.5"
            viewBox="0 0 31.5 31.5"
            isPlaying={props.isPlaying}
		>
			<path
				id="Icon_awesome-pause"
				data-name="Icon awesome-pause"
				d="M10.125,33.68H3.375A3.376,3.376,0,0,1,0,30.3V5.555A3.376,3.376,0,0,1,3.375,2.18h6.75A3.376,3.376,0,0,1,13.5,5.555V30.3A3.376,3.376,0,0,1,10.125,33.68ZM31.5,30.3V5.555A3.376,3.376,0,0,0,28.125,2.18h-6.75A3.376,3.376,0,0,0,18,5.555V30.3a3.376,3.376,0,0,0,3.375,3.375h6.75A3.376,3.376,0,0,0,31.5,30.3Z"
				transform={"translate(0 -2.18)"}
				fill="#f5f5f5"
				ref={pausePath}
			/>
			<path
				id="Icon_awesome-play"
				data-name="Icon awesome-play"
				d="M29.841,13.209,5.091.406C3.08-.633,0,.376,0,2.947v25.6c0,2.307,2.862,3.7,5.091,2.541l24.751-12.8a2.775,2.775,0,0,0,0-5.082Z"
				transform="translate(0 -0.002)"
                fill="#fff"
                ref={playPath}
				style={{ visibility: "hidden" }}
			/>

		</StyledSVG>
	);
};

export { MorphPlayPauseSVG };
