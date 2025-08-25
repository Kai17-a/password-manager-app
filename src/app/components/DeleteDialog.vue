<template>
  <Toast position="bottom-right" />
  <Dialog
    v-model:visible="dialog"
    modal
    header="Delete"
    :style="{ width: '25rem' }"
  >
    <div class="ml-5">
      <p class="m-0">以下のデータを削除します</p>
      <li v-for="data in dataList" class="pl-3">
        {{ data.name }}
      </li>
    </div>
    <div class="flex justify-end gap-2 mt-5">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        size="small"
        @click="closeDialog"
      ></Button>
      <Button
        type="button"
        label="Delete"
        severity="danger"
        size="small"
        icon="pi pi-trash"
        :loading="pending"
        @click="deleteData"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import type { Data } from "~/types/data";
import { useToast } from "primevue/usetoast";
import Database from "@tauri-apps/plugin-sql";
const toast = useToast();
const pending: Ref<boolean> = ref(false);

const dialog: Ref<boolean> = defineModel("dialog", {
  required: true,
});

const dataList: Ref<Data[]> = defineModel("data", {
  required: true,
});

const deleteData = async () => {
  pending.value = true;

  const db = await Database.load("sqlite:password-manager-app.db");
  for (const data of dataList.value) {
    await db.execute(`DELETE FROM credentials WHERE id = $1`, [data.id]);
  }

  const updateFlag = useState('credentials-updated')
  updateFlag.value = true

  closeDialog();
  pending.value = false;
  toast.add({ severity: "success", summary: "Delete Completed", life: 3000 });
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style></style>
