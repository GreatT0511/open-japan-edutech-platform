import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";

export async function GET() {
  try {
    // Get metrics with employment or grad school data
    const metrics = await prisma.uniMetric.findMany({
      where: {
        OR: [{ employmentRate: { not: null } }, { gradSchoolRate: { not: null } }],
      },
      include: {
        university: {
          select: { id: true, name: true, type: true },
        },
      },
      orderBy: [{ year: "desc" }, { universityId: "asc" }],
    });

    // Aggregate by university type
    const typeAgg: Record<
      string,
      {
        empSum: number;
        empCount: number;
        gradSum: number;
        gradCount: number;
      }
    > = {};

    for (const m of metrics) {
      const type = m.university.type;
      if (!typeAgg[type]) {
        typeAgg[type] = { empSum: 0, empCount: 0, gradSum: 0, gradCount: 0 };
      }
      if (m.employmentRate != null) {
        typeAgg[type].empSum += m.employmentRate;
        typeAgg[type].empCount += 1;
      }
      if (m.gradSchoolRate != null) {
        typeAgg[type].gradSum += m.gradSchoolRate;
        typeAgg[type].gradCount += 1;
      }
    }

    const typeLabels: Record<string, string> = {
      NATIONAL: "国立",
      PUBLIC: "公立",
      PRIVATE: "私立",
    };

    const aggregated = Object.entries(typeAgg).map(([type, agg]) => ({
      type,
      typeLabel: typeLabels[type] ?? type,
      avgEmploymentRate:
        agg.empCount > 0 ? Math.round((agg.empSum / agg.empCount) * 10) / 10 : null,
      avgGradSchoolRate:
        agg.gradCount > 0 ? Math.round((agg.gradSum / agg.gradCount) * 10) / 10 : null,
    }));

    return jsonResponse({
      data: {
        byType: aggregated,
        records: metrics,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
