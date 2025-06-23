var contador_mensagens = 0;
var modoAtual = 'modo_alegre';

function alterarModo(modo){
  modoAtual = modo;
  console.log(`Modo alterado para: ${modo}`);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('modo1').checked = true;
    
    document.querySelectorAll('input[name="modo_chat"]').forEach(radio => {
        radio.addEventListener('change', function() {
            alterarModo(this.value);
        });
    });
});

async function enviarMensagem(event) {
  event.preventDefault();

  const input = document.getElementById('mensagem');
  const texto = input.value;
  const chat = document.getElementById('chat');

  if(texto){ // Exibe a mensagem do usuário
    const pergunta = document.createElement('article');
      pergunta.classList.add('pergunta');
      pergunta.innerHTML = `<p>${texto}</p>`;
    chat.appendChild(pergunta);
    chat.scrollTop = chat.scrollHeight;
    input.value = '';
    contador_mensagens++;
  }else{
    return;
  }

  try {
    let mensagemParaAPI = texto;
    
    if(contador_mensagens === 1){
      const instrucoesIniciais = `
        Você é um assistente chamado "Como que faz?" com 3 modos:
        1. Alegre (emoji, linguagem casual)
        2. Professor (linguagem técnica detalhada)
        3. Sarcástico (respostas irônicas)
        
        Modo atual: ${modoAtual}
        Contexto atual: O usuário acabou de iniciar o chat e você deve responder correspondendo à linguagem com o modo padrão sendo o primeiro.
        Responda de acordo com o modo selecionado.

        Usuário: ${texto}
      `;
      mensagemParaAPI = instrucoesIniciais;
    }else{
      mensagemParaAPI = `[Modo: ${modoAtual}]\n${texto}`;
    }
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: mensagemParaAPI,
        modo: modoAtual
      }),
    });

    const data = await response.json();

    const resposta = document.createElement('article');
    resposta.classList.add('resposta');
    resposta.innerHTML = `<p>${data.reply}</p>`;
    chat.appendChild(resposta);
    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}