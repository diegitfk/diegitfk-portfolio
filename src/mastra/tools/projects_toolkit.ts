import { createTool, InferUITools } from "@mastra/core/tools";
import { z } from "zod";

import { clientSDK } from "@/utils/payloadClient";
import { KnowledgeProject } from "@/payload-types"

const sdk = clientSDK

export const projectListTool = createTool({
    id : 'projectListTool',
    description : `
    ## Descripción
    Herramienta para obtener la lista de proyectos de Diego Cancino, con opción de filtrar por tipo de proyecto
    
    ## Parámetros
    - typeProject : Tipo de proyecto a filtrar (Opcional)
        - "Backend Project" : Proyectos de backend
        - "Frontend Project" : Proyectos de frontend  
        - "Full Stack Project" : Proyectos full stack
    
    ## Salida
    - projects : Array de proyectos con la siguiente estructura:
        - idProject : ID del proyecto
        - nameProject : Nombre del proyecto
        - descriptionProject : Descripción del proyecto
        - project_type : Tipo de proyecto
    `,
    inputSchema : z.object({
        typeProject : z.enum(['Backend Project' , 'Frontend Project' , 'Full Stack Project']).optional()
    }),
    outputSchema : z.object({
        projects : z.array(
            z.object({
                idProject : z.number(),
                nameProject : z.string(),
                descriptionProject : z.string(),
                project_type : z.enum(['Backend Project' , 'Frontend Project' , 'Full Stack Project']),
            })
        )
    }),
    execute : async (input) => {
        const {typeProject} = input;
        const response = await sdk.find({
            collection : "projects",
            limit : 20,
            where : typeProject ? {
                project_type : {
                    equals : typeProject
                }
            } : undefined
        })
        const projectTypeMap: Record<string, 'Backend Project' | 'Frontend Project' | 'Full Stack Project'> = {
            'backend': 'Backend Project',
            'frontend': 'Frontend Project',
            'full-stack': 'Full Stack Project'
        }
        const projects = response.docs.map((project) => ({
            idProject: project.id,
            nameProject: project.name,
            descriptionProject: project.description,
            project_type: projectTypeMap[project.project_type] ?? 'Backend Project'
        }))
        return {
            projects
        }
    }
})

export const projectInfoTool = createTool({
    id : 'projectInfoTool',
    description : `

    ## Descripción
    Herramienta para obtener información detallada de un proyecto específico del portfolio de Diego Cancino

    ## Parámetros
    - idProject : ID único del proyecto a consultar
    ## Salida
        - nameProject : Nombre del proyecto
        - descriptionProject : Descripción completa del proyecto y sus objetivos
        - project_type : Tipo de proyecto (Backend, Frontend o Full Stack)
        - knowledge_project : Array con los archivos de conocimiento asociados al proyecto
    `,
    inputSchema : z.object({
        idProject : z.number()
    }),
    outputSchema : z.object({
        nameProject : z.string(),
        descriptionProject : z.string(),
        project_type : z.string(),
        knowledge_project : z.array(
            z.object({
                nameFile : z.string(),
                descriptionFile : z.string(),
                mimeType : z.string(),
            })
        )
    }),
    execute : async (input) => {
        const {idProject} = input
        const project = await sdk.findByID({
            collection : 'projects',
            id : idProject
        })
        const knowledgeProject = project.knowledge_project
            ?.filter((k): k is KnowledgeProject => typeof k !== 'number')
            .map((knowledge) => ({
                nameFile: knowledge.filename ?? '',
                descriptionFile: knowledge.description,
                mimeType: knowledge.mimeType ?? '',
            })) ?? []
        
        return {
            nameProject : project.name,
            descriptionProject : project.description,
            project_type : project.project_type,
            knowledge_project : knowledgeProject
        }
    }
})

//Testing URL FILE http://localhost:3000/api/knowledge_project/file/prodmentorai.md
export const projectKnowledgeTool = createTool({
    id : "projectKnowledgeTool",
    description : ` 
    ## Descripción
        Herramienta especializada para acceder y recuperar el contenido completo de archivos de conocimiento asociados a los proyectos del portfolio. Permite consultar documentación técnica, archivos de configuración, READMEs y cualquier otro archivo de soporte que forme parte del conocimiento del proyecto.
        
    ## Parámetros
        - nameFile : Nombre exacto del archivo de conocimiento que se desea consultar (ej: "README.md", "config.json", "api-docs.txt")
    
    ## Salida
        - contentFile : Contenido textual completo del archivo solicitado, incluyendo código, documentación o cualquier otro tipo de información almacenada en el mismo
    `,
    inputSchema : z.object({
        nameFile : z.string()
    }),
    outputSchema : z.object({
        contentFile : z.string()
    }),
    execute : async (input) => {
        const {nameFile} = input
        const file = await sdk.request({
            method : 'GET',
            path : `/knowledge_project/file/${nameFile}`,
        })
        const contentFile = await file.text()
        return {
            contentFile : contentFile
        }

    }
})

// Exportar objeto con todas las tools para inferir tipos
export const projectTools = {
    projectListTool,
    projectInfoTool,
    projectKnowledgeTool,
}

// Tipos inferidos para usar en el frontend
export type ProjectUITools = InferUITools<typeof projectTools>
