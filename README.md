# 🎖️ DELTA RECON - Sistema de Operações Táticas

## 📋 Sobre o Sistema

Sistema de comunicação tática em tempo real entre soldados em campo e equipe de comando, com recursos de:
- 📹 Transmissão de vídeo ao vivo
- 🎤 Comunicação por voz (Push-to-Talk)
- 📍 Rastreamento GPS em tempo real
- 🤖 Detecção de ameaças com IA
- 🔍 OCR para leitura de documentos
- 🗺️ Visualização em mapa tático

---

## 🚀 Deploy Rápido

### Opção 1: EasyPanel (Recomendado para Produção)

**Para deploy em VPS com EasyPanel via GitHub:**

1. Execute: `git_setup.bat` (primeira vez)
2. Siga o guia completo: [`DEPLOY_EASYPANEL.md`](DEPLOY_EASYPANEL.md)
3. Configure HTTPS no EasyPanel
4. Acesse via seu domínio

**Vantagens:**
- ✅ HTTPS automático (Let's Encrypt)
- ✅ Deploy automático via GitHub
- ✅ Escalável e profissional
- ✅ Acesso remoto via internet

### Opção 2: Servidor Local (Para Testes)

**Para testes em rede local:**

1. Execute: `start_server.bat`
2. Acesse: `http://localhost:8000/soldier.html`
3. Para acesso remoto, use o IP da rede

**Vantagens:**
- ✅ Rápido para testes
- ✅ Não precisa de domínio
- ✅ Funciona em rede local

---

## ⚠️ IMPORTANTE: Problema de Permissões

### ❌ NÃO FUNCIONA:
Abrir arquivos diretamente (`file:///soldier.html`)

**Por quê?** Navegadores bloqueiam câmera/microfone/GPS por segurança.

### ✅ FUNCIONA:
Usar servidor HTTP (`http://` ou `https://`)

**Soluções:**
- **Testes:** `start_server.bat` → `http://localhost:8000`
- **Produção:** Deploy no EasyPanel → `https://seudominio.com`

---

## 🚀 Como Usar

### 1️⃣ Iniciar o Servidor

**Opção A: Duplo clique no arquivo**
```
start_server.bat
```

**Opção B: Via terminal**
```bash
node server.js
```

### 2️⃣ Acessar os Apps

Após iniciar o servidor, você verá algo assim:

```
========================================
   🎖️  DELTA RECON - SERVIDOR ATIVO
========================================

📡 ACESSO LOCAL:
   Soldado:  http://localhost:8000/soldier.html
   Comando:  http://localhost:8000/comand.html

🌐 ACESSO REMOTO (Rede Local):
   Soldado:  http://192.168.1.100:8000/soldier.html
   Comando:  http://192.168.1.100:8000/comand.html
```

### 3️⃣ Conectar Soldado e Comando

1. **No app do Soldado** (`soldier.html`):
   - Clique em "ENGAGE SENSORS"
   - Permita acesso à câmera, microfone e localização
   - Anote o **UNIT ID** que aparece (ex: `OP-123`)

2. **No app de Comando** (`comand.html`):
   - Digite o UNIT ID do soldado
   - Clique em "CONNECT UPLINK"
   - O vídeo do soldado aparecerá automaticamente

---

## 🌐 Uso em Rede Local/Remota

### Para Soldados em Campo (Dispositivos Móveis)

1. Certifique-se de que todos os dispositivos estão na **mesma rede WiFi**
2. No servidor, anote o **IP da rede** (ex: `192.168.1.100`)
3. No celular/tablet do soldado, acesse:
   ```
   http://192.168.1.100:8000/soldier.html
   ```

### Para Equipe de Comando (Desktop)

No computador de comando, acesse:
```
http://192.168.1.100:8000/comand.html
```

### 🔒 Para Acesso via Internet (Deploy Real)

Para uso em operações reais com acesso via internet, você precisará:

1. **Hospedar em um servidor web** (VPS, AWS, Azure, etc.)
2. **Configurar HTTPS** (obrigatório para câmera/microfone)
3. **Usar certificado SSL** (Let's Encrypt é gratuito)

**Exemplo de serviços de hospedagem:**
- Vercel (gratuito, fácil)
- Netlify (gratuito, fácil)
- AWS EC2 (profissional)
- Azure (profissional)
- DigitalOcean (intermediário)

---

## 🔧 Requisitos

- **Node.js** (já instalado ✅)
- **Navegador moderno** (Chrome, Edge, Firefox)
- **Conexão de rede** (WiFi ou cabo)

---

## 🐛 Solução de Problemas

### "Não aparece o vídeo da câmera"
- ✅ Certifique-se de estar acessando via `http://`, não `file:///`
- ✅ Permita acesso à câmera quando o navegador solicitar
- ✅ Verifique se outra aplicação não está usando a câmera

### "Não consigo conectar soldado e comando"
- ✅ Verifique se ambos estão na mesma rede
- ✅ Confirme que o UNIT ID foi digitado corretamente
- ✅ Verifique se o firewall não está bloqueando a porta 8000

### "GPS não funciona"
- ✅ Permita acesso à localização quando solicitado
- ✅ Em dispositivos móveis, ative o GPS nas configurações
- ✅ O GPS pode demorar alguns segundos para adquirir sinal

### "Áudio não funciona"
- ✅ Permita acesso ao microfone
- ✅ No comando, segure o botão "PUSH TO TALK" enquanto fala
- ✅ Verifique o volume do dispositivo

---

## 📁 Estrutura de Arquivos

```
Militar/
├── soldier.html      # Interface do soldado em campo
├── comand.html       # Interface da equipe de comando
├── server.js         # Servidor HTTP Node.js
├── start_server.bat  # Script para iniciar servidor
├── deltabots.png     # Logo do sistema
└── README.md         # Este arquivo
```

---

## 🎯 Fluxo de Operação

1. **Comando** inicia o servidor
2. **Soldado** acessa via celular/tablet
3. **Soldado** ativa sensores e câmera
4. **Comando** conecta ao soldado usando o UNIT ID
5. **Comunicação estabelecida**:
   - Vídeo ao vivo do soldado → Comando
   - Áudio PTT do comando → Soldado
   - GPS do soldado → Mapa no comando
   - Detecção de ameaças → Alertas no comando

---

## 📞 Suporte

Para problemas técnicos, verifique:
1. Console do navegador (F12)
2. Logs do servidor no terminal
3. Configurações de firewall/antivírus

---

**Desenvolvido para operações táticas Delta Recon** 🎖️
