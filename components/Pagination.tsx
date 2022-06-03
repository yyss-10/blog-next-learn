import Link from 'next/link'
import stylePagination from '../styles/Pagination.module.scss'

const Pagination = ({ totalCount, currentNum }: { totalCount: number; currentNum: number }) => {
  const PER_PAGE = 5
  const range = (start: number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i)

  return (
    <ul className={stylePagination.pagination}>
      {range(1, Math.ceil(totalCount / PER_PAGE)).map((number, index) => (
        <li key={index}>
          <Link href={`/blog/page/${number}`}>
            <a className={currentNum == number ? stylePagination.active : ''}>{number}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Pagination
