"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();

	return (
		<main className="flex flex-col items-center justify-center h-screen p-4">
			<h1 className="text-5xl font-bold mb-6">
				Terraform Mars Simulator
			</h1>
			<p className="max-w-xl text-center mb-8">
				Use brushes to add water, plant trees, adjust elevation, and
				place houses & greenhouses on Mars. Watch your atmosphere,
				pressure, temperature, and radiation evolve in real-time!
			</p>
			<button
				onClick={() => router.push("/game")}
				className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white transition"
			>
				Begin Terraforming
			</button>
		</main>
	);
}
