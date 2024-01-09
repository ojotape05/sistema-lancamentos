import React from 'react';
import styles from "./Lancamento.module.css"

import SubLancamento from "../home/Sublancamento"

function Lancamento({ lanc }){

    return(
        <div className={styles.card_lancamento}>

            <div className={styles.card_lancamento_desc}>
                <h3 title={"N° Lançamento"}> {lanc.lancamento} </h3>
                <ul className={styles.list}>
                    <li> <span> OPERAÇÃO: </span> {lanc.operacao} </li>
                    <li> <span> HISTÓRICO: </span> {lanc.historico} </li>
                    <li> <span> SUBCONTA: </span> {lanc.subconta} </li>
                    <li> <span> ANALITICO: </span> {lanc.analitica} </li>
                </ul>
            </div>

            <div className={styles.card_lancamento_sublanc}>
            
                <ol>
                    {lanc.subLancamentos.map( (sublanc, index) =>
                        (
                            <SubLancamento key={lanc.lancamento + "-" +index} sublanc={sublanc}/>
                        )
                    )}
                </ol>
                    
            </div>

        </div>
    )
}

export default Lancamento