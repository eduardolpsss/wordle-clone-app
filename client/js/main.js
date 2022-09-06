document.addEventListener("DOMContentLoaded", () => {
    // Chamando função criar tabuleiro
    criarTabuleiro();
    // Chamando função para fazer a requisição de uma palavra aleatória por meio da API
    pegarNovaPalavra();

    let palavrasAdivinhadas = [
        []
    ];

    // Variável que controla o espaço disponível
    let espacoDisponivel = 1;

    // PARA USO COM A API
    //let word;

    let contagemPalavrasAdivinhadas = 0;
    const teclas = document.querySelectorAll(".linha-teclado button");

    // Função para inserir a palavra a ser acertada por meio da API Words
    function pegarNovaPalavra() {
        // PEGAR PALAVRA PELO BANCO DE PALAVRAS
        // Inicializando array de palavras (mais palavras no .txt bancoPalavras)
        let bancoPalavras = ["cigar", "rebut", "sissy", "comet", "jaunt", "enema", "steed", "abyss", "growl", "fling", "dozen", "boozy", "erode", "world", "gouge", "click", "briar", "great"];
        // Gerando um número aleatório referente a posição da palavra no bancoPalavras
        let nAleatorio = Math.floor(Math.random() * bancoPalavras.length);
        // Passando essa palavra para a variável word que vai ser usada como palavra correta
        word = bancoPalavras[nAleatorio];

        console.log(word);


        // PEGAR PALAVRA PELA API
        // Fazendo requisição na API de uma palavra aleatória com mínimo de 5 letrar a máximo de 5 (Adicionar '&?partOfSpeech=verb?' ao final para solicitar somente verbos)
        //     fetch(`https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`, {
        //             method: "GET",
        //             headers: {
        //                 "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        //                 // Chave da API entra aqui
        //                 "x-rapidapi-key": "CHAVE_API",
        //             },
        //         })
        //         // Pegando resposta e convertendo para .json
        //         .then((response) => {
        //             return response.json();
        //         })
        //         // Pegando o resultado e inserindo na variável word
        //         .then((res) => {
        //             word = res.word;
        //         })
        //         .catch((err) => {
        //             console.error(err);
        //         });

    }

    function pegarPalavraAtualArr() {
        const numeroPalavrasAdivinhadas = palavrasAdivinhadas.length;
        return palavrasAdivinhadas[numeroPalavrasAdivinhadas - 1];
    }

    // Função para colocar as letras tecladas no tabuleiro
    function atualizaPalavrasAdivinhadas(letter) {
        const palavraAtualArr = pegarPalavraAtualArr();

        if (palavraAtualArr && palavraAtualArr.length < 5) {
            palavraAtualArr.push(letter);

            const espacoDisponivelEl = document.getElementById(String(espacoDisponivel));

            espacoDisponivel = espacoDisponivel + 1;
            espacoDisponivelEl.textContent = letter;
        }
    }

    // Função utilizada para dar as cores para as letras se elas existirem na palavra, de acordo com sua posição
    function pegarCorQuadrado(letter, index) {
        const letraCorreta = word.includes(letter);

        // Cor cinza caso a letra não esteja correta
        if (!letraCorreta) {
            return "rgb(58, 58, 60)";
        }

        const letraNessaPosicao = word.charAt(index);
        const posicaoCorreta = letter === letraNessaPosicao;

        // window.alert(`Palavra: ${word} Letra: ${letter} index: ${index}.`);
        // Cor verde caso a letra esteja na posição correta
        if (posicaoCorreta) {
            return "rgb(83, 141, 78)";
        }

        // Cor amarela caso a letra esteja na palavra, mas não no lugar correto
        return "rgb(181, 159, 59)";
    }

    // Função de tratamento para a apalvra inserida (verifica se a palavra tem a quantidade de letras necessária, se existe, se está correta e se o jogador já utilizou todas as tentativas)
    function tratarPalavraInserida() {
        // Pegando palavra e inserindo em um array para verificar a quantidade de letras
        const palavraAtualArr = pegarPalavraAtualArr();

        // Controle caso entrer em de palavras com menos de 5 letras
        if (palavraAtualArr.length !== 5) {
            window.alert("A palavra inserida deve ter cinco letras.");
        }

        // Criando string da palavra atual
        const palavraAtual = palavraAtualArr.join("");

        // Verificando se a palavraAtual (palavra inserida pelo usuário existe no banco de dados da API)
        // fetch(`https://wordsapiv1.p.rapidapi.com/words/${palavraAtual}`, {
        //         method: "GET",
        //         headers: {
        //             "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        //             "x-rapidapi-key": "CHAVE_API",
        //         },
        //     })
        //     .then((res) => {
        //         if (!res.ok) {
        //             throw Error();
        //         }

        const idPrimeiraLetra = contagemPalavrasAdivinhadas * 5 + 1;
        const intervalo = 200;
        
        // Validação de tamanho
        if (palavraAtual.length >= 5) {
            palavraAtualArr.forEach((letter, index) => {
                setTimeout(() => {
                    const addCorQuadrado = pegarCorQuadrado(letter, index);

                    const idLetra = idPrimeiraLetra + index;
                    const letraEl = document.getElementById(idLetra);
                    letraEl.classList.add("animate__flipInX");
                    letraEl.style = `background-color:${addCorQuadrado};border-color:${addCorQuadrado}`;
                }, intervalo * index);
            });

            contagemPalavrasAdivinhadas += 1;

            if (palavraAtual === word) {
                window.alert("Congratulations!");
            }

            if (palavrasAdivinhadas.length === 6) {
                window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
            }

            palavrasAdivinhadas.push([]);
        }
        //})
        //.catch(() => {
        //    window.alert("Word is not recognised!");
        //});
    }

    // Função para criar o tabuleiro com as casas
    function criarTabuleiro() {
        const tabuleiroJogo = document.getElementById("tabuleiro");

        for (let index = 0; index < 30; index++) {
            let quadrado = document.createElement("div");
            quadrado.classList.add("quadrado");

            // Adicionando classe do Animate.css para fazer a movimentação
            quadrado.classList.add("animate__animated");
            quadrado.setAttribute("id", index + 1);
            tabuleiroJogo.appendChild(quadrado);
        }
    }

    // Função de tratamento para palavras deletadas
    function tratarPalavraDeletada() {
        // Pegando a palavra
        const palavraAtualArr = pegarPalavraAtualArr();

        // Cirando variável letraRemovida e dando a ela o valor pop do array da palavra inserida, pop retorna o array sem a última letra
        const letraRemovida = palavraAtualArr.pop();

        // Colocando essa palavra mutada no array palavraAtual
        palavrasAdivinhadas[palavrasAdivinhadas.length - 1] = palavraAtualArr;

        const ultimaLetraEl = document.getElementById(String(espacoDisponivel - 1));

        ultimaLetraEl.textContent = "";
        espacoDisponivel = espacoDisponivel - 1;
    }

    // Pegando informação do teclado e printando no console
    for (let i = 0; i < teclas.length; i++) {
        teclas[i].onclick = ({
            target
        }) => {
            const letter = target.getAttribute("data-key");

            // Ativando função tratarPalavraInserida assim que o enter do teclado for pressionado
            if (letter === "enter") {
                tratarPalavraInserida();
                return;
            }

            // Ativando função tratarPalavraDeletada assim que o del do teclado for pressionado
            if (letter === "del") {
                tratarPalavraDeletada();
                return;
            }

            // Ativando função para colocar as letras tecladas no tabuleiro
            atualizaPalavrasAdivinhadas(letter);
        };
    }
});
