import { check } from "@tauri-apps/plugin-updater";

export const check_update = async () => {
  const update = await check();
  return update;
};
