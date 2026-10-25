<script setup lang="ts">
// 애드센스 심사 단계에서는 개별 슬롯을 호출하지 않고 head 태그의 자동 광고 스크립트만 사용합니다.
interface Props {
  adSlot?: string
  adFormat?: string
  fullWidthResponsive?: boolean
}

defineProps<Props>()
</script>

<template>
  <!-- 심사 승인 전까지 개별 광고 슬롯 비활성화 -->
</template>
