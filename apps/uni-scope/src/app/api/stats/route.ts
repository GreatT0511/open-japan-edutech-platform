import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";

export async function GET() {
  try {
    const [
      totalUniversities,
      nationalCount,
      publicCount,
      privateCount,
      totalDepartments,
      metricsAgg,
    ] = await Promise.all([
      prisma.university.count(),
      prisma.university.count({ where: { type: "NATIONAL" } }),
      prisma.university.count({ where: { type: "PUBLIC" } }),
      prisma.university.count({ where: { type: "PRIVATE" } }),
      prisma.department.count(),
      prisma.uniMetric.aggregate({
        _avg: {
          employmentRate: true,
          gradSchoolRate: true,
          graduationRate: true,
          tuitionAnnual: true,
          enrollmentTotal: true,
        },
      }),
    ]);

    return jsonResponse({
      data: {
        totalUniversities,
        byType: {
          national: nationalCount,
          public: publicCount,
          private: privateCount,
        },
        totalDepartments,
        averages: {
          employmentRate: metricsAgg._avg.employmentRate
            ? Math.round(metricsAgg._avg.employmentRate * 10) / 10
            : null,
          gradSchoolRate: metricsAgg._avg.gradSchoolRate
            ? Math.round(metricsAgg._avg.gradSchoolRate * 10) / 10
            : null,
          graduationRate: metricsAgg._avg.graduationRate
            ? Math.round(metricsAgg._avg.graduationRate * 10) / 10
            : null,
          tuitionAnnual: metricsAgg._avg.tuitionAnnual
            ? Math.round(metricsAgg._avg.tuitionAnnual)
            : null,
          enrollmentTotal: metricsAgg._avg.enrollmentTotal
            ? Math.round(metricsAgg._avg.enrollmentTotal)
            : null,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
