import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { EduPolicyCategory } from "@ojetp/db";
import { prisma } from "@ojetp/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface EduPolicyStanceData {
  partyName: string;
  category: EduPolicyCategory;
  stance: string;
  detail?: string;
  source?: string;
  year?: number;
}

async function main() {
  const filePath = resolve(__dirname, "../../data/edu-policy-stances.json");
  const raw = await readFile(filePath, "utf-8");
  const stances: EduPolicyStanceData[] = JSON.parse(raw);

  console.log(`Seeding edu policy stances... (${stances.length} records)`);

  // Build a lookup map for party names -> ids
  const parties = await prisma.party.findMany({
    select: { id: true, name: true },
  });
  const partyMap = new Map(parties.map((p) => [p.name, p.id]));

  await prisma.eduPolicyStance.deleteMany();

  await prisma.eduPolicyStance.createMany({
    data: stances.map((s) => {
      const partyId = partyMap.get(s.partyName);
      if (!partyId) {
        throw new Error(`Party not found for name: ${s.partyName}`);
      }
      return {
        partyId,
        category: s.category,
        stance: s.stance,
        detail: s.detail ?? null,
        source: s.source ?? null,
        year: s.year ?? null,
      };
    }),
  });

  console.log(`Seeding edu policy stances... done (${stances.length} records)`);
}

main()
  .catch((e) => {
    console.error("Error seeding edu policy stances:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
