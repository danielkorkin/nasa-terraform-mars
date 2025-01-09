"use client";

import React, { useEffect } from "react";
import { useGameStore } from "./hooks/useGameStore";
import ThreeScene from "./components/ThreeScene";
import GameUI from "./components/GameUI";

export default function GamePage() {
	const { loadGameState, saveGameState, runSimulation } = useGameStore();

	// Load saved data on mount
	useEffect(() => {
		loadGameState();
	}, [loadGameState]);

	// Auto-save every 10s
	useEffect(() => {
		const interval = setInterval(() => {
			saveGameState();
		}, 10000);

		return () => {
			clearInterval(interval);
			saveGameState();
		};
	}, [saveGameState]);

	// Run simulation periodically (e.g., every 3s)
	useEffect(() => {
		const interval = setInterval(() => {
			runSimulation();
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	}, [runSimulation]);

	return (
		<main className="relative w-full h-screen overflow-hidden">
			<ThreeScene />
			<div className="absolute top-4 right-4 pointer-events-none">
				<GameUI />
			</div>
		</main>
	);
}
