import MillionLint from "@million/lint";

/** @type {import('next').NextConfig} */
const nextConfig = {
	// For docker purpose
	output: "standalone",

	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "lh3.googleusercontent.com" },
			{ protocol: "https", hostname: "github.com" },
		],
	},

	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default MillionLint.next({ rsc: true })(nextConfig);
