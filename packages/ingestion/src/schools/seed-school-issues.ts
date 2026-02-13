import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { IssueType, SchoolLevel } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface SchoolIssueData {
  prefectureCode?: string;
  year: number;
  issueType: IssueType;
  count: number;
  rate?: number;
  schoolLevel?: SchoolLevel;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/school-issues.json");
  const raw = await readFile(filePath, "utf-8");
  const issues: SchoolIssueData[] = JSON.parse(raw);

  console.log(`Seeding school issues... (${issues.length} records)`);

  // Build a lookup map for prefecture codes -> ids
  const prefectures = await prisma.prefecture.findMany({
    select: { id: true, code: true },
  });
  const prefMap = new Map(prefectures.map((p) => [p.code, p.id]));

  await prisma.schoolIssue.deleteMany();

  await prisma.schoolIssue.createMany({
    data: issues.map((issue) => {
      let prefectureId: string | null = null;
      if (issue.prefectureCode) {
        prefectureId = prefMap.get(issue.prefectureCode) ?? null;
        if (!prefectureId) {
          console.warn(`Prefecture not found for code: ${issue.prefectureCode}, setting to null`);
        }
      }
      return {
        prefectureId,
        year: issue.year,
        issueType: issue.issueType,
        count: issue.count,
        rate: issue.rate ?? null,
        schoolLevel: issue.schoolLevel ?? null,
      };
    }),
  });

  console.log(`Seeding school issues... done (${issues.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding school issues:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
