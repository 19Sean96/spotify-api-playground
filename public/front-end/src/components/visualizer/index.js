import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "react-three-fiber";
import { useSpring, animated, config } from "react-spring/three";
import { MeshDistortMaterial, OrbitControls, Sky } from "drei";
import Box from "./Box";
import Glob from "./Glob";
import { shuffleArray } from "../../functions";
import { MeshWobbleMaterial } from "drei";

let boxes = [
	{
		pitchToScaleIndex: {
			x: 0,
			y: 2,
			z: 4,
		},
		pitchToRotateIndex: {
			x: 1,
			y: 3,
			z: 5,
		},
	},
	{
		pitchToScaleIndex: {
			x: 1,
			y: 3,
			z: 5,
		},
		pitchToRotateIndex: {
			x: 0,
			y: 2,
			z: 4,
		},
	},
	{
		pitchToScaleIndex: {
			x: 2,
			y: 4,
			z: 6,
		},
		pitchToRotateIndex: {
			x: 3,
			y: 5,
			z: 7,
		},
	},
	{
		pitchToScaleIndex: {
			x: 3,
			y: 5,
			z: 7,
		},
		pitchToRotateIndex: {
			x: 2,
			y: 4,
			z: 6,
		},
	},
	{
		pitchToScaleIndex: {
			x: 4,
			y: 6,
			z: 8,
		},
		pitchToRotateIndex: {
			x: 5,
			y: 7,
			z: 9,
		},
	},
	{
		pitchToScaleIndex: {
			x: 5,
			y: 7,
			z: 9,
		},
		pitchToRotateIndex: {
			x: 4,
			y: 6,
			z: 8,
		},
	},
	{
		pitchToScaleIndex: {
			x: 6,
			y: 8,
			z: 10,
		},
		pitchToRotateIndex: {
			x: 7,
			y: 9,
			z: 11,
		},
	},
	{
		pitchToScaleIndex: {
			x: 7,
			y: 9,
			z: 11,
		},
		pitchToRotateIndex: {
			x: 6,
			y: 8,
			z: 10,
		},
	},
];

const radius = 15;
const yPerRow = [1, 0, -1];

const getCirclePerimCoordinates = (
	quant,
	index,
	radius,
	start = [-8, 0, -15]
) => {
	// let x = start[0] + radius * (2 * Math.PI * index / quant)
	let x = start[0] + index * 2;
	let y = start[1] + radius;
	let z = start[2];
	return [x, z];
};

const Reflection = (props) => {
	const { features } = props.audioDetails
	const light_1 = useRef();
	const [cos, setCos] = useState(0)
	const [sin, setSin] = useState(0)
	useFrame(() => {
		if (features) {
			setCos(cos + features.tempo / 2500)
			setSin(sin + features.tempo / 1000)
			light_1.current.position.x +=  Math.cos(cos / features.acousticness) 
			light_1.current.position.y += Math.sin(sin* features.time_signature)
			light_1.current.position.z += Math.sin(cos / features.time_signature) / 2
		}

	});
	return (
		<pointLight
			distance={0}
			intensity={1}
			position={[0, 0, -15]}
			// color="#D96B43"
			color="#59cB83"

			angle={10}
			power={8 * (4 * Math.PI)}
			castShadow={true}
			ref={light_1}
		/>
	);
};

function Visualizer(props) {
	const globe = useRef();

	return (
		<Canvas
			camera={{
				fov: 95,
				orthographic: true,
				position: [0, 0, 15],
			}}
		>
			<Reflection audioDetails={props.audioDetails}/>
			<OrbitControls />
			<spotLight
				position={[0, 25, 0]}
				angle={1}
				penumbra={0.34}
				distance={200}
				castShadow={true}
			/>

			<animated.mesh position={[0, 0, 0]}>
				<sphereBufferGeometry args={[25, 16, 16]} />
				<meshStandardMaterial
					attach="material"
					metalness={1}
					roughness={0.1}
					color={"#0xb385"}
					emissive={"#111"}
					side={THREE.DoubleSide}
					depthTest={true}
				/>
			</animated.mesh>
			{yPerRow.map((Y, i) => {
				boxes = shuffleArray(boxes);
				return boxes.map((box, i) => {
					let y = 5;

					// for (i = z; i <= -5; i--) {

					let coordinate = getCirclePerimCoordinates(
						boxes.length,
						i,
						radius
					);
					return (
						<Box
							position={[coordinate[0], Y * 3, coordinate[1]]}
							time={props.time}
							audioDetails={props.audioDetails}
							pitchToScaleIndex={box.pitchToScaleIndex}
							pitchToRotateIndex={box.pitchToRotateIndex}
							track={props.track}
							color={i % 2 === 0 ? "#333" : "#ddd"}
						/>
					);
				});
			})}
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
