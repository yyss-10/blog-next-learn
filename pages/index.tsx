import { GetStaticProps } from 'next'
import Link from 'next/link'
import { client } from '../libs/client'
import type { Blogs, Categorys, Tags } from '../types/blog'
import Pagination from '../components/Pagination'

type Props = {
  blogs: Blogs[]
  categorys: Categorys[]
  tags: Tags[]
  totalCount: number
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await client.get({ endpoint: 'blog', queries: { limit: 5, offset: 0 } })
  const categoryData = await client.get({ endpoint: 'categories' })
  const tagData = await client.get({ endpoint: 'tags' })

  return {
    props: {
      blogs: data.contents,
      categorys: categoryData.contents,
      tags: tagData.contents,
      totalCount: data.totalCount,
    },
  }
}

// { blogs }:Props == { blogs }: { blogs: { id: string, createdAt: string, updatedAt: string, publishedAt: string, revisedAt: string, title: string, body: string}[] }
// blogs.blogs == { blogs } ・ 分割代入は、オブジェクトからプロパティを取り出す機能
const Home = ({ blogs, categorys, tags, totalCount }: Props) => {
  // export default function Home({ blogs }:Props) {
  return (
    <div>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link href={`/tag/${tag.id}`}>
              <a>{tag.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <ul>
        {categorys.map((category) => (
          <li key={category.id}>
            <Link href={`/category/${category.id}`}>
              <a>{category.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <ul>
        {blogs.map((blog) => (
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
export default Home
