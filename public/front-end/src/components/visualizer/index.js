import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { WebPlayerContext } from "../../context";
import { useSpring, animated, config } from "react-spring/three";
import { MeshDistortMaterial, Sky } from 'drei'
import Box from './Box'
import Glob from './Glob'

function Visualizer(props) {


	return (
		<Canvas>
			<ambientLight intensity={0.5} />
			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
			{/* <pointLight position={[-10, -10, -10]} /> */}
			<pointLight
				distance={20}
				intensity={2}
				position={[1, 1, 0]}
				color="#D96B43"
			/>
			<pointLight
				distance={20}
				intensity={0.5}
				position={[2, 4, 1]}
				color="#fff"
			/>
			<pointLight
				distance={20}
				intensity={1.3}
				position={[2, 1, 0]}
				color="lightblue"
			/>
			<Box
				position={[-3.6, 0, -1]}
				time={props.time}
				audioDetails={props.audioDetails}
				pitchToScaleIndex={{ x: 0, y: 2, z: 4 }}
				pitchToRotateIndex={{ x: 1, y: 3, z: 5 }}
				track={props.track}
				color="#000"
			/>
			<Box
				position={[-1.2, 0, -1]}
				time={props.time}
				audioDetails={props.audioDetails}
				pitchToScaleIndex={{ x: 1, y: 3, z: 5 }}
				pitchToRotateIndex={{ x: 2, y: 4, z: 6 }}
				track={props.track}
				color="#df3333"
			/>
			<Box
				position={[1.2, 0, -1]}
				time={props.time}
				audioDetails={props.audioDetails}
				pitchToScaleIndex={{ x: 6, y: 8, z: 10 }}
				pitchToRotateIndex={{ x: 7, y: 9, z: 11 }}
				track={props.track}
				color="#eee"
			/>
			<Box
				position={[3.6, 0, -1]}
				time={props.time}
				audioDetails={props.audioDetails}
				pitchToScaleIndex={{ x: 7, y: 9, z: 11 }}
				pitchToRotateIndex={{ x: 8, y: 10, z: 0 }}
				track={props.track}
				color="#3333df"
			/>
			{/* <Glob 
				position={[0,0,1]}
				audioDetails={props.audioDetails}
				time={props.time}
				track={props.track}
			/> */}
		</Canvas>
	);
}

export default Visualizer;

/* ANIMATION STEPS FOR VISUALIZER 
*******************************'
	* 1. ON EVERY FRAME get current time stamp for song
	* 2. compare current time stamp against current beat ('i') and next beat ('i + 1') to detect if new beat or not
	* 3. BEAT ANIMATED DETAILS: 
			- on 'UPBEAT' - (beat-duration / 2) - grow relative to loudness, referred in 'SEGMENTS'

			*/
