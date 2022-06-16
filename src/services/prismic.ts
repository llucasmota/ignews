import Prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'


export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_ENDPOINT, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })


  return prismic
}
