import { lazy, useEffect, useState } from "react"

import Container from "../layout/Container"
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import Loading from "../layout/Loading"

import styles from './Home.module.css'

const Lancamentos = lazy(() => import("../home/Lancamentos"))

const pages = {
    1: {
        inicial: 0,
        final: 5000
    },
    2: {
        inicial: 5000,
        final: 10000
    },
    3: {
        inicial: 10000,
        final: 15000
    },
    4: {
        inicial: 15000,
        final: 20000
    },
    5: {
        inicial: 20000,
        final: 25000
    },
    6: {
        inicial: 25000,
        final: 30000
    },
    7: {
        inicial: 30000,
        final: 35000
    }
}

function Home(){

    const [processamento, setProcessamento] = useState({})
    const [lancamentos, setLancamentos] = useState([])
    const [lancamentosFiltrados, setLancamentosFiltrados] = useState([])
    const [loading, setLoading] = useState(false)
    const [lancPage, setLancPage] = useState(1)
    const [blocos, setBlocos] = useState(1)
    const [displayLancamentos, setDisplayLancamentos] = useState(true)
    
    useEffect(() =>{
        if(lancPage === (lancamentos.length / 5000)){
            setLancamentosFiltrados( lancamentos.slice(pages[lancPage].inicial,lancamentos.length - 1) )
        }else{
            setLancamentosFiltrados(lancamentos.slice(pages[lancPage].inicial,pages[lancPage].final))
        }
    },[lancPage,lancamentos])
    
    function limpaFiltro(){
        setLoading(true)
        setLancamentosFiltrados([...lancamentos])
        setTimeout(() => {
            setLoading(false)
        }, 1200)
    }
    
    function filterCarteira(e){
        setLoading(true)
        if(lancamentos.length > 0 && e.target.value !== ""){
            setLancamentosFiltrados([...lancamentosFiltrados])
            var tempList1 = [...lancamentosFiltrados].filter(lancamento =>
                lancamento.subLancamentos.some(sublancamento => sublancamento.carteira=== e.target.value)
            );
            setLancamentosFiltrados(tempList1)
        }
        setLoading(false)
    }
    
    function filterConta(e){
        setLoading(true)
        var tempList1; var search
        if(e.target.value.includes("*")){
            search = e.target.value.substring(1,e.target.value.length - 1)
            console.log(search)
            if(lancamentos.length > 0 && search !== ""){
                setLancamentosFiltrados([...lancamentosFiltrados])
                tempList1 = [...lancamentosFiltrados].filter(lancamento =>
                    lancamento.subLancamentos.some(sublancamento => sublancamento.conta.includes(search))
                );
                setLancamentosFiltrados(tempList1)
            }
            setLoading(false)
        }else{
            if(lancamentos.length > 0 && e.target.value !== ""){
                setLancamentosFiltrados([...lancamentosFiltrados])
                tempList1 = [...lancamentosFiltrados].filter(lancamento =>
                    lancamento.subLancamentos.some(sublancamento => sublancamento.conta === e.target.value)
                );
                setLancamentosFiltrados(tempList1)
            }
            setLoading(false)
        }
        
    }
    
    function filterLancamento(e){
        setLoading(true)
        if(lancamentos.length > 0 && e.target.value !== ""){
            setLancamentosFiltrados([...lancamentosFiltrados])
            var tempList1 = [...lancamentosFiltrados].filter( lanc => lanc.lancamento === e.target.value)
            setLancamentosFiltrados(tempList1)
        }
        setLoading(false)
    }
    
    function filterSubconta(e){
        setLoading(true)
        if(lancamentos.length > 0 && e.target.value !== ""){
            setLancamentosFiltrados([...lancamentosFiltrados])
            var tempList1 = [...lancamentosFiltrados].filter( lanc => lanc.subconta === e.target.value)

            var tempList2 = [...lancamentosFiltrados].filter(lancamento =>
                lancamento.subLancamentos.some(sublancamento => sublancamento.subconta === e.target.value)
            );

            setLancamentosFiltrados(somarListasSemRepeticao(tempList1,tempList2,'lancamento'))
            
        }
        setLoading(false)
    }

    function filterAnalitica(e){
        setLoading(true)
        if(lancamentos.length > 0 && e.target.value !== ""){
            setLancamentosFiltrados([...lancamentosFiltrados])
            var tempList1 = [...lancamentosFiltrados].filter( lanc => lanc.analitica === e.target.value)

            var tempList2 = [...lancamentosFiltrados].filter(lancamento =>
                lancamento.subLancamentos.some(sublancamento => sublancamento.analitica === e.target.value)
            );

            setLancamentosFiltrados(somarListasSemRepeticao(tempList1,tempList2,'lancamento'))
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
            
            fetch('http://localhost:5000/processar-arquivo',{
                mode: 'cors',
                method: 'POST',
                body: dataForm,
            })
            .then( result => result.json())
            .then( data => {
                setLancamentos(data.lancamentos)
                setBlocos(data.lancamentos.length / 5000)
                setLancamentosFiltrados(data.lancamentos)
                setLoading(false)
            })
            .catch( err => console.log(err))
        }else{
            alert("Preencha corretamente todos os campos do formulário")
        }
        
    }

    function pagePrevious(){
        setLoading(true)
        setDisplayLancamentos(false)
        setLancPage(lancPage - 1)
        setTimeout(() =>{
            
            setLoading(false)
            setDisplayLancamentos(true)

        },1500)

        document.getElementById('lancamentos').scrollIntoView()
    }

    function pageNext(){
        setLoading(true)
        setDisplayLancamentos(false)
        if(lancPage + 1 <= (lancamentos.length / 5000)){
            setLancPage(lancPage + 1)
        }
        setTimeout(() =>{
            
            setLoading(false)
            setDisplayLancamentos(true)

        },1500)

        document.getElementById('lancamentos').scrollIntoView()
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
        

            <div className={`${styles.home_container} ${styles[displayLancamentos]}`}>
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
                        
                        <div className={styles.div_filtro}>

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
                            

                        </div>

                        {
                            ( lancamentos.length > 0 ?

                                <Lancamentos
                                    lancamentos={lancamentosFiltrados}
                                    page={lancPage}
                                    blocos={blocos}
                                    pagePrevious={pagePrevious}
                                    pageNext={pageNext}
                                />
                                                                    
                                :

                                ""
                                
                            )
                        }
                    
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