import { useState } from "react"

import "./styles.less"

export const Input = (props) => {
  const { inputName, placeholder, onChangeValue } = props;
  const [value, setValue] = useState("");
  const onChange = (evt) => {
    setValue(evt.target.value);
    onChangeValue(evt.target.value);
  }
  return (
    <div className="inputBox">
      <label className="inputLabel">
        <span className="inputName">{inputName}:</span>
        <input className="inputContent" value={value} onChange={onChange} placeholder={placeholder} />
      </label>
    </div>
  )
}
