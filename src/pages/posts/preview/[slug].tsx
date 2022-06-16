import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import router from 'next/router'
import { RichText } from 'prismic-dom'
import { useEffect } from 'react'
import { getPrismicClient } from '../../../services/prismic'

import styles from '../post.module.scss'

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {

  const { data } = useSession()

  useEffect(() => {
    if (data?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  return (
    <>
      <Head>
        <title>{post.title} | Ignews </title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>

          </div>
        </article>
      </main>
    </>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params

  const primisc = getPrismicClient()

  const postResponse = await primisc.getByUID('post', String(slug), {})
  console.log(postResponse)
  const post = {

    slug: postResponse?.uid,
    title: RichText.asText(postResponse?.data?.title) ?? '',
    content: RichText.asHtml(postResponse?.data.content.splice(0, 3)),
    updatedAt: new Date(postResponse.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: { post },
    redirect: 60 * 30
  }
}