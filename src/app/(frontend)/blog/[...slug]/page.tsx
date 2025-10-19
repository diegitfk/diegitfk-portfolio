import { clientSDK } from "@/utils/payloadClient";
import { RichTextRender } from "@/components/RichTextRender";
import Image from "next/image";

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) { // En Next.js 15, params es una Promise
    // 1. Unir el array en un solo string
    const {slug} = await params;
    const slugString = slug.join('/');    
    console.log(`Buscando post con slug: "${slugString}"`); // Bueno para depurar

    const post = await clientSDK.find({
        collection : 'posts',
        depth : 20,
        limit : 1,
        locale : undefined,
        // 2. Usar el string unido en la consulta
        where : { slug : { equals : slugString } }
    });

    const postPageData = post.docs[0];

    // Es una buena práctica manejar el caso en que no se encuentre el post
    if (!postPageData) {
        // Puedes importar notFound de 'next/navigation' y llamarlo aquí
        // notFound();
        return <p>Post no encontrado.</p>;
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <article className="prose dark:prose-invert max-w-4xl mx-auto">
                {postPageData.richText ? (
                    <RichTextRender content={postPageData.richText} />
                ) : (
                    <p>El contenido de este post no está disponible.</p>
                )}
            </article>
        </main>
    );
}
