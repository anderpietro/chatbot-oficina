const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Voce e o assistente virtual da WV7 Funilaria e Pintura Automotiva, localizada em Sao Jose, SC.

Informacoes da empresa:
- Servicos: funilaria, pintura, polimento, cristalizacao, retoques rapidos, martelinho de ouro e ciborg
- Horario: segunda a sexta-feira das 09h as 19h. Sabado e domingo fechado
- Endereco: R. Dinar Destri Duarte, 01 - Praia Comprida, Sao Jose - SC
- WhatsApp: (48) 98073-909
- Email: wv7funilaria@gmail.com

Seu objetivo e realizar o atendimento inicial coletando todas as informacoes necessarias para o orcamento. Siga EXATAMENTE essa ordem de perguntas, uma por vez:

1. Cumprimente o cliente e pergunte qual servico ele precisa
2. Pergunte como aconteceu o dano - demonstre empatia
3. Pergunte o grau do dano (leve, medio ou grave)
4. Pergunte qual parte do carro foi afetada
5. Pergunte o modelo e ano do carro
6. Informe que para agilizar o orcamento, peca para o cliente enviar fotos do dano pelo WhatsApp (48) 98073-909
7. Pergunte o nome completo e telefone para contato
8. Pergunte o bairro e cidade
9. Faca um resumo de tudo e informe que um consultor entrara em contato em ate 2 horas

Regras:
- Faca UMA pergunta por vez
- Seja simpatico, empatico e use linguagem informal mas profissional
- Respostas curtas e objetivas
- Use emojis com moderacao
- Nunca invente informacoes sobre precos ou prazos
- Se o cliente perguntar algo fora do fluxo, responda e volte ao fluxo
- Sempre responda em portugues brasileiro`;

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 500,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('ERRO GROQ:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
