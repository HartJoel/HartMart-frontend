import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Button, { buttonClasses } from "@/components/Button";
import Field from "@/components/Field";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import ResultScreen from "@/components/ResultScreen";
import { useLogout } from "@/features/auth/api";
import ErrorBanner from "@/features/auth/components/ErrorBanner";
import { useCategories } from "@/features/catalog/api";
import { useUpdateVendorProfile } from "@/features/vendor-dashboard/api";
import { useApplyVendor } from "@/features/vendor-storefront/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import type { VendorApplicationInput } from "@/types/vendor";

const stepLabels = ["Store Info", "Business Details", "Banking"];
const stepTitles = ["Create your storefront", "Verify your business", "Set up your payouts"];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

type FieldKey = keyof VendorApplicationInput;
type FieldDef = { key: FieldKey; label: string; type?: "text" | "tel" | "select"; multiline?: boolean };

const stepFields: FieldDef[][] = [
  [
    { key: "storeName", label: "Store name" },
    { key: "storeDescription", label: "Store description", multiline: true },
    { key: "storeCategory", label: "Store category", type: "select" },
  ],
  [
    { key: "businessRegistration", label: "Registration number" },
    { key: "taxId", label: "Tax ID" },
    { key: "businessAddress", label: "Business address" },
    { key: "businessPhone", label: "Phone", type: "tel" },
  ],
  [
    { key: "bankName", label: "Bank name" },
    { key: "bankAccountNumber", label: "Account number" },
    { key: "bankAccountName", label: "Account name" },
    { key: "bankCode", label: "Bank code" },
  ],
];

const emptyForm: VendorApplicationInput = {
  storeName: "",
  storeDescription: "",
  storeCategory: "",
  businessRegistration: "",
  taxId: "",
  businessAddress: "",
  businessPhone: "",
  bankName: "",
  bankAccountNumber: "",
  bankAccountName: "",
  bankCode: "",
};

export default function VendorApplicationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<VendorApplicationInput>(emptyForm);
  const [error, setError] = useState("");
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const [bannerFile, setBannerFile] = useState<File | undefined>();
  const [bannerPreview, setBannerPreview] = useState<string | undefined>();
  const [brandingSaved, setBrandingSaved] = useState(false);
  const logoObjectUrl = useRef<string | null>(null);
  const bannerObjectUrl = useRef<string | null>(null);

  const applyVendor = useApplyVendor();
  const updateProfile = useUpdateVendorProfile();
  const logout = useLogout();
  const { data: categories } = useCategories();
  const rootCategories = (categories ?? []).filter((category) => category.parentId === null);

  const currentStep = step - 1;
  const fields = stepFields[currentStep];

  useEffect(() => {
    return () => {
      if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
      if (bannerObjectUrl.current) URL.revokeObjectURL(bannerObjectUrl.current);
    };
  }, []);

  function updateField(key: FieldKey, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function pickImage(file: File | undefined, onPicked: (file: File, preview: string) => void) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file, such as JPG or PNG.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Choose an image 4 MB or smaller.");
      return;
    }
    setError("");
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

  function stepIsComplete(index: number) {
    return stepFields[index].every((field) => form[field.key].trim().length > 0);
  }

  function goNext() {
    if (!stepIsComplete(currentStep)) {
      setError("Please complete each field before continuing.");
      return;
    }
    setError("");
    setStep((current) => current + 1);
  }

  async function submit() {
    if (!stepIsComplete(currentStep)) {
      setError("Please complete each field before continuing.");
      return;
    }
    setError("");
    try {
      await applyVendor.mutateAsync(form);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "We couldn't submit your application. Please try again.");
      return;
    }

    // Best effort: the account's vendor role only takes effect on next sign-in, so this can
    // fail until then. Logo/banner can always be added later from Settings, so a failure here
    // is silent — it doesn't block the application, which already succeeded.
    if (logoFile || bannerFile) {
      try {
        await updateProfile.mutateAsync({ storeDescription: form.storeDescription, storeLogo: logoFile, storeBanner: bannerFile });
        setBrandingSaved(true);
      } catch {
        setBrandingSaved(false);
      }
    }
  }

  if (applyVendor.isSuccess) {
    return (
      <ResultScreen
        showBrand={false}
        fullPage={false}
        icon="✓"
        tone="success"
        title="Application submitted."
        description={
          (logoFile || bannerFile) && !brandingSaved
            ? "We'll review your details within 3 business days. Your vendor tools — including your logo and banner — unlock the next time you sign in; add them from Settings if they don't carry over."
            : "We'll review your details within 3 business days. Your vendor tools unlock the next time you sign in."
        }
        action={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => logout.mutate()}>
              Sign out now
            </Button>
            <Link className={buttonClasses()} to="/">
              Back to Home
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Become a vendor" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="SELL ON HARTMART"
        title="Grow your business with us."
        description="Tell us about your store and we’ll help bring your products to customers across Nigeria."
      />

      <div className="grid grid-cols-3">
        {stepLabels.map((label, index) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-2.5 text-[11px] text-hm-muted max-[600px]:flex-col max-[600px]:text-center max-[600px]:text-[9px]",
              step >= index + 1 && "text-hm-accent",
            )}
          >
            <span className="grid size-[34px] place-items-center rounded-full border border-hm-border">{index + 1}</span>
            {label}
          </div>
        ))}
      </div>

      <section className="mx-auto my-[50px] max-w-[700px] rounded-hm-md bg-hm-surface p-[50px] max-[600px]:p-7 max-[600px]:px-5">
        <h2 className="text-[16px] font-normal">{stepTitles[currentStep]}</h2>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        {fields.map((field) => (
          <Field key={field.key} label={field.label} className="my-[18px] text-[11px] font-normal">
            {field.multiline ? (
              <textarea
                className="block min-h-[90px] w-full resize-none rounded-hm-sm border-0 bg-hm-field p-[15px] text-[14px] text-hm-text"
                value={form[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
              />
            ) : field.type === "select" ? (
              <select
                className="block h-[50px] w-full rounded-hm-sm border-0 bg-hm-field px-[15px] text-[14px] text-hm-text"
                value={form[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
              >
                <option value="">{categories ? "Select a category" : "Loading categories…"}</option>
                {rootCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                className="h-[50px] px-[15px]"
                type={field.type ?? "text"}
                value={form[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
              />
            )}
          </Field>
        ))}

        {step === 1 && (
          <div className="my-[18px] grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
            <Field label="Store logo (optional)" className="gap-2 text-[11px] font-normal">
              <label className="grid size-[90px] cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-hm-border bg-hm-field text-[10px] text-hm-muted">
                {logoPreview ? <img src={logoPreview} alt="" className="size-full object-cover" /> : "Upload"}
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
            </Field>
            <Field label="Store banner (optional)" className="gap-2 text-[11px] font-normal">
              <label className="grid h-[90px] w-full cursor-pointer place-items-center overflow-hidden rounded-hm-sm border border-dashed border-hm-border bg-hm-field text-[10px] text-hm-muted">
                {bannerPreview ? <img src={bannerPreview} alt="" className="size-full object-cover" /> : "Upload"}
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
            </Field>
          </div>
        )}

        {step === 3 && <p>🔒 Banking details are encrypted and used only for payouts.</p>}
        <div className="flex justify-end gap-3">
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={applyVendor.isPending}>
              Back
            </Button>
          )}
          <Button disabled={applyVendor.isPending || updateProfile.isPending} onClick={() => (step === 3 ? submit() : goNext())}>
            {step === 3
              ? applyVendor.isPending || updateProfile.isPending
                ? "Submitting…"
                : "Submit Application"
              : "Continue"}
          </Button>
        </div>
      </section>
    </>
  );
}
