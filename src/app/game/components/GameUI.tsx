"use client";

import React from "react";
import { useGameStore } from "../hooks/useGameStore";

export default function GameUI() {
	const {
		terraforming,
		brushMode,
		setBrushMode,
		placeMode,
		setPlaceMode,
		resetGame,
	} = useGameStore();

	return (
		<div className="pointer-events-auto bg-black/70 p-4 rounded-md w-72">
			<h2 className="text-xl font-semibold mb-2">Terraforming Panel</h2>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-2 mb-4">
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Atmosphere</p>
					<p className="font-bold text-lg">
						{terraforming.atmosphere.toFixed(1)}%
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Pressure</p>
					<p className="font-bold text-lg">
						{terraforming.pressure.toFixed(1)} kPa
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Water</p>
					<p className="font-bold text-lg">
						{terraforming.water.toFixed(1)}%
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Temperature</p>
					<p className="font-bold text-lg">
						{terraforming.temperature.toFixed(1)}°C
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Trees</p>
					<p className="font-bold text-lg">
						{terraforming.trees.toFixed(1)}%
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Radiation</p>
					<p className="font-bold text-lg">
						{terraforming.radiation.toFixed(1)}%
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Elevation</p>
					<p className="font-bold text-lg">
						{terraforming.elevation.toFixed(1)}
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Population</p>
					<p className="font-bold text-lg">
						{terraforming.population}
					</p>
				</div>
			</div>

			{/* Brush Modes */}
			<div className="flex flex-col gap-2 mb-4">
				<button
					onClick={() => setBrushMode("water")}
					className={`px-3 py-2 rounded ${
						brushMode === "water"
							? "bg-blue-700"
							: "bg-blue-600 hover:bg-blue-700"
					}`}
				>
					Water Brush
				</button>
				<button
					onClick={() => setBrushMode("trees")}
					className={`px-3 py-2 rounded ${
						brushMode === "trees"
							? "bg-green-700"
							: "bg-green-600 hover:bg-green-700"
					}`}
				>
					Tree Brush
				</button>
				<button
					onClick={() => setBrushMode("elevation+")}
					className={`px-3 py-2 rounded ${
						brushMode === "elevation+"
							? "bg-yellow-700"
							: "bg-yellow-600 hover:bg-yellow-700"
					}`}
				>
					Elevation +
				</button>
				<button
					onClick={() => setBrushMode("elevation-")}
					className={`px-3 py-2 rounded ${
						brushMode === "elevation-"
							? "bg-yellow-700"
							: "bg-yellow-600 hover:bg-yellow-700"
					}`}
				>
					Elevation -
				</button>
				<button
					onClick={() => setBrushMode("atmosphere")}
					className={`px-3 py-2 rounded ${
						brushMode === "atmosphere"
							? "bg-purple-700"
							: "bg-purple-600 hover:bg-purple-700"
					}`}
				>
					Add Atmosphere
				</button>
			</div>

			{/* Placement Modes */}
			<div className="flex flex-col gap-2 mb-4">
				<button
					onClick={() =>
						setPlaceMode(placeMode === "house" ? null : "house")
					}
					className={`px-3 py-2 rounded ${
						placeMode === "house"
							? "bg-red-700"
							: "bg-red-600 hover:bg-red-700"
					}`}
				>
					{placeMode === "house"
						? "Cancel House Placement"
						: "Place House"}
				</button>
				<button
					onClick={() =>
						setPlaceMode(
							placeMode === "greenhouse" ? null : "greenhouse"
						)
					}
					className={`px-3 py-2 rounded ${
						placeMode === "greenhouse"
							? "bg-red-700"
							: "bg-red-600 hover:bg-red-700"
					}`}
				>
					{placeMode === "greenhouse"
						? "Cancel Greenhouse"
						: "Place Greenhouse"}
				</button>
			</div>

			{/* Reset */}
			<button
				onClick={resetGame}
				className="px-3 py-2 bg-red-800 rounded w-full"
			>
				Reset Planet
			</button>
		</div>
	);
}
