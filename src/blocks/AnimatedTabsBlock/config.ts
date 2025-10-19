import type { Block } from 'payload';

export const AnimatedTabsBlock: Block = {
  slug: 'animatedTabs',
  interfaceName: 'AnimatedTabsBlock',
  labels: {
    singular: 'Animated Tabs',
    plural: 'Animated Tabs',
  },
  fields: [
    {
        name : "tabs" ,
        type : "array",
        fields : [
            {
                name : "value",
                type : "text",
            },
            {
                name : "title",
                type : "text",
            },
            {
                name : "description",
                type : "text",
            },
            {
                name : "image",
                type : "upload",
                relationTo : "media",
            }
        ]
    }
  ],
};