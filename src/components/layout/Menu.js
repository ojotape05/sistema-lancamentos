import styles from './Menu.module.css'

import { FiArrowLeft } from "react-icons/fi";

function Menu({trigger, handleOnClick}){

    return(
        <div className={`${styles.menu} ${styles[trigger]}`}>
            <div className={styles.menu_header}>
                <p>Menu</p>
                <div onClick={handleOnClick}>
                    <FiArrowLeft />
                </div>
            </div>
            <div className={styles.d_flex}>
                <ul>
                    <li> teste </li>
                </ul>
            </div>
        </div>
    )
}

export default Menu