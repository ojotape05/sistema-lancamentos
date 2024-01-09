import PropTypes from 'prop-types'
import styles from './Input.module.css'

function Input({type,text,name,placeholder,step,readonly,disabled,handleOnChange,handleOnBlur,value,required}){
    return(
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}</label>
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                value={value}
                required={required}
                step={step}
                readOnly={readonly}
                disabled={disabled}
            />
        </div>
    )
}

Input.propTypes = {
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
}

Input.defaultProps = {
    type: 'text',
    text: 'generic',
    name: 'generic',
    placeholder: 'generic',
    readonly: false,
    disabled: false
}


export default Input