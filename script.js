var botaoCalcularImposto = document.querySelector('.btn_calcular')
var botaoLimparCampos = document.querySelector('.btn_limpar')

botaoLimparCampos.addEventListener('click', () => limpar())
botaoCalcularImposto.addEventListener('click', () => calcular())

const ALIQUOTA_PIS = .65
const ALIQUOTA_COFINS = 3
const ALIQUOTA_IPI = .78
const INDICE_CONSUMIDOR_FINAL = 0

var inputAliquotaIcms = document.querySelector('.aliquota_icms')
var inputQuantidadePedido = document.querySelector('.qtde_pedido')
var inputValorUnitario = document.querySelector('.valor_unitario')

const CAMPOS_OBRIGATORIOS = [inputAliquotaIcms, inputQuantidadePedido, inputValorUnitario]

function calcular() {
    let icms = inputAliquotaIcms.value;
    let qtde = inputQuantidadePedido.value;
    let val_unit = inputValorUnitario.value;

    possuiPreenchimentoCamposObrigatorios()

    let erro = false;
    let regex = new RegExp(/[\d\.\,]+/);
    let result = regex.exec(icms);
    if (result == null || parseFloat(result[0]) <= 0) {
        adicionaAlerta(inputAliquotaIcms)
        erro = true;
    } 
    
    result = regex.exec(qtde);
    if (result == null || parseFloat(result[0]) <= 0) {
        adicionaAlerta(inputQuantidadePedido)
        erro = true;
    } 
    
    result = regex.exec(val_unit);
    if (result == null || parseFloat(result[0]) <= 0) {
        adicionaAlerta(inputValorUnitario)
        erro = true;
    }

    if (erro === false) {
        calcularImposto();
    }
}

function possuiPreenchimentoCamposObrigatorios() {
    CAMPOS_OBRIGATORIOS.forEach((input) => removeAlerta(input))
}

const CLASSE_ERRO = 'has-background-danger-50'

function removeAlerta(input) {
    input.classList.remove(CLASSE_ERRO)
}

function adicionaAlerta(input) {
    input.classList.add(CLASSE_ERRO)
}

function trataValorFloat(input) {
    let regex = new RegExp(/[\d\.\,]+/);
    let regexResultado = regex.exec(input.value);

    if (regexResultado == null) return 0;

    // 1.000,00 -> 1000,00
    let resultado = regexResultado[0].replace(/\./g, '')
    
    // 1000,00 -> 1000.00
    resultado.replace(/\,/g, '.')

    return parseFloat(resultado)

}

function calcularImposto() {
    let valor_produto = (limparValor(inputQuantidadePedido.value) *
        limparValor(inputValorUnitario.value));

    let base_calculo = (valor_produto + limparValor(document.querySelector('.valor_seguro').value) +
        limparValor(document.querySelector('.valor_frete').value) +
        limparValor(document.querySelector('.valor_despesas_acessorias').value));

    let valor_pis = (base_calculo * ALIQUOTA_PIS) / 100;
    let valor_cofins = (base_calculo * ALIQUOTA_COFINS) / 100;
    let valor_ipi = (base_calculo * ALIQUOTA_IPI) / 100;

    let valor_icms = 0;
    if (document.getElementById('destino_operacao').value == INDICE_CONSUMIDOR_FINAL) {
        base_calculo_icms = (base_calculo + valor_ipi);
        valor_icms = (base_calculo_icms * limparValor(inputAliquotaIcms.value)) / 100;
    } else {
        base_calculo_icms = base_calculo;
        valor_icms = (base_calculo * limparValor(inputAliquotaIcms.value)) / 100;
    }

    document.querySelector('.resultado').innerHTML = 'Total do Produto: R$ ' + valor_produto.toFixed(2) + '<br>';
    document.querySelector('.resultado').innerHTML += 'Base de Cálculo:  R$ ' + base_calculo.toFixed(2) + '<br>';
    document.querySelector('.resultado').innerHTML += 'Base de Cálculo ICMS:  R$ ' + base_calculo_icms.toFixed(2) + '<br><br>';
    document.querySelector('.resultado').innerHTML += 'Total de ICMS: R$ ' + valor_icms.toFixed(2) + '<br>';
    document.querySelector('.resultado').innerHTML += 'Total de PIS: R$ ' + valor_pis.toFixed(2) + '<br>';
    document.querySelector('.resultado').innerHTML += 'Total de COFINS: R$ ' + valor_cofins.toFixed(2) + '<br>';
    document.querySelector('.resultado').innerHTML += 'Total de IPI: R$ ' + valor_ipi.toFixed(2);
}

function limparValor(valor) {
    valor = valor.replace(/\./g, "");
    valor = valor.replace(/\,/g, ".");
    return parseFloat(valor);
}

function limpar() {
    document.querySelector('.resultado').innerHTML = 'Não existem resultados !';
    document.getElementById('destino_operacao').value = 0;
    inputAliquotaIcms.value = '0,00';
    inputQuantidadePedido.value = '0,00';
    inputValorUnitario.value = '0,00';
    document.querySelector('.valor_frete').value = '0,00';
    document.querySelector('.valor_seguro').value = '0,00';
    document.querySelector('.valor_despesas_acessorias').value = '0,00';
    inputAliquotaIcms.classList.remove('has-background-danger-50');
    inputQuantidadePedido.classList.remove('has-background-danger-50');
    inputValorUnitario.classList.remove('has-background-danger-50');
}