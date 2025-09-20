import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function readLS(key: string) {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeLS(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function generateCoverLetter(job: string, resume: string) {
  const companyMatch = job.match(
    /(?:в|в компанию|company|компания)\s+([A-Za-zА-Яа-я0-9\-\s"']{2,})/i,
  );
  const company = companyMatch?.[1]?.trim().replace(/["']+/g, "");
  const roleMatch = job.match(
    /(?:на|for|позицию|роль)\s+([A-Za-zА-Яа-я0-9\-\s"']{2,})/i,
  );
  const role = roleMatch?.[1]?.trim().replace(/["']+/g, "");

  const strengths = (resume || job)
    .split(/\n|,|•|-/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);

  const bullets = strengths.map((s) => `• ${s.replace(/^\W+/, "")}`).join("\n");

  return (
    `Здравствуйте! 👋\n\n` +
    `Меня заинтересовала вакансия${role ? ` «${role}»` : ""}${company ? ` в ${company}` : ""}. ` +
    `Я практикую Data‑driven подход и сфокусирован на результате. Вот почему я подхожу: \n\n` +
    `${bullets || "• Опыт в релевантных задачах\n• Быстро обучаюсь и беру ответственность"}\n\n` +
    `Готов обсудить детали и выполнить короткое тестовое задание. Спасибо за внимание! 🚀`
  );
}

// Sessions history
export type Training = {
  id: string;
  ts: number;
  title: string;
  turns: number;
  preview: string;
};
function readHistory(): Training[] {
  try {
    return JSON.parse(localStorage.getItem("interview.history") || "[]");
  } catch {
    return [];
  }
}
function addHistory(s: Training) {
  try {
    const arr = readHistory();
    arr.unshift(s);
    localStorage.setItem("interview.history", JSON.stringify(arr.slice(0, 50)));
  } catch {}
}
function deriveTitle(job: string) {
  const roleMatch = job.match(
    /(?:на|позицию|роль)\s+([A-Za-zА-Яа-я0-9\-\s"']{2,})/i,
  );
  return roleMatch?.[1]?.trim() || "Тренировка";
}

export default function Dashboard() {
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [letter, setLetter] = useState("");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Training[]>(readHistory());

  useEffect(() => {
    const j = readLS("interview.job");
    const r = readLS("interview.resume");
    setJob(j);
    setResume(r);
  }, []);

  const name = useMemo(() => {
    const m = resume.match(/(^|\s)([A-ZА-Я][a-zа-я]+\s+[A-ZА-Я][a-zа-я]+)/);
    return m?.[2] || "Гость";
  }, [resume]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Hey {name} <span className="align-middle">👋</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Добро пожаловать в тренировку собеседований на базе ИИ. Начните с
          подготовки интервью или сгенерируйте сопроводительное письмо для вашей
          вакансии.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <CardHeader>
            <CardTitle>Интервью готово ✅</CardTitle>
            <CardDescription>
              Вакансия обработана. Можно начинать тренировку. Голос и чат
              поддерживаются.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3 pt-0">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-black px-6 text-white hover:bg-black/90">
                  Начать
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="sr-only">
                    Тренировка интервью
                  </DialogTitle>
                </DialogHeader>
                <InterviewPanel
                  job={job}
                  onFinish={(session) => {
                    addHistory(session);
                    setHistory(readHistory());
                    setOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={() => {
                writeLS("interview.job", "");
                writeLS("interview.resume", "");
                location.href = "/";
              }}
            >
              Изменить вакансию
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <CardHeader>
            <CardTitle>Сопроводительное письмо ✍️</CardTitle>
            <CardDescription>
              Письмо появится ниже. Можно копировать или перегенерировать.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              className="min-h-48 rounded-2xl bg-secondary/50"
              placeholder={'Нажмите "Сгенерировать"'}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-full"
                onClick={() =>
                  setLetter(
                    letter.trim()
                      ? generateCoverLetter(job + "\n" + Date.now(), resume)
                      : generateCoverLetter(job, resume),
                  )
                }
              >
                {letter.trim() ? "Перегенерировать ♻️" : "Сгенерировать"}
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  navigator.clipboard.writeText(letter);
                }}
              >
                Копировать 📋
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <CardHeader>
          <CardTitle>История тренировок</CardTitle>
          <CardDescription>
            Завершённые тренировки сохраняются локально на этом устройстве.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {history.length === 0 ? (
            <div className="rounded-2xl border bg-white p-4 text-sm text-muted-foreground">
              Пока пусто. Завершите тренировку, чтобы она появилась здесь.
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{s.title}</div>
                    <div className="truncate text-muted-foreground">
                      {new Date(s.ts).toLocaleString()} • {s.turns} сообщений
                    </div>
                  </div>
                  <Button variant="ghost" className="rounded-full">
                    Открыть
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InterviewPanel({
  job,
  onFinish,
}: {
  job: string;
  onFinish: (s: Training) => void;
}) {
  const [messages, setMessages] = useState<
    { role: "ai" | "user"; text: string }[]
  >([
    {
      role: "ai",
      text: "Привет! Давай потренируемся. Расскажи кратко о себе.",
    },
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
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      submit(text);
    };
    rec.onend = () => setListening(false);
    rec.start();
    return () => {
      try {
        rec.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const submit = (text: string) => {
    if (!text.trim()) return;
    const next = text.trim();
    setMessages((m) => [...m, { role: "user", text: next }]);
    const followUp =
      next.length < 20
        ? "Раскройте, пожалуйста, подробнее. Какой был ваш вклад?"
        : pickFollowUp(job);
    setMessages((m) => [
      ...m,
      { role: "user", text: next },
      { role: "ai", text: followUp },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-[70vh] flex-col">
      <div className="flex items-center justify-between border-b px-2 py-1 text-sm text-muted-foreground">
        <div className="truncate">{deriveTitle(job)} • Тренировка</div>
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() =>
            onFinish({
              id: crypto.randomUUID(),
              ts: Date.now(),
              title: deriveTitle(job),
              turns: messages.length,
              preview: messages[messages.length - 1]?.text || "",
            })
          }
        >
          Завершить ✅
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 p-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "ai" ? "flex" : "flex justify-end"}
          >
            <div
              className={
                m.role === "ai"
                  ? "max-w-[80%] rounded-2xl border bg-white px-4 py-2"
                  : "max-w-[80%] rounded-2xl bg-black px-4 py-2 text-white"
              }
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setListening((v) => !v)}
          >
            {listening ? "Остановить 🎙️" : "Микрофон 🎙️"}
          </Button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 rounded-full border px-4 py-2"
          />
          <Button className="rounded-full" onClick={() => submit(input)}>
            Отправить →
          </Button>
        </div>
      </div>
    </div>
  );
}

function pickFollowUp(job: string) {
  const topics = [
    "Приведите пример, где вы улучшили метрику на проекте.",
    "Какой технологический риск вы видите в этой роли и как его снизить?",
    "Расскажите о сложном фидбэке, который вы получали, и чему он научил.",
    job
      ? `Как опыт релевантен требованиям вакансии: ${job.slice(0, 80)}…?`
      : "Какие ваши сильные стороны наиболее подходят под эту вакансию?",
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}
