<script setup lang="ts">
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-[#0F1226]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#4d4638]/30 shadow-sm transition-colors duration-300">
    <div class="flex justify-between items-center w-full px-4 sm:px-8 py-3.5 max-w-6xl mx-auto">
      <!-- 좌측: 로고 및 브랜드 이름 영역 (추후 로고 이미지 추가 예정) -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="flex items-center gap-2">
          <span class="font-serif-kr text-lg sm:text-xl font-bold text-amber-700 dark:text-[#FFDE9E] tracking-wider group-hover:text-amber-800 dark:group-hover:text-white transition-colors">
            일일운세 ✦ 天命
          </span>
          <span class="seal-stamp text-[10px] px-1.5 py-0.5" title="천명인 (天命印)">天命</span>
        </div>
      </NuxtLink>

      <!-- 우측: 다크모드/라이트모드 토글 버튼 -->
      <div class="flex items-center gap-2">
        <ColorModeButton />
      </div>
    </div>
  </header>
</template>
