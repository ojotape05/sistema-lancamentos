import PropTypes from 'prop-types'
import styles from './SubmitButton.module.css'

function SubmitButton({text, handleOnClick}){
    return(
        <div>
            <button onClick={handleOnClick} className={styles.btn}>{text}</button>
        </div>
    )
}

SubmitButton.propTypes = {
    text: PropTypes.string.isRequired,
}

SubmitButton.defaultProps = {
    text: 'generic'
}


export default SubmitButton