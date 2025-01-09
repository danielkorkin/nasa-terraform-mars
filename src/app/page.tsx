"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();

	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold mb-6">
				Terraform Mars Simulator
			</h1>
			<p className="max-w-md text-center mb-8">
				Welcome to the ultimate terraforming experience. Manage
				resources, build infrastructure, and transform Mars into a
				habitable world.
			</p>
			<button
				onClick={() => router.push("/game")}
				className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition"
			>
				Start Game
			</button>
		</main>
	);
}
