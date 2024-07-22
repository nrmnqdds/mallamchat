export default function Footer() {
	return (
		<footer className="bg-white">
			<div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
				<div className="flex justify-center space-x-6 md:order-2">
					<p>
						Credits to{" "}
						<a
							href="https://mesolitica.com"
							target="_blank"
							rel="noreferrer"
							className="underline hover:text-indigo-600"
						>
							Mesolitica
						</a>{" "}
						for the models
					</p>
				</div>
				<div className="mt-8 md:order-1 md:mt-0">
					<p className="text-center text-xs leading-5 text-gray-500">
						&copy; 2024 nrmnqdds. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
