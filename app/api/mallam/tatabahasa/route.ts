import { mallam } from "@/lib/mallam";
import { HfInference } from "@huggingface/inference";
import { type NextRequest, NextResponse } from "next/server";

// export const runtime = "edge";
// export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	const { input } = await request.json();

	const inference = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

	const result = await inference.textGeneration({
		model: "mesolitica/malaysian-mistral-7b-32k-instructions-v4-marlin",
		// inputs: input,
		inputs: `
		Anda adalah sebuah pembantu yang hebat dalam membetulkan tatabahasa.
		Cari kesalahan bahasa dalam ayat yang diberikan dan betulkan kesalahan tersebut.
		Pastikan konteks ayat masih tidak berubah.
		Jika ayat tersebut sudah betul, jawab 'Tatabahasa betul'. Dan jadikan ianya dalam bentuk JSON. Contoh:
		'
		{
		  kesalahan: [{
		    'salah': 'Perkataan yang salah',
		    'betul': 'Perkataan yang betul'
		}],
		  pembetulan: 'Ayat yang betul'
		}
		'
		Ayat yang diberikan: ${input}
		  `,
	});

	if (!result) {
		return NextResponse.json(
			{
				error: "Failed to translate",
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
	const { input } = await request.json();

	const systemInstruction = `
  Anda adalah sebuah pembantu yang hebat dalam membetulkan tatabahasa.
  Cari kesalahan bahasa dalam ayat yang diberikan dan betulkan kesalahan tersebut.
  Pastikan konteks ayat masih tidak berubah.
  Jika ayat tersebut sudah betul, jawab 'Tatabahasa betul'. Dan jadikan ianya dalam bentuk JSON. Contoh:
  '
  {
    kesalahan: [{
      'salah': 'Perkataan yang salah',
      'betul': 'Perkataan yang betul'
  }],
    pembetulan: 'Ayat yang betul'
  }
  '
    `;

	const instruction = [
		{
			role: "system",
			content: systemInstruction,
		},
		{
			role: "user",
			content: input,
		},
	];

	const res = await mallam.chatCompletion(instruction);

	return NextResponse.json(res);
}
