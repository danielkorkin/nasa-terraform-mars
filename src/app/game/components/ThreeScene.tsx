"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Resources {
	power: number;
	water: number;
	materials: number;
	money: number;
}

interface Terraforming {
	atmosphere: number; // Percentage
	temperature: number; // Celsius
	waterPresence: number; // Percentage
	biodiversity: number; // Percentage
}

interface ThreeSceneProps {
	resources: Resources;
	terraforming: Terraforming;
}

export default function ThreeScene({
	resources,
	terraforming,
}: ThreeSceneProps) {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene>();

	useEffect(() => {
		const width = mountRef.current?.clientWidth || window.innerWidth;
		const height = mountRef.current?.clientHeight || window.innerHeight;

		// Create scene
		const scene = new THREE.Scene();
		sceneRef.current = scene;

		// Create camera
		const camera = new THREE.PerspectiveCamera(
			45,
			width / height,
			0.1,
			1000,
		);
		camera.position.z = 5;

		// Create renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		renderer.setClearColor(new THREE.Color("#000000"));

		mountRef.current?.appendChild(renderer.domElement);

		// Add a directional light
		const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
		directionalLight.position.set(5, 10, 7.5);
		scene.add(directionalLight);

		// Create a sphere to represent Mars
		const geometry = new THREE.SphereGeometry(1.5, 32, 32);
		const marsMaterial = new THREE.MeshPhongMaterial({ color: 0xff5533 });
		const mars = new THREE.Mesh(geometry, marsMaterial);
		scene.add(mars);

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);

			// Rotate the Mars sphere
			mars.rotation.y += 0.002;

			// Adjust color based on terraforming metrics
			// We'll do a simple blend from red to green as atmosphere/biodiversity grow
			const atmosphereRatio = Math.min(terraforming.atmosphere / 100, 1);
			const biodiversityRatio = Math.min(
				terraforming.biodiversity / 100,
				1,
			);

			// Let's assume color transitions from red (0xff5533) to green (0x33ff55)
			// We can do a simple lerp between these colors:
			const startColor = new THREE.Color(0xff5533);
			const endColor = new THREE.Color(0x33ff55);
			const mixedColor = startColor.lerp(
				endColor,
				(atmosphereRatio + biodiversityRatio) / 2,
			);
			marsMaterial.color.set(mixedColor);

			// Render
			renderer.render(scene, camera);
		};
		animate();

		// Handle resizing
		const handleResize = () => {
			const newWidth = mountRef.current?.clientWidth || window.innerWidth;
			const newHeight =
				mountRef.current?.clientHeight || window.innerHeight;
			renderer.setSize(newWidth, newHeight);
			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();
		};
		window.addEventListener("resize", handleResize);

		// Cleanup on unmount
		return () => {
			window.removeEventListener("resize", handleResize);
			mountRef.current?.removeChild(renderer.domElement);
		};
	}, [terraforming]);

	return <div className="w-full h-full" ref={mountRef} />;
}
