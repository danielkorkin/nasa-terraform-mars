"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGameStore } from "../hooks/useGameStore";

export default function ThreeScene() {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const sphereRef = useRef<THREE.Mesh | null>(null);

	const {
		terraforming,
		brushMode,
		placeMode,
		setTerrainColor,
		adjustElevation,
		addHouseAt,
		addGreenhouseAt,
	} = useGameStore();

	// For loading house/greenhouse
	const [houseModel, setHouseModel] = useState<THREE.Group | null>(null);
	const [greenhouseModel, setGreenhouseModel] = useState<THREE.Group | null>(
		null
	);

	// House/Greenhouse instances displayed
	const houseMeshesRef = useRef<THREE.Object3D[]>([]);
	const greenhouseMeshesRef = useRef<THREE.Object3D[]>([]);

	useEffect(() => {
		if (!mountRef.current) return;
		const width = mountRef.current.clientWidth;
		const height = mountRef.current.clientHeight;

		// Scene
		const scene = new THREE.Scene();
		sceneRef.current = scene;
		scene.fog = new THREE.FogExp2(0xffffff, 0.01);

		// Camera
		const camera = new THREE.PerspectiveCamera(
			45,
			width / height,
			0.1,
			1000
		);
		camera.position.set(0, 0, 5);
		cameraRef.current = camera;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000, 1);
		mountRef.current.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.minDistance = 2;
		controls.maxDistance = 20;

		// Lights
		const dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(5, 10, 5);
		scene.add(dirLight);
		scene.add(new THREE.AmbientLight(0xffffff, 0.2));

		// Create a subdivided sphere for vertex painting
		const geometry = new THREE.SphereGeometry(1.5, 128, 128);
		// Initialize vertex colors (all Mars-like for start)
		const colorAttr = new THREE.Float32BufferAttribute(
			geometry.attributes.position.count * 3,
			3
		);
		for (let i = 0; i < colorAttr.count; i++) {
			colorAttr.setXYZ(i, 0.8, 0.3, 0.2); // More Mars-like red
		}
		geometry.setAttribute("color", colorAttr);

		// Make it support vertex coloring
		const material = new THREE.MeshPhongMaterial({
			vertexColors: true,
			shininess: 10, // Add some shininess for better water effect
			flatShading: false, // Smooth shading
		});
		const sphereMesh = new THREE.Mesh(geometry, material);
		sphereRef.current = sphereMesh;
		scene.add(sphereMesh);

		// GLTF Loader
		const loader = new GLTFLoader();
		loader.load("/models/house-mars.glb", (gltf) =>
			setHouseModel(gltf.scene)
		);
		loader.load("/models/greenhouse-mars.glb", (gltf) =>
			setGreenhouseModel(gltf.scene)
		);

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};
		animate();

		// Resize
		const handleResize = () => {
			const w = mountRef.current?.clientWidth ?? 0;
			const h = mountRef.current?.clientHeight ?? 0;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		};
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
			if (mountRef.current) {
				mountRef.current.removeChild(renderer.domElement);
			}
			renderer.dispose();
		};
	}, []);

	// Update fog density based on atmosphere
	useEffect(() => {
		if (sceneRef.current && sceneRef.current.fog instanceof THREE.FogExp2) {
			const ratio = terraforming.atmosphere / 100;
			sceneRef.current.fog.density = 0.01 * ratio;
			if (rendererRef.current) {
				// Adjust background color based on atmosphere
				const color = new THREE.Color(0x000000);
				color.lerp(new THREE.Color(0x4477aa), ratio * 0.3);
				rendererRef.current.setClearColor(color);
			}
		}
	}, [terraforming.atmosphere]);

	// On mouse click/drag for brush effects
	useEffect(() => {
		let isDragging = false;
		let lastUpdateTime = 0;

		const updateTerrain = (e: MouseEvent) => {
			if (
				!rendererRef.current ||
				!sceneRef.current ||
				!cameraRef.current ||
				!sphereRef.current
			)
				return;

			const now = Date.now();
			if (now - lastUpdateTime < 16) return; // Limit to ~60fps
			lastUpdateTime = now;

			const rect = rendererRef.current.domElement.getBoundingClientRect();
			const mouse = new THREE.Vector2(
				((e.clientX - rect.left) / rect.width) * 2 - 1,
				-((e.clientY - rect.top) / rect.height) * 2 + 1
			);

			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, cameraRef.current);
			const intersects = raycaster.intersectObject(sphereRef.current);

			if (intersects.length > 0) {
				const hit = intersects[0];

				// Handle placement modes
				if (placeMode === "house" && houseModel) {
					// Only place on click, not drag
					if (!isDragging) {
						const instance = houseModel.clone(true);
						instance.scale.set(0.02, 0.02, 0.02);
						instance.position.copy(hit.point);
						instance.lookAt(0, 0, 0);
						sceneRef.current.add(instance);
						houseMeshesRef.current.push(instance);
						addHouseAt(hit.point);
					}
					return;
				}

				if (placeMode === "greenhouse" && greenhouseModel) {
					// Only place on click, not drag
					if (!isDragging) {
						const instance = greenhouseModel.clone(true);
						instance.scale.set(0.02, 0.02, 0.02);
						instance.position.copy(hit.point);
						instance.lookAt(0, 0, 0);
						sceneRef.current.add(instance);
						greenhouseMeshesRef.current.push(instance);
						addGreenhouseAt(hit.point);
					}
					return;
				}

				// Handle brush modes
				if (brushMode) {
					const sphereGeo = sphereRef.current
						.geometry as THREE.SphereGeometry;
					const posAttr = sphereGeo.attributes
						.position as THREE.BufferAttribute;
					const colAttr = sphereGeo.attributes
						.color as THREE.BufferAttribute;
					const brushSize = 0.2; // Increased brush size

					// Get hit point in local coordinates
					const localHit = hit.point.clone();
					sphereRef.current.worldToLocal(localHit);

					for (let i = 0; i < posAttr.count; i++) {
						const vertex = new THREE.Vector3(
							posAttr.getX(i),
							posAttr.getY(i),
							posAttr.getZ(i)
						);

						const dist = vertex.distanceTo(localHit);
						if (dist < brushSize) {
							const influence = 1 - dist / brushSize;

							if (brushMode === "water") {
								const blue = new THREE.Color(0x0066ff);
								const curr = new THREE.Color(
									colAttr.getX(i),
									colAttr.getY(i),
									colAttr.getZ(i)
								);
								curr.lerp(blue, influence * 0.2);
								colAttr.setXYZ(i, curr.r, curr.g, curr.b);
								// Update water stat periodically
								if (Math.random() < 0.1)
									setTerrainColor("water");
							} else if (brushMode === "trees") {
								const green = new THREE.Color(0x228822);
								const curr = new THREE.Color(
									colAttr.getX(i),
									colAttr.getY(i),
									colAttr.getZ(i)
								);
								curr.lerp(green, influence * 0.2);
								colAttr.setXYZ(i, curr.r, curr.g, curr.b);
								// Update trees stat periodically
								if (Math.random() < 0.1)
									setTerrainColor("trees");
							} else if (
								brushMode === "elevation+" ||
								brushMode === "elevation-"
							) {
								const dir = brushMode === "elevation+" ? 1 : -1;
								const amount = 0.005 * dir * influence;
								vertex.normalize().multiplyScalar(1.5 + amount);
								posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);

								// Update elevation stat
								if (Math.random() < 0.1) {
									adjustElevation(dir * 0.5);
								}
							} else if (brushMode === "atmosphere") {
								setTerrainColor("atmosphere");
							}
						}
					}

					posAttr.needsUpdate = true;
					colAttr.needsUpdate = true;
					sphereGeo.computeVertexNormals();
				}
			}
		};

		const onPointerDown = (e: MouseEvent) => {
			isDragging = false;
			updateTerrain(e);
			document.addEventListener("mousemove", onPointerMove);
			document.addEventListener("mouseup", onPointerUp);
		};

		const onPointerMove = (e: MouseEvent) => {
			isDragging = true;
			if (brushMode) updateTerrain(e);
		};

		const onPointerUp = () => {
			document.removeEventListener("mousemove", onPointerMove);
			document.removeEventListener("mouseup", onPointerUp);
		};

		const domElement = rendererRef.current?.domElement;
		domElement?.addEventListener("pointerdown", onPointerDown);

		return () => {
			domElement?.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("mousemove", onPointerMove);
			document.removeEventListener("mouseup", onPointerUp);
		};
	}, [
		brushMode,
		placeMode,
		houseModel,
		greenhouseModel,
		addHouseAt,
		addGreenhouseAt,
		setTerrainColor,
		adjustElevation,
	]);

	return <div ref={mountRef} className="w-full h-full" />;
}
