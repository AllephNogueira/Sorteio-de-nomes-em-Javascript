// Array para armazenar os nomes
let nomes = [];

// Elementos do DOM
const nomeInput = document.getElementById('nomeInput');
const adicionarBtn = document.getElementById('adicionarBtn');
const limparBtn = document.getElementById('limparBtn');
const sortearBtn = document.getElementById('sortearBtn');
const listaNomes = document.getElementById('listaNomes');
const contador = document.getElementById('contador');
const resultado = document.getElementById('resultado');

// Carregar nomes do localStorage ao iniciar
carregarNomes();

// Função para adicionar nome
function adicionarNome() {
    const nome = nomeInput.value.trim();
    
    if (nome === '') {
        alert('Por favor, digite um nome!');
        return;
    }
    
    if (nomes.includes(nome)) {
        alert('Este nome já está na lista!');
        return;
    }
    
    nomes.push(nome);
    nomeInput.value = '';
    nomeInput.focus();
    atualizarLista();
    salvarNomes();
}

// Função para remover nome
function removerNome(nome) {
    nomes = nomes.filter(n => n !== nome);
    atualizarLista();
    salvarNomes();
}

// Função para atualizar a lista visual
function atualizarLista() {
    listaNomes.innerHTML = '';
    
    if (nomes.length === 0) {
        listaNomes.innerHTML = '<div class="lista-vazia">Nenhum participante adicionado ainda</div>';
        sortearBtn.disabled = true;
    } else {
        nomes.forEach((nome, index) => {
            const item = document.createElement('div');
            item.className = 'nome-item';
            item.innerHTML = `
                <span>${index + 1}. ${nome}</span>
                <button class="btn-remover" onclick="removerNome('${nome}')">Remover</button>
            `;
            listaNomes.appendChild(item);
        });
        sortearBtn.disabled = false;
    }
    
    contador.textContent = nomes.length;
}

// Função para limpar a lista
function limparLista() {
    if (nomes.length === 0) {
        return;
    }
    
    if (confirm('Tem certeza que deseja limpar toda a lista?')) {
        nomes = [];
        atualizarLista();
        resultado.textContent = '';
        salvarNomes();
    }
}

// Função para sortear
function sortear() {
    if (nomes.length === 0) {
        alert('Adicione pelo menos um nome antes de sortear!');
        return;
    }
    
    // Desabilitar botão durante animação
    sortearBtn.disabled = true;
    resultado.textContent = 'Sorteando...';
    resultado.classList.add('animando');
    
    // Animação de sorteio (roleta)
    let tentativas = 0;
    const maxTentativas = 20;
    const intervalo = setInterval(() => {
        const indiceAleatorio = Math.floor(Math.random() * nomes.length);
        resultado.textContent = nomes[indiceAleatorio];
        tentativas++;
        
        if (tentativas >= maxTentativas) {
            clearInterval(intervalo);
            // Resultado final
            const indiceFinal = Math.floor(Math.random() * nomes.length);
            resultado.textContent = `🎉 ${nomes[indiceFinal]} 🎉`;
            resultado.classList.remove('animando');
            sortearBtn.disabled = false;
        }
    }, 100);
}

// Função para salvar no localStorage
function salvarNomes() {
    localStorage.setItem('nomesSorteio', JSON.stringify(nomes));
}

// Função para carregar do localStorage
function carregarNomes() {
    const nomesSalvos = localStorage.getItem('nomesSorteio');
    if (nomesSalvos) {
        nomes = JSON.parse(nomesSalvos);
        atualizarLista();
    } else {
        atualizarLista();
    }
}

// Event Listeners
adicionarBtn.addEventListener('click', adicionarNome);
limparBtn.addEventListener('click', limparLista);
sortearBtn.addEventListener('click', sortear);

// Adicionar nome ao pressionar Enter
nomeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        adicionarNome();
    }
});

// Tornar removerNome disponível globalmente
window.removerNome = removerNome;

