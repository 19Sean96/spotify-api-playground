import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { WebPlayerContext } from "../../context";
import { useSpring, animated, config } from "react-spring/three";
function Box(props) {
	// This reference will give us direct access to the mesh
	const mesh = useRef();
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	// const {analysis,features} = props.audioDetails
	// Rotate mesh every frame, this is outside of React without overhead
	const [tempo, setTempo] = useState();
	const [segmentIndex, setSegmentIndex] = useState(0);
	const [segmentAnimation, setSegmentAnimation] = useState({
		from: undefined,
		to: undefined,
		duration: 0,
	});
	const [currentBeat, setCurrentBeat] = useState({
		up: 0,
		down: 0,
	});

	const { features, analysis } = props.audioDetails;

	// useEffect(() => {

	// }, [analysis])

	console.log(config);

	useEffect(() => {
		setSegmentIndex(0);
	}, [props.track?.current_track.id]);

	useFrame(() => {
		if (analysis) {
			let current, next, dur;
			// console.log("ANALYSIS: ", analysis);
			// console.log(props.time.current);
			if (segmentIndex < analysis.segments.length - 1) {
				if (
					analysis.segments[segmentIndex + 1].start * 1000 <
					props.time.current
				) {
					setSegmentIndex(segmentIndex + 1);
					current = analysis.segments[segmentIndex];
					dur = current.duration;
					next = analysis.segments[segmentIndex + 1];
					console.log("CURRENT SEGMENT: ", current);
					console.log("SEGMENT DURATION: ", dur);
					console.log("NEXT SEGMENT: ", next);
					setSegmentAnimation({
						from: current,
						to: next,
						duration: dur,
					});
				}
			}

		}
		// console.log(analysis);
		// const {bars,beats,segments} = audioDetails.analysis
		// console.log(time);
		mesh.current.rotation.x = mesh.current.rotation.y += segmentAnimation.to
			? segmentAnimation.to.pitches[7] / 10
			: 0.05;
		// mesh.current.scale =
	});

	const animatedVals = useSpring({
		to: {
			scale: segmentAnimation.to
				? [
						1.5 *
							segmentAnimation.to.pitches[
								props.pitchToScaleIndex.x
							],
						1.5 *
							segmentAnimation.to.pitches[
								props.pitchToScaleIndex.y
							],
						1.5 *
							segmentAnimation.to.pitches[
								props.pitchToScaleIndex.z
							],
				  ]
				: [1, 1, 1],
		},
		config: config.wobbly,
	});

	return (
		<animated.mesh
			{...animatedVals}
			{...props}
			ref={mesh}
			onClick={(e) => setActive(!active)}
			onPointerOver={(e) => setHover(true)}
			onPointerOut={(e) => setHover(false)}
			onUpdate={(self) => console.log("PROPS HAVE BEEN UPDATED")}
		>
			<boxBufferGeometry args={[1, 1, 1]} />
			<meshPhysicalMaterial attach="material" color="#000" />
		</animated.mesh>
	);
}

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
				position={[1.2, 0, 0]}
				color="green"
				time={props.time}
				audioDetails={props.audioDetails}
				pitchToScaleIndex={{ x: 0, y: 1, z: 2 }}
				track={props.track}
			/>
			<Box
				position={[-1.2, 0, 0]}
				color="crimson"
				time={props.time}
				audioDetails={props.audioDetails}
				pitchToScaleIndex={{ x: 3, y: 4, z: 5 }}
				track={props.track}
			/>
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
