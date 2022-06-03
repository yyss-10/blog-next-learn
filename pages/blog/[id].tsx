// pages/blog/[id].js
import Link from 'next/link'
import { GetStaticProps, GetStaticPaths } from 'next'
import { client } from '../../libs/client'
import { Blogs } from '../../types/blog'
import styles from '../../styles/Home.module.scss'

// component
import Header from '../../components/Header'
import Title from '../../components/Title'

// css
import styleCommon from '../../styles/Common.module.scss'
import styleBlogLayout from '../../styles/BlogLayout.module.scss'
import styleCard from '../../styles/Card.module.scss'
import styleButton from '../../styles/Button.module.scss'

export default function BlogId({ blog }: { blog: Blogs }) {
  // console.log(blog)
  const publishedDate = blog.publishedAt.replace(/-/g, '/').substring(0, blog.publishedAt.indexOf('T'))

  return (
    <>
      <Header title={'Blog'} />
      <div className={styleCommon.layout}>
        <main className={styleCard.card}>
          <Title title={blog.title} size="l" />
          <div className={styleBlogLayout.head}>
            <p>日付：{publishedDate}</p>
            <p>カテゴリ：{blog.category && `${blog.category.name}`}</p>
            <p>
              タグ：
              {blog.tag.map((tag) => (
                <Link href={`/tag/${tag.id}`} key={tag.id}>
                  <a>#{tag.name}</a>
                </Link>
              ))}
            </p>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: `${blog.body}`,
            }}
            className={styleBlogLayout.body}
          />
        </main>
        <Link href={`/`}>
          <a className={styleButton.btn}>Topに戻る</a>
        </Link>
      </div>
    </>
  )
}

// 静的生成のためのパスを指定します
export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.get({ endpoint: 'blog' })

  const paths = data.contents.map((content: Blogs) => `/blog/${content.id}`)
  return { paths, fallback: false }
}

// データをテンプレートに受け渡す部分の処理を記述します
// export const getStaticProps: GetStaticProps = async (context) => {
//   const id = context.params?.id as string
//   const data = await client.get({ endpoint: 'blog', contentId: id })

//   return {
//     props: {
//       blog: data,
//     },
//   }
// }

export const getStaticProps = async (context: any) => {
  // 記事IDを取得する
  const slug = context.params.id

  // draftKeyを取得し、クエリを作成する
  const draftKey = context.previewData?.draftKey ? { draftKey: context.previewData.draftKey } : {}

  // 記事を取得する
  const blogPost = await client.get({
    endpoint: 'blog',
    contentId: slug,
    queries: draftKey,
  })

  // 記事が存在しなければ404エラーを返す
  if (!blogPost) {
    return { notFound: true }
  }

  // 記事とdraftKeyをpropsに渡す
  return {
    props: {
      blog: blogPost,
      // ...draftKey,
    },
  }
}
