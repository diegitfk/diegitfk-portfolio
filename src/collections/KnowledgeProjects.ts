import type { CollectionConfig } from 'payload'

export const KnowledgeProject : CollectionConfig = {
    slug : 'knowledge_project',
    access : {
        read: () => true,
    },
    fields : [
        {
            name : 'description',
            type : 'text',
            required : true
        }
    ],
    upload : true
}