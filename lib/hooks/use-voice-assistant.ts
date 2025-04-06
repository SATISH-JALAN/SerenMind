"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UseVoiceAssistantProps {
  enabled: boolean;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export function useVoiceAssistant({
  enabled = false,
  pitch = 1.1,
  rate = 0.9,
  volume = 1.0,
}: UseVoiceAssistantProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const { toast } = useToast();
  const lastUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    const availableVoices = synth.getVoices();

    if (availableVoices.length === 0) return;

    setVoices(availableVoices);

    const femaleVoice = availableVoices.find(
      (voice) =>
        ["female", "samantha", "victoria", "ava", "moira", "karen"].some((name) =>
          voice.name.toLowerCase().includes(name)
        ) && voice.lang.startsWith("en")
    );

    setSelectedVoice(femaleVoice || availableVoices.find(v => v.lang.startsWith("en")) || availableVoices[0]);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsAvailable(true);
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [loadVoices]);

  const speak = useCallback((text: string) => {
    if (!enabled || !isAvailable || !text) return;

    try {
      const synth = window.speechSynthesis;

      // Cancel any existing speech
      if (synth.speaking || synth.pending) {
        synth.cancel();
        // Add a slight delay to ensure cancellation is processed
        setTimeout(() => startSpeaking(), 50);
      } else {
        startSpeaking();
      }

      function startSpeaking() {
        const utterance = new SpeechSynthesisUtterance(text);
        lastUtteranceRef.current = utterance;

        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = volume;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          if (event.error === "not-allowed") {
            console.error("Speech synthesis is not allowed. Ensure it is triggered by user interaction.");
            toast({
              title: "Speech Error",
              description: "Speech synthesis is not allowed. Please interact with the page first.",
              variant: "destructive",
            });
          } else if (event.error) {
            console.error("Speech synthesis error:", event.error);
            toast({
              title: "Speech Error",
              description: event.error,
              variant: "destructive",
            });
          } else {
            console.error("Speech synthesis error occurred.");
          }
        };

        synth.speak(utterance);
      }
    } catch (error: any) {
      console.error("Speech synthesis error:", error);
      toast({
        title: "Speech Error",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    }
  }, [enabled, isAvailable, selectedVoice, pitch, rate, volume, toast]);

  return { speak, isSpeaking, isAvailable, voices, selectedVoice };
}