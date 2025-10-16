import { RichTextRender } from '@/components/RichTextRender'
interface Post {
  id: number;
  title: string;
  richText: any;
}

// Función para obtener los datos del post
async function getPostData(): Promise<Post> {
  const endpoint = 'http://localhost:3000/api/posts/2?depth=10&draft=false&locale=undefined&trash=false';
  
  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch post, status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
        id: 0,
        title: "Error al cargar el post",
        richText: { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'No se pudo cargar el contenido del post.'}]}]}}
    };
  }
}

// Componente de la página del post
export default async function PostPage() {
  const post = await getPostData();

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="prose dark:prose-invert max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-8">{post.title}</h1>
        {post.richText ? (
          <RichTextRender content={post.richText} />
        ) : (
          <p>El contenido de este post no está disponible.</p>
        )}
      </article>
    </main>
  );
}
