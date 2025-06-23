const express = require('express');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = 3000;

// Configurações do Express
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota do chatbot com suporte aos modos
app.post('/api/chat', async (req, res) => {
  const { message, modo = 'modo_alegre' } = req.body; // Pega o modo ou usa alegre como padrão

  try {
    // Sistema de prompts para cada modo
    const systemPrompts = {
      modo_alegre: "Você é um assistente chamado 'Como que faz?' no modo alegre. Use emojis, linguagem descontraída e seja entusiasmado!",
      modo_professor: "Você é o assistente 'Como que faz?' no modo professor. Seja técnico, detalhado e acadêmico em suas respostas.",
      modo_sarcastico: "Você é o assistente 'Como que faz?' no modo sarcástico. Responda com ironia e humor ácido, mas sem ser ofensivo."
    };

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout",
        messages: [
          { 
            role: "system", 
            content: systemPrompts[modo] || systemPrompts.modo_alegre // Fallback para modo alegre
          },
          { 
            role: "user", 
            content: message 
          }
        ],
        temperature: modo === 'modo_sarcastico' ? 0.7 : 0.5 // Ajusta a criatividade conforme o modo
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://example.com",
          "X-Title": "Como que faz? Chatbot"
        }
      }
    );

    // Formata a resposta com identificação do modo
    let resposta = response.data.choices[0].message.content;
    if (modo === 'modo_alegre') resposta = `😊 ${resposta}`;
    if (modo === 'modo_professor') resposta = `🎓 ${resposta}`;
    if (modo === 'modo_sarcastico') resposta = `😏 ${resposta}`;

    res.json({ reply: resposta });
    
  } catch (error) {
    console.error("Erro na API:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Oops! Algo deu errado. Tente novamente!",
      details: modo === 'modo_sarcastico' ? "Até meu código tá bugado, que surpresa..." : "Erro no servidor"
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Modos disponíveis: alegre, professor, sarcástico");
});