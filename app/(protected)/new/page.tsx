"use client";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChatCompletionResponse } from "mallam";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  input: z.string().min(1, { message: "Sila masukkan soalan anda" }),
});

const today = new Date();
const curHr = today.getHours();

const Page = () => {
  const session = useSession();
  const [output, setOutput] = useState<string>("");
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      input: "",
    },
  });

  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.style.height = `${outputRef.current.scrollHeight}px`;
    }
  }, [output]);

  const onSubmit = useCallback(async (data: z.infer<typeof schema>) => {
    setOutput("");
    const res = await fetch("/api/mallam/soalan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.body) return;

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        console.log(value);
        const message = JSON.parse(value.split(/\s{2,}/)[0]);
        let message2: ChatCompletionResponse | undefined;
        if (JSON.parse(value.split(/\s{2,}/)[1])) {
          message2 = JSON.parse(value.split(/\s{2,}/)[1]);
        }
        setOutput((prev) => `${prev + message.message + message2?.message}`);
      }
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl flex flex-col">
        <h1 className="text-5xl text-center">
          {curHr < 12
            ? "Good Morning,"
            : curHr < 18
              ? "Good Afternoon,"
              : "Good Evening,"}{" "}
          {session.data?.user?.name ?? "visitor"}
        </h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
          <div>
            <Textarea
              className="bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
              placeholder="Apa yang boleh MaLLaM bantu anda hari ini?"
              rows={5}
              {...form.register("input")}
            />
            {form.formState.errors.input && (
              <p className="text-sm text-red-600">
                {form.formState.errors.input.message}
              </p>
            )}
          </div>
          {/* <div className="flex items-center gap-5"> */}
          {/* <button */}
          {/*   type="submit" */}
          {/*   disabled={form.formState.isSubmitting} */}
          {/*   className="flex items-center mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" */}
          {/* > */}
          {/*   <LanguageIcon className="w-5 h-5 mr-2" /> */}
          {/*   <span>Tanya</span> */}
          {/* </button> */}
          {/* <button */}
          {/*   type="button" */}
          {/*   disabled={form.formState.isSubmitting} */}
          {/*   className="flex items-center mt-4 px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" */}
          {/*   onClick={() => { */}
          {/*     setOutput(""); */}
          {/*     form.setValue("input", ""); */}
          {/*   }} */}
          {/* > */}
          {/*   <TrashIcon className="w-5 h-5 mr-2" /> */}
          {/*   <span>Padam</span> */}
          {/* </button> */}
          {/* </div> */}
        </form>
      </div>
      {/* <div> */}
      {/*   <textarea */}
      {/*     placeholder={ */}
      {/*       form.formState.isSubmitting ? "Sedang memproses..." : "Hasil Tanya" */}
      {/*     } */}
      {/*     rows={5} */}
      {/*     className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" */}
      {/*     readOnly */}
      {/*     ref={outputRef} */}
      {/*     value={output} */}
      {/*   /> */}
      {/* </div> */}
    </div>
  );
};

export default Page;
