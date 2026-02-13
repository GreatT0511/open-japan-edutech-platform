import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { BudgetCategory } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface EduBudgetData {
  fiscalYear: number;
  category: BudgetCategory;
  amount: number;
  description?: string;
  source?: string;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/edu-budgets.json");
  const raw = await readFile(filePath, "utf-8");
  const budgets: EduBudgetData[] = JSON.parse(raw);

  console.log(`Seeding edu budgets... (${budgets.length} records)`);

  await prisma.eduBudget.deleteMany();

  await prisma.eduBudget.createMany({
    data: budgets.map((b) => ({
      fiscalYear: b.fiscalYear,
      category: b.category,
      amount: BigInt(b.amount),
      description: b.description ?? null,
      source: b.source ?? null,
    })),
  });

  console.log(`Seeding edu budgets... done (${budgets.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding edu budgets:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
