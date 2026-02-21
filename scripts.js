// ===============================
// INICIALIZAÇÃO
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    configurarMenu();
    configurarBotaoHome();
    carregarCarrinho();
});


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
                secao.style.display = "block";
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
// ADICIONAR AO CARRINHO
// ===============================

function adicionarCarrinho(botao) {

    const card = botao.closest(".produto-item"); // 🔥 PADRÃO ÚNICO
    if (!card) return;

    const selecionado = card.querySelector("input[type='radio']:checked");

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

    const itemExistente = carrinho.find(item => item.descricao === descricao);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            descricao: descricao,
            preco: preco,
            quantidade: 1
        });
    }

    salvarCarrinho(carrinho);

    alert("✅ Item adicionado ao carrinho!");
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
// FINALIZAR PEDIDO (WHATSAPP)
// ===============================

function finalizarPedido() {

    let carrinho = pegarCarrinho();

    if (carrinho.length === 0) {
        alert("Carrinho vazio!");
        return;
    }

    let mensagem = "Pedido:%0A%0A";
    let total = 0;

    carrinho.forEach(item => {
        mensagem += `${item.descricao} x${item.quantidade}%0A`;
        total += item.preco * item.quantidade;
    });

    mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

    window.open(`https://wa.me/5584987228300?text=${mensagem}`, "_blank");
}

function adicionarMonteAcai() {

    const cremes = document.querySelectorAll(".creme:checked");
    const ingredientes = document.querySelectorAll(".ingrediente:checked");
    const calda = document.querySelector('input[name="calda"]:checked');

    if (cremes.length === 0) {
        alert("Escolha pelo menos 1 creme!");
        return;
    }

    if (cremes.length > 2) {
        alert("Você pode escolher no máximo 2 cremes!");
        return;
    }

    if (ingredientes.length > 3) {
        alert("Você pode escolher no máximo 3 ingredientes!");
        return;
    }

    if (!calda) {
        alert("Escolha 1 calda!");
        return;
    }

    let descricao = "🍧 Monte Seu Açaí\n";

    descricao += "Cremes: ";
    cremes.forEach(c => descricao += c.value + ", ");

    descricao += "\nIngredientes: ";
    ingredientes.forEach(i => descricao += i.value + ", ");

    descricao += "\nCalda: " + calda.value;

    let carrinho = pegarCarrinho();

    carrinho.push({
        descricao: descricao,
        preco: 20.00,
        quantidade: 1
    });

    salvarCarrinho(carrinho);

    alert("✅ Monte Seu Açaí adicionado ao carrinho!");

}

const precoBase = 15;
const precoIngrediente = 2;
const precoCremeExtra = 3;
const precoCalda = 1.5;

function atualizarPrecoMonte() {

    const cremes = document.querySelectorAll(".creme:checked");
    const ingredientes = document.querySelectorAll(".ingrediente:checked");
    const calda = document.querySelector('input[name="calda"]:checked');

    let total = precoBase;

    // Se escolher 2 cremes cobra extra
    if (cremes.length === 2) {
        total += precoCremeExtra;
    }

    // Cada ingrediente soma
    total += ingredientes.length * precoIngrediente;

    // Se escolheu calda soma
    if (calda) {
        total += precoCalda;
    }

    document.getElementById("preco-monte").innerText = total.toFixed(2);
}

document.addEventListener("change", function(e) {
    if (
        e.target.classList.contains("creme") ||
        e.target.classList.contains("ingrediente") ||
        e.target.name === "calda"
    ) {
        atualizarPrecoMonte();
    }
});

function adicionarMonteAcai() {

    const cremes = document.querySelectorAll(".creme:checked");
    const ingredientes = document.querySelectorAll(".ingrediente:checked");
    const calda = document.querySelector('input[name="calda"]:checked');

    if (cremes.length === 0) {
        alert("Escolha pelo menos 1 creme!");
        return;
    }

    if (cremes.length > 2) {
        alert("Você pode escolher no máximo 2 cremes!");
        return;
    }

    if (ingredientes.length > 3) {
        alert("Você pode escolher no máximo 3 ingredientes!");
        return;
    }

    if (!calda) {
        alert("Escolha 1 calda!");
        return;
    }

    let total = parseFloat(document.getElementById("preco-monte").innerText);

    let descricao = "🍧 Monte Seu Açaí\n";
    descricao += "Cremes: ";
    cremes.forEach(c => descricao += c.value + ", ");

    descricao += "\nIngredientes: ";
    ingredientes.forEach(i => descricao += i.value + ", ");

    descricao += "\nCalda: " + calda.value;

    let carrinho = pegarCarrinho();

    carrinho.push({
        descricao: descricao,
        preco: total,
        quantidade: 1
    });

    salvarCarrinho(carrinho);

    alert("✅ Monte Seu Açaí adicionado ao carrinho!");

}
