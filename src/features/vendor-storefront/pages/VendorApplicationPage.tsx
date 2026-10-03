import { useState } from "react";
import { Link } from "react-router";
import Button, { buttonClasses } from "@/components/Button";
import Field from "@/components/Field";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import ResultScreen from "@/components/ResultScreen";
import { cn } from "@/lib/cn";

const stepLabels = ["Store Info", "Business Details", "Banking"];

const stepFields = [
  ["Store name", "Store description", "Store category"],
  ["Registration number", "Tax ID", "Business address", "Phone"],
  ["Bank name", "Account number", "Account name"],
];

const stepTitles = ["Create your storefront", "Verify your business", "Set up your payouts"];

export default function VendorApplicationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <ResultScreen
        showBrand={false}
        fullPage={false}
        icon="✓"
        tone="success"
        title="Application submitted."
        description="We’ll review your details within 3 business days."
        action={
          <Link className={buttonClasses()} to="/">
            Back to Home
          </Link>
        }
      />
    );
  }

  const currentStep = step - 1;

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
        {stepFields[currentStep].map((field) => (
          <Field key={field} label={field} className="my-[18px] text-[11px] font-normal">
            <Input className="h-[50px] px-[15px]" />
          </Field>
        ))}
        {step === 3 && <p>🔒 Banking details are encrypted and used only for payouts.</p>}
        <div className="flex justify-end gap-3">
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button
            onClick={() => (step === 3 ? setSubmitted(true) : setStep(step + 1))}
          >
            {step === 3 ? "Submit Application" : "Continue"}
          </Button>
        </div>
      </section>
    </>
  );
}
