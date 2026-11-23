<script setup lang="ts">
// /guide/saju/ilju 접근 시 /guide/saju (60일주 공식 가이드 허브)로 깔끔하게 301 영구 리다이렉트
// 구글봇 및 사용자가 /guide/saju/ilju 경로로 유입되었을 때 404 오류를 완벽 차단
await navigateTo('/guide/saju', { redirectCode: 301, replace: true })
</script>

<template>
  <div class="min-h-[50vh] flex items-center justify-center p-6 text-center">
    <p class="text-sm pg-text-muted">60일주 처세 가이드 허브로 이동 중입니다...</p>
  </div>
</template>

