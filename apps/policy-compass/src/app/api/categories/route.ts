import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

const CATEGORY_LABELS: Record<string, string> = {
  TEACHER_POLICY: "教員政策",
  TUITION_SUPPORT: "学費・就学支援",
  ICT_EDUCATION: "ICT・デジタル教育",
  TRUANCY_SUPPORT: "不登校対策",
  SPECIAL_NEEDS: "特別支援教育",
  EARLY_CHILDHOOD: "幼児教育",
  HIGHER_EDUCATION_REFORM: "大学改革",
  CURRICULUM: "カリキュラム・学力",
  SCHOOL_SAFETY: "学校安全",
  INTERNATIONAL: "国際教育・英語",
  LIFELONG_LEARNING: "生涯学習",
  EDUCATION_FINANCE: "教育財政",
};

export async function GET(_request: NextRequest) {
  try {
    const stanceCounts = await prisma.eduPolicyStance.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { category: "asc" },
    });

    // Build full category list with counts (include categories with 0 stances)
    const allCategories = Object.entries(CATEGORY_LABELS).map(([key, label]) => {
      const found = stanceCounts.find((sc) => sc.category === key);
      return {
        key,
        label,
        stanceCount: found?._count.id ?? 0,
      };
    });

    return jsonResponse({ data: allCategories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
