"use client";

import React, { useEffect } from "react";
import ThreeScene from "./components/ThreeScene";
import GameUI from "./components/GameUI";
import { useGameStore } from "./hooks/useGameStore";

export default function GamePage() {
	const {
		resources,
		terraforming,
		loadGameState,
		saveGameState,
		updateResource,
		updateTerraforming,
	} = useGameStore();

	// On mount, load existing game state from localStorage
	useEffect(() => {
		loadGameState();
	}, [loadGameState]);

	// Example: Auto-save the game state every 10 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			saveGameState();
		}, 10000);

		return () => {
			clearInterval(interval);
			// Save one last time on cleanup
			saveGameState();
		};
	}, [saveGameState]);

	return (
		<main className="relative w-full h-screen overflow-hidden">
			{/* 3D Scene */}
			<ThreeScene resources={resources} terraforming={terraforming} />

			{/* Overlay UI / HUD */}
			<div className="absolute top-0 left-0 right-0 p-4">
				<GameUI />
			</div>
		</main>
	);
}
