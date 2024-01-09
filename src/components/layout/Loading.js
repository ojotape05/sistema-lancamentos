import loading from '../../img/loading.gif'
import styles from './Loading.module.css'

function Loading(){
    return(
        <div className={styles.loader_container}>
            <img
                src={loading}
                alt='Loading'    
            />
        </div>
    )
}

export default Loading