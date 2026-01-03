import { getPostBySlug } from "@/actions/get-post";

import { RichTextRender } from "@/components/RichTextRender";
import { TableOfContents } from "@/components/TableOfContents";
import { BlogHeader } from "@/components/BlogHeader";
import { extractHeadings } from "@/lib/headingUtils";
import { Media } from "@/payload-types";
import { Metadata } from 'next';

// Helper to check if preview-image is a Media object
function isMedia(media: unknown): media is Media {
  return media !== null && typeof media === 'object' && 'url' in media;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug.join('/');
  
  const postData = await getPostBySlug(slugString, 1);

  if (!postData) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: postData.title,
    description: postData.description || `Lee sobre ${postData.title} en el blog de Diego Cancino.`,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) { // En Next.js 15, params es una Promise
    // 1. Unir el array en un solo string
    const {slug} = await params;
    const slugString = slug.join('/');    
    console.log(`Buscando post con slug: "${slugString}"`); // Bueno para depurar

    const postPageData = await getPostBySlug(slugString, 20);

    // Es una buena práctica manejar el caso en que no se encuentre el post
    if (!postPageData) {
        // Puedes importar notFound de 'next/navigation' y llamarlo aquí
        // notFound();
        return <p>Post no encontrado.</p>;
    }

    // Extraer los headings para la tabla de contenidos
    const headings = postPageData.richText ? extractHeadings(postPageData.richText) : [];

    // Extraer la URL de la imagen de preview
    const previewImage = postPageData['preview-image'];
    const previewImageUrl = isMedia(previewImage) && previewImage.url
        ? (process.env.NEXT_PUBLIC_PAYLOAD_URL 
            ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${previewImage.url}` 
            : previewImage.url)
        : null;

    return (
        <>
            {/* Tabla de contenidos */}
            <TableOfContents headings={headings} />
            
            {/* Header del blog con título, autor y preview image */}
            <BlogHeader title={postPageData.title} previewImage={previewImageUrl} />
            
            <main className="container mx-auto px-4 py-8">
                <article className="prose dark:prose-invert max-w-4xl mx-auto">
                    {postPageData.richText ? (
                        <RichTextRender content={postPageData.richText} />
                    ) : (
                        <p>El contenido de este post no está disponible.</p>
                    )}
                </article>
            </main>
        </>
    );
}
