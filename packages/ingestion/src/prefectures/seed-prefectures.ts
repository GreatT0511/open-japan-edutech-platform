import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Region } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface PrefectureData {
  code: string;
  name: string;
  region: Region;
  population: number;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/prefectures.json");
  const raw = await readFile(filePath, "utf-8");
  const prefectures: PrefectureData[] = JSON.parse(raw);

  console.log(`Seeding prefectures... (${prefectures.length} records)`);

  for (const pref of prefectures) {
    await prisma.prefecture.upsert({
      where: { code: pref.code },
      update: {
        name: pref.name,
        region: pref.region,
        population: pref.population,
      },
      create: {
        code: pref.code,
        name: pref.name,
        region: pref.region,
        population: pref.population,
      },
    });
  }

  console.log(`Seeding prefectures... done (${prefectures.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding prefectures:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
