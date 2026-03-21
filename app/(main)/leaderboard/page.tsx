"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Lock, LogIn, ChevronRight, Users } from "lucide-react";
import { INDUSTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  MARKET_DATA,
  getGroupStats,
  getAllStats,
  calculatePercentile,
  incomeRangeToSalary,
  getIndustryComparisonData,
} from "@/lib/market-data";
import type { Industry } from "@/types";

const BarChartComponent = dynamic(() => import("recharts").then(m => {
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } = m;
  return function ChartWrapper({ data, userSalary }: { data: { label: string; avg: number; median: number; top10: number }[]; userSalary?: number }) {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" tickFormatter={(v: number) => `${(v/10000).toFixed(0)}억`} hide domain={[0, 'auto']} />
          <YAxis type="category" dataKey="label" width={70} tick={{ fontSize: 11, fill: '#666' }} />
          <Tooltip formatter={(v: unknown) => [`${Number(v).toLocaleString()}만원`]} />
          <Bar dataKey="avg" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.avg >= (userSalary || 0) ? '#e5e7eb' : '#2563eb'} />
            ))}
          </Bar>
          {userSalary && <ReferenceLine x={userSalary} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" />}
        </BarChart>
      </ResponsiveContainer>
    );
  };
}), { ssr: false, loading: () => <div className="h-[280px] bg-gray-50 animate-pulse rounded" /> });

const DistributionChart = dynamic(() => import("recharts").then(m => {
  const { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } = m;
  return function DistWrapper({ percentiles, userSalary }: { percentiles: Record<string, number>; userSalary?: number }) {
    const data = Object.entries(percentiles)
      .map(([k, v]) => ({ pct: k, salary: v, density: Math.exp(-0.5 * Math.pow((parseInt(k.replace('P','')) - 50)/20, 2)) * 100 }))
      .sort((a, b) => a.salary - b.salary);
    return (
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="salary" tickFormatter={(v: number) => `${v.toLocaleString()}`} tick={{ fontSize: 10 }} />
          <YAxis hide />
          <Tooltip formatter={(v: unknown, name: unknown) => String(name) === 'density' ? [`${Number(v).toFixed(0)}%`, '분포'] : [`${Number(v).toLocaleString()}만원`]} />
          <Area type="monotone" dataKey="density" stroke="#2563eb" fill="url(#grad)" strokeWidth={2} />
          {userSalary && <ReferenceLine x={userSalary} stroke="#ef4444" strokeWidth={2} label={{ value: "나", fill: "#ef4444", fontSize: 12, position: "top" }} />}
        </AreaChart>
      </ResponsiveContainer>
    );
  };
}), { ssr: false, loading: () => <div className="h-[180px] bg-gray-50 animate-pulse rounded" /> });

type TabType = "all" | "my" | "other";

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabType>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const authLevel = user?.auth_level ?? 0;
  const userIndustry = user?.industry || "insurance";
  const userSalary = user ? incomeRangeToSalary(user.income_range) : 4000;
  const allStats = getAllStats();
  const myGroupStats = getGroupStats(userIndustry);
  const myPercentile = calculatePercentile(userIndustry, userSalary);
  const allPercentile = Math.round(myPercentile * 0.95); // 전체 대비 약간 다름
  const comparisonData = useMemo(() => getIndustryComparisonData(), []);
  const myIndustryData = MARKET_DATA.filter(d => d.group === userIndustry);
  const otherIndustry = selectedIndustry || (comparisonData.find(d => d.group !== userIndustry)?.group || "finance");
  const otherGroupStats = getGroupStats(otherIndustry);
  const otherData = MARKET_DATA.filter(d => d.group === otherIndustry);

  const industryLabel = INDUSTRIES.find(i => i.value === userIndustry)?.label || userIndustry;

  // 비로그인
  if (!authLoading && authLevel === 0) {
    return (
      <div>
        <div className="bg-white px-5 py-4">
          <h1 className="text-[15px] font-bold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-blue-600" /> 리더보드
          </h1>
        </div>
        {/* 전체 영업직 평균 (누구나 볼 수 있음) */}
        <div className="bg-white mt-2 px-5 py-5">
          <p className="text-[11px] text-gray-400 mb-1">영업 직군 전체</p>
          <p className="text-[20px] font-bold text-gray-900">
            평균 연봉 {allStats.avg.toLocaleString()}만원
          </p>
          <p className="text-[12px] text-gray-500 mt-1">
            추정 종사자 {(allStats.totalWorkers / 10000).toFixed(1)}만명 · 중위 {allStats.median.toLocaleString()}만원
          </p>
        </div>
        {/* 업종별 평균 비교 */}
        <div className="bg-white mt-2 px-5 py-4">
          <p className="text-[13px] font-bold text-gray-900 mb-3">업종별 평균 연봉</p>
          <BarChartComponent data={comparisonData} />
          <p className="text-[10px] text-gray-400 mt-2">출처: 금감원, 통계청, 잡코리아, 사람인 (2024)</p>
        </div>
        <div className="bg-white mt-2 px-5 py-6 text-center">
          <Lock className="h-8 w-8 mx-auto text-gray-300 mb-3" />
          <p className="text-[13px] font-medium text-gray-700">내 위치와 상세 통계를 확인하려면</p>
          <Link href="/login">
            <Button size="sm" className="mt-3 rounded-full bg-blue-600 text-[12px] px-5">
              <LogIn className="h-3 w-3 mr-1.5" /> 로그인하기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="bg-white px-5 py-3">
        <h1 className="text-[15px] font-bold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-blue-600" /> 리더보드
        </h1>
      </div>

      {/* 탭: 전체 / 내 직군 / 다른 직군 */}
      <div className="bg-white border-b border-gray-100 flex">
        {([
          { key: "all" as TabType, label: "전체 영업직" },
          { key: "my" as TabType, label: `내 직군 (${industryLabel})` },
          { key: "other" as TabType, label: "다른 직군" },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 py-2.5 text-[12px] font-medium border-b-2 transition-colors",
              tab === t.key ? "text-gray-900 border-gray-900" : "text-gray-400 border-transparent"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========== 전체 영업직 탭 ========== */}
      {tab === "all" && (
        <div>
          {/* 내 위치 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-5">
            <p className="text-[11px] text-blue-200">전체 영업직 중 나의 위치</p>
            <div className="flex items-end justify-between mt-1">
              <div>
                <p className="text-[32px] font-bold text-white">상위 {allPercentile}%</p>
                <p className="text-[12px] text-blue-200 mt-0.5">
                  내 연봉 {userSalary.toLocaleString()}만원 · 평균 {allStats.avg.toLocaleString()}만원
                </p>
              </div>
              <div className="flex items-center gap-1 text-green-300 text-[13px] font-medium">
                <TrendingUp className="h-4 w-4" /> +3%
              </div>
            </div>
          </div>

          {/* 업종별 평균 비교 바 차트 */}
          <div className="bg-white mt-2 px-5 py-4">
            <p className="text-[13px] font-bold text-gray-900 mb-1">업종별 평균 연봉 비교</p>
            <p className="text-[11px] text-gray-400 mb-3">빨간 점선 = 나의 연봉</p>
            <BarChartComponent data={comparisonData} userSalary={userSalary} />
          </div>

          {/* 전체 분포에서 내 위치 */}
          <div className="bg-white mt-2 px-5 py-4">
            <p className="text-[13px] font-bold text-gray-900 mb-1">전체 영업직 급여 분포</p>
            <p className="text-[11px] text-gray-400 mb-2">종사자 {(allStats.totalWorkers / 10000).toFixed(1)}만명 기준</p>
            <DistributionChart
              percentiles={MARKET_DATA[0].percentiles}
              userSalary={userSalary}
            />
          </div>

          {/* 월별 추이 (더미) */}
          <div className="bg-white mt-2 px-5 py-4">
            <p className="text-[13px] font-bold text-gray-900 mb-3">월별 순위 변동</p>
            <div className="flex items-end gap-1 h-[100px]">
              {[38, 36, 35, 34, 33, 32, 30, 32, 31, 30, 29, allPercentile].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-gray-400">{v}%</span>
                  <div
                    className={cn("w-full rounded-t", i === 11 ? "bg-blue-600" : "bg-gray-200")}
                    style={{ height: `${Math.max(10, (100 - v))}%` }}
                  />
                  <span className="text-[9px] text-gray-400">
                    {i < 9 ? `${i + 4}월` : i === 9 ? "1월" : i === 10 ? "2월" : "3월"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center py-3">
            출처: 금감원, 통계청, 잡코리아, 사람인, 한국고용정보원 (2024)
          </p>
        </div>
      )}

      {/* ========== 내 직군 탭 ========== */}
      {tab === "my" && (
        <div>
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-5">
            <p className="text-[11px] text-blue-200">{industryLabel} 영업직 중 나의 위치</p>
            <div className="flex items-end justify-between mt-1">
              <div>
                <p className="text-[32px] font-bold text-white">상위 {myPercentile}%</p>
                <p className="text-[12px] text-blue-200 mt-0.5">
                  내 연봉 {userSalary.toLocaleString()}만원
                </p>
              </div>
              {myGroupStats && (
                <div className="text-right">
                  <p className="text-[11px] text-blue-200">업종 평균</p>
                  <p className="text-[16px] font-bold text-white">{myGroupStats.avg.toLocaleString()}만원</p>
                </div>
              )}
            </div>
          </div>

          {/* 내 직군 급여 분포 */}
          {myIndustryData.length > 0 && (
            <div className="bg-white mt-2 px-5 py-4">
              <p className="text-[13px] font-bold text-gray-900 mb-1">{industryLabel} 급여 분포</p>
              <p className="text-[11px] text-gray-400 mb-2">
                종사자 {((myGroupStats?.totalWorkers || 0) / 10000).toFixed(1)}만명
              </p>
              <DistributionChart
                percentiles={myIndustryData[0].percentiles}
                userSalary={userSalary}
              />
            </div>
          )}

          {/* 세부 직종 비교 */}
          <div className="bg-white mt-2 px-5 py-4">
            <p className="text-[13px] font-bold text-gray-900 mb-3">세부 직종별 연봉</p>
            {myIndustryData.map((d, i) => {
              const myPct = calculatePercentile(d.group, userSalary);
              return (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{d.label}</p>
                    <p className="text-[11px] text-gray-400">
                      종사자 {(d.workers / 10000).toFixed(1)}만명 · 중위 {d.median.toLocaleString()}만원
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-blue-600">상위 {myPct}%</p>
                    <p className="text-[11px] text-gray-400">평균 {d.avg.toLocaleString()}만원</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 주요 구간 */}
          {myIndustryData.length > 0 && (
            <div className="bg-white mt-2 px-5 py-4">
              <p className="text-[13px] font-bold text-gray-900 mb-3">급여 구간 분포</p>
              {[
                { label: "하위 25%", val: myIndustryData[0].percentiles.P25, color: "bg-gray-300" },
                { label: "중위 50%", val: myIndustryData[0].percentiles.P50, color: "bg-gray-400" },
                { label: "상위 25%", val: myIndustryData[0].percentiles.P75, color: "bg-blue-400" },
                { label: "상위 10%", val: myIndustryData[0].percentiles.P90, color: "bg-blue-600" },
                { label: "상위 5%", val: myIndustryData[0].percentiles.P95, color: "bg-violet-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <div className={cn("w-2 h-2 rounded-full", item.color)} />
                  <span className="text-[12px] text-gray-600 w-16">{item.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${Math.min(100, (item.val / (myIndustryData[0].percentiles.P99)) * 100)}%` }} />
                  </div>
                  <span className="text-[12px] font-medium text-gray-900 w-20 text-right">
                    {item.val.toLocaleString()}만원
                  </span>
                </div>
              ))}
              {/* 나의 위치 표시 */}
              <div className="flex items-center gap-3 py-1.5 mt-1 bg-red-50 -mx-5 px-5 rounded">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[12px] text-red-600 font-medium w-16">나</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min(100, (userSalary / (myIndustryData[0].percentiles.P99)) * 100)}%` }} />
                </div>
                <span className="text-[12px] font-bold text-red-600 w-20 text-right">
                  {userSalary.toLocaleString()}만원
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========== 다른 직군 탭 ========== */}
      {tab === "other" && (
        <div>
          {/* 직군 선택 */}
          <div className="bg-white px-5 py-3 overflow-x-auto">
            <div className="flex gap-2">
              {comparisonData.filter(d => d.group !== userIndustry).map(d => (
                <button
                  key={d.group}
                  onClick={() => setSelectedIndustry(d.group)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors",
                    otherIndustry === d.group
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {otherGroupStats && (
            <>
              <div className="bg-white mt-2 px-5 py-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <p className="text-[15px] font-bold text-gray-900">
                    {INDUSTRIES.find(i => i.value === otherIndustry)?.label || otherIndustry}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-gray-400">종사자</p>
                    <p className="text-[15px] font-bold text-gray-900">{(otherGroupStats.totalWorkers / 10000).toFixed(1)}만</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-gray-400">평균</p>
                    <p className="text-[15px] font-bold text-gray-900">{otherGroupStats.avg.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-gray-400">상위10%</p>
                    <p className="text-[15px] font-bold text-blue-600">{otherGroupStats.topPct.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 분포 */}
              {otherData.length > 0 && (
                <div className="bg-white mt-2 px-5 py-4">
                  <p className="text-[13px] font-bold text-gray-900 mb-2">급여 분포</p>
                  <DistributionChart percentiles={otherData[0].percentiles} userSalary={userSalary} />
                </div>
              )}

              {/* 세부 직종 */}
              <div className="bg-white mt-2 px-5 py-4">
                <p className="text-[13px] font-bold text-gray-900 mb-3">세부 직종</p>
                {otherData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-[13px] font-medium text-gray-900">{d.label}</p>
                      <p className="text-[11px] text-gray-400">
                        {(d.workers / 10000).toFixed(1)}만명 · 중위 {d.median.toLocaleString()}만원
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold text-gray-900">{d.avg.toLocaleString()}<span className="text-[11px] font-normal text-gray-400">만원</span></p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 내 직군과 비교 */}
              {myGroupStats && (
                <div className="bg-white mt-2 px-5 py-4">
                  <p className="text-[13px] font-bold text-gray-900 mb-3">내 직군과 비교</p>
                  <div className="space-y-2">
                    {[
                      { label: "평균 연봉", my: myGroupStats.avg, other: otherGroupStats.avg },
                      { label: "중위 연봉", my: myGroupStats.median, other: otherGroupStats.median },
                      { label: "상위 10%", my: myGroupStats.topPct, other: otherGroupStats.topPct },
                    ].map((row, i) => {
                      const diff = row.other - row.my;
                      return (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                          <span className="text-[12px] text-gray-500 w-16">{row.label}</span>
                          <span className="text-[12px] font-medium text-gray-900">{row.my.toLocaleString()}</span>
                          <span className={cn("text-[12px] font-bold", diff > 0 ? "text-red-500" : "text-blue-600")}>
                            {diff > 0 ? "+" : ""}{diff.toLocaleString()}
                          </span>
                          <span className="text-[12px] font-medium text-gray-900">{row.other.toLocaleString()}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between text-[10px] text-gray-400 pt-1">
                      <span>{industryLabel}</span>
                      <span>차이</span>
                      <span>{INDUSTRIES.find(i => i.value === otherIndustry)?.label}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
