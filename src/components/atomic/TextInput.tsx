import React from 'react'

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, startAdornment, endAdornment, className, ...rest }, ref) => {
    return (
      <div className={`th-textinput ${className ?? ''}`.trim()}>
        {label && (
          <label className="th-textinput__label">
            {label}
          </label>
        )}

        <div className="th-textinput__control">
          {startAdornment && (
            <span className="th-textinput__adornment th-textinput__adornment--start">{startAdornment}</span>
          )}

          <input ref={ref} className="th-textinput__input" {...rest} />

          {endAdornment && (
            <span className="th-textinput__adornment th-textinput__adornment--end">{endAdornment}</span>
          )}
        </div>

        {error && <div className="th-textinput__error">{error}</div>}
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
