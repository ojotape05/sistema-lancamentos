const express = require('express');
const cors = require('cors');

const multer = require('multer');
const upload = multer({ dest: 'backend/uploads/' });

const fs = require('fs');

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello World! Eu sou o Express.");
});

app.post('/processar-arquivo', upload.single('file'), (req, res) => {

  // Verifica se o arquivo foi enviado
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  
  const caminhoArquivo = `backend/uploads/${req.file.filename}`
  fs.readFile(caminhoArquivo, 'utf-8', (err, content) => {
    if(err){
      console.error('Erro ao ler o arquivo', err.message)
    } else {
      
      const hist_compl = processarHist_Compl(content)
      const valores = processarValores(content)

      const lancamentos = processarArquivo(content,hist_compl,valores,JSON.parse(req.body.tp_exportacao))

      try {
        fs.unlinkSync(caminhoArquivo);
        console.log('Arquivo excluído com sucesso.');
      } catch (erro) {
        console.error('Erro ao excluir o arquivo:', erro.message);
      }

      // Retorna uma resposta adequada
      res.status(200).json({message: "Arquivo processado com sucesso!", lancamentos: lancamentos})

    }
  })

  

  
});

function processarArquivo(fileContent, hist_compl, valores, tp_exportacao) {
 
  let tarifa25 = false
  if(tp_exportacao.id == 2){
    tarifa25 = true
  }
  
  const re = /\d{3} \d{6}\.\d/

  let indice = fileContent.indexOf('----------------  PARAMETROS DE LANCAMENTOS-----------------------------------------------------------------------------------------')
  indice = indice + 534 // Para pular cabeçario e pegar o primeiro lançamento
  
  let indiceFinal = fileContent.indexOf('------  REFERENCIA CRUZADA ENTRE CONTAS E LANCAMENTOS ------------------------------------------------------------------------------')
  indiceFinal = indiceFinal - 518
  fileContent = fileContent.substring(indice, indiceFinal)

  let lancamentos = []
  let subLancamentos = []

  var lancamento = ''  

  lastSubConta = ''; lastAnalitica = ''
  let filtros = [
    "BANESTES S.A. - BANCO DO ESTADO DO ESPIRITO SANTO",
    "RELACAO DE PARAMETROS CONTABEIS",
    "PARAMETROS DE LANCAMENTOS",
    "GCO LANCTO  (P)  SUB-CONTA",
    "(C-P) SUB-CONTA",
    "TRANSACAO       PASSO REGRA1"
  ]

  ajust = false

  for( var[index, linha] of fileContent.split('\r').entries() ){

    // Filtrando

    var filtred = false
    for(var filtro of filtros){
      if(linha.includes(filtro)){
        filtred = true
      }
    }

    if(filtred){
      continue
    }

    // Finalizando Filtro

    if((match = re.exec(linha)) !== null){
      lancamento += match.input + "\n"
      content = linha.split(" ").filter( i => {return i})

      // Filtro de Tarifa 25
      
      if(tarifa25 && content[3].substring(0,5) !== '71273'){
        obj = {}
        continue
      }

      obj = {
        lancamento: content[1],
        operacao: content[4],
        historico: content[7],
        subconta: content[2],
        analitica: content[3]
      }
      lastSubConta = content[2]
      lastAnalitica = content[3]
    }else{

      if(!obj.lancamento){
        continue
      }
      
      if (linha.trim() == "") {

        if(obj.lancamento && subLancamentos.length > 0){
          obj.subLancamentos = subLancamentos
          lancamento = ""
          lancamentos.push(obj)
          obj = {}
          subLancamentos = []
        }
        else{
          continue
        }
        
      }
      
      else {

          if(index % 2 != 0){

            conta = linha.substring(93,109)
            carteira = conta.substring(2,4)
            status = conta.substring(4,5)
            interna_banestes = conta.substring(5,12).trim()
            agencia = conta.substring(13,17).trim()
  
            subLancamentos.push(
              subobj = {
                operacao: (obj.operacao == 'C' ? 'D' : 'C'),
                subconta: (linha.substring(17,25).trim() == "" ? lastSubConta : linha.substring(17,25)),
                analitica: (linha.substring(39,46).trim() == "" ? lastAnalitica : linha.substring(39,46)),
                valor_desc: valores.filter( el => el.valor == linha.substring(61,74))[0],
                conta: conta.trim(),
                carteira: carteira,
                status: status,
                interna_banestes: interna_banestes,
                agencia: agencia,
                compl_desc: hist_compl.filter( el => el.compl_hist == linha.substring(116,121))[0]
              }
            )
    
            lancamento += linha + "\n"
          }      

        }
      
    }

    if(ajust){
      break
    }

  }

  //console.log(lancamentos)
  return lancamentos

  // Exemplo: console.log('Arquivo processado:', fileContent);
};

function processarHist_Compl(fileContent) {

  const re = /\d{3}\.\d/

  let indice = fileContent.indexOf('TABELA 04 - HISTORICOS/COMPLEMENTOS')
  let indiceFinal = fileContent.indexOf('TABELA 05 - UNIDADES CONTABEIS')

  let filtros = [
    "BANESTES S.A. - BANCO DO ESTADO DO ESPIRITO SANTO",
    "RELACAO DE PARAMETROS CONTABEIS",
    "PARAMETROS DE LANCAMENTOS",
    "GCO CODIGO    H/C           TEXTO",
    "(C-P) SUB-CONTA",
    "TABELA 04 - HISTORICOS/COMPLEMENTOS",
    "----------------"
  ]

  fileContent = fileContent.substring(indice,indiceFinal)
  hist_compl = []
  for(var [index,linha] of fileContent.split('\r').entries()){
    
    linha = linha.trim(); var filtred = false
    for(var filtro of filtros){
      if(linha.includes(filtro) || linha == ''){
        filtred = true
      }
    }

    if(filtred){
      continue
    }else{
      if(re.exec(linha) != null){
        var obj = {}; 
        obj.compl_hist = linha.substring(4,9)
        obj.descricao = linha.substring(28,linha.length)
      }
      else{
        obj.descricao = obj.descricao + linha.substring(0,linha.length)
      }
    }

    hist_compl.push(obj)

  }

  return hist_compl
};

function processarValores(fileContent) {
  const re = /\b\w+\s\d{4}\b/

  let indice = fileContent.indexOf('TABELA 06 - VALORES')
  let indiceFinal = fileContent.indexOf('PARAMETROS DE LANCAMENTOS')

  let filtros = [
    "BANESTES S.A. - BANCO DO ESTADO DO ESPIRITO SANTO",
    "RELACAO DE PARAMETROS CONTABEIS",
    "PARAMETROS DE LANCAMENTOS",
    "GCO ORIGEM   CODIGO  AUXILIAR  TIPO  DESCRICAO",
    "(C-P) SUB-CONTA",
    "TABELA 06 - VALORES",
    "----------------"
  ]

  fileContent = fileContent.substring(indice,indiceFinal)
  valores = []
  for(var [index,linha] of fileContent.split('\r').entries()){
    
    linha = linha.trim(); var filtred = false
    for(var filtro of filtros){

      if(linha.includes(filtro) || linha == ''){
        filtred = true
      }

    }

    if(filtred){
      continue
    }
    else{
      content = linha.split(" ").filter( i => {return i})
      var obj = {}; 
      obj.valor = linha.substring(4,17)
      obj.descricao = content.slice(3,content.length).join(' ')

    }
    valores.push(obj)

  }

  return valores
};

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
