import stylesHeader from '../styles/Header.module.scss'

const Header: any = (props: { title: string }) => {
  return (
    <header className={stylesHeader.header}>
      <h1 className={stylesHeader.title}>{props.title}</h1>
    </header>
  )
}

export default Header
