/** @type {import('next').NextConfig} */
const nextConfig = {
	// For docker purpose
	output: "standalone",

	// Configure `pageExtensions` to include MDX files
	pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

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

	experimental: {
		mdxRs: true,
	},
};

export default nextConfig;
