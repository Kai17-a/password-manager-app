<template>
  <DataTable
    v-model:selection="deleteTargetList"
    v-model:filters="filters"
    :value="list"
    filterDisplay="menu"
    :globalFilterFields="['name', 'website']"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-model="filters['global'].value"
            placeholder="Keyword Search"
            size="small"
          />
        </IconField>
        <div>
          <Button
            label="追加"
            icon="pi pi-plus"
            size="small"
            @click="openDialog({})"
          />
          <Button
            label="削除"
            icon="pi pi-trash"
            size="small"
            severity="danger"
            class="ml-3"
            :disabled="deleteTargetList.length == 0"
            @click="openDeleteDialog"
          />
        </div>
      </div>
    </template>
    <Column selectionMode="multiple"></Column>
    <Column header="Name" filterField="name">
      <template #body="slotProps">
        <span
          class="text-blue-500 underline cursor-pointer"
          @click="openDialog(slotProps.data)"
        >
          {{ slotProps.data.name }}
        </span>
      </template>
    </Column>
    <Column field="username" header="Username" filterField="username">
      <template #body="slotProps">
        <div class="flex items-center gap-2">
          <copy-btn :secret-value="slotProps.data.username" />
          {{ slotProps.data.username }}
        </div>
      </template>
    </Column>
    <Column header="Secret">
      <template #body="slotProps">
        <div class="flex items-center gap-2">
          <CopyBtn :secret-value="slotProps.data.secret" />
          <span>••••</span>
        </div>
      </template>
    </Column>
    <Column header="Website">
      <template #body="slotProps">
        <NuxtLink :to="slotProps.data.website" target="_blank">
          {{ slotProps.data.website }}
        </NuxtLink>
      </template>
    </Column>
  </DataTable>

  <SaveDialog v-model:dialog="dialog" v-model:data="targetData" />
  <DeleteDialog
    v-model:dialog="deleteDialog"
    v-model:data="deleteTargetList"
  ></DeleteDialog>

  <UpdaterDialog :dialog="updateAppDialog" :update="appUpdate" />
</template>

<script lang="ts" setup>
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import "primeicons/primeicons.css";
import type { Data } from "~/types/data";
import Database from "@tauri-apps/plugin-sql";
import { check, Update } from "@tauri-apps/plugin-updater";
import UpdaterDialog from "./components/UpdaterDialog.vue";

const filters = ref();
const list: Ref<Data[]> = ref([]);

const appUpdate: Ref<Update | null> = ref(null)
const updateAppDialog: Ref<boolean> = ref(false);

onMounted(async () => {
  appUpdate.value = await check();
  if (appUpdate.value) {
    updateAppDialog.value = true;
  }
});

onUnmounted(async () => {
  await getData();
})

const getData = async () => {
  const db = await Database.load("sqlite:password-manager-app.db");

  const result: Data[] = await db.select(
    "select * from credentials order by LOWER(name) "
  );
  list.value = result;
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    website: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  };
};

initFilters();

// 登録・更新
const dialog: Ref<boolean> = ref(false);
const targetData: Ref<Data> = ref({});
const openDialog = (target: Data) => {
  targetData.value = {
    id: target.id,
    name: target.name,
    username: target.username,
    secret: target.secret,
    website: target.website,
  };
  dialog.value = true;
};

// 削除
const deleteDialog: Ref<boolean> = ref(false);
const deleteTargetList: Ref<Data[]> = ref([]);
const openDeleteDialog = () => {
  deleteDialog.value = true;
};

// 画面データ更新
const updateFlag: Ref<boolean> = useState("credentials-updated", () => false);
watch(updateFlag, async () => {
  if (updateFlag.value) {
    await getData();
    updateFlag.value = false;
  }
});
</script>

<style>
body {
  user-select: none;
}
</style>
