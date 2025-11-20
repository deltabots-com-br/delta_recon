const http = require('http');
const fs = require('fs');
const path = require('path');

// Porta configurável via variável de ambiente (necessário para EasyPanel/VPS)
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

// MIME types para diferentes arquivos
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    // Define o arquivo solicitado
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './soldier.html'; // Página padrão
    }

    // Obtém a extensão do arquivo
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Lê e serve o arquivo
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Arquivo não encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Erro no servidor: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Obtém o IP local da máquina
function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Pula endereços internos e não IPv4
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

server.listen(PORT, HOST, () => {
    const localIP = getLocalIP();
    const isProduction = process.env.NODE_ENV === 'production';

    console.log('\n========================================');
    console.log('   🎖️  DELTA RECON - SERVIDOR ATIVO');
    console.log('========================================\n');

    if (isProduction) {
        console.log('🌐 MODO: PRODUÇÃO');
        console.log(`📡 Servidor rodando na porta: ${PORT}`);
        console.log('✅ Pronto para receber conexões remotas\n');
    } else {
        console.log('📡 ACESSO LOCAL:');
        console.log(`   Soldado:  http://localhost:${PORT}/soldier.html`);
        console.log(`   Comando:  http://localhost:${PORT}/comand.html\n`);
        console.log('🌐 ACESSO REMOTO (Rede Local):');
        console.log(`   Soldado:  http://${localIP}:${PORT}/soldier.html`);
        console.log(`   Comando:  http://${localIP}:${PORT}/comand.html\n`);
        console.log('⚠️  IMPORTANTE:');
        console.log('   - Compartilhe o IP da rede com outros dispositivos');
        console.log('   - Certifique-se de que o firewall permite conexões na porta', PORT);
        console.log('   - Pressione Ctrl+C para parar o servidor\n');
    }

    console.log('========================================\n');
});
