// pages/blog/[id].js
import { GetStaticProps, GetStaticPaths } from 'next'
import { client } from '../../libs/client'
import { Blogs } from '../../types/blog'
import styles from '../../styles/Home.module.scss'

export default function BlogId({ blog }: { blog: Blogs }) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{blog.title}</h1>
      <p className={styles.publishedAt}>{blog.publishedAt}</p>
      <p className="category">{blog.category && `${blog.category.name}`}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: `${blog.body}`,
        }}
        className={styles.post}
      />
    </main>
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

export const getStaticProps = async (context:any) => {
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
      ...draftKey,
    },
  }
}
