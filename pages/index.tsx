import { GetStaticProps } from 'next'
import Link from 'next/link'
import { client } from '../libs/client'
import type { Blogs } from '../types/blog'

type Props = {
  blogs: Blogs[]
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await client.get({ endpoint: 'blog' })

  return {
    props: {
      blogs: data.contents,
    },
  }
}

// { blogs }:Props == { blogs }: { blogs: { id: string, createdAt: string, updatedAt: string, publishedAt: string, revisedAt: string, title: string, body: string}[] }
// blogs.blogs == { blogs } ・ 分割代入は、オブジェクトからプロパティを取り出す機能
const Home = ({ blogs }: Props) => {
  // export default function Home({ blogs }:Props) {
  return (
    <div>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>
              <a>{blog.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Home
