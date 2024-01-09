

import Lancamento from './Lancamento'

import styles from './Lancamentos.module.css'

//Icones
import { SlActionUndo } from "react-icons/sl";
import { SlActionRedo } from "react-icons/sl"


function Lancamentos({lancamentos, page, blocos, pagePrevious, pageNext}){

    return(
        <>
         { lancamentos.length > 0 ?
            ( <>
                <div id='lancamentos' className={styles.lancamentos}>
                    
                    {
                        lancamentos.length !== 0 ?
                        lancamentos.map( lanc => (
                            <Lancamento key={lanc.lancamento} lanc={lanc} />
                        ))
                        :
                        ""
                    }
                    

                </div>

                <div className={styles.pages_div}>
                    {
                        page !== 1 ?
                        (<div onClick={pagePrevious}> <SlActionUndo />  </div>)
                        :
                        ("")
                    }
                    
                    <span> {page} </span>
                    
                    {
                        page !== parseInt(blocos) ?
                        (<div onClick={pageNext}> <SlActionRedo /> </div>)
                        :
                        ("")
                    }
                </div>

              </>  
            ) :
            'Sem lançamentos encontrados'
         }
         
        </>
        
    )
}

export default Lancamentos

// Helpers 

