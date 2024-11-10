"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { initWllama, getWllama } from "@/lib/wllama-client";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [prompt, setPrompt] = useState("Once upon a time,");
  const [nPredict, setNPredict] = useState(50);
  const [output, setOutput] = useState("");
  const [modelLoadProgress, setModelLoadProgress] = useState(0);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await initWllama((progress) => {
          const percentage = Math.round((progress.loaded / progress.total) * 100);
          setModelLoadProgress(percentage);
        });
        setReady(true);
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };

    loadModel();
  }, []);

  const runCompletion = async () => {
    if (!ready || running) return;

    setRunning(true);
    setOutput("");

    try {
      const wllama = getWllama();
      await wllama.createCompletion(prompt, {
        nPredict: nPredict,
        sampling: {
          temp: 0.5,
          top_k: 40,
          top_p: 0.9,
        },
        onNewToken: (_, __, currentText) => {
          setOutput(currentText);
        },
      });
    } catch (error) {
      console.error("Error during completion:", error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">AI Chat</h2>
        
        {!ready ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">Loading AI model...</p>
            <Progress value={modelLoadProgress} className="w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={running}
                placeholder="Enter your prompt..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Number of tokens: {nPredict}
              </label>
              <Slider
                value={[nPredict]}
                onValueChange={(value) => setNPredict(value[0])}
                min={10}
                max={200}
                step={10}
                disabled={running}
              />
            </div>

            <Button
              onClick={runCompletion}
              disabled={running || !prompt.trim()}
              className="w-full"
            >
              {running ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>

            {output && (
              <Card className="p-4 bg-muted">
                <p className="whitespace-pre-wrap font-mono text-sm">
                  {prompt + output}
                </p>
              </Card>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}