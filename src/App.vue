<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted} from "vue";

const router = useRouter();
const onInitOrResize = () => {
  if (window.innerWidth > window.innerHeight) {
    router.push("/");
  } else {
    router.push("/mobile");
  }
}
onMounted(() => {
  window.addEventListener("resize", onInitOrResize);
  onInitOrResize();
})
</script>

<template>
  <router-view/>
</template>

<style scoped>

</style>