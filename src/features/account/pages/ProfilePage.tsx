import { useEffect, useRef, useState, type FormEvent } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import TextField from "@/components/TextField";
import AccountShell from "@/features/account/components/AccountShell";
import { getInitials } from "@/lib/format";
import { savedProfile } from "@/lib/mock/account";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

type Profile = {
  name: string;
  avatarUrl: string | null;
};

export default function ProfilePage() {
  const email = savedProfile.email;
  const [saved, setSaved] = useState<Profile>({ name: savedProfile.name, avatarUrl: savedProfile.avatarUrl });
  const [draft, setDraft] = useState<Profile>(saved);
  const [nameTouched, setNameTouched] = useState(false);
  const [avatarError, setAvatarError] = useState<string | undefined>();
  const [justSaved, setJustSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  // Object URL for a photo picked but not yet saved, so it can be released when replaced or discarded.
  const draftUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (draftUrl.current) URL.revokeObjectURL(draftUrl.current);
    };
  }, []);

  const nameError = nameTouched && draft.name.trim().length < 2 ? "Enter your full name." : undefined;
  const isValid = !nameError && !avatarError;
  const isDirty = draft.name.trim() !== saved.name || draft.avatarUrl !== saved.avatarUrl;
  const statusMessage = justSaved ? "Profile updated." : isDirty ? "You have unsaved changes." : "";

  function replaceDraftAvatar(url: string | null) {
    if (draftUrl.current) URL.revokeObjectURL(draftUrl.current);
    draftUrl.current = url;
    setDraft((current) => ({ ...current, avatarUrl: url }));
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Choose an image file, such as JPG or PNG.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Choose an image 2 MB or smaller.");
      return;
    }
    setAvatarError(undefined);
    setJustSaved(false);
    replaceDraftAvatar(URL.createObjectURL(file));
  }

  function updateName(value: string) {
    setDraft((current) => ({ ...current, name: value }));
    setJustSaved(false);
  }

  function discard() {
    replaceDraftAvatar(saved.avatarUrl);
    setDraft(saved);
    setNameTouched(false);
    setAvatarError(undefined);
    setJustSaved(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setNameTouched(true);
    if (!isValid || !isDirty) return;

    const next = { name: draft.name.trim(), avatarUrl: draft.avatarUrl };
    // The picked photo is now the saved one, so it must not be released.
    draftUrl.current = null;
    setSaved(next);
    setDraft(next);
    setJustSaved(true);
  }

  return (
    <AccountShell>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account" }]} />
      <PageHeader
        eyebrow="PROFILE"
        title="Personal details"
        description="Update your name and photo. Your email is tied to your sign-in."
      />

      <form noValidate onSubmit={handleSubmit} className="grid max-w-[600px] gap-8">
        <div className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            aria-label="Change profile photo"
            onClick={() => fileInput.current?.click()}
            className="group relative grid size-24 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border-0 bg-hm-text p-0 text-[24px] font-[700] text-white"
          >
            {draft.avatarUrl ? (
              <img src={draft.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <span aria-hidden="true">{getInitials(draft.name)}</span>
            )}
            <span
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center bg-[rgba(20,20,22,0.55)] text-[11px] font-[650] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              Change photo
            </span>
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />

          <div className="min-w-0">
            <p className="m-0 truncate text-[16px] font-[650]">{saved.name}</p>
            <p className="m-0 mt-1 truncate text-[12px] text-hm-muted">{email}</p>
            <p className="m-0 mt-3 text-[11px] text-hm-muted">JPG or PNG, up to 2 MB.</p>
            {avatarError && (
              <p role="alert" className="m-0 mt-2 text-[11px] text-hm-error">
                {avatarError}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <TextField
            label="Full name"
            name="name"
            autoComplete="name"
            value={draft.name}
            onChange={(event) => updateName(event.target.value)}
            onBlur={() => setNameTouched(true)}
            error={nameError}
          />
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            readOnly
            hint="Your email is tied to your sign-in and can't be changed here."
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-hm-border pt-6">
          <p role="status" aria-live="polite" className="m-0 mr-auto text-[12px] text-hm-muted">
            {statusMessage}
          </p>
          <Button variant="ghost" size="sm" onClick={discard} disabled={!isDirty}>
            Discard
          </Button>
          <Button type="submit" size="sm" disabled={!isDirty || !isValid}>
            Save changes
          </Button>
        </div>
      </form>
    </AccountShell>
  );
}
