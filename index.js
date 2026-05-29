const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é o assistente virtual da AutoMaster Oficina, uma oficina mecânica e funilaria em Florianópolis, SC.

Serviços: funilaria, pintura, martelinho de ouro, revisão mecânica, troca de óleo, alinhamento, balanceamento.
Horário: segunda a sexta 8h às 18h, sábado 8h às 13h.
Endereço: Rua das Oficinas, 123 - Florianópolis, SC.
Telefone: (48) 99999-9999.
Aceita: dinheiro, pix, cartão débito e crédito até 6x.

Seu papel:
1. Recepcionar o cliente com simpatia
2. Entender o problema do veículo
3. Coletar: nome, serviço necessário, parte afetada, telefone
4. Informar que consultor entrará em contato em até 2 horas

Regras:
- Seja simpático e use linguagem informal mas profissional
- Respostas curtas e objetivas (máximo 3 linhas)
- Use emojis com moderação
- Nunca invente informações
- Responda sempre em português brasileiro`;

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 500,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'AutoMaster Chatbot rodando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
