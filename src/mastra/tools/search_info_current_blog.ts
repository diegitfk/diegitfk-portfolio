import { createTool } from '@mastra/core/tools';
import z from "zod";

export const search_info_current_blog = createTool({
    id : "search-info-current-blog",
    description : "Para hacer busquedas semanticas sobre el blog actual.",
    inputSchema : z.object({
        slug_blog : z.string().describe("Slug del blog actual."),
        query : z.string().describe("Query para hacer busquedas semanticas sobre el blog actual."),
    }),
    outputSchema : z.object({
        result : z.string().describe("Resultado de la busqueda semanticas sobre el blog actual.")
    }),
    execute : async ({context : {slug_blog}}) => {
        //Lógica de busqueda semanticas sobre el blog actual en la base de datos (SUPABASE bajo la conexión al schema MASTRA)
        return {
            result : ""
        }
    }
})