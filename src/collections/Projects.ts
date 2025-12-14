import type { CollectionConfig } from "payload";

export const Projects : CollectionConfig = {
    slug: 'projects',
    access: {
        read: () => true,
    },
    fields : [
        {
            type : "text",
            name : "name",
            required : true
        },
        {
            type : "text" ,
            name : "description",
            required : true
        },
        {
            type : "text" ,
            name : "github_repo",
            required : false,
        },
        {
            type : "relationship",
            relationTo : "media",
            hasMany : false,
            required : false,
            name : "image_repo"
        },
        {
            type : "select" , 
            name : "project_type",
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
            type : "relationship",
            relationTo : "knowledge_project",
            hasMany : true,
            required : false,
            name : "knowledge_project"
        }
    ]
}