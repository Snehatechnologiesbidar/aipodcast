import { useState, useEffect } from 'react';

export interface AudioRecorderState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    audioBlob: null,
    audioUrl: null,
    error: null,
  });
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setState((prev) => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
        }));
      };

      recorder.start();
      setMediaRecorder(recorder);
      setState((prev) => ({ ...prev, isRecording: true, error: null }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          'Failed to access microphone. Please ensure microphone permissions are granted.',
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && state.isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setState((prev) => ({ ...prev, isRecording: false }));
    }
  };

  const resetRecording = () => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    setState({
      isRecording: false,
      audioBlob: null,
      audioUrl: null,
      error: null,
    });
    setAudioChunks([]);
  };

  useEffect(() => {
    return () => {
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }
    };
  }, [state.audioUrl]);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
