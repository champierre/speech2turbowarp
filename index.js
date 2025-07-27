(function(Scratch) {
    'use strict';


    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

    class Speech2TurboWarp {
        constructor() {
            this.speech = '';
            this.isListening = false;
            this.recognition = null;
            this.permissionGranted = false;
            this.initialized = false;
        }

        getInfo() {
            return {
                id: 'speech2turbowarp',
                name: 'Speech2TurboWarp',
                blocks: [
                    {
                        opcode: 'startRecognition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '音声認識開始'
                    },
                    {
                        opcode: 'getSpeech',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '音声'
                    },
                    {
                        opcode: 'getIsListening',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '音声認識中'
                    },
                    {
                        opcode: 'stopRecognition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '音声認識停止'
                    },
                    {
                        opcode: 'whenSpeechRecognized',
                        blockType: Scratch.BlockType.HAT,
                        text: '音声が認識されたとき'
                    }
                ]
            };
        }

        async initializeRecognition() {
            if (this.initialized) return true;
            
            try {
                // マイクのアクセス許可を要求
                await navigator.mediaDevices.getUserMedia({ audio: true });
                this.permissionGranted = true;
                this.initialized = true;
                return true;
            } catch (error) {
                console.error('マイクへのアクセスが拒否されました:', error);
                this.permissionGranted = false;
                return false;
            }
        }

        async startRecognition() {
            if (!SpeechRecognition) {
                console.error('Speech recognition is not supported in this browser');
                return;
            }

            // 初回実行時にマイク許可を取得
            if (!this.initialized) {
                const success = await this.initializeRecognition();
                if (!success) {
                    console.error('マイクへのアクセスが許可されていません。');
                    return;
                }
            }

            if (this.recognition && this.isListening) {
                return;
            }

            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'ja-JP';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.speech = '';
            };

            this.recognition.onresult = (event) => {
                if (event.results.length > 0) {
                    this.speech = event.results[0][0].transcript;
                    Scratch.vm.runtime.startHats('speech2turbowarp_whenSpeechRecognized');
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    console.error('マイクへのアクセスが許可されていません。');
                    console.error('ブラウザの設定でマイクへのアクセスを許可してください。');
                    this.permissionGranted = false;
                    this.initialized = false;
                } else if (event.error === 'network') {
                    console.error('ネットワークエラーが発生しました。');
                }
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };

            // 音声認識を開始（ユーザー操作のコンテキストを保持するため即座に実行）
            const startRecognition = () => {
                try {
                    this.recognition.start();
                } catch (error) {
                    console.error('Failed to start speech recognition:', error);
                    this.isListening = false;
                    
                    // DOMException の場合は初期化をリセット
                    if (error instanceof DOMException) {
                        this.initialized = false;
                        this.permissionGranted = false;
                    }
                }
            };
            
            // 即座に実行してユーザー操作のコンテキストを保持
            startRecognition();
        }

        stopRecognition() {
            if (this.recognition && this.isListening) {
                this.recognition.stop();
                this.isListening = false;
            }
        }

        getSpeech() {
            return this.speech;
        }

        getIsListening() {
            return this.isListening;
        }

        whenSpeechRecognized() {
            return false;
        }
    }

    Scratch.extensions.register(new Speech2TurboWarp());
})(Scratch);