<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '시스템 내부 지표 대시보드 | sajuapp',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' } // 검색엔진 노출 방지
  ]
})

interface DailyLog {
  date: string
  totalViews: number
  sajuViews: number
  ichingViews: number
}

interface SummaryStats {
  todayDate: string
  todayViews: number
  yesterdayViews: number
  growthRate: number
  totalViewsAllTime: number
  totalSajuViews: number
  totalIchingViews: number
}

const loading = ref(true)
const summary = ref<SummaryStats>({
  todayDate: '',
  todayViews: 0,
  yesterdayViews: 0,
  growthRate: 0,
  totalViewsAllTime: 0,
  totalSajuViews: 0,
  totalIchingViews: 0
})
const dailyLogs = ref<DailyLog[]>([])

const fetchMetrics = async () => {
  loading.value = true
  try {
    const res: any = await $fetch('/api/secret-metrics/daily')
    if (res?.success) {
      summary.value = res.summary
      dailyLogs.value = res.dailyLogs || []
    }
  } catch (err) {
    console.error('Failed to load metrics:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMetrics()
})

// 최고 방문자 수 (그래프 비율 계산용)
const maxViewsInLogs = computed(() => {
  if (dailyLogs.value.length === 0) return 10
  const max = Math.max(...dailyLogs.value.map(l => l.totalViews))
  return max > 0 ? max : 10
})

// 사주 vs 주역 비중 계산
const sajuRatio = computed(() => {
  const total = summary.value.totalSajuViews + summary.value.totalIchingViews
  if (total === 0) return 50
  return Math.round((summary.value.totalSajuViews / total) * 100)
})

const ichingRatio = computed(() => 100 - sajuRatio.value)

// 호버 중인 로그
const hoveredLog = ref<DailyLog | null>(null)
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-8">
      
      <!-- 상단 헤더 -->
      <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-6 gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Internal Analytics Console
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            일자별 방문자 & 성장 트렌드 대시보드
          </h1>
          <p class="text-sm text-neutral-400 mt-1">
            날짜별 방문자 증가 추이 및 사주·주역 이용 통계를 실시간으로 분석합니다.
          </p>
        </div>

        <button 
          @click="fetchMetrics" 
          class="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700 self-start md:self-auto"
        >
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          데이터 새로고침
        </button>
      </div>

      <!-- 로딩 스켈레톤 -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-32 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse"></div>
      </div>

      <template v-else>
        <!-- KPI 카운터 카드 4종 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 오늘 방문자 -->
          <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div class="text-xs font-medium text-neutral-400">오늘 방문자 수 (KST)</div>
            <div class="text-3xl font-extrabold text-amber-400 mt-2">
              {{ summary.todayViews.toLocaleString() }} <span class="text-sm font-normal text-neutral-400">명</span>
            </div>
            <div class="mt-2 flex items-center text-xs gap-1">
              <span 
                v-if="summary.growthRate >= 0" 
                class="text-emerald-400 font-semibold flex items-center gap-0.5"
              >
                ▲ {{ summary.growthRate }}%
              </span>
              <span v-else class="text-rose-400 font-semibold flex items-center gap-0.5">
                ▼ {{ Math.abs(summary.growthRate) }}%
              </span>
              <span class="text-neutral-500">전일({{ summary.yesterdayViews }}명) 대비</span>
            </div>
            <div class="absolute right-3 top-3 opacity-10 text-amber-400">
              <UIcon name="i-heroicons-user-group" class="w-12 h-12" />
            </div>
          </div>

          <!-- 어제 방문자 -->
          <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div class="text-xs font-medium text-neutral-400">어제 총 방문자</div>
            <div class="text-3xl font-bold text-neutral-200 mt-2">
              {{ summary.yesterdayViews.toLocaleString() }} <span class="text-sm font-normal text-neutral-400">명</span>
            </div>
            <div class="mt-2 text-xs text-neutral-500">
              기준일자: {{ summary.todayDate }}
            </div>
            <div class="absolute right-3 top-3 opacity-10 text-neutral-400">
              <UIcon name="i-heroicons-calendar-days" class="w-12 h-12" />
            </div>
          </div>

          <!-- 누적 총 방문자 -->
          <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div class="text-xs font-medium text-neutral-400">누적 총 방문자</div>
            <div class="text-3xl font-bold text-cyan-400 mt-2">
              {{ summary.totalViewsAllTime.toLocaleString() }} <span class="text-sm font-normal text-neutral-400">명</span>
            </div>
            <div class="mt-2 text-xs text-neutral-500">
              서비스 오픈 이후 합계
            </div>
            <div class="absolute right-3 top-3 opacity-10 text-cyan-400">
              <UIcon name="i-heroicons-chart-bar" class="w-12 h-12" />
            </div>
          </div>

          <!-- 사주 vs 주역 비중 -->
          <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div class="text-xs font-medium text-neutral-400">운세 분석 선호도</div>
            <div class="text-sm font-bold text-neutral-200 mt-2 flex justify-between">
              <span class="text-amber-400">사주 {{ sajuRatio }}%</span>
              <span class="text-indigo-400">주역 {{ ichingRatio }}%</span>
            </div>
            <!-- 게이지 바 -->
            <div class="w-full bg-neutral-800 rounded-full h-2.5 mt-2 flex overflow-hidden">
              <div class="bg-amber-400 h-full transition-all duration-500" :style="{ width: `${sajuRatio}%` }"></div>
              <div class="bg-indigo-500 h-full transition-all duration-500" :style="{ width: `${ichingRatio}%` }"></div>
            </div>
            <div class="mt-2 text-xs text-neutral-500 flex justify-between">
              <span>사주: {{ summary.totalSajuViews }}회</span>
              <span>주역: {{ summary.totalIchingViews }}회</span>
            </div>
          </div>
        </div>

        <!-- 일자별 방문자 성장 트렌드 차트 (SVG 기반) -->
        <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <UIcon name="i-heroicons-presentation-chart-line" class="text-amber-400 w-5 h-5" />
                일자별 방문자 수 추이 차트
              </h2>
              <p class="text-xs text-neutral-400 mt-0.5">막대에 마우스를 올리면 당일 사주/주역 분석 통계를 볼 수 있습니다.</p>
            </div>
            
            <div v-if="hoveredLog" class="text-xs font-mono bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700 text-amber-300">
              {{ hoveredLog.date }}: 방문 {{ hoveredLog.totalViews }}명 (사주 {{ hoveredLog.sajuViews }} / 주역 {{ hoveredLog.ichingViews }})
            </div>
          </div>

          <!-- 차트 영역 -->
          <div class="h-64 pt-6 pb-2 px-2 flex items-end gap-2 border-b border-neutral-800 overflow-x-auto">
            <div v-if="dailyLogs.length === 0" class="w-full text-center text-neutral-500 py-10 text-sm">
              기록된 일별 방문 통계 데이터가 아직 없습니다. 오늘 첫 방문자부터 자동으로 축적됩니다.
            </div>

            <div 
              v-for="log in dailyLogs" 
              :key="log.date"
              @mouseenter="hoveredLog = log"
              @mouseleave="hoveredLog = null"
              class="flex-1 min-w-8 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end"
            >
              <!-- 수치 툴팁 (그룹 호버시) -->
              <span class="text-[10px] font-mono text-neutral-400 group-hover:text-amber-400 transition-colors">
                {{ log.totalViews }}
              </span>

              <!-- 막대 그래프 바 -->
              <div class="w-full bg-neutral-800 group-hover:bg-neutral-700 rounded-t-md relative flex flex-col justify-end overflow-hidden transition-all duration-300"
                   :style="{ height: `${Math.max(10, Math.round((log.totalViews / maxViewsInLogs) * 100))}%` }"
              >
                <!-- 막대 내부 그라데이션 -->
                <div class="w-full bg-linear-gradient-to-t from-amber-600/40 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 h-full transition-colors"></div>
              </div>

              <!-- 날짜 라벨 -->
              <span class="text-[10px] text-neutral-500 group-hover:text-neutral-200 transition-colors font-mono tracking-tighter truncate max-w-full">
                {{ log.date.slice(5) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 일자별 상세 테이블 -->
        <div class="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
          <div class="p-4 border-b border-neutral-800 font-bold text-sm text-neutral-200 flex items-center justify-between">
            <span>일자별 기록 리스트 (최근 60일)</span>
            <span class="text-xs text-neutral-400 font-normal">총 {{ dailyLogs.length }}개 일자 기록됨</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-neutral-950 text-neutral-400 font-mono border-b border-neutral-800">
                <tr>
                  <th class="py-3 px-4">날짜 (Date)</th>
                  <th class="py-3 px-4">일일 방문자 (Views)</th>
                  <th class="py-3 px-4">사주 분석 (Saju)</th>
                  <th class="py-3 px-4">주역 분석 (IChing)</th>
                  <th class="py-3 px-4 text-right">사주 : 주역 비율</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-800/60">
                <tr v-if="dailyLogs.length === 0">
                  <td colspan="5" class="py-8 text-center text-neutral-500">
                    아직 수집된 일별 통계가 없습니다.
                  </td>
                </tr>
                <tr 
                  v-for="log in [...dailyLogs].reverse()" 
                  :key="log.date"
                  class="hover:bg-neutral-800/40 transition-colors"
                >
                  <td class="py-3 px-4 font-mono font-medium text-amber-300">
                    {{ log.date }}
                    <span v-if="log.date === summary.todayDate" class="ml-1.5 px-1.5 py-0.5 text-[9px] bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">TODAY</span>
                  </td>
                  <td class="py-3 px-4 font-bold text-white">
                    {{ log.totalViews.toLocaleString() }} 명
                  </td>
                  <td class="py-3 px-4 text-neutral-300">
                    {{ log.sajuViews }} 회
                  </td>
                  <td class="py-3 px-4 text-neutral-300">
                    {{ log.ichingViews }} 회
                  </td>
                  <td class="py-3 px-4 text-right font-mono text-neutral-400">
                    <span v-if="log.sajuViews + log.ichingViews > 0">
                      {{ Math.round((log.sajuViews / (log.sajuViews + log.ichingViews)) * 100) }}% : {{ 100 - Math.round((log.sajuViews / (log.sajuViews + log.ichingViews)) * 100) }}%
                    </span>
                    <span v-else class="text-neutral-600">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>
