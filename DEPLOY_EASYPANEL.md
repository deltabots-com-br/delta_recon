# 🚀 Deploy no EasyPanel via GitHub

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ VPS com EasyPanel instalado
- ✅ Domínio configurado (opcional, mas recomendado para HTTPS)

---

## 🔧 Passo 1: Preparar Repositório no GitHub

### 1.1 Criar Repositório

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Configure:
   - **Nome:** `delta-recon` (ou outro nome)
   - **Visibilidade:** Private (recomendado para operações militares)
   - **NÃO** marque "Initialize with README"
4. Clique em **"Create repository"**

### 1.2 Fazer Push do Código

Abra o terminal na pasta `Militar` e execute:

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit - Delta Recon System"

# Adicionar repositório remoto (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/delta-recon.git

# Fazer push para GitHub
git branch -M main
git push -u origin main
```

**Nota:** Se pedir credenciais, use um **Personal Access Token** ao invés de senha.

---

## 🌐 Passo 2: Configurar no EasyPanel

### 2.1 Acessar EasyPanel

1. Acesse seu painel EasyPanel (ex: `https://seu-vps.com:3000`)
2. Faça login com suas credenciais

### 2.2 Criar Nova Aplicação

1. Clique em **"+ Create"** ou **"New App"**
2. Selecione **"GitHub"** como fonte
3. Conecte sua conta GitHub (se ainda não conectou)
4. Selecione o repositório **`delta-recon`**
5. Configure:

   **Build Settings:**
   ```
   Build Command: (deixe vazio - não precisa build)
   Install Command: npm install (ou deixe vazio)
   Start Command: npm start
   ```

   **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000 (EasyPanel define automaticamente)
   ```

   **Port:** `3000` (ou a porta que o EasyPanel usar)

6. Clique em **"Deploy"**

### 2.3 Configurar Domínio e HTTPS

1. No painel da aplicação, vá em **"Domains"**
2. Adicione seu domínio:
   - **Exemplo:** `delta-recon.seudominio.com`
3. Ative **SSL/HTTPS** (EasyPanel usa Let's Encrypt automaticamente)
4. Aguarde a emissão do certificado (1-2 minutos)

---

## ✅ Passo 3: Testar a Aplicação

### 3.1 Acessar os Apps

Após o deploy, acesse:

- **Soldado:** `https://delta-recon.seudominio.com/soldier.html`
- **Comando:** `https://delta-recon.seudominio.com/comand.html`

### 3.2 Verificar Permissões

1. Abra o app do soldado
2. Clique em **"ENGAGE SENSORS"**
3. O navegador deve pedir permissão para:
   - 📹 Câmera
   - 🎤 Microfone
   - 📍 Localização
4. Permita todas

### 3.3 Testar Conexão

1. No **Soldado:** Anote o UNIT ID (ex: `OP-123`)
2. No **Comando:** Digite o UNIT ID e clique em "CONNECT UPLINK"
3. Verifique se:
   - ✅ Vídeo do soldado aparece no comando
   - ✅ GPS é exibido no mapa
   - ✅ Áudio PTT funciona
   - ✅ Detecção de ameaças está ativa

---

## 🔄 Passo 4: Atualizações Futuras

Sempre que fizer alterações no código:

```bash
# Adicionar alterações
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Fazer push
git push origin main
```

O EasyPanel detectará automaticamente e fará **redeploy automático**! 🎉

---

## ⚙️ Configurações Avançadas (Opcional)

### Variáveis de Ambiente Adicionais

No EasyPanel, você pode adicionar:

```env
# Modo de produção
NODE_ENV=production

# Porta (EasyPanel define automaticamente)
PORT=3000

# Host (já configurado no código)
HOST=0.0.0.0
```

### Logs e Monitoramento

1. No EasyPanel, vá em **"Logs"** para ver:
   - Logs de inicialização
   - Requisições HTTP
   - Erros (se houver)

2. Monitore:
   - CPU e memória
   - Uptime
   - Tráfego de rede

---

## 🔒 Segurança

### Recomendações:

1. **HTTPS Obrigatório:**
   - ✅ Já configurado via EasyPanel + Let's Encrypt
   - Câmera/microfone só funcionam com HTTPS

2. **Repositório Privado:**
   - Use repositório **private** no GitHub
   - Não exponha credenciais no código

3. **Firewall:**
   - EasyPanel gerencia automaticamente
   - Apenas portas necessárias abertas

4. **Autenticação (Futuro):**
   - Considere adicionar login/senha
   - Implementar tokens de acesso
   - Restringir IPs permitidos

---

## 📊 Estrutura Final no GitHub

```
delta-recon/
├── .gitignore
├── package.json
├── server.js
├── soldier.html
├── comand.html
├── deltabots.png
├── README.md
├── GUIA_RAPIDO.txt
└── DEPLOY_EASYPANEL.md (este arquivo)
```

---

## 🆘 Solução de Problemas

### Deploy Falhou

**Erro:** "Build failed"
- ✅ Verifique se `package.json` está correto
- ✅ Confirme que `server.js` não tem erros de sintaxe
- ✅ Veja os logs no EasyPanel

**Erro:** "Port already in use"
- ✅ EasyPanel gerencia portas automaticamente
- ✅ Não precisa configurar PORT manualmente

### App Não Carrega

**Problema:** Página em branco
- ✅ Verifique se todos os arquivos foram enviados ao GitHub
- ✅ Confirme que o servidor está rodando (veja logs)
- ✅ Teste acessar `/soldier.html` diretamente

**Problema:** Permissões negadas
- ✅ Certifique-se de estar usando **HTTPS** (não HTTP)
- ✅ Verifique se o certificado SSL está ativo
- ✅ Teste em navegador diferente

### Conexão Entre Soldado e Comando Falha

**Problema:** "UPLINK: STANDBY"
- ✅ Verifique se ambos estão acessando o mesmo domínio
- ✅ Confirme que o UNIT ID foi digitado corretamente
- ✅ Aguarde 10-15 segundos após clicar em CONNECT
- ✅ Veja console do navegador (F12) para erros

---

## 📞 Suporte

### Logs Úteis:

**No Navegador (F12 → Console):**
```javascript
// Ver erros de conexão
// Ver status do PeerJS
// Verificar permissões
```

**No EasyPanel (Logs):**
```
// Ver inicialização do servidor
// Ver requisições HTTP
// Ver erros do Node.js
```

---

## ✅ Checklist Final

Antes de usar em produção:

- [ ] Código enviado ao GitHub
- [ ] Deploy no EasyPanel concluído
- [ ] HTTPS configurado e funcionando
- [ ] Domínio apontando corretamente
- [ ] Testado acesso ao soldier.html
- [ ] Testado acesso ao comand.html
- [ ] Permissões de câmera/microfone funcionando
- [ ] Conexão entre soldado e comando testada
- [ ] GPS funcionando
- [ ] Áudio PTT funcionando
- [ ] Detecção de ameaças ativa
- [ ] Logs monitorados

---

**🎖️ Sistema pronto para operações táticas!**
