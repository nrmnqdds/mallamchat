import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import remarkPrism from "remark-prism";

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

	// experimental: {
	// 	mdxRs: true,
	// },
};

const withMDX = createMDX({
	// extension: /\.mdx?$/,
	// Add markdown plugins here, as desired
	options: {
		remarkPlugins: [remarkPrism, remarkGfm],
		rehypePlugins: [rehypeHighlight],
	},
});

export default withMDX(nextConfig);
