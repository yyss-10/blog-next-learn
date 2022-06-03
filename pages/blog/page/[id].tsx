import Link from 'next/link'
import { GetStaticProps, GetStaticPaths } from 'next'
import { client } from '../../../libs/client'
import { Blogs, Categorys, Tags } from '../../../types/blog'

// component
import Header from '../../../components/Header'
import Pagination from '../../../components/Pagination'
import Title from '../../../components/Title'

// css
import styleCommon from '../../../styles/Common.module.scss'
import styleTop from '../../../styles/Top.module.scss'
import styleCard from '../../../styles/Card.module.scss'

const PER_PAGE = 5

type Props = {
  blogs: Blogs[]
  categorys: Categorys[]
  tags: Tags[]
  totalCount: number
  id: number
}

export default function BlogPageId({ blogs, categorys, tags, totalCount, id }: Props) {
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
            <Pagination totalCount={totalCount} currentNum={id} />
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

export const getStaticPaths: GetStaticPaths = async () => {
  const repos = await client.get({ endpoint: 'blog' })
  const range = (start: number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i)
  const paths = range(1, Math.ceil(repos.totalCount / PER_PAGE)).map((repo) => `/blog/page/${repo}`)

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id
  const data = await client.get({ endpoint: 'blog', queries: { offset: (Number(id) - 1) * 5, limit: 5 } })
  const categoryData = await client.get({ endpoint: 'categories' })
  const tagData = await client.get({ endpoint: 'tags' })

  return {
    props: {
      blogs: data.contents,
      categorys: categoryData.contents,
      tags: tagData.contents,
      totalCount: data.totalCount,
      id: Number(id),
    },
  }
}
