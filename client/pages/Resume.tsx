import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

function writeLS(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch {}
}
function readLS(key: string) {
  try { return localStorage.getItem(key) || ""; } catch { return ""; }
}

export default function ResumeStep() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(readLS("interview.resume"));

  const goDashboard = () => {
    writeLS("interview.resume", resume);
    navigate("/dashboard");
  };

  return (
    <section className="grid gap-6 md:grid-cols-1">
      <Card className="shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <CardHeader>
          <span className="mb-1 inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">STEP 2 (опцион��льно)</span>
          <CardTitle>Добавьте резюме 👤</CardTitle>
          <CardDescription>Вставьте текст или основные тезисы — так тренировка будет точнее.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea placeholder="Резюме / ключевые навыки…" className="min-h-60 rounded-2xl" value={resume} onChange={(e) => setResume(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-full" onClick={goDashboard}>Перейти в дашборд →</Button>
            <Button variant="outline" className="rounded-full" onClick={() => { setResume(""); goDashboard(); }}>Пропустить</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
