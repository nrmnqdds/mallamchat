import ClientSection from "@/components/landing/client-section";
import HeroSection from "@/components/landing/hero-section";
import Particles from "@/components/ui/particles";

export default async function Page() {
	return (
		<>
			<HeroSection />
			<ClientSection />
			<Particles
				className="absolute inset-0 -z-10"
				quantity={50}
				ease={70}
				size={0.05}
				staticity={40}
				color="#ffffff"
			/>
		</>
	);
}
