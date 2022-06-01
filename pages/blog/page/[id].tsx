import Link from 'next/link'
import Pagination from '../../../components/Pagination'
import { GetStaticProps, GetStaticPaths } from 'next'
import { client } from '../../../libs/client'
import { Blogs } from '../../../types/blog'

const PER_PAGE = 5

export default function BlogPageId({ blog, totalCount }: { blog: Blogs[], totalCount: number }) {
  return (
    <div>
      <ul>
        {blog.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>
              <a>{blog.title}</a>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination totalCount={totalCount} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const repos = await client.get({ endpoint: 'blog' })
  const range = (start: number, end:number) => [...Array(end - start + 1)].map((_, i) => start + i)
  const paths = range(1, Math.ceil(repos.totalCount / PER_PAGE)).map((repo) => `/blog/page/${repo}`)

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id
  const data = await client.get({ endpoint: 'blog', queries: { offset: (Number(id) - 1) * 5, limit: 5 } })

  return {
    props: {
      blog: data.contents,
      totalCount: data.totalCount
    }
  }
}