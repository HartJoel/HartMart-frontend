import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useUpdateVendorProfile, useVendorProfile } from "@/features/vendor-dashboard/api";
import { getInitials } from "@/lib/format";

const settingRow = "grid grid-cols-[220px_1fr] gap-[50px] border-t border-hm-border py-10 max-[700px]:grid-cols-1";
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export default function SettingsPage() {
  const { data: vendor, isPending, isError, refetch } = useVendorProfile();
  const updateProfile = useUpdateVendorProfile();

  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | undefined>();
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const logoObjectUrl = useRef<string | null>(null);
  const bannerObjectUrl = useRef<string | null>(null);

  // Hydrate the draft once the profile loads, without clobbering unsaved edits.
  useEffect(() => {
    if (!vendor) return;
    setDescription((current) => (logoFile || bannerFile ? current : vendor.storeDescription));
    setLogoPreview((current) => (logoFile ? current : vendor.storeLogo));
    setBannerPreview((current) => (bannerFile ? current : vendor.storeBanner));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor]);

  useEffect(() => {
    return () => {
      if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
      if (bannerObjectUrl.current) URL.revokeObjectURL(bannerObjectUrl.current);
    };
  }, []);

  function pickImage(file: File | undefined, onPicked: (file: File, preview: string) => void) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file, such as JPG or PNG.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Choose an image 4 MB or smaller.");
      return;
    }
    setImageError("");
    setJustSaved(false);
    onPicked(file, URL.createObjectURL(file));
  }

  function handleLogo(file: File | undefined) {
    pickImage(file, (picked, preview) => {
      if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
      logoObjectUrl.current = preview;
      setLogoFile(picked);
      setLogoPreview(preview);
    });
  }

  function handleBanner(file: File | undefined) {
    pickImage(file, (picked, preview) => {
      if (bannerObjectUrl.current) URL.revokeObjectURL(bannerObjectUrl.current);
      bannerObjectUrl.current = preview;
      setBannerFile(picked);
      setBannerPreview(preview);
    });
  }

  function handleSave() {
    setJustSaved(false);
    updateProfile.mutate(
      { storeDescription: description, storeLogo: logoFile, storeBanner: bannerFile },
      {
        onSuccess: () => {
          logoObjectUrl.current = null;
          bannerObjectUrl.current = null;
          setLogoFile(undefined);
          setBannerFile(undefined);
          setJustSaved(true);
        },
      },
    );
  }

  if (isPending) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Dashboard", to: "/vendor/dashboard" }, { label: "Settings" }]} />
        <div className="h-[400px] animate-pulse rounded-hm-md bg-hm-field" />
      </>
    );
  }

  if (isError || !vendor) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Dashboard", to: "/vendor/dashboard" }, { label: "Settings" }]} />
        <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load your store settings.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </>
    );
  }

  const isDirty = description !== vendor.storeDescription || logoFile !== undefined || bannerFile !== undefined;

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/vendor/dashboard" }, { label: "Settings" }]} />
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
          <label className="grid size-[130px] cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-[#ccc] font-[750]">
            {logoPreview ? (
              <img src={logoPreview} alt="" className="size-full object-cover" />
            ) : (
              getInitials(vendor.storeName)
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                handleLogo(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
        </section>

        <section className={settingRow}>
          <div>
            <b>Store banner</b>
            <p className="text-[9px] text-hm-muted">Recommended 1600 × 500px.</p>
          </div>
          <label className="grid h-40 cursor-pointer place-items-center overflow-hidden rounded-[14px] border border-dashed border-[#ccc] text-hm-muted">
            {bannerPreview ? (
              <img src={bannerPreview} alt="" className="size-full object-cover" />
            ) : (
              "Upload banner"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                handleBanner(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
        </section>

        {imageError && (
          <p role="alert" className="mt-2 text-[10px] text-hm-error">
            {imageError}
          </p>
        )}

        <section className={settingRow}>
          <div>
            <b>Store description</b>
            <p className="text-[9px] text-hm-muted">A concise introduction.</p>
          </div>
          <div>
            <textarea
              className="block min-h-[120px] w-full rounded-[11px] border-0 bg-hm-field p-3"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setJustSaved(false);
              }}
            />
            <Button
              className="mt-4"
              size="sm"
              disabled={!isDirty || updateProfile.isPending}
              onClick={handleSave}
            >
              {updateProfile.isPending ? "Saving…" : "Save Settings"}
            </Button>
            {justSaved && <span className="ml-3 text-[10px] text-hm-success">✓ Saved</span>}
            {updateProfile.isError && (
              <span className="ml-3 text-[10px] text-hm-error">Couldn&apos;t save. Try again.</span>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
