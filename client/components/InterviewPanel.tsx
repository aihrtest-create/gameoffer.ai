import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Training, addHistory, deriveTitle, pickFollowUp } from "@/lib/interview";
import { Mic, MicOff, Send } from "lucide-react";

export default function InterviewPanel({ job, onFinish, fullScreen = false }: { job: string; onFinish: (s: Training) => void; fullScreen?: boolean }) {
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([
    { role: "ai", text: "Привет! Давай потренируемся. Расскажи кратко о себе." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const speak = (text: string) => {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ru-RU";
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    } catch {}
  };

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "ai") speak(last.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  useEffect(() => {
    if (!listening) return;
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    // @ts-ignore
    const rec = new SR();
    rec.lang = "ru-RU";
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      submit(text);
    };
    rec.onend = () => setListening(false);
    rec.start();
    return () => {
      try { rec.stop(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const submit = (text: string) => {
    if (!text.trim()) return;
    const next = text.trim();
    setMessages((m) => [...m, { role: "user", text: next }]);
    const followUp = next.length < 20
      ? "Раскройте, пожалуйста, подробнее. Какой был ваш вклад?"
      : pickFollowUp(job);
    setMessages((m) => [...m, { role: "user", text: next }, { role: "ai", text: followUp }]);
    setInput("");
  };

  const finish = () => {
    onFinish({
      id: crypto.randomUUID(),
      ts: Date.now(),
      title: deriveTitle(job),
      turns: messages.length,
      preview: messages[messages.length - 1]?.text || "",
    });
  };

  return (
    <div className={fullScreen ? "flex h-[calc(100vh-5rem)] flex-col" : "flex h-[70vh] flex-col"}>
      <div className="flex items-center justify-between border-b px-2 py-1 text-sm text-muted-foreground">
        <div className="truncate">{deriveTitle(job)} • Тренировка</div>
        <Button variant="ghost" className="rounded-full" onClick={finish}>Завершить ✅</Button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 p-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "ai" ? "flex" : "flex justify-end"}>
            <div className={m.role === "ai" ? "max-w-[80%] rounded-2xl border bg-white px-4 py-2" : "max-w-[80%] rounded-2xl bg-black px-4 py-2 text-white"}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-2">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => setListening((v) => !v)} aria-label={listening ? "Остановить" : "Микрофон"}>
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Напишите сообщение..." className="flex-1 rounded-full border px-4 py-2" />
          <Button size="icon" className="rounded-full" onClick={() => submit(input)} aria-label="Отправить">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
