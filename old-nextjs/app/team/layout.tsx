import { Providers } from "@/components/providers";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
    </Providers>
  );
} 