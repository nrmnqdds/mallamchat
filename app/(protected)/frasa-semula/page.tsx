"use client";

import { LanguageIcon, TrashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	input: z
		.string()
		.min(1, { message: "Sila masukkan ayat yang ingin di-frasa semula." }),
	output: z.string(),
});

const Page = () => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			input: "",
		},
	});

	const onSubmit = useCallback(async (data: z.infer<typeof schema>) => {
		form.setValue("output", "");
		const res = await fetch("/api/mallam/frasasemula", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.body) return;

		// To decode incoming data as a string
		const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

		while (true) {
			const { value, done } = await reader.read();
			if (done) {
				break;
			}
			if (value) {
				const message = JSON.parse(value.trim());
				form.setValue(
					"output",
					//@ts-ignore
					(form.getValues().output += message.message as string),
				);
			}
		}
	}, []);

	return (
		<div className="flex flex-col gap-5">
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<label
					htmlFor="input"
					className="block text-sm font-medium leading-6 text-gray-900"
				>
					Teks Asal
				</label>
				<div className="mt-2">
					<textarea
						placeholder="Masukkan ayat yang ingin di-frasa semula"
						rows={5}
						className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						{...form.register("input")}
					/>
					{form.formState.errors.input && (
						<p className="text-sm text-red-600">
							{form.formState.errors.input.message}
						</p>
					)}
				</div>
				<div className="flex items-center gap-5">
					<button
						type="submit"
						disabled={form.formState.isSubmitting}
						className="flex items-center mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<LanguageIcon className="w-5 h-5 mr-2" />
						<span>Frasa Semula</span>
					</button>
					<button
						type="button"
						disabled={form.formState.isSubmitting}
						className="flex items-center mt-4 px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
						onClick={() => {
							form.setValue("output", "");
							form.setValue("input", "");
						}}
					>
						<TrashIcon className="w-5 h-5 mr-2" />
						<span>Padam</span>
					</button>
				</div>
			</form>
			<div>
				<textarea
					placeholder={
						form.formState.isSubmitting
							? "Memfrasa semula..."
							: "Hasil Frasa Semula"
					}
					rows={5}
					className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					readOnly
					{...form.register("output")}
				/>
			</div>
		</div>
	);
};

export default Page;
