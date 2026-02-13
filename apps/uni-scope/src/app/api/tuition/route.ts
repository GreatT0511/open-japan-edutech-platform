import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";

export async function GET() {
  try {
    // Get all metrics with tuition data
    const metrics = await prisma.uniMetric.findMany({
      where: { tuitionAnnual: { not: null } },
      include: {
        university: {
          select: { id: true, name: true, type: true },
        },
      },
      orderBy: { year: "desc" },
    });

    // Aggregate by university type
    const typeAgg: Record<string, { sum: number; count: number; min: number; max: number }> = {};

    for (const m of metrics) {
      if (m.tuitionAnnual == null) continue;
      const type = m.university.type;
      if (!typeAgg[type]) {
        typeAgg[type] = {
          sum: 0,
          count: 0,
          min: Number.MAX_SAFE_INTEGER,
          max: 0,
        };
      }
      typeAgg[type].sum += m.tuitionAnnual;
      typeAgg[type].count += 1;
      typeAgg[type].min = Math.min(typeAgg[type].min, m.tuitionAnnual);
      typeAgg[type].max = Math.max(typeAgg[type].max, m.tuitionAnnual);
    }

    const typeLabels: Record<string, string> = {
      NATIONAL: "国立",
      PUBLIC: "公立",
      PRIVATE: "私立",
    };

    const aggregated = Object.entries(typeAgg).map(([type, agg]) => ({
      type,
      typeLabel: typeLabels[type] ?? type,
      avgTuition: Math.round(agg.sum / agg.count),
      minTuition: agg.min,
      maxTuition: agg.max,
      count: agg.count,
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
