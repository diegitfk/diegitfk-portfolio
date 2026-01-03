'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Project } from '@/payload-types'

export async function getProjects(): Promise<Project[]> {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'projects',
    limit: 100,
    depth: 2,
    sort: '-createdAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs as unknown as Project[]
}
