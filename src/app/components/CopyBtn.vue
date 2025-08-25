<template>
  <Button
    :icon="icon"
    variant="text"
    rounded
    aria-label="Filter"
    size="small"
    @click="copy"
    v-tooltip.top="message"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  secretValue: String,
});
const secretValue: string = props.secretValue ?? "";
const icon: Ref<string> = ref("pi pi-copy");
const copied: Ref<boolean> = ref(false);
const message: Ref<string> = ref("copy")

watch(copied, (newValue) => {
  if (newValue) {
    icon.value = "pi pi-check";
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } else {
    icon.value = "pi pi-copy";
  }
});

const copy = async () => {
  await navigator.clipboard.writeText(secretValue);
  copied.value = true;
  message.value = "copied!"
};
</script>

<style></style>
