import { clientSDK } from "@/utils/payloadClient";
import { Post, Media } from "@/payload-types";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BlurNavbar } from "@/components/BlurNavbar";

// Helper type guard
function isMedia(media: any): media is Media {
  return media && typeof media === 'object' && ('url' in media);
}

// Function to calculate grid spans based on index to create a Bento effect
const getBentoClasses = (index: number) => {
  // Pattern cycles every 6 items
  const i = index % 6;
  
  if (i === 0) return "md:col-span-2 md:row-span-2"; // Large featured item
  if (i === 3) return "md:col-span-2 md:row-span-1"; // Wide item
  
  return "md:col-span-1 md:row-span-1"; // Standard square item
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric' 
  }).replace('.', '');
};

export default async function BlogPage() {
  let posts: Post[] = [];
  
  try {
    const postsData = await clientSDK.find({
      collection: 'posts',
      limit: 100,
      depth: 1,
      sort: '-createdAt',
    });
    posts = postsData.docs;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <section className="min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Navigation */}
      <BlurNavbar 
        items={[
          { label: "Home", href: "/" },
          { label: "Proyectos", href: "/projects" },
          { label: "Blog", href: "/blog" },
        ]}
        ctaLabel="Contacto"
        ctaHref="/#contact"
      />

      {/* Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-16">
            <p className="text-sm font-medium text-gray-400 mb-4 tracking-wide uppercase">
              Blog
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Artículos
              <br />
              <span className="text-gray-400">&</span>
              <br />
              Insights
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              Descubre artículos, tutoriales y reflexiones sobre desarrollo web, 
              arquitectura de software, inteligencia artificial y tecnología.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {posts.map((post, index) => {
              const previewImage = post['preview-image'];
              const hasImage = isMedia(previewImage);
              const imageUrl = hasImage && previewImage.url
                ? (process.env.NEXT_PUBLIC_PAYLOAD_URL 
                    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${previewImage.url}` 
                    : previewImage.url)
                : null;

              const isFeatured = index % 6 === 0;

              return (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl transition-all duration-300 ease-out hover:border-white/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5",
                    getBentoClasses(index),
                    hasImage 
                      ? "bg-zinc-900/60" 
                      : "bg-zinc-900/80"
                  )}
                >
                  {/* Background Image with Overlay */}
                  {hasImage && imageUrl && (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 z-10" />
                    </div>
                  )}

                  {/* Decorative Icon for non-image cards */}
                  {!hasImage && (
                    <div className="absolute top-6 left-6 z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Date Badge */}
                  <div className="absolute top-6 right-6 z-20">
                    <span className="text-xs font-medium text-gray-400 tracking-wide">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-20 h-full flex flex-col justify-end p-6">
                    <h2 className={cn(
                      "font-bold text-white mb-2 leading-tight transition-colors group-hover:text-gray-200",
                      isFeatured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                    )}>
                      {post.title}
                    </h2>
                    
                    {post.description && (
                      <p className={cn(
                        "text-gray-400 leading-relaxed",
                        isFeatured ? "line-clamp-3 text-sm sm:text-base" : "line-clamp-2 text-sm"
                      )}>
                        {post.description}
                      </p>
                    )}
                    
                    {/* Read More Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/60 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <span>Leer más</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Empty State */}
          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <p className="text-xl font-medium text-white mb-2">No hay posts publicados aún</p>
              <p className="text-gray-500 text-center max-w-md">
                Estamos preparando contenido increíble. Vuelve pronto para descubrir nuevos artículos.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

