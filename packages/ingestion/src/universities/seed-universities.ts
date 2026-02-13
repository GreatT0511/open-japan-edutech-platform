import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { UniversityType } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface DepartmentData {
  name: string;
  capacity?: number;
  applicants?: number;
  field?: string;
}

interface MetricData {
  year: number;
  enrollmentTotal?: number;
  graduationRate?: number;
  employmentRate?: number;
  gradSchoolRate?: number;
  tuitionAnnual?: number;
}

interface UniversityData {
  name: string;
  type: UniversityType;
  prefectureCode: string;
  foundedYear?: number;
  website?: string;
  departments?: DepartmentData[];
  metrics?: MetricData[];
}

async function main() {
  const filePath = resolve(__dirname, "../../data/universities.json");
  const raw = await readFile(filePath, "utf-8");
  const universities: UniversityData[] = JSON.parse(raw);

  console.log(`Seeding universities... (${universities.length} records)`);

  // Build a lookup map for prefecture codes -> ids
  const prefectures = await prisma.prefecture.findMany({
    select: { id: true, code: true },
  });
  const prefMap = new Map(prefectures.map((p) => [p.code, p.id]));

  // Delete existing records in reverse dependency order
  await prisma.uniMetric.deleteMany();
  await prisma.department.deleteMany();
  await prisma.university.deleteMany();

  let departmentCount = 0;
  let metricCount = 0;

  for (const uni of universities) {
    const prefectureId = prefMap.get(uni.prefectureCode);
    if (!prefectureId) {
      throw new Error(`Prefecture not found for code: ${uni.prefectureCode}`);
    }

    await prisma.university.create({
      data: {
        name: uni.name,
        type: uni.type,
        prefectureId,
        foundedYear: uni.foundedYear ?? null,
        website: uni.website ?? null,
        departments: uni.departments
          ? {
              createMany: {
                data: uni.departments.map((d) => ({
                  name: d.name,
                  capacity: d.capacity ?? null,
                  applicants: d.applicants ?? null,
                  field: d.field ?? null,
                })),
              },
            }
          : undefined,
        metrics: uni.metrics
          ? {
              createMany: {
                data: uni.metrics.map((m) => ({
                  year: m.year,
                  enrollmentTotal: m.enrollmentTotal ?? null,
                  graduationRate: m.graduationRate ?? null,
                  employmentRate: m.employmentRate ?? null,
                  gradSchoolRate: m.gradSchoolRate ?? null,
                  tuitionAnnual: m.tuitionAnnual ?? null,
                })),
              },
            }
          : undefined,
      },
    });

    departmentCount += uni.departments?.length ?? 0;
    metricCount += uni.metrics?.length ?? 0;
  }

  console.log(
    `Seeding universities... done (${universities.length} universities, ${departmentCount} departments, ${metricCount} metrics)`,
  );
}

main()
  .catch((e) => {
    console.error("Error seeding universities:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
