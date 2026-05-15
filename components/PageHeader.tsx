type PageHeaderProps = {
  label: string;
  title: string;
  description: string;
};

export default function PageHeader({
  label,
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 text-white sm:px-6 md:py-20">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-400 sm:text-sm">
        {label}
      </p>

      <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
        {title}
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
        {description}
      </p>
    </section>
  );
}