// ESTE É UM JOGO DA VELHA (TIC-TAC-TOE) ESCRITO EM JAVASCRIPT
// O Player1 (humano) joga com o símbolo 'O' enquanto o Player2 (computador) joga com 'X'
// O Player1 começa o jogo

// ARRAYS E VARIÁVEIS GLOBAIS
// Array que representa o tabuleiro: 0 = vazio, 'O' = jogador, 'X' = computador
let mapa = new Array(0,0,0,0,0,0,0,0,0);
let P1tentativa = 5; // Número de tentativas restantes do jogador
let P2tentativa = 5; // Número de tentativas restantes do computador
let Player1 = 'O';   // Símbolo do jogador humano
let Player2 = 'X';   // Símbolo do computador
var encerrado = false; // Controla se o jogo terminou
var vezDoHumano = true; // Controla de quem é a vez

// FUNÇÃO: exibir()
// Atualiza a interface gráfica com base no estado atual do mapa
function exibir(){
    // LOOP: Percorre todas as posições do tabuleiro (0 a 8)
    for(let i = 0; i < mapa.length; i++) {
        // SELETOR DOM: Busca elemento HTML pelo ID (n1 a n9)
        const celula = document.getElementById(`n${i+1}`);
        // SELETOR DOM: Busca a imagem dentro da célula
        const imagem = celula ? celula.querySelector('.imagem-celula') : null;
        
        // CONDICIONAL: Verifica se elemento existe antes de manipular
        if (celula && imagem) {
            // Atualiza imagem baseada no conteúdo do mapa
            if (mapa[i] === 'O') {
                imagem.src = 'images/circulo.png';
                imagem.alt = 'O';
            } else if (mapa[i] === 'X') {
                imagem.src = 'images/X.png';
                imagem.alt = 'X';
            } else {
                imagem.src = 'images/vazio.png';
                imagem.alt = '';
            }
        }
    }
    atualizarStatus();
}

// FUNÇÃO: atualizarStatus()
// Atualiza o texto de status do jogo
function atualizarStatus() {
    // SELETOR DOM: Busca elemento de status
    const statusElement = document.getElementById('status-jogo');
    if (!statusElement) return;
    
    // CONDICIONAIS: Define mensagem baseada no estado do jogo
    if (encerrado) {
        statusElement.textContent = "Jogo encerrado!";
    } else if (vezDoHumano) {
        statusElement.textContent = "Sua vez (O) - Clique em uma célula";
    } else {
        statusElement.textContent = "Vez do computador (X)... jogue na sequência";
    }
    atualizar();
}

// FUNÇÃO: atualizar()
// Função auxiliar para atualizações de interface
function atualizar(){
    setTimeout(50000);
    if(vezDoHumano === true){
        // MANIPULAÇÃO DOM: Altera conteúdo HTML diretamente
        document.getElementById('status-jogo').innerHTML = "Sua vez (O) - Clique em uma célula";
    }
}

// FUNÇÃO: assinalar(player, posicao)
// Marca uma posição no tabuleiro para um jogador
function assinalar(player, posicao){
    // Verifica se jogo está encerrado
    if (encerrado) return false;
    
    // VALIDAÇÃO: Verifica se posição está disponível
    if (mapa[posicao] !== 0) {
        return false;
    }

    // ATUALIZAÇÃO DE ARRAY: Marca posição no mapa
    mapa[posicao] = player;
    
    // CONTROLE DE TURNOS: Decrementa tentativas e alterna jogador
    if(player == 'O') { 
        P1tentativa--;
        vezDoHumano = false; // Passa vez para computador
    }
    if(player == 'X') {
        P2tentativa--; 
        vezDoHumano = true; // Passa vez para humano
    }
    
    // Atualiza interface
    exibir();
    
    // VERIFICAÇÃO DE FIM DE JOGO: Vitória
    if (vencedor(player)) {
        return true;
    }
    
    // VERIFICAÇÃO DE FIM DE JOGO: Empate
    if (empate()) {
        return true;
    }
    
    return true;
}

// FUNÇÃO: jogadaHumano(posicao)
// Processa jogada do jogador humano
function jogadaHumano(posicao) {
    // Verifica se é vez do humano e jogo não encerrado
    if (!vezDoHumano || encerrado) return;
    
    // Tenta fazer jogada
    const sucesso = assinalar(Player1, posicao);
    if (sucesso) {
        vezDoHumano = false;
        
        // Se jogo continua, computador joga após delay
        if (!encerrado && P2tentativa > 0) {
            // TIMER: Executa função após 1 segundo
            setTimeout(jogadaComputador, 1000);
        }
    } else {
        vezDoHumano = true; // Mantém vez se jogada inválida
    }
}

// FUNÇÃO: jogadaComputador(bypass)
// Processa jogada do computador
function jogadaComputador(bypass = false) {
    // Verifica se é vez do computador
    if (vezDoHumano || encerrado) return;
    
    // Verifica se computador ainda tem tentativas
    if(P2tentativa > 0){
        // CONTAGEM: Conta espaços vazios no tabuleiro
        let quantidadeespacos = 0;
        for(let i = 0; i < mapa.length; i++){
            if(mapa[i] === 0) { quantidadeespacos++; }
        }
        
        // Se não há espaços, declara empate
        if(quantidadeespacos < 1) {
            empate();
            return;
        }

        // ESTRATÉGIA: Usa jogada inteligente ou aleatória
        if(bypass == false){
            jogadaElaborada(); // Jogada com IA
        } else {
            // Jogada aleatória entre espaços disponíveis
            let disponiveis = espacos_restantes();
            if (disponiveis.length > 0) {
                // RANDOM: Escolhe posição aleatória
                const posicao = disponiveis[Math.floor(Math.random() * disponiveis.length)];
                assinalar(Player2, posicao);
            }
            vezDoHumano = true;
        }
    } else {
        encerrado = true; // Fim de jogo sem tentativas
    }
}

// FUNÇÃO: jogadaElaborada()
// Implementa IA para jogadas inteligentes do computador
function jogadaElaborada(){
    // ESTRATÉGIA 1: Tentar vencer (duas 'X' em linha)
    let posicaoVitoria = encontrarPosicaoVitoria('X');
    if (posicaoVitoria !== -1) {
        assinalar(Player2, posicaoVitoria);
        vezDoHumano = true;
        return;
    }
    
    // ESTRATÉGIA 2: Bloquear jogador humano (duas 'O' em linha)
    let posicaoBloqueio = encontrarPosicaoVitoria('O');
    if (posicaoBloqueio !== -1) {
        assinalar(Player2, posicaoBloqueio);
        vezDoHumano = true;
        return;
    }
    
    // ESTRATÉGIA 3: Pegar centro (melhor posição)
    if (mapa[4] === 0) {
        assinalar(Player2, 4);
        vezDoHumano = true;
        return;
    }
    
    // ESTRATÉGIA 4: Pegar cantos (boas posições)
    const cantos = [0, 2, 6, 8];
    // ARRAY.FILTER(): Filtra apenas cantos disponíveis
    let cantosDisponiveis = cantos.filter(pos => mapa[pos] === 0);
    if (cantosDisponiveis.length > 0) {
        const posicao = cantosDisponiveis[Math.floor(Math.random() * cantosDisponiveis.length)];
        assinalar(Player2, posicao);
        vezDoHumano = true;
        return;
    }
    
    // ESTRATÉGIA 5: Jogada aleatória (último recurso)
    let disponiveis = espacos_restantes();
    if (disponiveis.length > 0) {
        const posicao = disponiveis[Math.floor(Math.random() * disponiveis.length)];
        assinalar(Player2, posicao);
    }
    
    vezDoHumano = true;
}

// FUNÇÃO: encontrarPosicaoVitoria(jogador)
// Encontra posição que completa linha para vitória ou bloqueio
function encontrarPosicaoVitoria(jogador) {
    // ARRAY: Todas combinações vencedoras possíveis
    const combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas horizontais
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // linhas verticais
        [0, 4, 8], [2, 4, 6]             // diagonais
    ];
    
    // LOOP: Percorre todas combinações possíveis
    for (let combinacao of combinacoes) {
        // DESESTRUTURAÇÃO: Extrai posições da combinação
        let [a, b, c] = combinacao;
        let countJogador = 0;
        let posicaoVazia = -1;
        
        // CONTAGEM: Verifica cada posição da combinação
        if (mapa[a] === jogador) countJogador++;
        else if (mapa[a] === 0) posicaoVazia = a;
        
        if (mapa[b] === jogador) countJogador++;
        else if (mapa[b] === 0) posicaoVazia = b;
        
        if (mapa[c] === jogador) countJogador++;
        else if (mapa[c] === 0) posicaoVazia = c;
        
        // Se tem 2 símbolos e 1 vazio, retorna posição para completar
        if (countJogador === 2 && posicaoVazia !== -1) {
            return posicaoVazia;
        }
    }
    
    return -1; // Nenhuma jogada vencedora encontrada
}

// FUNÇÃO: vencedor(player)
// Verifica se um jogador venceu o jogo
function vencedor(player){
    if (encerrado) return true;
    
    let vencedor = false;
    
    // Verifica todas linhas horizontais
    if((mapa[0] == player && mapa[1] == player && mapa[2] == player) ||
       (mapa[3] == player && mapa[4] == player && mapa[5] == player) ||
       (mapa[6] == player && mapa[7] == player && mapa[8] == player)) {
        vencedor = true;
    }
    
    // Verifica todas linhas verticais
    if((mapa[0] == player && mapa[3] == player && mapa[6] == player) ||
       (mapa[1] == player && mapa[4] == player && mapa[7] == player) ||
       (mapa[2] == player && mapa[5] == player && mapa[8] == player)) {
        vencedor = true;
    }
    
    // Verifica diagonais
    if((mapa[0] == player && mapa[4] == player && mapa[8] == player) ||
       (mapa[2] == player && mapa[4] == player && mapa[6] == player)) {
        vencedor = true;
    }
    
    // Se há vencedor, atualiza interface e encerra jogo
    if(vencedor){
        const statusElement = document.getElementById('status-jogo');
        if (player == 'O'){
            statusElement.textContent = "Parabéns, você venceu!";
        } else {
            statusElement.textContent = "O computador venceu!";
        }
        encerrado = true;
        P1tentativa = 0;
        P2tentativa = 0;
        return true;
    }
    return false;
}

// FUNÇÃO: empate()
// Verifica se o jogo terminou em empate
function empate(){
    if (encerrado) return true;
    
    let e = espacos_restantes();
    // Empate se sem tentativas ou sem espaços
    if (P1tentativa <= 0 || P2tentativa <= 0 || e.length == 0) {
        const statusElement = document.getElementById('status-jogo');
        statusElement.textContent = "Deu velha! Jogo empatado!";
        encerrado = true;
        P1tentativa = 0;
        P2tentativa = 0;
        return true;
    }
    return false;
}

// FUNÇÃO: espacos_restantes()
// Retorna array com posições vazias do tabuleiro
function espacos_restantes(){
    let vazios = new Array();
    // LOOP: Percorre mapa procurando posições vazias (0)
    for(let i = 0; i < mapa.length; i++){
        if(mapa[i] === 0) { 
            // ARRAY.PUSH(): Adiciona posição ao array
            vazios.push(i); 
        }
    }
    return vazios;
}

// FUNÇÃO: reiniciarJogo()
// Reinicia o jogo para estado inicial
function reiniciarJogo() {
    // Reinicializa todas variáveis
    mapa = [0,0,0,0,0,0,0,0,0];
    P1tentativa = 5;
    P2tentativa = 5;
    encerrado = false;
    vezDoHumano = true;
    exibir(); // Atualiza interface
}

// INICIALIZAÇÃO: Quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // EVENT LISTENERS: Adiciona clique às células
    for(let i = 1; i <= 9; i++) {
        const celula = document.getElementById(`n${i}`);
        if (celula) {
            // EVENTO: Chama jogadaHumano quando célula é clicada
            celula.addEventListener('click', function() {
                jogadaHumano(i-1); // Converte n1 para posição 0, etc.
            });
        }
    }
    
    // EVENT LISTENER: Botão reiniciar
    const botaoReiniciar = document.getElementById('reiniciar');
    if (botaoReiniciar) {
        botaoReiniciar.addEventListener('click', reiniciarJogo);
    }
    
    // Inicializa display
    exibir();
});