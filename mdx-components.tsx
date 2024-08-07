import type { MDXComponents } from "mdx/types";
import "@/styles/github-dark.css";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
	};
}
