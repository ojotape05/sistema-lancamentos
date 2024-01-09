import { lazy, useState } from "react"
import { FixedSizeList as List } from "react-window";

import Container from "../layout/Container"
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import Loading from "../layout/Loading"

import styles from './Home.module.css'

const Lancamento = lazy(() => import("../home/Lancamento"))

function Home(){

    const [processamento, setProcessamento] = useState({})
    const [lancamentos, setLancamentos] = useState([])
    const [lancamentosFiltrados, setLancamentosFiltrados] = useState([])
    const [loading, setLoading] = useState(false)
    
    function limpaFiltro(){
        setLoading(true)
        setLancamentosFiltrados([...lancamentos])
        setLoading(false)
    }
    
    function filterCarteira(e){
        setLoading(true)
        var tempList1 = []
        if(lancamentos.length > 0){
            if(e.target.value !== ""){
                tempList1 = [...lancamentosFiltrados].filter(lancamento =>
                    lancamento.subLancamentos.some(sublancamento => sublancamento.carteira=== e.target.value)
                );
                setLancamentosFiltrados((tempList1))
            } else {
                tempList1 = lancamentosFiltrados.length > 0 ? lancamentosFiltrados : [...lancamentos];
                setLancamentosFiltrados((tempList1))
            }
        }
        setLoading(false)
    }
    
    function filterConta(e){
        setLoading(true)
        var tempList1; var search
        if(e.target.value.includes("*")){
            search = e.target.value.substring(1,e.target.value.length - 1)
            if(lancamentos.length > 0){
                if(search !== ""){
                    setLancamentosFiltrados([...lancamentosFiltrados])
                    tempList1 = [...lancamentosFiltrados].filter(lancamento =>
                        lancamento.subLancamentos.some(sublancamento => sublancamento.conta.includes(search))
                    );
                    setLancamentosFiltrados(tempList1)
                }else{
                    tempList1 = lancamentosFiltrados.length > 0 ? lancamentosFiltrados : [...lancamentos];
                    setLancamentosFiltrados((tempList1))
                }
            }
            setLoading(false)
        }else{
            if(lancamentos.length > 0){
                if(e.target.value !== ""){
                    setLancamentosFiltrados([...lancamentosFiltrados])
                    tempList1 = [...lancamentosFiltrados].filter(lancamento =>
                        lancamento.subLancamentos.some(sublancamento => sublancamento.conta === e.target.value)
                    );
                    setLancamentosFiltrados(tempList1)
                } else {
                    tempList1 = lancamentosFiltrados.length > 0 ? lancamentosFiltrados : [...lancamentos];
                    setLancamentosFiltrados((tempList1))
                }
            }
            setLoading(false)
        }
    }
    
    function filterLancamento(e){
        setLoading(true)
        var tempList1 = []
        if(lancamentos.length > 0){
            if(e.target.value !== ""){
                setLancamentosFiltrados([...lancamentosFiltrados])
                tempList1 = [...lancamentosFiltrados].filter( lanc => lanc.lancamento === e.target.value)
                setLancamentosFiltrados(tempList1)
            } else {
                tempList1 = lancamentosFiltrados.length > 0 ? lancamentosFiltrados : [...lancamentos];
                setLancamentosFiltrados((tempList1))
            }
            
        }
        setLoading(false)
    }
    
    function filterSubconta(e){
        setLoading(true)
        var tempList1 = []; var tempList2
        if(lancamentos.length > 0){
            if(e.target.value !== ""){
                setLancamentosFiltrados([...lancamentosFiltrados])
                tempList1 = [...lancamentosFiltrados].filter( lanc => lanc.subconta === e.target.value)

                tempList2 = [...lancamentosFiltrados].filter(lancamento =>
                    lancamento.subLancamentos.some(sublancamento => sublancamento.subconta === e.target.value)
                );

                setLancamentosFiltrados(somarListasSemRepeticao(tempList1,tempList2,'lancamento'))
            } else {
                tempList1 = lancamentosFiltrados.length > 0 ? lancamentosFiltrados : [...lancamentos];
                setLancamentosFiltrados((tempList1))
            }
            
        }
        setLoading(false)
    }

    function filterAnalitica(e){
        setLoading(true)
        var tempList1 = []; var tempList2 = []
        if(lancamentos.length > 0){
            if(e.target.value !== ""){
                setLancamentosFiltrados([...lancamentosFiltrados])
                tempList1 = [...lancamentosFiltrados].filter( lanc => lanc.analitica === e.target.value)
                tempList2 = [...lancamentosFiltrados].filter(lancamento =>
                    lancamento.subLancamentos.some(sublancamento => sublancamento.analitica === e.target.value)
                );
                setLancamentosFiltrados(somarListasSemRepeticao(tempList1,tempList2,'lancamento'))
            } else {
                tempList1 = lancamentosFiltrados.length > 0 ? lancamentosFiltrados : [...lancamentos];
                setLancamentosFiltrados((tempList1))
            }
            
        }
        setLoading(false)
    }
    
    function handleOnChange(e){
        setProcessamento({
            ...processamento,
            'file': e.target.files[0]
        })
    }
    
    function handleSelectExport(e){
        setProcessamento({
            ...processamento,
            tp_exportacao:{
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            }
        })
    }

    function handleOnSubmit(e){
        e.preventDefault()
        if(processamento.file && processamento.tp_exportacao){
            setLoading(true)
            setLancamentos([])

            const dataForm = new FormData();

            dataForm.append('file', processamento.file)
            dataForm.append('tp_exportacao', JSON.stringify(processamento.tp_exportacao))
            
            fetch(`http://localhost:5000/processar-arquivo`,{
                mode: 'cors',
                method: 'POST',
                body: dataForm,
            })
            .then( result => result.json())
            .then( data => {
                setLancamentos(data.lancamentos)
                setLancamentosFiltrados(data.lancamentos)
                setLoading(false)
            })
            .catch( err => {
                alert("ERRO! Confira o log")
                console.log(err)
            })
        }else{
            alert("Preencha corretamente todos os campos do formulário")
        }
        
    }

    return(
        <>
            {
                ( loading ?
                    <Loading />
                    :
                  ""    
                ) 
            }
        

            <div className={`${styles.home_container}`}>
                <Container>
                        <h2 className={styles.title}> Processamento de arquivo de lançamento </h2>
                        <form className={styles.form} onSubmit={handleOnSubmit}>
                            <Select
                                text='Tipo de Importação'
                                name='tp_exportacao'
                                options={[{id:1,name:'Todos'},{id:2,name:'Tarifa 25'}]}
                                handleOnChange={handleSelectExport}
                                value={processamento.tp_exportacao ? processamento.tp_exportacao.id : ""}
                            />
                            <Input
                                name='file'
                                type='file'
                                text='Arquivo de lançamento (.txt)'
                                handleOnChange={handleOnChange}
                            />
                            <SubmitButton 
                                text='Processar'
                            />
                        </form>

                        {( lancamentos.length > 0 ?
                            (<div className={styles.div_filtro}>

                                <Input
                                    text='Lançamento'
                                    type='text'
                                    placeholder=""
                                    handleOnBlur={filterLancamento}
                                />

                                <Input
                                    text='Subconta'
                                    type='text'
                                    placeholder=""
                                    handleOnBlur={filterSubconta}
                                />

                                <Input
                                    text='Analitico'
                                    type='text'
                                    placeholder=""
                                    handleOnBlur={filterAnalitica}
                                />

                                <Input
                                    text='Conta'
                                    type='text'
                                    placeholder="* (pesquisa personalizada)"
                                    handleOnBlur={filterConta}
                                />

                                <Input
                                    text='Carteira'
                                    type='text'
                                    placeholder=''
                                    handleOnBlur={filterCarteira}
                                />
                                <div className={styles.div_button} onClick={limpaFiltro}>
                                    <button>
                                        Limpar
                                    </button>
                                </div>


                                </div>)

                                : 

                                ""
                        )}
                        
                        
                        
                        <List
                            itemCount={lancamentosFiltrados.length}
                            itemSize={385}
                            height={700}
                            width={1000}
                        >

                            {({index, style}) => {
                                return(
                                    <div style={style}>
                                        <Lancamento
                                            key={lancamentosFiltrados[index].lancamento}
                                            lanc={lancamentosFiltrados[index]}
                                        />
                                    </div>
                                )
                            }}

                        </List>
                    
                </Container>
            </div>

        </>
    )
}

export default Home

// Helpers

function somarListasSemRepeticao(lista1, lista2, chaveUnica) {
    const resultado = [...lista1];

    // Adicionar objetos de lista2 que não estão em resultado
    for (const obj2 of lista2) {
        if (!resultado.some(obj1 => obj1[chaveUnica] === obj2[chaveUnica])) {
            resultado.push(obj2);
        }
    }

    return resultado;
}
