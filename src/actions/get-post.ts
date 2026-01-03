'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Post } from '@/payload-types'

export async function getPostBySlug(slug: string, depth = 20): Promise<Post | null> {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'posts',
    depth,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return (result.docs[0] as unknown as Post) || null
}
