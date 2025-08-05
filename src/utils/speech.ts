export function speakText(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis is not supported in this browser'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Wait for voices to be loaded
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Retry after a short delay
        setTimeout(loadVoices, 100);
        return;
      }

      const preferredVoice = voices.find(voice =>
        voice.name.includes('Natural') ||
        voice.name.includes('Premium') ||
        voice.name.includes('Enhanced') ||
        (voice.lang.startsWith('en') && voice.localService)
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      window.speechSynthesis.speak(utterance);
    };

    // Start the voice loading process
    loadVoices();
  });
}
