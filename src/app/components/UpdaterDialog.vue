<template>
  <Dialog
    v-model:visible="dialog"
    modal
    header="Update Application"
    :style="{ width: '25rem' }"
  >
    <div class="ml-5">
      <p class="m-0">アプリケーションが更新できます</p>
      <p v-if="pending">{{ `${downloaded} / ${contentLength}` }}</p>
    </div>
    <div class="flex justify-end gap-2 mt-5">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        size="small"
        :disabled="pending"
        @click="closeDialog"
      ></Button>
      <Button
        type="button"
        label="Delete"
        severity="danger"
        size="small"
        icon="pi pi-trash"
        :loading="pending"
        @click="updateApp"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

const pending: Ref<boolean> = ref(false);

const dialog: Ref<boolean> = defineModel("dialog", {
  required: true,
});

const props = defineProps({
  update: {
    type: [Update, null],
    required: true,
  },
});

const contentLength: Ref<number | undefined> = ref(0);
const downloaded: Ref<number> = ref(0);

const updateApp = async () => {
  pending.value = true;
  if (!props.update) return;
  await props.update.downloadAndInstall((event) => {
    switch (event.event) {
      case "Started":
        contentLength.value = event.data.contentLength;
        break;
      case "Progress":
        downloaded.value += event.data.chunkLength;
        break;
      case "Finished":
        break;
    }
  });
  await relaunch();
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style></style>
