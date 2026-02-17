// Buscar o Botão Açaí pelo id no html
const btnAcai = document.getElementById("btn-acai");

// Busca a seção do cardápio de açaí
const cardapioAcai = document.getElementById("cardapio-acai");

// Adiciona um evento de clique no botão Açaí
btnAcai.addEventListener("click", () => {

// Mostra o cardápio caso ele esteja oculto com display: none
    cardapioAcai.style.display = "block";

// Faz a página rolar suavemente até o cardápio
    cardapioAcai.scrollIntoView({ behavior: "smooth" });
});

// Função carrinho

// Função chamada quando o botão "Adicionar ao carrinho" é clicado
function adicionarCarrinho() {

    const selecionado = document.querySelector(
        '.acai-item input[type="radio"]:checked'
    );

    if (!selecionado) {
        alert("Selecione um tamanho!");
        return;
    }

    alert(
        "🍇 Açaí adicionado ao carrinho!\nTamanho: " + selecionado.value
    );
}

// Botão Ver Cardápio

// Busca o botão "Ver Cardápio"
const btnVerCardapio = document.getElementById("btn-ver-cardapio");

// Busca novamente a seção do cardápio
const cardapio = document.getElementById("cardapio-acai");

// Evento de clique no botão "Ver Cardápio"
btnVerCardapio.addEventListener("click", () => {

// Rola a página suavemente até o cardápio
    cardapio.scrollIntoView({ behavior: "smooth" });
});

const btnBebidas = document.getElementById("btn-bebidas");
const cardapioBebidas = document.getElementById("cardapio-bebidas");

btnBebidas.addEventListener("click", () => {
    cardapioBebidas.style.display = "block";
    cardapioBebidas.scrollIntoView({ behavior: "smooth" });
});

function adicionarCarrinhoBebida(tipo) {

    const bebidaSelecionada = document.querySelector(
        'input[name="' + tipo + '"]:checked'
    ).value;

    alert("🥤 Bebida adicionada ao carrinho!\nItem: " + bebidaSelecionada);
}
