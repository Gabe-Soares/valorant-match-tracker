# 🔎 Valorant Match Tracker (Tracker.gg + Puppeteer)

Este projeto monitora automaticamente as partidas de um jogador no **Valorant** através do site  
[tracker.gg](https://tracker.gg/valorant), usando **Node.js + Puppeteer** para realizar webscraping.

Sempre que uma nova partida é detectada, o script exibe uma **notificação do Windows**, junto com a lista de **parceiros de time** da última partida.

---

## 🚀 Tecnologias utilizadas

- **Node.js**
- **Puppeteer + Stealth Plugin**
- **Node-Notifier**
- **Windows Task Scheduler** (opcional)
- **JavaScript (ES6+)**

---

## 📌 Funcionalidades

✔ Coleta automaticamente a data da última partida  
✔ Detecta se uma partida nova foi registrada  
✔ Abre o modal da partida e identifica o time do jogador  
✔ Extrai o nome dos parceiros presentes na mesma equipe  
✔ Emite notificação no Windows sempre que houver nova partida  
✔ Salva a data no arquivo `ultima_data.txt` para evitar duplicações  
✔ Pode rodar automaticamente via **Agendador de Tarefas do Windows**  

---

# 🖥️ Pré-requisitos

Antes de usar o projeto, instale:

- **Node.js 18+**
- **Google Chrome ou Chromium**
- Windows (para notificações e scheduler)

---

# 📥 Instalação

Clone o repositório:

```bash
git clone https://github.com/Gabe-Soares/valorant-match-tracker.git
cd valorant-match-tracker
```

Instale as dependências:

```npm install```

No arquivo [monitor_valorant.js](./monitor_valorant.js) edite as variáveis `PROFILE_URL` e `USER` para os valores relacionados ao usuário rastreado _(sua URL de perfil no tracker.gg/valorant e seu usuário com tag)_.

▶️ Para executar manualmente basta rodar:

```node index.js```


O script irá:
- Abrir um navegador headless
- Acessar seu perfil no Tracker.gg
- Ler a última partida
- Ver se é mais recente que a salva
- Notificar caso haja novidade

🕒 Execução automática via Scheduler (Task Scheduler)
1️⃣ Execute como administrador o arquivo [create-schedule](./create-schedule.bat).

2️⃣ Verificar se a tarefa foi criada:
```schtasks /query /tn "ValorantTracker"```

_Obs.: Isso fará o script rodar a cada 10 minutos._

---

### 🔔 Notificações no Windows

Quando uma nova partida for encontrada, você verá algo como:

Nova partida encontrada!
```Parceiros: Jogador1#123, Jogador2#XYZ, Jogador3#999```

### 📄 Arquivo de histórico (ultima_data.txt)

O arquivo ultima_data.txt salva a data da última partida detectada. Para resetar o script e detectar novamente, basta apagar o arquivo.

---

❤️ Contribuindo

Pull requests são bem-vindos!
Sinta-se livre para abrir issues com sugestões ou melhorias.

📜 Licença

MIT License — use como quiser!