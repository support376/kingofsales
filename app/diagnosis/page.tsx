"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  INDUSTRIES,
  EXPERIENCE_RANGES,
  INCOME_RANGES,
  GROWTH_NEEDS,
} from "@/lib/constants";
import type {
  Industry,
  ExperienceRange,
  IncomeRange,
  GrowthNeed,
} from "@/types";

const TOTAL_STEPS = 5;

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [experience, setExperience] = useState<ExperienceRange | null>(null);
  const [income, setIncome] = useState<IncomeRange | null>(null);
  const [growthNeeds, setGrowthNeeds] = useState<GrowthNeed[]>([]);
  const [loading, setLoading] = useState(false);

  const canNext = () => {
    if (step === 1) return !!industry;
    if (step === 2) return !!experience;
    if (step === 3) return !!income;
    if (step === 4) return growthNeeds.length > 0;
    return true;
  };

  const toggleNeed = (need: GrowthNeed) => {
    setGrowthNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = async () => {
    if (!industry || !experience || !income) return;
    setLoading(true);

    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry,
          experience_years: experience,
          income_range: income,
          growth_needs: growthNeeds,
        }),
      });
      const data = await res.json();
      router.push(`/diagnosis/result?id=${data.id}`);
    } catch {
      setLoading(false);
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else handleSubmit();
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)}>
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1">
            <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
          </div>
          <span className="text-sm text-muted-foreground">
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        {/* Step 1: 업종 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">어떤 영역에서 영업하세요?</h2>
            <div className="grid grid-cols-2 gap-3">
              {INDUSTRIES.map(({ value, label, icon }) => (
                <Card
                  key={value}
                  className={cn(
                    "cursor-pointer transition-all",
                    industry === value
                      ? "border-[#2E75B6] bg-[#2E75B6]/5 ring-2 ring-[#2E75B6]"
                      : "hover:border-[#2E75B6]/50"
                  )}
                  onClick={() => setIndustry(value)}
                >
                  <CardContent className="flex flex-col items-center gap-2 p-4">
                    <span className="text-3xl">{icon}</span>
                    <span className="text-sm font-medium">{label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 경력 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">영업 경력이 어떻게 되세요?</h2>
            <div className="space-y-2">
              {EXPERIENCE_RANGES.map(({ value, label }) => (
                <Card
                  key={value}
                  className={cn(
                    "cursor-pointer transition-all",
                    experience === value
                      ? "border-[#2E75B6] bg-[#2E75B6]/5 ring-2 ring-[#2E75B6]"
                      : "hover:border-[#2E75B6]/50"
                  )}
                  onClick={() => setExperience(value)}
                >
                  <CardContent className="p-4">
                    <span className="font-medium">{label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 연봉 */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              현재 연 수입은 어느 구간인가요?
            </h2>
            <div className="space-y-2">
              {INCOME_RANGES.map(({ value, label }) => (
                <Card
                  key={value}
                  className={cn(
                    "cursor-pointer transition-all",
                    income === value
                      ? "border-[#2E75B6] bg-[#2E75B6]/5 ring-2 ring-[#2E75B6]"
                      : "hover:border-[#2E75B6]/50"
                  )}
                  onClick={() => setIncome(value)}
                >
                  <CardContent className="p-4">
                    <span className="font-medium">{label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: 성장 희망 영역 */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">가장 키우고 싶은 영역은?</h2>
            <p className="text-sm text-muted-foreground">
              복수 선택 가능합니다
            </p>
            <div className="grid grid-cols-2 gap-3">
              {GROWTH_NEEDS.map(({ value, label }) => (
                <Card
                  key={value}
                  className={cn(
                    "cursor-pointer transition-all",
                    growthNeeds.includes(value)
                      ? "border-[#2E75B6] bg-[#2E75B6]/5 ring-2 ring-[#2E75B6]"
                      : "hover:border-[#2E75B6]/50"
                  )}
                  onClick={() => toggleNeed(value)}
                >
                  <CardContent className="p-4 text-center">
                    <span className="font-medium">{label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: 확인 */}
        {step === 5 && (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold">진단 준비 완료!</h2>
            <p className="text-muted-foreground">
              입력하신 정보를 기반으로
              <br />
              역량 진단 결과를 생성합니다.
            </p>
            <div className="mx-auto max-w-xs space-y-2 rounded-lg border p-4 text-left text-sm">
              <div>
                <span className="text-muted-foreground">업종: </span>
                {INDUSTRIES.find((i) => i.value === industry)?.label}
              </div>
              <div>
                <span className="text-muted-foreground">경력: </span>
                {EXPERIENCE_RANGES.find((e) => e.value === experience)?.label}
              </div>
              <div>
                <span className="text-muted-foreground">연봉대: </span>
                {INCOME_RANGES.find((i) => i.value === income)?.label}
              </div>
              <div>
                <span className="text-muted-foreground">성장 영역: </span>
                {growthNeeds
                  .map((n) => GROWTH_NEEDS.find((g) => g.value === n)?.label)
                  .join(", ")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 bg-background px-4 py-4 safe-bottom">
        <Button
          className="w-full bg-[#2E75B6] hover:bg-[#1B3A5C] text-white"
          size="lg"
          disabled={!canNext() || loading}
          onClick={next}
        >
          {loading ? (
            "진단 중..."
          ) : step === TOTAL_STEPS ? (
            "결과 보기"
          ) : (
            <>
              다음 <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
