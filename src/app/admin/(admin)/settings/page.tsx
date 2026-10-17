import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/admin/ui";
import SettingsForm from "@/components/admin/SettingForm";

export default async function AdminSettings() {
  const s = await getSettings();

  return (
    <>
      <PageHeader
        title="Site settings"
        subtitle="Changes show on the store within a minute."
      />
      <SettingsForm s={s} />
    </>
  );
}
