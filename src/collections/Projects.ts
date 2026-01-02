import type { CollectionConfig } from "payload";

export const Projects : CollectionConfig = {
    slug: 'projects',
    access: {
        read: () => true,
    },
    versions : {
        drafts : true,
    },
    fields : [
        {
            type : "text",
            name : "name", // Nombre del proyecto
            required : true
        },
        {
            type : "text",
            name : "slug", // URL slug del proyecto
            required : true,
            unique : true,
            index : true,
            admin : {
                description : "URL slug para el proyecto (ej: mi-proyecto-increible)"
            }
        },
        {
            type : "text" ,
            name : "description", // Descripción del proyecto
            required : true
        },
        {
            type : "text" ,
            name : "link_github", // Enlace al repositorio del proyecto (Si es null, se añade que es privado)
            required : false,
        },
        {
            type : "text",
            name : "link_live_demo", // Enlace al demo del proyecto (Si es null, se añade que es privado)
            required : false,
        },
        {
            type : "relationship",
            relationTo : "media", // Imagen principal del proyecto
            hasMany : false,
            required : false,
            name : "image_repo"
        },
        {
            type : "select" , 
            name : "project_type",  // Tipo de proyecto
            required : true,
            options : [
                {
                    label : "Backend Project",
                    value : "backend"
                },
                {
                    label : "Frontend Project",
                    value : "frontend"
                },
                {
                    label : "Full Stack Project",
                    value : "full-stack"
                }
            ],
            index : true
        },
        {
            type : "select",
            name : "project_status", // Estado del proyecto
            required : true,
            defaultValue : "production",
            options : [
                {
                    label : "Production",
                    value : "production"
                },
                {
                    label : "MVP",
                    value : "mvp"
                },
                {
                    label : "R&D (Research & Development)",
                    value : "rnd"
                }
            ],
            index : true
        },
        {
            type : "checkbox",
            name : "is_featured", // Proyecto destacado (ocupa 2 columnas en el grid)
            defaultValue : false,
            admin : {
                description : "Marcar como proyecto destacado para mostrar en tamaño grande"
            }
        },
        {
            type : "select",
            name : "tech_stack", // Tech Stack del proyecto
            hasMany : true,
            admin : {
                description : "Selecciona las tecnologías usadas en el proyecto"
            },
            options : [
                { label : "React", value : "react" },
                { label : "Next.js", value : "nextjs" },
                { label : "TypeScript", value : "typescript" },
                { label : "Python", value : "python" },
                { label : "Node.js", value : "node" },
                { label : "PostgreSQL", value : "postgresql" },
                { label : "MongoDB", value : "mongodb" },
                { label : "Redis", value : "redis" },
                { label : "Docker", value : "docker" },
                { label : "Kubernetes", value : "kubernetes" },
                { label : "pnpm", value : "pnpm" },
                { label : "OpenAI", value : "openai" },
                { label : "Gemini", value : "gemini" },
                { label : "Qwen", value : "qwen" },
                { label : "Supabase", value : "supabase" },
                { label : "AWS", value : "aws" },
                { label : "Nginx", value : "nginx" },
                { label : "PayloadCMS", value : "payloadcms" },
                { label : "Strapi", value : "strapi" }
            ]
        },
        {
            type : "relationship",
            relationTo : "media", // Video o GIF de preview del proyecto
            hasMany : false,
            required : false,
            name : "preview_video",
            admin : {
                description : "Video o GIF para mostrar en hover (proyectos destacados)"
            }
        },
        {
            type : "textarea",
            name : "challenge", // El desafío del proyecto
            required : false,
            admin : {
                description : "Describe el problema de negocio/técnico que resuelve"
            }
        },
        {
            type : "textarea",
            name : "solution", // La solución implementada
            required : false,
            admin : {
                description : "Describe la arquitectura/solución final que diseñaste"
            }
        },
        {
            type : "relationship",
            relationTo : "knowledge_project", // Archivos de conocimiento (SOLAMENTE ACCEDE AI)
            hasMany : true,
            required : false,
            name : "knowledge_project"
        },
        {
            type: "relationship",
            relationTo : "posts",
            hasMany : true,
            required : false,
            name : "related_posts", // Artículos relacionados con el proyecto
            filterOptions: {
                _status: {
                  equals: 'published',
                },
            },
        },
        {
            name : "richText", // Descripción detallada del proyecto
            type : "richText"
        }
    ]
}