import React, {useRef, useEffect, useState} from 'react'
import { useFrame } from 'react-three-fiber'
import { useSpring, animated, config } from "react-spring/three";
import { MeshDistortMaterial } from 'drei'



export default function({ audioDetails, track, time }) {
	const mesh = useRef()
	const material = useRef()
    const [segmentIndex, setSegmentIndex] = useState(0);
	const [segmentAnimation, setSegmentAnimation] = useState({
		from: undefined,
		to: undefined,
		duration: 1,
    });
    const { features, analysis } = audioDetails;

	useFrame(({ clock }) => {
        // material.current.distort = Math.sin(segmentAnimation.duration * 10)
        // console.log(mesh.current.quaternion);
        if (analysis) {
			let current, next, dur;

			if (segmentIndex < analysis.segments.length - 1) {
				if (
					analysis.segments[segmentIndex + 1].start * 1000 <
					time.current
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
        

    })
    
    const animatedVals = useSpring({
        to: {
            distort: segmentAnimation.to ? Math.sin(segmentAnimation.duration * 10): 1
        },
        config: config.wobbly
    })
	return (
		<animated.mesh
            ref={mesh}	
            {...animatedVals}
		>
			<icosahedronBufferGeometry args={[1,4]} wireframe="true"/>
			<meshPhysicalMaterial attach="material" color="#000" ref={material}/>

		</animated.mesh>
	)
}