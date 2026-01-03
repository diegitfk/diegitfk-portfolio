'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Post } from '@/payload-types'

export async function getPosts(): Promise<Post[]> {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'posts',
    limit: 100,
    depth: 1,
    sort: '-createdAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs as unknown as Post[]
}
