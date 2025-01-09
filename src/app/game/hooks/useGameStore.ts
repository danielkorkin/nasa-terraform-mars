"use client";

import { useCallback, useState } from "react";

interface GameStore {
	resources: {
		power: number;
		water: number;
		materials: number;
		money: number;
	};
	terraforming: {
		atmosphere: number; // percentage
		temperature: number; // in Celsius
		waterPresence: number; // percentage
		biodiversity: number; // percentage
	};
}

export function useGameStore() {
	const [resources, setResources] = useState<GameStore["resources"]>({
		power: 100,
		water: 50,
		materials: 50,
		money: 1000,
	});

	const [terraforming, setTerraforming] = useState<GameStore["terraforming"]>(
		{
			atmosphere: 1,
			temperature: -60,
			waterPresence: 0,
			biodiversity: 0,
		},
	);

	// Save game state to localStorage
	const saveGameState = useCallback(() => {
		const gameState: GameStore = {
			resources,
			terraforming,
		};
		const encodedState = btoa(JSON.stringify(gameState));
		localStorage.setItem("terraformMarsGameState", encodedState);
	}, [resources, terraforming]);

	// Load game state from localStorage
	const loadGameState = useCallback(() => {
		const savedState = localStorage.getItem("terraformMarsGameState");
		if (savedState) {
			try {
				const decoded = JSON.parse(atob(savedState));
				if (decoded.resources && decoded.terraforming) {
					setResources(decoded.resources);
					setTerraforming(decoded.terraforming);
				}
			} catch (error) {
				console.error("Failed to load game state:", error);
			}
		}
	}, []);

	// Reset to initial state
	const resetGame = useCallback(() => {
		setResources({
			power: 100,
			water: 50,
			materials: 50,
			money: 1000,
		});
		setTerraforming({
			atmosphere: 1,
			temperature: -60,
			waterPresence: 0,
			biodiversity: 0,
		});
		// Clear localStorage
		localStorage.removeItem("terraformMarsGameState");
	}, []);

	// Update a single resource
	const updateResource = useCallback(
		(key: keyof GameStore["resources"], value: number) => {
			setResources((prev) => ({
				...prev,
				[key]: value,
			}));
		},
		[],
	);

	// Update a single terraforming metric
	const updateTerraforming = useCallback(
		(key: keyof GameStore["terraforming"], value: number) => {
			setTerraforming((prev) => ({
				...prev,
				[key]: value,
			}));
		},
		[],
	);

	return {
		resources,
		terraforming,
		saveGameState,
		loadGameState,
		resetGame,
		updateResource,
		updateTerraforming,
	};
}
