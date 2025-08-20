interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
}
export default function PageHeader({
  title,
  subtitle,
  rightContent,
}: PageHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </header>
  );
}
