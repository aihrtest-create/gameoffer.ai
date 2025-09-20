export type Training = {
  id: string;
  ts: number;
  title: string;
  turns: number;
  preview: string;
};

export function readHistory(): Training[] {
  try {
    return JSON.parse(localStorage.getItem("interview.history") || "[]");
  } catch {
    return [];
  }
}

export function addHistory(s: Training) {
  try {
    const arr = readHistory();
    arr.unshift(s);
    localStorage.setItem("interview.history", JSON.stringify(arr.slice(0, 50)));
  } catch {}
}

export function deriveTitle(job: string) {
  const roleMatch = job.match(
    /(?:на|позицию|роль)\s+([A-Za-zА-Яа-я0-9\-\s"']{2,})/i,
  );
  return roleMatch?.[1]?.trim() || "Тренировка";
}

export function pickFollowUp(job: string) {
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
