import { useState } from "react";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";

const settingRow = "grid grid-cols-[220px_1fr] gap-[50px] border-t border-hm-border py-10 max-[700px]:grid-cols-1";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="STORE PROFILE"
        title="Settings"
        description="Keep the storefront customers see polished and current."
      />

      <div>
        <section className={settingRow}>
          <div>
            <b>Store logo</b>
            <p className="text-[9px] text-hm-muted">Square image, at least 400 × 400px.</p>
          </div>
          <label className="grid size-[130px] place-items-center rounded-full border border-dashed border-[#ccc] font-[750]">
            AT
            <input type="file" className="hidden" />
          </label>
        </section>

        <section className={settingRow}>
          <div>
            <b>Store banner</b>
            <p className="text-[9px] text-hm-muted">Recommended 1600 × 500px.</p>
          </div>
          <label className="grid h-40 place-items-center rounded-[14px] border border-dashed border-[#ccc] text-hm-muted">
            Upload banner
            <input type="file" className="hidden" />
          </label>
        </section>

        <section className={settingRow}>
          <div>
            <b>Store description</b>
            <p className="text-[9px] text-hm-muted">A concise introduction.</p>
          </div>
          <div>
            <textarea
              className="block min-h-[120px] w-full rounded-[11px] border-0 bg-hm-field p-3"
              defaultValue="Smart technology for everyday living, delivered across Nigeria."
            />
            <Button className="mt-4" size="sm" onClick={() => setSaved(true)}>
              Save Settings
            </Button>
            {saved && <span className="ml-3 text-[10px] text-hm-success">✓ Saved</span>}
          </div>
        </section>
      </div>
    </>
  );
}
