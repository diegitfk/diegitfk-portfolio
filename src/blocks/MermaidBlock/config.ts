import type { Block } from 'payload';

export const MermaidBlock: Block = {
    slug : "mermaid-block",
    interfaceName : "MermaidBlock",
    fields : [
        {
            name : "code",
            type : "textarea",
            required : true,
            label : "Código"
        }
    ]
}