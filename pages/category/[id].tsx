import Link from 'next/link'
import { client } from '../../libs/client'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Blogs, Tags, Categorys } from '../../types/blog'

// component
import Header from '../../components/Header'
import Title from '../../components/Title'

// css
import styleCommon from '../../styles/Common.module.scss'
import styleButton from '../../styles/Button.module.scss'
import styleCard from '../../styles/Card.module.scss'

export default function CategoryId({ blogs }: { blogs: Blogs[] }) {
  // カテゴリーに紐付いたコンテンツがない場合に表示
  if (blogs.length === 0) {
    return <div>ブログコンテンツがありません</div>
  }
  return (
    <>
      <Header title={'Blog'} />
      <div className={styleCommon.layout}>
        <div className={styleCard.card}>
          <Title title={`${blogs[0].category.name} カテゴリ一覧`} size={'l'} />
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
