'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Project } from '@/payload-types'

export async function getProjectBySlug(slug: string, depth = 3): Promise<Project | null> {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'projects',
    depth,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return (result.docs[0] as unknown as Project) || null
}
