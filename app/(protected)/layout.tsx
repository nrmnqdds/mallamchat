import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import { redirect } from "next/navigation";

const sp = Space_Grotesk({ display: "swap", subsets: ["latin"] });

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  return (
    <main
      className={cn(
        "min-h-screen w-full bg-background flex-1 py-24",
        sp.className,
      )}
    >
      {children}
    </main>
  );
};

export default ProtectedLayout;
