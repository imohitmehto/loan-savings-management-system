export default function CardContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-8 lg:p-10 transition-all">
      {children}
    </div>
  );
}
