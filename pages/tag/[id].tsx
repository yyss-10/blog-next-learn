import Link from 'next/link'
import { client } from '../../libs/client'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Blogs, Tags } from '../../types/blog'

// component
import Header from '../../components/Header'
import Pagination from '../../components/Pagination'
import Title from '../../components/Title'

// css
import styleCommon from '../../styles/Common.module.scss'
import styleButton from '../../styles/Button.module.scss'
import styleCard from '../../styles/Card.module.scss'

export default function CategoryId({ blogs, tagName }: { blogs: Blogs[]; tagName: string }) {
  // タグに紐付いたコンテンツがない場合に表示
  if (blogs.length === 0) {
    return <div>ブログコンテンツがありません</div>
  }
  return (
    <>
      <Header title={'Blog'} />
      <div className={styleCommon.layout}>
        <div className={styleCard.card}>
          <Title title={`${tagName} タグ一覧`} size={'l'} />
          <ul>
            {blogs.map((blog) => (
              <li className={styleCard.blogCard} key={blog.id}>
                <Link href={`/blog/${blog.id}`}>
                  <a className={styleCard.link}>
                    <p className={styleCard.title}>{blog.title}</p>
                    {blog.description && <p className={styleCard.description}>{blog.description}</p>}
                    <div>
                      {blog.category && <p className={styleCard.category}>{blog.category.name}</p>}
                      {blog.tag.map((tag: Tags) => (
                        <span className={styleCard.tag} key={tag.id}>
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href={`/`}>
          <a className={styleButton.btn}>Topに戻る</a>
        </Link>
      </div>
    </>
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
  const tagName = await client.get({ endpoint: 'tags', queries: { filters: `id[contains]${id}` } })

  return {
    props: {
      blogs: data.contents,
      tagName: tagName.contents[0].name,
    },
  }
}
