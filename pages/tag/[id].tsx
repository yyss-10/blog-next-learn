import Link from 'next/link'
import { client } from '../../libs/client'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Blogs, Tags } from '../../types/blog'

export default function CategoryId({ blogs }: { blogs: Blogs[] }) {
  console.log(blogs)
  // タグに紐付いたコンテンツがない場合に表示
  if (blogs.length === 0) {
    return <div>ブログコンテンツがありません</div>
  }
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

// 静的生成のためのパスを指定します
export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.get({ endpoint: 'tags' })
  const paths = data.contents.map((content: Tags) => `/tag/${content.id}`)

  return { paths, fallback: false }
}

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id
  const data = await client.get({ endpoint: 'blog', queries: { filters: `tag[contains]${id}` } }) // 複数コンテンツの時は「contains」？

  return {
    props: {
      blogs: data.contents,
    },
  }
}
