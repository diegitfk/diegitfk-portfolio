import { createTool } from '@mastra/core/tools';
import z from "zod";

export const get_content_current_blog = createTool({
    id : "get-content-current-blog",
    description : "Tool para obtener el contenido total del blog actual, en formato JSON estructurado.",
    inputSchema : z.object({
        slug_blog : z.string(),
    }),
    outputSchema : z.object({
        title : z.string(),
        content : z.string(),
    }),
    execute : async ({context : {slug_blog}}) => {
        //Lógica de obtención del blog contenido total del blog actual.
        //Está búsqueda se hace bajo el schema public con el sdk de payload, para obtener el contenido estructurado del rich text de la colección posts.
        return {
            title : "",
            content : ""
        }
    }
})
