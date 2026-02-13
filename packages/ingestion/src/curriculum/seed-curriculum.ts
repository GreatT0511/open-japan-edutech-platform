import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SchoolLevel } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface SubjectContentData {
  grade: number;
  area: string;
  description: string;
  isNew?: boolean;
  isRemoved?: boolean;
}

interface SubjectData {
  name: string;
  gradeStart: number;
  gradeEnd: number;
  objectives: string;
  contents: SubjectContentData[];
}

interface CurriculumGuidelineData {
  version: string;
  schoolLevel: SchoolLevel;
  effectiveYear: number;
  subjects: SubjectData[];
}

async function main() {
  const filePath = resolve(__dirname, "../../data/curriculum-guidelines.json");
  const raw = await readFile(filePath, "utf-8");
  const guidelines: CurriculumGuidelineData[] = JSON.parse(raw);

  console.log(`Seeding curriculum guidelines... (${guidelines.length} guidelines)`);

  // Delete existing records in reverse dependency order
  await prisma.subjectContent.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.curriculumGuideline.deleteMany();

  let subjectCount = 0;
  let contentCount = 0;

  for (const guideline of guidelines) {
    const createdGuideline = await prisma.curriculumGuideline.create({
      data: {
        version: guideline.version,
        schoolLevel: guideline.schoolLevel,
        effectiveYear: guideline.effectiveYear,
      },
    });

    for (const subject of guideline.subjects) {
      const createdSubject = await prisma.subject.create({
        data: {
          guidelineId: createdGuideline.id,
          name: subject.name,
          gradeStart: subject.gradeStart,
          gradeEnd: subject.gradeEnd,
          objectives: subject.objectives,
        },
      });

      subjectCount++;

      if (subject.contents && subject.contents.length > 0) {
        await prisma.subjectContent.createMany({
          data: subject.contents.map((content) => ({
            subjectId: createdSubject.id,
            grade: content.grade,
            area: content.area,
            description: content.description,
            isNew: content.isNew ?? false,
            isRemoved: content.isRemoved ?? false,
          })),
        });

        contentCount += subject.contents.length;
      }
    }
  }

  console.log(
    `Seeding curriculum guidelines... done (${guidelines.length} guidelines, ${subjectCount} subjects, ${contentCount} contents)`,
  );
}

main()
  .catch((e) => {
    console.error("Error seeding curriculum guidelines:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
