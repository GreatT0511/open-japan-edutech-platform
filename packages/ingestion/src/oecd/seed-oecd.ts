import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface OecdData {
  country: string;
  countryCode: string;
  year: number;
  eduSpendingGdpPct?: number;
  publicSpendingPct?: number;
  primaryPupilTeacher?: number;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/oecd-education.json");
  const raw = await readFile(filePath, "utf-8");
  const records: OecdData[] = JSON.parse(raw);

  console.log(`Seeding OECD comparisons... (${records.length} records)`);

  await prisma.oecdComparison.deleteMany();

  await prisma.oecdComparison.createMany({
    data: records.map((r) => ({
      country: r.country,
      countryCode: r.countryCode,
      year: r.year,
      eduSpendingGdpPct: r.eduSpendingGdpPct ?? null,
      publicSpendingPct: r.publicSpendingPct ?? null,
      primaryPupilTeacher: r.primaryPupilTeacher ?? null,
    })),
  });

  console.log(`Seeding OECD comparisons... done (${records.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding OECD comparisons:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
