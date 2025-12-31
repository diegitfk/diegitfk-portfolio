export default async function ProjectPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugPath = slug.join('/');

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-8">Project: {slugPath}</h1>
      <p className="text-muted-foreground text-lg">Project details coming soon...</p>
    </div>
  );
}