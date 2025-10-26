'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeakToFillProps {
  isPlaying: boolean;
  currentCountIndex: number;
  onTranscript: (countIndex: number, text: string) => void;
  className?: string;
}

export function SpeakToFill({ isPlaying, currentCountIndex, onTranscript, className }: SpeakToFillProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        const lastResult = results[results.length - 1];

        if (lastResult.isFinal) {
          const finalTranscript = lastResult[0].transcript.trim();
          setTranscript(finalTranscript);

          if (isPlaying && currentCountIndex >= 0) {
            onTranscript(currentCountIndex, finalTranscript);
            toast({
              title: 'Added',
              description: `"${finalTranscript}" → Count ${currentCountIndex + 1}`,
            });
          }
        } else {
          setTranscript(lastResult[0].transcript);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: 'Speech Error',
          description: event.error,
          variant: 'destructive',
        });
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && isPlaying) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  }, [isActive, isPlaying]);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm">Speak-to-Fill</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Speech recognition is not supported in this browser.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          Speak-to-Fill
          <Button
            size="icon"
            variant={isActive ? 'default' : 'outline'}
            onClick={toggleActive}
          >
            {isActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isActive ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {isPlaying ? 'Listening...' : 'Press play to start recording'}
            </p>
            {transcript && (
              <p className="text-sm border rounded p-2 bg-muted/50">
                {transcript}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click the mic button to enable speech-to-text while playing.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
