import { type TypeOf, z } from "zod";

const envVariables = z.object({
	MALLAM_API_KEY: z.string(),
	NEXT_PUBLIC_HF_TOKEN: z.string(),
});

envVariables.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends TypeOf<typeof envVariables> {}
	}
}
