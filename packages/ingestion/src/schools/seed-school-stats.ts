import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SchoolLevel } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface SchoolStatData {
  prefectureCode: string;
  year: number;
  schoolLevel: SchoolLevel;
  schoolCount: number;
  studentCount: number;
  classCount?: number;
  avgClassSize?: number;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/school-stats.json");
  const raw = await readFile(filePath, "utf-8");
  const stats: SchoolStatData[] = JSON.parse(raw);

  console.log(`Seeding school stats... (${stats.length} records)`);

  // Build a lookup map for prefecture codes -> ids
  const prefectures = await prisma.prefecture.findMany({
    select: { id: true, code: true },
  });
  const prefMap = new Map(prefectures.map((p) => [p.code, p.id]));

  await prisma.schoolStat.deleteMany();

  await prisma.schoolStat.createMany({
    data: stats.map((s) => {
      const prefectureId = prefMap.get(s.prefectureCode);
      if (!prefectureId) {
        throw new Error(`Prefecture not found for code: ${s.prefectureCode}`);
      }
      return {
        prefectureId,
        year: s.year,
        schoolLevel: s.schoolLevel,
        schoolCount: s.schoolCount,
        studentCount: s.studentCount,
        classCount: s.classCount ?? null,
        avgClassSize: s.avgClassSize ?? null,
      };
    }),
  });

  console.log(`Seeding school stats... done (${stats.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding school stats:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
