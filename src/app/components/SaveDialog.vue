<template>
  <Dialog
    v-model:visible="dialog"
    modal
    :header="data.id ? data.name: '新規登録'"
    :style="{ width: '25rem' }"
  >
    <div v-if="!data.id" class="flex items-center gap-4 mb-4">
      <label for="name" class="font-semibold w-24">Name</label>
      <InputText
        v-model="data.name"
        id="name"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Username</label>
      <InputText
        v-model="data.username"
        id="username"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="secret" class="font-semibold w-24">secret</label>
      <Password v-model="data.secret" :feedback="false" toggleMask />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="website" class="font-semibold w-24">website</label>
      <InputText
        v-model="data.website"
        id="website"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        size="small"
        @click="closeDialog"
      ></Button>
      <Button
        type="button"
        label="Save"
        size="small"
        :loading="pending"
        @click="save"
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
  default: false,
});
const data: Ref<Data> = defineModel("data", { default: {} });

const save = async () => {
  pending.value = true;
  const db = await Database.load("sqlite:password-manager-app.db");

  if (!data.value.id) {
    // 登録
    await db.execute(
      `INSERT INTO credentials (name, username, secret, website) VALUES($1, $2, $3, $4);`,
      [
        data.value.name,
        data.value.username,
        data.value.secret,
        data.value.website,
      ]
    );
  } else {
    // 更新
    await db.execute(
      `UPDATE credentials SET name = $1, username = $2, secret = $3, website = $4 where id = $5;`,
      [
        data.value.name,
        data.value.username,
        data.value.secret,
        data.value.website,
        data.value.id
      ]
    );
  }

  const updateFlag = useState('credentials-updated')
  updateFlag.value = true

  closeDialog();
  pending.value = false;
  toast.add({
    severity: "success",
    summary: "Register Completed",
    life: 3000,
  });
};

const closeDialog = () => {
  data.value = {};
  dialog.value = false;
};
</script>

<style></style>
