<script setup>
import imgCropper from '@/components/imgCropper.vue'
</script>

<template>
  <imgCropper
    :upload-file-type="'blob'"
    :preview-width="200"
    :preview-scale="[1, 1]"
    :allow-type-list="['image/jpeg', 'image/png', 'image/jpg']"
    :limit-size="2"
    :fixed-number="[1, 1]"
  ></imgCropper>
</template>

<style scoped></style>
