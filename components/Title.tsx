import styleTitle from '../styles/Title.module.scss'

const Title = ({ title, size }: { title: string; size: string }) => {
  const classSize = () => {
    switch (size) {
      case 'l':
        return 'title--border'
      case 's':
        return 'title--sub'
      default:
        return 'title--border'
    }
  }

  return <h2 className={styleTitle[classSize()]}>{title}</h2>
}

export default Title
