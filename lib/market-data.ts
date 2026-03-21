// 엑셀 시장조사 데이터 기반 (SalesKing_시장조사_리더보드데이터.xlsx)
// 출처: 금감원, 통계청, 잡코리아, 사람인, 한국고용정보원

export interface IndustryData {
  group: string; // constants.ts의 Industry와 매칭
  sub: string;
  label: string;
  workers: number;
  avg: number;   // 평균 연봉 (만원)
  median: number;
  p25: number;
  p75: number;
  p10pct: number; // 상위10%
  percentiles: Record<string, number>;
}

export const MARKET_DATA: IndustryData[] = [
  { group:"insurance", sub:"생명보험", label:"보험설계사(생명)", workers:380000, avg:4500, median:3800, p25:2400, p75:6200, p10pct:10000, percentiles:{P5:1304,P10:1652,P20:2198,P25:2452,P30:2703,P40:3224,P50:3800,P60:4479,P70:5342,P75:5889,P80:6569,P90:8744,P95:11071,P99:17235} },
  { group:"insurance", sub:"손해보험", label:"보험설계사(손해)", workers:271000, avg:5800, median:4800, p25:3000, p75:7500, p10pct:12000, percentiles:{P5:1789,P10:2225,P20:2897,P25:3204,P30:3506,P40:4125,P50:4801,P60:5588,P70:6575,P75:7194,P80:7957,P90:10361,P95:12882,P99:19384} },
  { group:"realestate", sub:"주거용", label:"부동산중개(주거)", workers:130000, avg:4000, median:3200, p25:1800, p75:5500, p10pct:10000, percentiles:{P5:932,P10:1223,P20:1702,P25:1930,P30:2160,P40:2647,P50:3200,P60:3869,P70:4741,P75:5305,P80:6017,P90:8370,P95:10989,P99:18314} },
  { group:"realestate", sub:"상업용", label:"부동산중개(상업)", workers:50000, avg:5500, median:4500, p25:2500, p75:7000, p10pct:15000, percentiles:{P5:1207,P10:1614,P20:2294,P25:2624,P30:2959,P40:3675,P50:4500,P60:5509,P70:6843,P75:7716,P80:8825,P90:12549,P95:16778,P99:28929} },
  { group:"automotive", sub:"국산차", label:"자동차딜러(국산)", workers:22000, avg:5000, median:4500, p25:3200, p75:6500, p10pct:9000, percentiles:{P5:2400,P10:2400,P20:2954,P25:3212,P30:3463,P40:3965,P50:4500,P60:5107,P70:5848,P75:6303,P80:6855,P90:8542,P95:10242,P99:14397} },
  { group:"automotive", sub:"수입차", label:"자동차딜러(수입)", workers:8000, avg:6500, median:5800, p25:4000, p75:8500, p10pct:13000, percentiles:{P5:3000,P10:3000,P20:3652,P25:4005,P30:4349,P40:5049,P50:5802,P60:6668,P70:7740,P75:8406,P80:9220,P90:11744,P95:14339,P99:20854} },
  { group:"pharma", sub:"전문의약품", label:"제약MR(전문)", workers:45000, avg:6900, median:6200, p25:4500, p75:8500, p10pct:12000, percentiles:{P5:2958,P10:3483,P20:4245,P25:4579,P30:4899,P40:5534,P50:6200,P60:6949,P70:7850,P75:8398,P80:9058,P90:11041,P95:13001,P99:17663} },
  { group:"pharma", sub:"일반의약품", label:"제약MR(일반)", workers:15000, avg:5200, median:4800, p25:3500, p75:6500, p10pct:9000, percentiles:{P5:2500,P10:2875,P20:3428,P25:3667,P30:3893,P40:4339,P50:4800,P60:5312,P70:5921,P75:6287,P80:6724,P90:8018,P95:9271,P99:12173} },
  { group:"b2b", sub:"IT솔루션", label:"B2B SaaS(IT)", workers:8000, avg:5500, median:5000, p25:3200, p75:7500, p10pct:11000, percentiles:{P5:2400,P10:2470,P20:3147,P25:3451,P30:3748,P40:4351,P50:5000,P60:5747,P70:6670,P75:7244,P80:7945,P90:10120,P95:12357,P99:17971} },
  { group:"b2b", sub:"엔터프라이즈", label:"B2B SaaS(엔터)", workers:3000, avg:7000, median:6000, p25:4000, p75:9000, p10pct:14000, percentiles:{P5:3000,P10:3000,P20:3620,P25:4004,P30:4381,P40:5155,P50:6000,P60:6983,P70:8217,P75:8990,P80:9944,P90:12948,P95:16099,P99:24224} },
  { group:"finance", sub:"은행PB", label:"금융(은행PB)", workers:25000, avg:7500, median:6800, p25:5000, p75:9500, p10pct:14000, percentiles:{P5:3500,P10:3581,P20:4463,P25:4854,P30:5232,P40:5991,P50:6799,P60:7716,P70:8835,P75:9523,P80:10358,P90:12907,P95:15475,P99:21753} },
  { group:"finance", sub:"증권영업", label:"금융(증권)", workers:15000, avg:8000, median:7000, p25:4500, p75:10000, p10pct:16000, percentiles:{P5:3000,P10:3458,P20:4405,P25:4831,P30:5247,P40:6090,P50:7000,P60:8045,P70:9338,P75:10141,P80:11122,P90:14167,P95:17298,P99:25157} },
  { group:"advertising", sub:"디지털광고", label:"광고(디지털)", workers:12000, avg:4800, median:4200, p25:3000, p75:6000, p10pct:9000, percentiles:{P5:2000,P10:2212,P20:2757,P25:2998,P30:3232,P40:3701,P50:4200,P60:4766,P70:5458,P75:5883,P80:6398,P90:7973,P95:9560,P99:13437} },
  { group:"advertising", sub:"전통매체", label:"광고(전통)", workers:5000, avg:4200, median:3800, p25:2800, p75:5500, p10pct:8000, percentiles:{P5:1813,P10:2134,P20:2602,P25:2806,P30:3002,P40:3391,P50:3800,P60:4258,P70:4811,P75:5147,P80:5551,P90:6766,P95:7967,P99:10824} },
  { group:"manufacturing", sub:"산업재", label:"B2B제조(산업재)", workers:35000, avg:5000, median:4500, p25:3200, p75:6500, p10pct:9500, percentiles:{P5:2200,P10:2527,P20:3081,P25:3323,P30:3555,P40:4016,P50:4500,P60:5042,P70:5696,P75:6094,P80:6573,P90:8012,P95:9434,P99:12817} },
  { group:"manufacturing", sub:"원자재", label:"B2B제조(원자재)", workers:20000, avg:5500, median:5000, p25:3500, p75:7000, p10pct:10000, percentiles:{P5:2500,P10:2808,P20:3423,P25:3692,P30:3950,P40:4462,P50:5000,P60:5603,P70:6330,P75:6772,P80:7303,P90:8903,P95:10482,P99:14241} },
];

/** 업종 그룹별 통합 데이터 */
export function getGroupStats(group: string) {
  const items = MARKET_DATA.filter(d => d.group === group);
  if (items.length === 0) return null;
  const totalWorkers = items.reduce((s, d) => s + d.workers, 0);
  const weightedAvg = Math.round(items.reduce((s, d) => s + d.avg * d.workers, 0) / totalWorkers);
  const weightedMedian = Math.round(items.reduce((s, d) => s + d.median * d.workers, 0) / totalWorkers);
  const maxP10 = Math.max(...items.map(d => d.p10pct));
  const minP25 = Math.min(...items.map(d => d.p25));
  return { group, items, totalWorkers, avg: weightedAvg, median: weightedMedian, topPct: maxP10, bottomPct: minP25 };
}

/** 전체 영업직 통합 통계 */
export function getAllStats() {
  const totalWorkers = MARKET_DATA.reduce((s, d) => s + d.workers, 0);
  const weightedAvg = Math.round(MARKET_DATA.reduce((s, d) => s + d.avg * d.workers, 0) / totalWorkers);
  const weightedMedian = Math.round(MARKET_DATA.reduce((s, d) => s + d.median * d.workers, 0) / totalWorkers);
  return { totalWorkers, avg: weightedAvg, median: weightedMedian };
}

/** 사용자 연봉으로 백분위 계산 */
export function calculatePercentile(group: string, salary: number): number {
  const items = MARKET_DATA.filter(d => d.group === group);
  if (items.length === 0) return 50;
  // 가장 종사자 수 많은 세부직종 기준
  const main = items.reduce((a, b) => a.workers > b.workers ? a : b);
  const pcts = Object.entries(main.percentiles).map(([k, v]) => ({ pct: parseInt(k.replace('P', '')), val: v })).sort((a, b) => a.pct - b.pct);
  if (salary <= pcts[0].val) return 100 - pcts[0].pct;
  if (salary >= pcts[pcts.length - 1].val) return 100 - pcts[pcts.length - 1].pct;
  for (let i = 0; i < pcts.length - 1; i++) {
    if (salary >= pcts[i].val && salary < pcts[i + 1].val) {
      const ratio = (salary - pcts[i].val) / (pcts[i + 1].val - pcts[i].val);
      const pctile = pcts[i].pct + ratio * (pcts[i + 1].pct - pcts[i].pct);
      return Math.round(100 - pctile);
    }
  }
  return 50;
}

/** 연봉 구간 → 중간값 (만원) */
export function incomeRangeToSalary(range: string): number {
  const map: Record<string, number> = {
    under_30m: 2500,
    '30m_50m': 4000,
    '50m_70m': 6000,
    '70m_100m': 8500,
    '100m_150m': 12500,
    over_150m: 18000,
  };
  return map[range] || 4000;
}

/** 업종별 평균 연봉 비교 차트 데이터 */
export function getIndustryComparisonData() {
  const groups = [...new Set(MARKET_DATA.map(d => d.group))];
  return groups.map(g => {
    const stats = getGroupStats(g);
    return {
      group: g,
      label: getGroupLabel(g),
      avg: stats?.avg || 0,
      median: stats?.median || 0,
      top10: stats?.topPct || 0,
      workers: stats?.totalWorkers || 0,
    };
  }).sort((a, b) => b.avg - a.avg);
}

function getGroupLabel(group: string): string {
  const labels: Record<string, string> = {
    insurance: '보험', realestate: '부동산', automotive: '자동차',
    pharma: '제약/의료기기', b2b: 'B2B/솔루션', finance: '금융',
    advertising: '광고/미디어', manufacturing: '제조/건설',
  };
  return labels[group] || group;
}
