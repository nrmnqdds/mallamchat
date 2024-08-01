"use client";

import Link from "next/link";

const TopBanner = () => {
	return (
		<div className="w-full bg-blue-500 p-2 flex items-center justify-center">
			{/* <p>{window.location.toString()}</p> */}
			{window.location.toString().includes("nrmnqdds") && (
				<p className="font-bold">
					🚧 Do visit our new website at{" "}
					<Link
						href="https://mallam.chat"
						target="_blank"
						className="text-yellow-300 hover:underline"
					>
						mallam.chat
					</Link>{" "}
				</p>
			)}
			<p className="font-bold">
				🚧 Still in active rapid development. Please expect bugs and missing
				features. 🚧
			</p>
		</div>
	);
};

export default TopBanner;
