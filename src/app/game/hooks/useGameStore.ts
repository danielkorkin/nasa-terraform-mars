"use client";

import { useCallback, useState } from "react";
import { Vector3 } from "three";

interface Terraforming {
	atmosphere: number;
	water: number;
	trees: number;
	elevation: number;
	temperature: number;
	pressure: number;
	radiation: number;
	population: number;
}

type BrushMode =
	| "water"
	| "trees"
	| "elevation+"
	| "elevation-"
	| "atmosphere"
	| null;
type PlaceMode = "house" | "greenhouse" | null;

interface GameStore {
	terraforming: Terraforming;
	brushMode: BrushMode;
	placeMode: PlaceMode;
	// arrays for houses, greenhouses if we want to store them
}

let initialState: Terraforming = {
	atmosphere: 10,
	water: 0,
	trees: 0,
	elevation: 0,
	temperature: -60,
	pressure: 10,
	radiation: 70,
	population: 0,
};

export function useGameStore() {
	const [terraforming, setTerraforming] = useState<Terraforming>({
		...initialState,
	});
	const [brushMode, setBrushMode] = useState<BrushMode>(null);
	const [placeMode, setPlaceMode] = useState<PlaceMode>(null);

	// No need to store positions in local state if we only do ephemeral.
	// But to keep track, you can store them in arrays if you want to re-load from localStorage.

	// For brush mode: atmosphere => increment atmosphere stat
	const setTerrainColor = useCallback((type: "atmosphere" | "water" | "trees") => {
		setTerraforming((prev) => {
			const updates: Partial<Terraforming> = {};
			
			switch (type) {
				case "atmosphere":
					updates.atmosphere = Math.min(prev.atmosphere + 5, 100);
					updates.pressure = Math.min(prev.pressure + 2, 100);
					break;
				case "water":
					updates.water = Math.min(prev.water + 5, 100);
					updates.temperature = prev.temperature + 0.2;
					break;
				case "trees":
					if (prev.water > 20) { // Need sufficient water for trees
						updates.trees = Math.min(prev.trees + 5, 100);
						updates.atmosphere = Math.min(prev.atmosphere + 1, 100);
						updates.temperature = prev.temperature + 0.1;
					}
					break;
			}

			return { ...prev, ...updates };
		});
	}, []);

	// For brush mode: elevation changes
	const adjustElevation = useCallback((amount: number) => {
		setTerraforming((prev) => ({
			...prev,
			elevation: Math.max(Math.min(prev.elevation + amount, 100), -100),
		}));
	}, []);

	// Placement
	const addHouseAt = useCallback((point: Vector3) => {
		// Increase population, for example
		setTerraforming((prev) => ({
			...prev,
			population: prev.population + 5,
		}));
	}, []);

	const addGreenhouseAt = useCallback((point: Vector3) => {
		setTerraforming((prev) => ({
			...prev,
			population: prev.population + 2,
			trees: Math.min(prev.trees + 1, 100), // greenhouses produce some vegetation?
		}));
	}, []);

	// Simulation: every few seconds, update stats
	const runSimulation = useCallback(() => {
		setTerraforming((prev) => {
			let { atmosphere, water, trees, temperature, pressure, radiation } =
				prev;
			// Example rules:

			// If atmosphere is too low, water evaporates, trees die
			if (atmosphere < 20) {
				water = Math.max(water - 3, 0);
				trees = Math.max(trees - 3, 0);
			}

			// If water is 0, trees can’t exist
			if (water <= 0) {
				trees = 0;
			}

			// More trees => more atmosphere
			if (trees > 10) {
				atmosphere = Math.min(atmosphere + trees * 0.01, 100);
			}

			// More atmosphere => less radiation
			radiation = Math.max(radiation - atmosphere * 0.02, 0);

			// More atmosphere => higher pressure
			pressure = Math.min(pressure + atmosphere * 0.01, 100);

			// Water and atmosphere => slightly increase temperature
			temperature += water * 0.02 + atmosphere * 0.02;

			return {
				...prev,
				atmosphere,
				water,
				trees,
				temperature,
				pressure,
				radiation,
			};
		});
	}, []);

	// Reset
	const resetGame = useCallback(() => {
		setTerraforming({ ...initialState });
		setBrushMode(null);
		setPlaceMode(null);
		localStorage.removeItem("terraformMarsGameState");
	}, []);

	// Save/Load from localStorage
	const saveGameState = useCallback(() => {
		const data = {
			terraforming,
			brushMode,
			placeMode,
		};
		const encoded = btoa(JSON.stringify(data));
		localStorage.setItem("terraformMarsGameState", encoded);
	}, [terraforming, brushMode, placeMode]);

	const loadGameState = useCallback(() => {
		const saved = localStorage.getItem("terraformMarsGameState");
		if (saved) {
			try {
				const decoded = JSON.parse(atob(saved));
				if (decoded.terraforming) setTerraforming(decoded.terraforming);
				if (decoded.brushMode) setBrushMode(decoded.brushMode);
				if (decoded.placeMode) setPlaceMode(decoded.placeMode);
			} catch (err) {
				console.error("Failed to parse game state:", err);
			}
		}
	}, []);

	return {
		terraforming,
		brushMode,
		placeMode,
		setBrushMode,
		setPlaceMode,
		setTerrainColor,
		adjustElevation, // add this to returned object
		addHouseAt,
		addGreenhouseAt,
		runSimulation,
		resetGame,
		saveGameState,
		loadGameState,
	};
}
