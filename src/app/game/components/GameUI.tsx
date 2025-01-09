"use client";

import React from "react";
import { useGameStore } from "../hooks/useGameStore";

export default function GameUI() {
	const {
		resources,
		terraforming,
		updateResource,
		updateTerraforming,
		resetGame,
	} = useGameStore();

	/**
	 * Example function: invests resources in atmospheric generation
	 */
	const handleGenerateAtmosphere = () => {
		if (resources.power >= 10 && resources.money >= 5) {
			updateResource("power", resources.power - 10);
			updateResource("money", resources.money - 5);
			updateTerraforming("atmosphere", terraforming.atmosphere + 1);
		} else {
			alert("Not enough power or money!");
		}
	};

	return (
		<div className="flex flex-col space-y-4 bg-black/70 p-4 rounded-md w-96">
			<h2 className="text-xl font-semibold mb-2">
				Mars Terraforming Control Panel
			</h2>

			{/* Resource Display */}
			<div className="grid grid-cols-2 gap-2">
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Power</p>
					<p className="font-bold text-lg">{resources.power}</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Water</p>
					<p className="font-bold text-lg">{resources.water}</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Materials</p>
					<p className="font-bold text-lg">{resources.materials}</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Money</p>
					<p className="font-bold text-lg">{resources.money}</p>
				</div>
			</div>

			{/* Terraforming Metrics */}
			<div className="grid grid-cols-2 gap-2 mt-4">
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Atmosphere</p>
					<p className="font-bold text-lg">
						{terraforming.atmosphere} %
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Temperature</p>
					<p className="font-bold text-lg">
						{terraforming.temperature} °C
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Water Presence</p>
					<p className="font-bold text-lg">
						{terraforming.waterPresence} %
					</p>
				</div>
				<div className="bg-gray-800 p-2 rounded">
					<p className="text-sm">Biodiversity</p>
					<p className="font-bold text-lg">
						{terraforming.biodiversity} %
					</p>
				</div>
			</div>

			{/* Action Buttons */}
			<button
				onClick={handleGenerateAtmosphere}
				className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
			>
				Generate Atmosphere
			</button>

			<button
				onClick={resetGame}
				className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
			>
				Reset Game
			</button>
		</div>
	);
}
