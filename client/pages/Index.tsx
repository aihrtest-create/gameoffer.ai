import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function writeLS(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}
function readLS(key: string) {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

export default function Index() {
  const navigate = useNavigate();
  const [jobUrl, setJobUrl] = useState(readLS("interview.jobUrl"));
  const [job, setJob] = useState(readLS("interview.job"));
  const [resume, setResume] = useState(readLS("interview.resume"));

  useEffect(() => {
    if (jobUrl) writeLS("interview.jobUrl", jobUrl);
  }, [jobUrl]);
  useEffect(() => {
    if (job) writeLS("interview.job", job);
  }, [job]);
  useEffect(() => {
    if (resume) writeLS("interview.resume", resume);
  }, [resume]);

  const proceed = () => {
    writeLS("interview.job", job);
    writeLS("interview.resume", resume);
    writeLS("interview.jobUrl", jobUrl);
    navigate("/dashboard");
  };

  return (
    <div className="space-y-10">
      <section className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-muted-foreground shadow-sm">
          🚀 Готовим к собеседованию с помощью ИИ
        </div>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Ваш тренер по собеседованиям{" "}
          <span className="whitespace-nowrap">на ИИ 💡</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Вставьте описание вакансии и, по желанию, резюме — мы подготовим
          вопросы, потренируем голосом и поможем с письмами.
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            className="rounded-full bg-black px-6 text-white hover:bg-black/90"
            onClick={() =>
              document
                .getElementById("step1")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Начать бесплатно ✨
          </Button>
        </div>
      </section>

      <section id="step1" className="grid gap-6 md:grid-cols-1">
        <Card className="shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <CardHeader>
            <span className="mb-1 inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
              STEP 1
            </span>
            <CardTitle>Вставьте вакансию 📄</CardTitle>
            <CardDescription>
              Можно вставить ссылку на вакансию или сам текст.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Ссылка на вакансию (опционально)"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="rounded-2xl"
            />
            <Textarea
              placeholder="Описание вакансии…"
              className="min-h-40 rounded-2xl"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                className="rounded-full"
                onClick={() => {
                  writeLS("interview.job", job);
                  writeLS("interview.jobUrl", jobUrl);
                  navigate("/resume");
                }}
              >
                Далее →
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm text-muted-foreground">
          Работает без регистрации • Ничего никуда не отправляем • Можно
          вернуться и отредактировать
        </p>
      </section>
    </div>
  );
}
