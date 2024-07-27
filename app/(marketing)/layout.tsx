import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default async function MarketingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex-1 overflow-hidden">{children}</main>
      <Footer />
    </>
  );
}
