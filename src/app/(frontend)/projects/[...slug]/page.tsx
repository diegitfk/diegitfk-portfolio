export default function ProjectPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-8">Project: {slug}</h1>
      <p className="text-muted-foreground text-lg">Project details coming soon...</p>
    </div>
  );
}