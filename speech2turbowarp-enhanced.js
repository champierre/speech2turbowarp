(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Speech2TurboWarp extension must be run unsandboxed');
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const blockIconURI = 'data:image/png;base64,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';

    class Speech2TurboWarp {
        constructor() {
            this.speech = '';
            this.isListening = false;
            this.recognition = null;
            this.language = 'ja-JP';
            this.continuous = false;
            this.lastSpeech = '';
            this.confidence = 0;
            this.error = '';
        }

        getInfo() {
            return {
                id: 'speech2turbowarp',
                name: 'Speech2TurboWarp',
                blockIconURI: blockIconURI,
                blocks: [
                    {
                        opcode: 'startRecognition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '音声認識開始'
                    },
                    {
                        opcode: 'startContinuousRecognition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '連続音声認識開始'
                    },
                    {
                        opcode: 'stopRecognition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '音声認識停止'
                    },
                    '---',
                    {
                        opcode: 'getSpeech',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '音声'
                    },
                    {
                        opcode: 'getConfidence',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '認識精度'
                    },
                    {
                        opcode: 'getError',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'エラーメッセージ'
                    },
                    '---',
                    {
                        opcode: 'isListening',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '音声認識中'
                    },
                    {
                        opcode: 'isSupported',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '音声認識がサポートされている'
                    },
                    {
                        opcode: 'speechContains',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '音声に [TEXT] が含まれる',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'こんにちは'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'whenSpeechRecognized',
                        blockType: Scratch.BlockType.HAT,
                        text: '音声が認識されたとき'
                    },
                    {
                        opcode: 'whenSpeechContains',
                        blockType: Scratch.BlockType.HAT,
                        text: '音声に [TEXT] が含まれるとき',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'スタート'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'setLanguage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '言語を [LANGUAGE] に設定',
                        arguments: {
                            LANGUAGE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'languages',
                                defaultValue: 'ja-JP'
                            }
                        }
                    },
                    {
                        opcode: 'clearSpeech',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '音声をクリア'
                    }
                ],
                menus: {
                    languages: {
                        acceptReporters: true,
                        items: [
                            { text: '日本語', value: 'ja-JP' },
                            { text: 'English (US)', value: 'en-US' },
                            { text: 'English (UK)', value: 'en-GB' },
                            { text: '中文 (普通话)', value: 'zh-CN' },
                            { text: '한국어', value: 'ko-KR' },
                            { text: 'Español', value: 'es-ES' },
                            { text: 'Français', value: 'fr-FR' },
                            { text: 'Deutsch', value: 'de-DE' },
                            { text: 'Italiano', value: 'it-IT' },
                            { text: 'Português', value: 'pt-BR' }
                        ]
                    }
                }
            };
        }

        startRecognition() {
            this._startRecognition(false);
        }

        startContinuousRecognition() {
            this._startRecognition(true);
        }

        _startRecognition(continuous) {
            if (!this.isSupported()) {
                this.error = 'Speech recognition is not supported in this browser';
                console.error(this.error);
                return;
            }

            if (this.recognition && this.isListening) {
                this.recognition.stop();
            }

            this.recognition = new SpeechRecognition();
            this.recognition.lang = this.language;
            this.recognition.continuous = continuous;
            this.recognition.interimResults = false;
            this.continuous = continuous;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.error = '';
                if (!continuous) {
                    this.speech = '';
                }
            };

            this.recognition.onresult = (event) => {
                if (event.results.length > 0) {
                    const result = event.results[event.results.length - 1];
                    this.speech = result[0].transcript;
                    this.confidence = Math.round(result[0].confidence * 100);
                    
                    if (this.speech !== this.lastSpeech) {
                        this.lastSpeech = this.speech;
                        Scratch.vm.runtime.startHats('speech2turbowarp_whenSpeechRecognized');
                        
                        const words = this.speech.toLowerCase().split(' ');
                        words.forEach(word => {
                            if (word.length > 0) {
                                Scratch.vm.runtime.startHats('speech2turbowarp_whenSpeechContains', { TEXT: word });
                            }
                        });
                    }
                }
            };

            this.recognition.onerror = (event) => {
                this.error = `Recognition error: ${event.error}`;
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
                if (this.continuous && !this.error) {
                    setTimeout(() => {
                        if (this.continuous) {
                            this._startRecognition(true);
                        }
                    }, 100);
                }
            };

            try {
                this.recognition.start();
            } catch (error) {
                this.error = `Failed to start: ${error.message}`;
                console.error('Failed to start speech recognition:', error);
                this.isListening = false;
            }
        }

        stopRecognition() {
            this.continuous = false;
            if (this.recognition && this.isListening) {
                this.recognition.stop();
                this.isListening = false;
            }
        }

        getSpeech() {
            return this.speech;
        }

        getConfidence() {
            return this.confidence;
        }

        getError() {
            return this.error;
        }

        isListening() {
            return this.isListening;
        }

        isSupported() {
            return !!SpeechRecognition;
        }

        speechContains(args) {
            const text = args.TEXT.toLowerCase();
            return this.speech.toLowerCase().includes(text);
        }

        whenSpeechRecognized() {
            return false;
        }

        whenSpeechContains(args) {
            return this.speechContains(args);
        }

        setLanguage(args) {
            this.language = args.LANGUAGE;
            if (this.isListening) {
                this.stopRecognition();
                setTimeout(() => {
                    this._startRecognition(this.continuous);
                }, 100);
            }
        }

        clearSpeech() {
            this.speech = '';
            this.lastSpeech = '';
            this.confidence = 0;
            this.error = '';
        }
    }

    Scratch.extensions.register(new Speech2TurboWarp());
})(Scratch);