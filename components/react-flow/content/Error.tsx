import s from './Error.module.css'

function Error(props: { message: string }) {
  return <span className={s.error}>{props.message}</span>
}

export default Error
