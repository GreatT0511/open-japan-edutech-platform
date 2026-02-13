import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { BudgetCategory } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface EduProgramData {
  name: string;
  description: string;
  category: BudgetCategory;
  startYear: number;
  endYear?: number;
  budgetBillions?: number;
  url?: string;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/edu-programs.json");
  const raw = await readFile(filePath, "utf-8");
  const programs: EduProgramData[] = JSON.parse(raw);

  console.log(`Seeding edu programs... (${programs.length} records)`);

  await prisma.eduProgram.deleteMany();

  await prisma.eduProgram.createMany({
    data: programs.map((p) => ({
      name: p.name,
      description: p.description,
      category: p.category,
      startYear: p.startYear,
      endYear: p.endYear ?? null,
      budgetBillions: p.budgetBillions ?? null,
      url: p.url ?? null,
    })),
  });

  console.log(`Seeding edu programs... done (${programs.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding edu programs:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
