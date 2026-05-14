type AboutCardProps = {
  title: string;
  description: string;
};

export default function AboutCard({ title, description }: AboutCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <p className="leading-7 text-gray-300">{description}</p>
    </article>
  );
}