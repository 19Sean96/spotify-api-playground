import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { WebPlayerContext } from '../../context'; 
import { useSpring, animated, config } from 'react-spring/three'
function Box(props) {
	// This reference will give us direct access to the mesh
	const mesh = useRef();
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
    // const {analysis,features} = props.audioDetails
	// Rotate mesh every frame, this is outside of React without overhead
	const [tempo, setTempo] = useState()
	const [segmentIndex, setSegmentIndex] = useState(0)
	const [segmentAnimation, setSegmentAnimation] = useState({
		from: undefined,
		to: undefined,
		duration: 0
	})
	const [currentBeat, setCurrentBeat] = useState({
		up: 0,
		down: 0
	})

	const { features, analysis } = props.audioDetails

	// useEffect(() => {

	// }, [analysis])

	console.log(config);

	useFrame(() => {
		if (analysis) {
			let current, next, dur
			// console.log("ANALYSIS: ", analysis);
			// console.log(props.time.current);
			if (analysis.segments[segmentIndex + 1].start * 1000 < props.time.current) {
				setSegmentIndex(segmentIndex + 1);
				current = analysis.segments[segmentIndex];
				dur = current.duration;
				next = analysis.segments[segmentIndex + 1];
				console.log("CURRENT SEGMENT: ", current)
				console.log("SEGMENT DURATION: ", dur);
				console.log("NEXT SEGMENT: ", next)
				setSegmentAnimation({
					from: current,
					to: next,
					duration: dur
				})
			}

		}
        // console.log(analysis);
        // const {bars,beats,segments} = audioDetails.analysis
        // console.log(time);
        mesh.current.rotation.x = mesh.current.rotation.y += 0.05;
        // mesh.current.scale = 
	}); 

	const animatedVals = useSpring({

		to: {
			scale: segmentAnimation.to ? [
				1.5 * segmentAnimation.to.pitches[0],
				1.5 * segmentAnimation.to.pitches[0],
				1.5 * segmentAnimation.to.pitches[0]
			] : [1,1,1]
		},
		config: config.wobbly
	})


	return (
		<animated.mesh
			{...animatedVals}
			{...props}
			ref={mesh}
			onClick={(e) => setActive(!active)}
			onPointerOver={(e) => setHover(true)}
            onPointerOut={(e) => setHover(false)}
            onUpdate={self => console.log("PROPS HAVE BEEN UPDATED")}
		>
			<boxBufferGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? "hotpink" : props.color} />
		</animated.mesh>
	);
}

function Visualizer(props) {
	return (
		<Canvas>
			<ambientLight intensity={0.5} />
			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
			<pointLight position={[-10, -10, -10]} />
			<Box position={[1.2, 0, 0]} color="green" time={props.time} audioDetails={props.audioDetails} />
			<Box position={[-1.2, 0, 0]} color="crimson" time={props.time} audioDetails={props.audioDetails}/>
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