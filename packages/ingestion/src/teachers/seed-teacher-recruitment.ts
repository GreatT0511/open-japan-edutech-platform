import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SchoolLevel } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface TeacherRecruitmentData {
  prefectureCode?: string;
  year: number;
  schoolLevel: SchoolLevel;
  applicants?: number;
  hires?: number;
  ratio?: number;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/teacher-recruitment.json");
  const raw = await readFile(filePath, "utf-8");
  const recruitments: TeacherRecruitmentData[] = JSON.parse(raw);

  console.log(`Seeding teacher recruitment... (${recruitments.length} records)`);

  // Build a lookup map for prefecture codes -> ids (optional field)
  const prefectures = await prisma.prefecture.findMany({
    select: { id: true, code: true },
  });
  const prefMap = new Map(prefectures.map((p) => [p.code, p.id]));

  await prisma.teacherRecruitment.deleteMany();

  await prisma.teacherRecruitment.createMany({
    data: recruitments.map((r) => {
      let prefectureId: string | null = null;
      if (r.prefectureCode) {
        prefectureId = prefMap.get(r.prefectureCode) ?? null;
        if (!prefectureId) {
          console.warn(`Prefecture not found for code: ${r.prefectureCode}, setting to null`);
        }
      }
      return {
        prefectureId,
        year: r.year,
        schoolLevel: r.schoolLevel,
        applicants: r.applicants ?? null,
        hires: r.hires ?? null,
        ratio: r.ratio ?? null,
      };
    }),
  });

  console.log(`Seeding teacher recruitment... done (${recruitments.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding teacher recruitment:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
