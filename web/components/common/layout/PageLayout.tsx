export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">{children}</div>
    </main>
  );
}
