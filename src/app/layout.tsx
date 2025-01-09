import "./globals.css";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terraform Mars Simulator",
	description:
		"Brush-based terraforming with houses, greenhouses, and dynamic atmosphere.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-gray-900 text-gray-50 min-h-screen">
				{children}
			</body>
		</html>
	);
}
