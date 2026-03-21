import type {
  Industry,
  ExperienceRange,
  IncomeRange,
  GrowthNeed,
  DiagnosisResultJson,
} from "@/types";

/** 업종·경력 매트릭스 기반 역량 진단 점수 산출 */
export function calculateDiagnosis(input: {
  industry: Industry;
  experience_years: ExperienceRange;
  income_range: IncomeRange;
  growth_needs: GrowthNeed[];
}): DiagnosisResultJson {
  // 경력 기반 점수 (0~40)
  const expScores: Record<ExperienceRange, number> = {
    under_1: 8,
    "1_3": 16,
    "3_7": 26,
    "7_15": 34,
    over_15: 40,
  };

  // 연봉 기반 점수 (0~40)
  const incomeScores: Record<IncomeRange, number> = {
    under_30m: 6,
    "30m_50m": 14,
    "50m_70m": 22,
    "70m_100m": 30,
    "100m_150m": 36,
    over_150m: 40,
  };

  // 성장영역 다양성 보너스 (0~20)
  const needsBonus = Math.min(input.growth_needs.length * 4, 20);

  const rawScore =
    expScores[input.experience_years] +
    incomeScores[input.income_range] +
    needsBonus;

  // percentile 계산 (점수 기반 근사)
  const percentile = Math.max(1, Math.min(99, 100 - rawScore));

  // 영업 유형 결정
  const { typeName, typeDesc } = getSalesType(
    input.industry,
    input.experience_years,
    rawScore
  );

  // 강점/약점 분석
  const strengths = getStrengths(
    input.experience_years,
    input.income_range,
    input.growth_needs
  );
  const weaknesses = getWeaknesses(input.growth_needs);

  // 추천사항
  const recommendations = getRecommendations(
    input.industry,
    input.growth_needs
  );

  return {
    percentile,
    strengths,
    weaknesses,
    type_name: typeName,
    type_description: typeDesc,
    recommendations,
  };
}

function getSalesType(
  industry: Industry,
  exp: ExperienceRange,
  score: number
): { typeName: string; typeDesc: string } {
  if (score >= 80) {
    return {
      typeName: "마스터 클로저",
      typeDesc:
        "탁월한 실적과 경험을 갖춘 영업 고수입니다. 후배 양성과 팀 리딩에 적합합니다.",
    };
  }
  if (score >= 60) {
    return {
      typeName: "성장형 플레이어",
      typeDesc:
        "꾸준히 성과를 내고 있으며 한 단계 도약할 준비가 된 영업인입니다.",
    };
  }
  if (score >= 40) {
    return {
      typeName: "잠재력 헌터",
      typeDesc:
        "기본기는 갖추고 있지만 핵심 스킬 강화가 필요한 단계입니다. AI 봇 분석을 활용해보세요.",
    };
  }
  return {
    typeName: "루키 파이터",
    typeDesc:
      "영업의 세계에 첫 발을 딛었습니다. 커뮤니티에서 선배들의 노하우를 흡수하세요.",
  };
}

function getStrengths(
  exp: ExperienceRange,
  income: IncomeRange,
  needs: GrowthNeed[]
): string[] {
  const s: string[] = [];
  if (["7_15", "over_15"].includes(exp)) s.push("풍부한 현장 경험");
  if (["70m_100m", "100m_150m", "over_150m"].includes(income))
    s.push("검증된 실적 역량");
  if (needs.length >= 3) s.push("폭넓은 성장 의지");
  if (needs.includes("closing")) s.push("클로징에 대한 관심");
  if (s.length === 0) s.push("성장에 대한 열정", "새로운 도전 정신");
  return s;
}

function getWeaknesses(needs: GrowthNeed[]): string[] {
  const labels: Record<GrowthNeed, string> = {
    cold_call: "초기 접점 확보 (콜드콜)",
    closing: "거래 마무리 (클로징)",
    referral: "고객 추천 네트워크 (리퍼럴)",
    team_management: "팀 운영 및 관리",
    negotiation: "가격/조건 협상",
    other: "기타 영역",
  };
  return needs.map((n) => labels[n]);
}

function getRecommendations(
  industry: Industry,
  needs: GrowthNeed[]
): string[] {
  const recs: string[] = [];
  recs.push("AI 세일즈 봇으로 실전 콜을 분석해보세요");
  recs.push("커뮤니티에서 같은 업종 선배의 노하우를 확인하세요");
  if (needs.includes("cold_call"))
    recs.push("콜드콜 스크립트 템플릿을 다운로드하세요");
  if (needs.includes("closing"))
    recs.push("클로징 신호 포착 가이드를 참고하세요");
  return recs;
}
