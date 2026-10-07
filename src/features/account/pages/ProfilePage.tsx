import { useEffect, useRef, useState, type FormEvent } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import TextField from "@/components/TextField";
import AccountShell from "@/features/account/components/AccountShell";
import { useUpdateProfile } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { getInitials } from "@/lib/format";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

type Draft = {
  name: string;
  avatarFile: File | null;
  /** Preview URL: the uploaded photo's URL, or an object URL for a picked-but-unsaved file. */
  avatarPreview: string | null;
};

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();

  const [draft, setDraft] = useState<Draft>({ name: user?.name ?? "", avatarFile: null, avatarPreview: user?.avatar?.url ?? null });
  const [nameTouched, setNameTouched] = useState(false);
  const [avatarError, setAvatarError] = useState<string | undefined>();
  const [justSaved, setJustSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const draftObjectUrl = useRef<string | null>(null);

  // Keep the draft in sync once the signed-in user loads or changes elsewhere (e.g. a save from another tab).
  useEffect(() => {
    if (!user) return;
    setDraft((current) => (current.avatarFile ? current : { name: user.name, avatarFile: null, avatarPreview: user.avatar?.url ?? null }));
  }, [user]);

  useEffect(() => {
    return () => {
      if (draftObjectUrl.current) URL.revokeObjectURL(draftObjectUrl.current);
    };
  }, []);

  if (!user) {
    return (
      <AccountShell>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account" }]} />
        <div className="h-[280px] max-w-[600px] animate-pulse rounded-hm-md border border-hm-border bg-hm-field" />
      </AccountShell>
    );
  }

  const nameError = nameTouched && draft.name.trim().length < 2 ? "Enter your full name." : undefined;
  const isValid = !nameError && !avatarError;
  const isDirty = draft.name.trim() !== user.name || draft.avatarFile !== null;
  const statusMessage = justSaved
    ? "Profile updated."
    : updateProfile.isError
      ? "Couldn't save your changes. Try again."
      : isDirty
        ? "You have unsaved changes."
        : "";

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
    if (draftObjectUrl.current) URL.revokeObjectURL(draftObjectUrl.current);
    const previewUrl = URL.createObjectURL(file);
    draftObjectUrl.current = previewUrl;
    setDraft((current) => ({ ...current, avatarFile: file, avatarPreview: previewUrl }));
  }

  function updateName(value: string) {
    setDraft((current) => ({ ...current, name: value }));
    setJustSaved(false);
  }

  function discard() {
    if (!user) return;
    if (draftObjectUrl.current) {
      URL.revokeObjectURL(draftObjectUrl.current);
      draftObjectUrl.current = null;
    }
    setDraft({ name: user.name, avatarFile: null, avatarPreview: user.avatar?.url ?? null });
    setNameTouched(false);
    setAvatarError(undefined);
    setJustSaved(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setNameTouched(true);
    if (!isValid || !isDirty) return;

    updateProfile.mutate(
      { name: draft.name.trim(), avatar: draft.avatarFile ?? undefined },
      {
        onSuccess: () => {
          draftObjectUrl.current = null;
          setDraft((current) => ({ ...current, avatarFile: null }));
          setJustSaved(true);
        },
      },
    );
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
            {draft.avatarPreview ? (
              <img src={draft.avatarPreview} alt="" className="size-full object-cover" />
            ) : (
              <span aria-hidden="true">{getInitials(draft.name || user.name)}</span>
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
            <p className="m-0 truncate text-[16px] font-[650]">{user.name}</p>
            <p className="m-0 mt-1 truncate text-[12px] text-hm-muted">{user.email}</p>
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
            value={user.email}
            readOnly
            hint="Your email is tied to your sign-in and can't be changed here."
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-hm-border pt-6">
          <p role="status" aria-live="polite" className="m-0 mr-auto text-[12px] text-hm-muted">
            {statusMessage}
          </p>
          <Button variant="ghost" size="sm" onClick={discard} disabled={!isDirty || updateProfile.isPending}>
            Discard
          </Button>
          <Button type="submit" size="sm" disabled={!isDirty || !isValid || updateProfile.isPending}>
            {updateProfile.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </AccountShell>
  );
}
