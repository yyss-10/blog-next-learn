import { GetStaticProps } from 'next'
import { client } from '../libs/client'
import Link from 'next/link'
import type { Blogs, Categorys, Tags } from '../types/blog'

// component
import Header from '../components/Header'
import Pagination from '../components/Pagination'
import Title from '../components/Title'

// css
import styleCommon from '../styles/Common.module.scss'
import styleTop from '../styles/Top.module.scss'
import styleCard from '../styles/Card.module.scss'

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
    <>
      <Header title={'Blog'} />
      <div className={`${styleCommon.layout} ${styleTop.flex}`}>
        <div className={styleTop[`flexInner--large`]}>
          <div className={styleCard.card}>
            <Title title={'記事一覧'} size={'l'} />
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
            <Pagination totalCount={totalCount} currentNum={1} />
          </div>
        </div>

        <div className={styleTop[`flexInner--small`]}>
          <div className={styleCard.smallCard}>
            <Title title={'カテゴリ一覧'} size={'s'} />
            <ul>
              {categorys.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.id}`}>
                    <a>{category.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styleCard.smallCard}>
            <Title title={'タグ一覧'} size={'s'} />
            <ul>
              {tags.map((tag) => (
                <li key={tag.id}>
                  <Link href={`/tag/${tag.id}`}>
                    <a>#{tag.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
export default Home
