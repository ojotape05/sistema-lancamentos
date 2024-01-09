import styles from './Sublancamento.module.css'

import { memo } from "react"

function Sublancamento({ sublanc }){
    return(
        <li>
            <span title={"Conta"} >{sublanc.conta}</span>
            <span title={"Operação"} >{sublanc.operacao}</span>
            <span title={"Subconta"} >{sublanc.subconta}</span>
            <span title={"Analítico"} >{sublanc.analitica}</span>
            <span className={styles.hover} title={sublanc.valor_desc.descricao}>{sublanc.valor_desc.valor}</span>
            <span className={styles.hover} title={sublanc.compl_desc.descricao}>{sublanc.compl_desc.compl_hist}</span>
        </li>
    )
}

export default memo(Sublancamento)

