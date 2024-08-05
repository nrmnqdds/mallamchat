import DETA from "@/assets/images/Logo DeTA.svg";
import MESOLITICA from "@/assets/images/mesolitica-transparent.png";
import NOUNS from "@/assets/images/nouns.svg";
import Image from "next/image";
import Link from "next/link";

const powered = [
	{
		id: 0,
		name: "Nouns",
		logo: NOUNS,
		url: "https://nouns.wtf/",
	},
	{
		id: 1,
		name: "Mesolitica",
		logo: MESOLITICA,
		url: "https://mesolitica.com/",
	},
	{
		id: 2,
		name: "DeTA",
		logo: DETA,
		url: "https://plashspeed-aiman.github.io/#/gerakan",
	},
];

export default function ClientSection() {
	return (
		<section
			id="clients"
			className="mx-auto max-w-7xl px-6 text-center md:px-8"
		>
			<div className="py-14">
				<div className="mx-auto max-w-screen-xl px-4 md:px-8">
					<h2 className="text-center text-sm font-semibold text-gray-600">
						POWERED BY
					</h2>
					<div className="mt-6">
						<ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 [&_path]:fill-white">
							{powered.map((client) => (
								<li key={client.id}>
									<Link
										href={client.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center transition-all duration-150 hover:scale-105"
									>
										<Image
											src={client.logo}
											alt={client.name}
											width={200}
											height={200}
											className="object-contain"
										/>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
