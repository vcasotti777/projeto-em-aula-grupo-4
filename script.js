// Seleciona os elementos da interface do DOM (Document Object Model)
const container = document.getElementById("container"); // Container que contém os blocos dos produtos
const burger = document.getElementById("burger"); // Ícone de menu (hambúrguer) para abrir o menu lateral
const menu = document.getElementById("menu"); // O menu lateral que se expande ao clicar no ícone
const cartIcon = document.getElementById("cart-icon"); // Ícone do carrinho de compras
const cartSidebar = document.getElementById("cart-sidebar"); // Sidebar que mostra o conteúdo do carrinho
const cartItemsContainer = document.getElementById("cart-items"); // Contêiner onde serão listados os itens adicionados ao carrinho
const finalizarBtn = document.getElementById("finalizar-btn"); // Botão para finalizar o pedido
let cart = []; // Inicializa um array vazio que vai conter os itens do carrinho

// Evento de clique para abrir/fechar o menu lateral quando o ícone de hambúrguer é clicado
burger.addEventListener("click", () => {
    menu.classList.toggle("active"); // Alterna a classe 'active' para mostrar ou esconder o menu
    document.body.classList.toggle("menu-open"); // Alterna a classe do body para ajustar a posição dos elementos
    burger.classList.toggle("white"); // Muda a cor do ícone de hambúrguer quando o menu está aberto
});

// Evento de clique para abrir/fechar a sidebar do carrinho quando o ícone do carrinho é clicado
cartIcon.addEventListener("click", () => {
    cartSidebar.classList.toggle("active"); // Alterna a classe 'active' para mostrar ou esconder o carrinho
    document.body.classList.toggle("cart-open"); // Ajusta o layout do body ao abrir o carrinho
});

// Função para adicionar um item ao carrinho
function addToCart(item) {
    // Verifica se o item já existe no carrinho
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity++; // Se o item já estiver no carrinho, incrementa a quantidade
    } else {
        cart.push({ ...item, quantity: 1 }); // Se não estiver, adiciona o item ao array de carrinho com quantidade inicial 1
    }
    renderCart(); // Atualiza a exibição do carrinho
}

// Função que renderiza os itens do carrinho na sidebar
function renderCart() {
    cartItemsContainer.innerHTML = ""; // Limpa o conteúdo atual do carrinho
    // Para cada item no carrinho, cria um elemento visual e o adiciona ao container do carrinho
    cart.forEach((item) => {
        const cartItem = document.createElement("div"); // Cria um div para representar um item
        cartItem.className = "cart-item"; // Define a classe CSS para o item do carrinho
        const totalPrice = (item.price * item.quantity).toFixed(2); // Calcula o preço total do item (quantidade * preço unitário)
        cartItem.innerHTML = `
            <h4>${item.quantity}x ${item.name}</h4> <!-- Exibe a quantidade e o nome do item -->
            <p>Preço: R$ ${totalPrice}</p> <!-- Exibe o preço total do item -->
            <button class="remove-item">Remover</button> <!-- Botão para remover o item -->
        `;
        // Adiciona evento de clique no botão para remover o item do carrinho
        const removeButton = cartItem.querySelector(".remove-item");
        removeButton.addEventListener("click", () => removeFromCart(item.name));
        cartItemsContainer.appendChild(cartItem); // Adiciona o item à lista de itens do carrinho
    });
}

// Cria 6 blocos de produtos dinamicamente
Array.from({ length: 6 }).map((_, i) => {
    const bloco = document.createElement("div"); // Cria um div para representar o bloco do produto
    const item = {
        name: `Sorvete ${i + 1}`, // Define o nome do produto
        price: (i + 1) * 10, // Define o preço do produto (exemplo: Sorvete 1 custa 10, Sorvete 2 custa 20, etc.)
    };
    // Define a estrutura do bloco com nome, descrição, imagem e botão de adicionar ao carrinho
    bloco.className = "bloco";
    bloco.innerHTML = `
        <h2>${item.name}</h2> <!-- Nome do produto -->
        <p>Informações do pedido ${i + 1}</p> <!-- Descrição do produto -->
        <div class='div-sorvete'>
            <img src='https://polosulsc.com.br/wp-content/webp-express/webp-images/uploads/2018/03/Tr%C3%AAs-tipos-e-sabores-de-sorvete-diferentes-1.jpg.webp' alt='Sorvete' class="sorvetinho">
        </div>
        <p class='preco'>R$ ${item.price}</p> <!-- Preço do produto -->
        <button class='add-carrinho'>Adicionar ao Carrinho</button> <!-- Botão para adicionar ao carrinho -->
    `;
    // Adiciona evento de clique no botão para adicionar o item ao carrinho
    const addButton = bloco.querySelector(".add-carrinho");
    addButton.addEventListener("click", () => addToCart(item));
    // Adiciona o bloco de produto ao container
    container.appendChild(bloco);
});

// Função para trocar a imagem dependendo do tamanho da tela
function changeImage() {
    const images = document.querySelectorAll(".sorvetinho"); // Seleciona todas as imagens com a classe 'sorvetinho'
    images.forEach((image) => {
        if (window.innerWidth <= 677) {
            // Se a largura da janela for menor ou igual a 768px
            image.src = "https://gkpb.com.br/wp-content/uploads/2022/10/novo-bobs-candy-dia-das-criancas.jpg"; // Define uma imagem diferente (apenas para exemplo)
        } else {
            image.src = "https://polosulsc.com.br/wp-content/webp-express/webp-images/uploads/2018/03/Tr%C3%AAs-tipos-e-sabores-de-sorvete-diferentes-1.jpg.webp"; // Define a imagem original
        }
    });
}

// Executa a troca de imagem ao redimensionar a janela ou quando a página é carregada
window.addEventListener("resize", changeImage);
window.addEventListener("load", changeImage);

// Função para gerar a nota fiscal
function gerarNotaFiscal() {
    let nota = "Nota Fiscal\n\n"; // Inicializa a string da nota fiscal
    let total = 0; // Variável para o total do pedido
    // Para cada item no carrinho, adiciona as informações à nota fiscal
    cart.forEach((item) => {
        const totalItemPrice = (item.price * item.quantity).toFixed(2); // Calcula o preço total para cada item (quantidade * preço)
        nota += `${item.quantity}x ${item.name} - R$ ${totalItemPrice}\n`; // Adiciona a linha do item à nota
        total += parseFloat(totalItemPrice); // Acumula o total do pedido
    });
    nota += `\nTotal: R$ ${total.toFixed(2)}`; // Adiciona o valor total do pedido à nota
    // Cria um arquivo de texto com a nota fiscal
    const blob = new Blob([nota], { type: "text/plain" });
    const link = document.createElement("a"); // Cria um elemento de link
    link.href = URL.createObjectURL(blob); // Cria a URL para download
    link.download = "nota_fiscal.txt"; // Define o nome do arquivo para download
    link.click(); // Inicia o download do arquivo
    cart = []; // Limpa o carrinho após a finalização do pedido
    renderCart(); // Atualiza a exibição do carrinho
}

// Adiciona evento de clique para gerar a nota fiscal quando o botão 'Finalizar Pedido' for clicado
finalizarBtn.addEventListener("click", gerarNotaFiscal);

// Função para remover um item do carrinho
function removeFromCart(itemName) {
    const itemIndex = cart.findIndex((cartItem) => cartItem.name === itemName);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--; // Decrementa a quantidade se for maior que 1
        } else {
            cart.splice(itemIndex, 1); // Remove o item se a quantidade for 1
        }
    }
    renderCart(); // Atualiza a exibição do carrinho
}

// Função para cancelar o pedido
function cancelarPedido() {
    cart = []; // Limpa o carrinho
    renderCart(); // Atualiza a exibição do carrinho
}

// Adiciona evento de clique para cancelar o pedido quando o botão 'Cancelar Pedido' for clicado
const cancelarBtn = document.getElementById("cancelar-btn");
cancelarBtn.addEventListener("click", cancelarPedido);
