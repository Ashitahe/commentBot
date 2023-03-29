import "./styles.less"

export const Button = (props) => {
  const { onClick, btnText } = props
  return (
    <div className="buttonBox" onClick={onClick}>
      {btnText}
    </div>
  )
}
