import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SchoolLevel } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface TeacherStatData {
  prefectureCode: string;
  year: number;
  schoolLevel: SchoolLevel;
  teacherCount: number;
  femaleRatio?: number;
  avgAge?: number;
  pupilTeacherRatio?: number;
  nonRegularRatio?: number;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/teacher-stats.json");
  const raw = await readFile(filePath, "utf-8");
  const stats: TeacherStatData[] = JSON.parse(raw);

  console.log(`Seeding teacher stats... (${stats.length} records)`);

  // Build a lookup map for prefecture codes -> ids
  const prefectures = await prisma.prefecture.findMany({
    select: { id: true, code: true },
  });
  const prefMap = new Map(prefectures.map((p) => [p.code, p.id]));

  await prisma.teacherStat.deleteMany();

  await prisma.teacherStat.createMany({
    data: stats.map((s) => {
      const prefectureId = prefMap.get(s.prefectureCode);
      if (!prefectureId) {
        throw new Error(`Prefecture not found for code: ${s.prefectureCode}`);
      }
      return {
        prefectureId,
        year: s.year,
        schoolLevel: s.schoolLevel,
        teacherCount: s.teacherCount,
        femaleRatio: s.femaleRatio ?? null,
        avgAge: s.avgAge ?? null,
        pupilTeacherRatio: s.pupilTeacherRatio ?? null,
        nonRegularRatio: s.nonRegularRatio ?? null,
      };
    }),
  });

  console.log(`Seeding teacher stats... done (${stats.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding teacher stats:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
