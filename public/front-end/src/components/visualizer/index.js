import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { useSpring, animated, config } from "react-spring/three";
import { MeshDistortMaterial, OrbitControls, Sky } from 'drei'
import Box from './Box'
import Glob from './Glob'

const boxes = [
	{
		pitchToScaleIndex: {
			x: 0,
			y: 2,
			z: 4
		},
		pitchToRotateIndex: {
			x: 1,
			y: 3,
			z: 5
		}
	},
	{
		pitchToScaleIndex: {
			x: 1,
			y: 3,
			z: 5
		},
		pitchToRotateIndex: {
			x: 0,
			y: 2,
			z: 4
		}
	},
	{
		pitchToScaleIndex: {
			x: 2,
			y: 4,
			z: 6
		},
		pitchToRotateIndex: {
			x: 3,
			y: 5,
			z: 7
		}
	},
	{
		pitchToScaleIndex: {
			x: 3,
			y: 5,
			z: 7
		},
		pitchToRotateIndex: {
			x: 2,
			y: 4,
			z: 6
		}
	},
	{
		pitchToScaleIndex: {
			x: 4,
			y: 6,
			z: 8
		},
		pitchToRotateIndex: {
			x: 5,
			y: 7,
			z: 9
		}
	},
	{
		pitchToScaleIndex: {
			x: 5,
			y: 7,
			z: 9
		},
		pitchToRotateIndex: {
			x: 4,
			y: 6,
			z: 8
		}
	},
	{
		pitchToScaleIndex: {
			x: 6,
			y: 8,
			z: 10
		},
		pitchToRotateIndex: {
			x: 7,
			y: 9,
			z: 11
		}
	},
	{
		pitchToScaleIndex: {
			x: 7,
			y: 9,
			z: 11
		},
		pitchToRotateIndex: {
			x: 6,
			y: 8,
			z: 10
		}
	},
	{
		pitchToScaleIndex: {
			x: 8,
			y: 10,
			z: 0
		},
		pitchToRotateIndex: {
			x: 9,
			y: 11,
			z: 1
		}
	},
	{
		pitchToScaleIndex: {
			x: 9,
			y: 11,
			z: 1
		},
		pitchToRotateIndex: {
			x: 8,
			y: 10,
			z: 0
		}
	},
	{
		pitchToScaleIndex: {
			x: 10,
			y: 0,
			z: 4
		},
		pitchToRotateIndex: {
			x: 11,
			y: 1,
			z: 5
		}
	},
	{
		pitchToScaleIndex: {
			x: 11,
			y: 1,
			z: 5
		},
		pitchToRotateIndex: {
			x: 10,
			y: 0,
			z: 4
		}
	},
	{
		pitchToScaleIndex: {
			x: 0,
			y: 4,
			z: 8
		},
		pitchToRotateIndex: {
			x: 1,
			y: 5,
			z: 9
		}
	}
]

const radius = 15;
const yPerRow = [
	3,2,1,0,-1,-2,-3
]
// const shapesPerRow = [
// 	1,
// 	3,
// 	7,
// 	13,
// 	7,
// 	3,
// 	1
// ]
// let yStart = radius

const getCirclePerimCoordinates = (quant, index, radius, start=[0,0,0] ) => {
	let x = start[0] + radius * Math.cos(2 * Math.PI * index / quant)
	let y = start[1] + radius 
	let z = start[1] + radius * Math.sin(2 * Math.PI * index / quant)
	return [x,z]
}

// const getSphereAreaCoordinate = (h, dY, dZ, r) => {
// 	// console.log("CURRENT Y: ", h);
// 	// console.log("CHANGE IN Y: ", dY);
// 	// console.log("CHANGE IN Z: ", dZ);
// 	let x = r * Math.cos(dZ) * Math.sin(dY)
// 	let y = r * Math.sin(dZ) * Math.sin(dY)
// 	let z = r * Math.cos(dY)
// 	return [x,y,z]
// }

// let b = 0;

function Visualizer(props) {
	console.log("VISUALIZER WAS RENDERED");
	return (
		<Canvas camera={{
			fov: 85,
			orthographic: true,
			position: [0,0,0.01]
		}}>
			<OrbitControls />
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
			{
				yPerRow.map((Y, i) => {

					return boxes.map((box,i) => {
						let y = 5;

						// for (i = z; i <= -5; i--) {
	
							let coordinate = getCirclePerimCoordinates(boxes.length, i, radius)
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
									
							)

					})

				})
			}

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
