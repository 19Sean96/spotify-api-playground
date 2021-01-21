import React, {useRef, useEffect, useState} from 'react'
import { useFrame } from 'react-three-fiber'
import { useSpring, animated, config } from "react-spring/three";
import { MeshWobbleMaterial } from 'drei'



export default function(props) {
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
		duration: 1,
	});
	const [currentBeat, setCurrentBeat] = useState({
		up: 0,
		down: 0,
	});

	const { features, analysis } = props.audioDetails;

	// useEffect(() => {

	// }, [analysis])

	// console.log(config);

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
					// console.log("CURRENT SEGMENT: ", current);
					// console.log("SEGMENT DURATION: ", dur);
					// console.log("NEXT SEGMENT: ", next);
					setSegmentAnimation({
						from: current,
						to: next,
						duration: dur,
					});
				}
			}

		}


		mesh.current.rotation.x += segmentAnimation.to ? segmentAnimation.to.pitches[
			props.pitchToRotateIndex.x
		] / 10 : .05

		mesh.current.rotation.y += segmentAnimation.to ? segmentAnimation.to.pitches[
			props.pitchToRotateIndex.y
		] / 10 : .05

		mesh.current.rotation.z += segmentAnimation.to ? segmentAnimation.to.pitches[
			props.pitchToRotateIndex.z
		] / 10 : .05
		
	});

	const animatedVals = useSpring({
		to: {
			scale: segmentAnimation.to
				? [
						.5 + .075 *
							segmentAnimation.to.timbre[
								props.pitchToScaleIndex.x
							],
						.5 + .075 *
							segmentAnimation.to.timbre[
								props.pitchToScaleIndex.y
							],
						.5 + .075 *
							segmentAnimation.to.timbre[
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
			// onUpdate={(self) => console.log("PROPS HAVE BEEN UPDATED")}
		>
			<boxBufferGeometry args={[1, 1, 1]} />
			{/* <meshPhysicalMaterial attach="material" color={props.color} /> */}
			<MeshWobbleMaterial attach="material" factor={.1} color={props.color}/>
		</animated.mesh>
	);
}