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

    // Busca o radio button marcado (checked)
    // que tenha o name="tamanho-acai"
    const tamanhoSelecionado = document.querySelector(
        'input[name="tamanho-acai"]:checked'
    ).value;

// Exibe um alerta mostrando o tamanho escolhido
    alert(
        "🍇 Açaí adicionado ao carrinho!\nTamanho: " + tamanhoSelecionado
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
