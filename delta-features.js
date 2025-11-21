// DELTA RECON - MÓDULO DE FUNCIONALIDADES AVANÇADAS
// Versão: 2.0
// Adicione este arquivo ao soldier.html: <script src="delta-features.js"></script>

console.log('🎖️ Delta Features Module carregado');

// ============================================
// 1. CAPTURA DE FOTO
// ============================================
window.deltaPhoto = {
    capture: function () {
        const canvas = document.createElement('canvas');
        const video = document.getElementById('video');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const photo = canvas.toDataURL('image/jpeg', 0.9);
        const timestamp = new Date().toISOString();

        // Salvar localmente
        const link = document.createElement('a');
        link.download = `DELTA_${Date.now()}.jpg`;
        link.href = photo;
        link.click();

        // Enviar para comando
        if (window.dataConn && window.dataConn.open) {
            window.dataConn.send({
                type: 'PHOTO_CAPTURE',
                payload: {
                    image: photo,
                    timestamp: timestamp,
                    gps: window.currentGPS || { lat: 0, lon: 0 },
                    threat: window.currentThreatStatus || 'UNKNOWN'
                }
            });
        }

        // Feedback visual
        deltaUI.showNotification('📸 Foto capturada!', 'success');
        deltaAudio.play('camera_shutter');

        console.log('📸 Foto capturada:', timestamp);
        return photo;
    }
};

// ============================================
// 2. CHAT DE TEXTO
// ============================================
window.deltaChat = {
    messages: [],

    send: function (text) {
        const msg = {
            from: window.myPeerId || 'UNKNOWN',
            text: text,
            timestamp: new Date().toISOString(),
            gps: window.currentGPS || { lat: 0, lon: 0 }
        };

        this.messages.push(msg);

        if (window.dataConn && window.dataConn.open) {
            window.dataConn.send({
                type: 'CHAT_MESSAGE',
                payload: msg
            });
        }

        this.display(msg, 'sent');
        deltaAudio.play('message_sent');
        console.log('💬 Mensagem enviada:', text);
    },

    receive: function (msg) {
        this.messages.push(msg);
        this.display(msg, 'received');
        deltaAudio.play('message_received');
        deltaUI.showNotification(`💬 ${msg.from}: ${msg.text}`, 'info');
    },

    display: function (msg, type) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const div = document.createElement('div');
        div.className = `chat-message ${type}`;
        div.innerHTML = `
            <div class="msg-header">
                <span class="msg-from">${msg.from}</span>
                <span class="msg-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="msg-text">${msg.text}</div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    templates: [
        'Posição confirmada',
        'Aguardando ordens',
        'Ameaça neutralizada',
        'Necessito suporte',
        'Área segura',
        'Retornando à base'
    ]
};

// ============================================
// 3. ALERTAS SONOROS
// ============================================
window.deltaAudio = {
    sounds: {},

    init: function () {
        // Sons em base64 (beeps simples)
        this.sounds = {
            threat_detected: this.createBeep(800, 0.3, 0.1),
            message_received: this.createBeep(600, 0.2, 0.05),
            message_sent: this.createBeep(500, 0.1, 0.05),
            low_battery: this.createBeep(400, 0.5, 0.2),
            hq_calling: this.createBeep(1000, 0.3, 0.1),
            camera_shutter: this.createBeep(700, 0.05, 0.02)
        };
    },

    createBeep: function (frequency, duration, volume) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        return {
            play: function () {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = frequency;
                osc.type = 'sine';
                gain.gain.setValueAtTime(volume, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                osc.start();
                osc.stop(audioContext.currentTime + duration);
            }
        };
    },

    play: function (soundName, repeat = 1) {
        const sound = this.sounds[soundName];
        if (sound) {
            for (let i = 0; i < repeat; i++) {
                setTimeout(() => sound.play(), i * 300);
            }
        }
    }
};

// ============================================
// 4. GRAVAÇÃO DE VÍDEO
// ============================================
window.deltaRecording = {
    recorder: null,
    chunks: [],
    isRecording: false,

    start: function () {
        const canvas = document.getElementById('outputCanvas');
        const stream = canvas.captureStream(30);

        this.recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        this.recorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.chunks.push(e.data);
        };

        this.recorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `DELTA_REC_${Date.now()}.webm`;
            a.click();

            this.chunks = [];
            deltaUI.showNotification('🎥 Gravação salva!', 'success');
        };

        this.recorder.start();
        this.isRecording = true;
        deltaUI.showNotification('🔴 Gravação iniciada', 'info');
        console.log('🔴 Gravação iniciada');
    },

    stop: function () {
        if (this.recorder && this.recorder.state !== 'inactive') {
            this.recorder.stop();
            this.isRecording = false;
            console.log('⏹️ Gravação finalizada');
        }
    }
};

// ============================================
// 5. UI HELPER
// ============================================
window.deltaUI = {
    showNotification: function (message, type = 'info') {
        const container = document.getElementById('notifications') || this.createNotificationContainer();

        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        notif.textContent = message;
        notif.style.cssText = `
            padding: 10px 15px;
            margin: 5px;
            border-radius: 4px;
            background: ${type === 'success' ? '#238636' : type === 'error' ? '#da3633' : '#1f6feb'};
            color: white;
            font-size: 12px;
            animation: slideIn 0.3s ease;
        `;

        container.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    },

    createNotificationContainer: function () {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.style.cssText = `
            position: fixed;
            top: 70px;
            right: 10px;
            z-index: 9999;
            max-width: 300px;
        `;
        document.body.appendChild(container);
        return container;
    }
};

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎖️ Inicializando Delta Features...');

    // Inicializar áudio
    deltaAudio.init();

    // Adicionar botões à UI
    addFeatureButtons();

    // Adicionar painel de chat
    addChatPanel();

    console.log('✅ Delta Features inicializado!');
});

// ============================================
// ADICIONAR BOTÕES À UI
// ============================================
function addFeatureButtons() {
    const controls = document.querySelector('.controls');
    if (!controls) return;

    // Botão de foto
    const photoBtn = document.createElement('button');
    photoBtn.id = 'photo-btn';
    photoBtn.className = 'w-full border border-green-500 bg-green-900/40 text-[10px] py-2 text-green-300 font-bold hover:bg-green-500 hover:text-black transition-all mt-2';
    photoBtn.innerHTML = '📸 CAPTURE PHOTO';
    photoBtn.onclick = () => deltaPhoto.capture();

    // Botão de gravação
    const recBtn = document.createElement('button');
    recBtn.id = 'rec-btn';
    recBtn.className = 'w-full border border-red-500 bg-red-900/40 text-[10px] py-2 text-red-300 font-bold hover:bg-red-500 hover:text-black transition-all mt-2';
    recBtn.innerHTML = '⏺️ START REC';
    recBtn.onclick = function () {
        if (deltaRecording.isRecording) {
            deltaRecording.stop();
            this.innerHTML = '⏺️ START REC';
            this.className = this.className.replace('border-red-500', 'border-green-500').replace('bg-red-900', 'bg-green-900').replace('text-red-300', 'text-green-300');
        } else {
            deltaRecording.start();
            this.innerHTML = '⏹️ STOP REC';
            this.className = this.className.replace('border-green-500', 'border-red-500').replace('bg-green-900', 'bg-red-900').replace('text-green-300', 'text-red-300');
        }
    };

    // Botão de chat
    const chatBtn = document.createElement('button');
    chatBtn.id = 'chat-btn';
    chatBtn.className = 'w-full border border-blue-500 bg-blue-900/40 text-[10px] py-2 text-blue-300 font-bold hover:bg-blue-500 hover:text-black transition-all mt-2';
    chatBtn.innerHTML = '💬 TOGGLE CHAT';
    chatBtn.onclick = () => toggleChatPanel();

    controls.appendChild(photoBtn);
    controls.appendChild(recBtn);
    controls.appendChild(chatBtn);
}

// ============================================
// PAINEL DE CHAT
// ============================================
function addChatPanel() {
    const chatPanel = document.createElement('div');
    chatPanel.id = 'chat-panel';
    chatPanel.style.cssText = `
        display: none;
        position: fixed;
        bottom: 80px;
        right: 10px;
        width: 300px;
        height: 400px;
        background: rgba(0, 20, 0, 0.95);
        border: 1px solid #0f0;
        border-radius: 4px;
        z-index: 100;
        flex-direction: column;
    `;

    chatPanel.innerHTML = `
        <div style="padding: 10px; border-bottom: 1px solid #0f0; font-weight: bold; color: #0f0;">
            💬 SECURE CHAT
        </div>
        <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 10px; font-size: 11px;"></div>
        <div style="padding: 10px; border-top: 1px solid #0f0; display: flex; gap: 5px;">
            <input type="text" id="chat-input" placeholder="Type message..." style="flex: 1; background: #000; border: 1px solid #0f0; color: #0f0; padding: 5px; font-size: 11px;" />
            <button onclick="sendChatMessage()" style="background: #0f0; color: #000; border: none; padding: 5px 10px; font-weight: bold; cursor: pointer;">SEND</button>
        </div>
        <div style="padding: 5px; font-size: 9px; color: #0f0; opacity: 0.7;">
            Quick: <span onclick="deltaChat.send('Posição confirmada')" style="cursor: pointer; text-decoration: underline;">✓ Pos</span> | 
            <span onclick="deltaChat.send('Aguardando ordens')" style="cursor: pointer; text-decoration: underline;">⏳ Wait</span> | 
            <span onclick="deltaChat.send('Área segura')" style="cursor: pointer; text-decoration: underline;">🟢 Safe</span>
        </div>
    `;

    document.body.appendChild(chatPanel);

    // Enter para enviar
    document.getElementById('chat-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendChatMessage();
    });
}

function toggleChatPanel() {
    const panel = document.getElementById('chat-panel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (text) {
        deltaChat.send(text);
        input.value = '';
    }
}

// ============================================
// INTEGRAÇÃO COM CÓDIGO EXISTENTE
// ============================================

// Interceptar conexões de dados para receber mensagens
if (window.peer) {
    const originalOnConnection = window.peer.on;
    window.peer.on = function (event, callback) {
        if (event === 'connection') {
            return originalOnConnection.call(this, event, function (conn) {
                const originalOnData = conn.on;
                conn.on = function (dataEvent, dataCallback) {
                    if (dataEvent === 'data') {
                        return originalOnData.call(this, dataEvent, function (data) {
                            // Processar mensagens de chat
                            if (data.type === 'CHAT_MESSAGE') {
                                deltaChat.receive(data.payload);
                            }
                            // Processar fotos
                            if (data.type === 'PHOTO_CAPTURE') {
                                console.log('📸 Foto recebida do comando');
                            }
                            // Chamar callback original
                            dataCallback(data);
                        });
                    }
                    return originalOnData.call(this, dataEvent, dataCallback);
                };
                callback(conn);
            });
        }
        return originalOnConnection.call(this, event, callback);
    };
}

console.log('🎖️ Delta Features Module pronto para uso!');
