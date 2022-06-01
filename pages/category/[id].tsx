import Link from 'next/link'
import { client } from '../../libs/client'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Blogs, Categorys } from '../../types/blog'

export default function CategoryId({ blogs }: {blogs :Blogs[] }) {
  console.log(blogs)
  // カテゴリーに紐付いたコンテンツがない場合に表示
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
  const data = await client.get({ endpoint: 'categories' })
  const paths = data.contents.map((content: Categorys) => `/category/${content.id}`)

  // paths：事前ビルドするパス対象を指定するパラメータ
  // fallback：事前ビルドしたパス以外にアクセスしたときのパラメータ true:カスタム404Pageを表示 false:404pageを表示
  return { paths, fallback: false } // return { paths: ['/category/lp1j0vzh4', '/category/???'], fallback: false }
}

// データをテンプレートに受け渡す部分の処理を記述します / context({ params })には上記pathsで指定した値が入る（1postずつ）
export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id
  const data = await client.get({ endpoint: 'blog', queries: { filters: `category[equals]${id}` } }) // microcmsのapi参照 / equals = 値が完全一致しているコンテンツを取得

  return {
    props: {
      blogs: data.contents,
    },
  }
}
