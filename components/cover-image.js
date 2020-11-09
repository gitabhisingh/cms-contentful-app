import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

export default function CoverImage({ title, url, slug }) {
  const image = (
    // <img
    //   src={url}
    //   alt={`Cover Image for ${title}`}
    //   className={cn('shadow-small', {
    //     'hover:shadow-medium transition-shadow duration-200': slug,
    //   })}
    // />
    <Image src='/scenery.jpg' width="400" height="400" alt='Cover' />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
          image
        )}
    </div>
  )
}
