import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SchoolLevel } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface TeacherWorkloadData {
  year: number;
  schoolLevel: SchoolLevel;
  weeklyHoursTotal?: number;
  weeklyHoursTeaching?: number;
  weeklyHoursAdmin?: number;
  source?: string;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/teacher-workload.json");
  const raw = await readFile(filePath, "utf-8");
  const workloads: TeacherWorkloadData[] = JSON.parse(raw);

  console.log(`Seeding teacher workload... (${workloads.length} records)`);

  await prisma.teacherWorkload.deleteMany();

  await prisma.teacherWorkload.createMany({
    data: workloads.map((w) => ({
      year: w.year,
      schoolLevel: w.schoolLevel,
      weeklyHoursTotal: w.weeklyHoursTotal ?? null,
      weeklyHoursTeaching: w.weeklyHoursTeaching ?? null,
      weeklyHoursAdmin: w.weeklyHoursAdmin ?? null,
      source: w.source ?? null,
    })),
  });

  console.log(`Seeding teacher workload... done (${workloads.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding teacher workload:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
