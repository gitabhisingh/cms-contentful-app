import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../../../components/container'
import PostBody from '../../../components/post-body'
import Header from '../../../components/header'
import PostHeader from '../../../components/post-header'
import Layout from '../../../components/layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../../lib/api'
import PostTitle from '../../../components/post-title'
import { CMS_NAME } from '../../../lib/constants'

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
            <>
              <article>
                <Head>
                  <title>
                    {post.title} | Next.js Blog Example with {CMS_NAME}
                  </title>
                  <meta property="og:image" content={post.coverImage.url} />
                </Head>
                <PostHeader
                  title={post.title}
                  coverImage={post.coverImage}
                  date={post.date}
                  author={post.author}
                />
                <PostBody content={post.content} />
              </article>
            </>
          )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getPostAndMorePosts(params.slug, params.locale, preview)

  return {
    props: {
      preview,
      post: data?.post ?? null,
    },
  }
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug()
  return {
    paths: allPosts ?? [],
    fallback: true,
  }
}
