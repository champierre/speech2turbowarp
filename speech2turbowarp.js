(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Speech2TurboWarp extension must be run unsandboxed');
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

    class Speech2TurboWarp {
        constructor() {
            this.speech = '';
            this.isListening = false;
            this.recognition = null;
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
                        opcode: 'isListening',
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

        startRecognition() {
            if (!SpeechRecognition) {
                console.error('Speech recognition is not supported in this browser');
                return;
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
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };

            try {
                this.recognition.start();
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
                this.isListening = false;
            }
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

        isListening() {
            return this.isListening;
        }

        whenSpeechRecognized() {
            return false;
        }
    }

    Scratch.extensions.register(new Speech2TurboWarp());
})(Scratch);