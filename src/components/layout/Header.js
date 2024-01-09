import styles from './Header.module.css'
import logo from "../../banestes_logo.png"
import { FiMenu } from "react-icons/fi";

import Menu from './Menu';
import { useState } from 'react';

function Header(){

    const [trigger, setTrigger] = useState('close')
    
    function handleOnClick(){
        setTrigger(( trigger === 'close' ? 'open' : 'close'))
    }

    return(
        <>
            <header className={styles.header}>
                <div onClick={handleOnClick}>
                    <FiMenu />
                </div>
                
                <img src={logo} alt='Banestes'/>
            </header>

            <Menu trigger={trigger} handleOnClick={handleOnClick}/>
        </>
    )
}

export default Header