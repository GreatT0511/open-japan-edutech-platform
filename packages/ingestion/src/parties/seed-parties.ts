import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface PartyData {
  name: string;
  shortName: string;
  color: string;
  website: string;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/parties.json");
  const raw = await readFile(filePath, "utf-8");
  const parties: PartyData[] = JSON.parse(raw);

  console.log(`Seeding parties... (${parties.length} records)`);

  for (const party of parties) {
    await prisma.party.upsert({
      where: { name: party.name },
      update: {
        shortName: party.shortName,
        color: party.color,
        website: party.website,
      },
      create: {
        name: party.name,
        shortName: party.shortName,
        color: party.color,
        website: party.website,
      },
    });
  }

  console.log(`Seeding parties... done (${parties.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding parties:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
