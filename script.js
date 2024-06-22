
function calcular() {
    let icms = document.querySelector('.aliquota_icms').value;
    let qtde = document.querySelector('.qtde_pedido').value;
    let val_unit = document.querySelector('.valor_unitario').value;

    let erro = false;
    let regex = new RegExp(/[\d\.\,]+/);
    let result = regex.exec(icms);
    if (result == null || parseFloat(result[0]) <= 0) {
        document.querySelector('.aliquota_icms').classList.add('has-background-danger-50');
        erro = true;
    } else {
        document.querySelector('.aliquota_icms').classList.remove('has-background-danger-50');
    }

    result = regex.exec(qtde);
    if (result == null || parseFloat(result[0]) <= 0) {
        document.querySelector('.qtde_pedido').classList.add('has-background-danger-50');
        erro = true;
    } else {
        document.querySelector('.qtde_pedido').classList.remove('has-background-danger-50');
    }

    result = regex.exec(val_unit);
    if (result == null || parseFloat(result[0]) <= 0) {
        document.querySelector('.valor_unitario').classList.add('has-background-danger-50');
        erro = true;
    } else {
        document.querySelector('.valor_unitario').classList.remove('has-background-danger-50');
    }

    if (erro === false) {
        calcularImposto();
    }
}

function calcularImposto() {
    let valor_produto = (limparValor(document.querySelector('.qtde_pedido').value) *
        limparValor(document.querySelector('.valor_unitario').value));

    let base_calculo = (valor_produto + limparValor(document.querySelector('.valor_seguro').value) +
        limparValor(document.querySelector('.valor_frete').value) +
        limparValor(document.querySelector('.valor_despesas_acessorias').value));

    let valor_pis = (base_calculo * 0.65) / 100;
    let valor_cofins = (base_calculo * 3.00) / 100;
    let valor_ipi = (base_calculo * 0.78) / 100;

    let valor_icms = 0;
    if (document.getElementById('destino_operacao').value == '0') {
        base_calculo_icms = (base_calculo + valor_ipi);
        valor_icms = (base_calculo_icms * limparValor(document.querySelector('.aliquota_icms').value)) / 100;
    } else {
        base_calculo_icms = base_calculo;
        valor_icms = (base_calculo * limparValor(document.querySelector('.aliquota_icms').value)) / 100;
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
    document.querySelector('.aliquota_icms').value = '0,00';
    document.querySelector('.qtde_pedido').value = '0,00';
    document.querySelector('.valor_unitario').value = '0,00';
    document.querySelector('.valor_frete').value = '0,00';
    document.querySelector('.valor_seguro').value = '0,00';
    document.querySelector('.valor_despesas_acessorias').value = '0,00';
    document.querySelector('.aliquota_icms').classList.remove('has-background-danger-50');
    document.querySelector('.qtde_pedido').classList.remove('has-background-danger-50');
    document.querySelector('.valor_unitario').classList.remove('has-background-danger-50');
}