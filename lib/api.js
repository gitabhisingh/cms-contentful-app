import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com',
})

const getClient = (preview) => (preview ? previewClient : client)

function parseAuthor({ fields }) {
  return {
    name: fields.name,
    picture: fields.picture.fields.file,
  }
}

function parsePost({ fields }) {
  return {
    title: fields.title,
    slug: fields.slug,
    date: fields.date,
    content: fields.content,
    excerpt: fields.excerpt,
    coverImage: fields.coverImage.fields.file,
    domain: fields.domain,
    author: parseAuthor(fields.author),
  }
}

function parsePostEntries(entries, cb = parsePost) {
  return entries?.items?.map(cb)
}

export async function getPreviewPostBySlug(slug) {
  const entries = await getClient(true).getEntries({
    content_type: 'post',
    limit: 1,
    'fields.slug[in]': slug,
  })
  return parsePostEntries(entries)[0]
}

function parsePostParamEntries(entries, cb = parsePost) {
  return entries?.items?.map(cb)
}

export async function getAllPostsWithSlug() {
  const localeList = ['en-US', 'fr'];
  const entries = await client.getEntries({
    content_type: 'post',
    select: 'fields.slug',
  })
  let pathArr = [];
  let allPosts = parsePostParamEntries(entries, (post) => post.fields)
  allPosts.map((val) => {
    localeList.map((lang) => {
      pathArr.push({
        params: {
          locale: lang,
          domain: val.domain,
          slug: val.slug,
        }
      })
    });
  })
  return pathArr;
}

export async function getAllPostsForHome(preview) {
  const entries = await getClient(preview).getEntries({
    content_type: 'post',
    order: '-fields.date',
  })
  return parsePostEntries(entries)
}

export async function getPostAndMorePosts(slug, locale, preview) {
  const entry = await getClient(preview).getEntries({
    content_type: 'post',
    limit: 1,
    'fields.slug[in]': slug,
    locale: locale,
  })
  const entries = await getClient(preview).getEntries({
    content_type: 'post',
    limit: 2,
    order: '-fields.date',
    'fields.slug[nin]': slug,
  })

  return {
    post: parsePostEntries(entry)[0],
    morePosts: parsePostEntries(entries),
  }
}
