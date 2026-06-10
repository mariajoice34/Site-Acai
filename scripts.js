// ===============================
// INICIALIZAÇÃO
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    configurarMenu();
    configurarBotaoHome();
    carregarCarrinho();
    atualizarPrecoMonte();
    permitirApenasUmaOpcaoPorProduto();
});

function permitirApenasUmaOpcaoPorProduto() {
    const produtos = document.querySelectorAll(".produto-item");

    produtos.forEach(produto => {
        const opcoes = produto.querySelectorAll(".tamanhos input[type='checkbox']");

        opcoes.forEach(opcao => {
            opcao.addEventListener("change", function () {
                if (this.checked) {
                    opcoes.forEach(outraOpcao => {
                        if (outraOpcao !== this) {
                            outraOpcao.checked = false;
                        }
                    });
                }
            });
        });
    });
}
// ===============================
// MENU
// ===============================

function configurarMenu() {
    const secoes = {
        "btn-acai": "cardapio-acai",
        "btn-bebidas": "cardapio-bebidas",
        "btn-salgados": "cardapio-salgados"
    };

    Object.keys(secoes).forEach(btnId => {
        const botao = document.getElementById(btnId);
        const secao = document.getElementById(secoes[btnId]);

        if (botao && secao) {
            botao.addEventListener("click", () => {
                secao.scrollIntoView({ behavior: "smooth" });
            });
        }
    });
}

// ===============================
// BOTÃO VER CARDÁPIO
// ===============================

function configurarBotaoHome() {
    const btnVerCardapio = document.getElementById("btn-ver-cardapio");
    const cardapioAcai = document.getElementById("cardapio-acai");

    if (btnVerCardapio && cardapioAcai) {
        btnVerCardapio.addEventListener("click", () => {
            cardapioAcai.scrollIntoView({ behavior: "smooth" });
        });
    }
}

// ===============================
// LOCAL STORAGE
// ===============================

function pegarCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// ===============================
// ADICIONAR PRODUTO NORMAL
// ===============================

function adicionarCarrinho(botao) {
    const card = botao.closest(".produto-item");

    if (!card) return;

    const selecionado = card.querySelector("input:checked");

    if (!selecionado) {
        alert("Selecione uma opção!");
        return;
    }

    const descricao = selecionado.value;

    const match = descricao.match(/R\$ (\d+[.,]?\d*)/);

    if (!match) {
        alert("Erro ao identificar o preço.");
        return;
    }

    const preco = parseFloat(match[1].replace(",", "."));

    let carrinho = pegarCarrinho();

    carrinho.push({
        descricao: descricao,
        preco: preco,
        quantidade: 1
    });

    salvarCarrinho(carrinho);

    alert("✅ Item adicionado ao carrinho!");

    selecionado.checked = false;
}

// ===============================
// MONTE SEU AÇAÍ
// ===============================

function toggleMonteAcai() {
    const opcoes = document.getElementById("opcoes-monte-acai");

    if (!opcoes) return;

    if (opcoes.style.display === "block") {
        opcoes.style.display = "none";
    } else {
        opcoes.style.display = "block";
    }
}

function atualizarPrecoMonte() {
    const precoMonte = document.getElementById("preco-monte");

    if (!precoMonte) return;

    const adicionais = document.querySelectorAll(".adicional:checked");
    const coberturas = document.querySelectorAll(".cobertura:checked");

    let total = 10;

    adicionais.forEach(item => {
        total += parseFloat(item.dataset.preco);
    });

    // 1 cobertura grátis.
    // A partir da segunda cobertura, cobra R$ 1,50 cada.
    if (coberturas.length > 1) {
        total += (coberturas.length - 1) * 1.5;
    }

    precoMonte.innerText = total.toFixed(2);
}

document.addEventListener("change", function(e) {
    if (
        e.target.classList.contains("creme") ||
        e.target.classList.contains("gratis") ||
        e.target.classList.contains("adicional") ||
        e.target.classList.contains("cobertura")
    ) {
        atualizarPrecoMonte();
    }
});

function adicionarMonteAcai() {
    const cremes = document.querySelectorAll(".creme:checked");
    const gratis = document.querySelectorAll(".gratis:checked");
    const adicionais = document.querySelectorAll(".adicional:checked");
    const coberturas = document.querySelectorAll(".cobertura:checked");

    if (cremes.length === 0) {
        alert("Escolha pelo menos 1 creme!");
        return;
    }

    if (cremes.length > 2) {
        alert("Você pode escolher no máximo 2 cremes!");
        return;
    }

    if (gratis.length > 3) {
        alert("Você pode escolher no máximo 3 acompanhamentos grátis!");
        return;
    }

    if (coberturas.length === 0) {
        alert("Escolha pelo menos 1 cobertura!");
        return;
    }

    const total = parseFloat(document.getElementById("preco-monte").innerText);

    let descricao = "🍧 Monte Seu Açaí\n";

    descricao += "Cremes: ";
    cremes.forEach(c => descricao += c.value + ", ");

    descricao += "\nAcompanhamentos grátis: ";
    if (gratis.length === 0) {
        descricao += "Nenhum";
    } else {
        gratis.forEach(g => descricao += g.value + ", ");
    }

    descricao += "\nAdicionais pagos: ";
    if (adicionais.length === 0) {
        descricao += "Nenhum";
    } else {
        adicionais.forEach(a => descricao += a.value + ", ");
    }

    descricao += "\nCoberturas: ";
    coberturas.forEach(c => descricao += c.value + ", ");

    let carrinho = pegarCarrinho();

    carrinho.push({
        descricao: descricao,
        preco: total,
        quantidade: 1
    });

    salvarCarrinho(carrinho);

    alert("✅ Monte Seu Açaí adicionado ao carrinho!");
}

// ===============================
// CARREGAR CARRINHO
// ===============================

function carregarCarrinho() {
    const container = document.getElementById("lista-carrinho");
    const totalSpan = document.getElementById("total");

    if (!container || !totalSpan) return;

    container.innerHTML = "";

    let carrinho = pegarCarrinho();
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalSpan.textContent = "0.00";
        return;
    }

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;

        const div = document.createElement("div");
        div.classList.add("item-carrinho");

        div.innerHTML = `
            <h4>${item.descricao}</h4>

            <div class="controle-quantidade">
                <button onclick="alterarQuantidade(${index}, -1)">➖</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade(${index}, 1)">➕</button>
            </div>

            <p>Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>

            <button class="btn-remover" onclick="removerItem(${index})">
                Remover
            </button>
        `;

        container.appendChild(div);
    });

    totalSpan.textContent = total.toFixed(2);
}

// ===============================
// ALTERAR QUANTIDADE
// ===============================

function alterarQuantidade(index, valor) {
    let carrinho = pegarCarrinho();

    carrinho[index].quantidade += valor;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    salvarCarrinho(carrinho);
    carregarCarrinho();
}

// ===============================
// REMOVER ITEM
// ===============================

function removerItem(index) {
    let carrinho = pegarCarrinho();

    carrinho.splice(index, 1);

    salvarCarrinho(carrinho);
    carregarCarrinho();
}

// ===============================
// LIMPAR CARRINHO
// ===============================

function limparCarrinho() {
    localStorage.removeItem("carrinho");
    carregarCarrinho();
}

// ===============================
// FINALIZAR PEDIDO NO WHATSAPP
// ===============================

function finalizarPedido() {
    let carrinho = pegarCarrinho();

    if (carrinho.length === 0) {
        alert("Carrinho vazio!");
        return;
    }

    const nome = document.getElementById("nome-cliente").value;
    const endereco = document.getElementById("endereco-cliente").value;
    const referencia = document.getElementById("referencia-cliente").value;
    const pagamento = document.getElementById("pagamento-cliente").value;
    const tipoEntrega = document.getElementById("tipo-entrega").value;

    if (nome.trim() === "") {
        alert("Digite seu nome!");
        return;
    }

    if (tipoEntrega === "Entrega" && endereco.trim() === "") {
        alert("Digite seu endereço!");
        return;
    }

    if (pagamento.trim() === "") {
        alert("Selecione a forma de pagamento!");
        return;
    }

    let taxaEntrega = 0;

    if (tipoEntrega === "Entrega") {
        taxaEntrega = 5;
    }

    let total = 0;

    let mensagem = "🍧 *NOVO PEDIDO - AÇAÍ TOP*\n";
    mensagem += "\n\n";

    mensagem += "👤 *Cliente:* " + nome + "\n";
    mensagem += "🚚 *Tipo do pedido:* " + tipoEntrega + "\n";

    if (tipoEntrega === "Entrega") {
        mensagem += "📍 *Endereço:* " + endereco + "\n";

        if (referencia.trim() !== "") {
            mensagem += "📌 *Referência:* " + referencia + "\n";
        }
    }

    mensagem += "💳 *Pagamento:* " + pagamento + "\n\n";

    mensagem += "🛒 *ITENS DO PEDIDO*\n";
    mensagem += "\n";

    carrinho.forEach((item, index) => {
        let subtotal = item.preco * item.quantidade;

        mensagem += `\n${index + 1}. ${item.descricao}\n`;
        mensagem += `Quantidade: ${item.quantidade}\n`;
        mensagem += `Valor Unitário: R$ ${item.preco.toFixed(2)}\n`;
        mensagem += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;

        total += subtotal;
    });

    total += taxaEntrega;

    mensagem += "\n";
    mensagem += `🚚 *Taxa de Entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
    mensagem += `💰 *TOTAL DO PEDIDO:* R$ ${total.toFixed(2)}\n`;
    mensagem += "\n";
    mensagem += "🙏 Obrigado pela preferência!";

   window.open(
    `https://wa.me/5584987228300?text=${encodeURIComponent(mensagem)}`,
    "_blank"
);
}