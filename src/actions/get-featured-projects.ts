'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Project } from '@/payload-types'

export async function getFeaturedProjects(): Promise<Project[]> {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'projects',
    where: {
      is_featured: {
        equals: true,
      },
    },
    limit: 3,
    depth: 1,
  })

  // The result.docs type might need casting depending on exact payload-types generation, 
  // but typically it matches.
  return result.docs as unknown as Project[]
}
