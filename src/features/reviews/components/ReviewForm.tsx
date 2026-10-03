import { useId, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import TextField from "@/components/TextField";
import { cn } from "@/lib/cn";
import type { ReviewInput } from "@/types/review";

type ReviewFormProps = {
  initial?: ReviewInput;
  onSubmit: (input: ReviewInput) => void;
  onCancel: () => void;
};

type ReviewField = keyof ReviewInput;

const emptyReview: ReviewInput = { rating: 0, title: "", body: "" };

function validate({ rating, title, body }: ReviewInput): Partial<Record<ReviewField, string>> {
  const errors: Partial<Record<ReviewField, string>> = {};
  if (rating < 1) errors.rating = "Choose a rating.";
  if (title.trim().length < 3) errors.title = "Add a short headline.";
  if (body.trim().length < 10) errors.body = "Add a few more words, at least 10 characters.";
  return errors;
}

/** Star rating, headline and written review for one item. Submit stays disabled until the review is complete. */
export default function ReviewForm({ initial = emptyReview, onSubmit, onCancel }: ReviewFormProps) {
  const [values, setValues] = useState<ReviewInput>(initial);
  const [touched, setTouched] = useState<Partial<Record<ReviewField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const ratingName = useId();
  const bodyId = useId();

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  // Errors appear once a field has been left, or after a submit attempt.
  function errorFor(field: ReviewField) {
    return attempted || touched[field] ? errors[field] : undefined;
  }

  function touch(field: ReviewField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setAttempted(true);
    if (!isValid) return;

    onSubmit({ rating: values.rating, title: values.title.trim(), body: values.body.trim() });
  }

  const ratingError = errorFor("rating");
  const bodyError = errorFor("body");

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-7">
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-3 text-[13px] font-[600]">Your rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <label
              key={star}
              className="grid size-11 cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-hm-field focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-hm-accent/25"
            >
              <input
                type="radio"
                name={ratingName}
                value={star}
                checked={values.rating === star}
                onChange={() => {
                  setValues((current) => ({ ...current, rating: star }));
                  touch("rating");
                }}
                className="sr-only"
              />
              <span className="sr-only">
                {star} {star === 1 ? "star" : "stars"}
              </span>
              <Icon
                name="star"
                size={24}
                aria-hidden="true"
                className={cn(star <= values.rating ? "fill-current text-hm-text" : "text-hm-border")}
              />
            </label>
          ))}
        </div>
        {ratingError && <p className="m-0 mt-2 text-[11px] text-hm-error">{ratingError}</p>}
      </fieldset>

      <TextField
        label="Headline"
        placeholder="Sum up your experience"
        value={values.title}
        onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
        onBlur={() => touch("title")}
        error={errorFor("title")}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor={bodyId} className="text-[13px] font-[600]">
          Your review
        </label>
        <textarea
          id={bodyId}
          rows={5}
          value={values.body}
          placeholder="What did you like, and what could be better?"
          onChange={(event) => setValues((current) => ({ ...current, body: event.target.value }))}
          onBlur={() => touch("body")}
          aria-invalid={bodyError ? true : undefined}
          aria-describedby={bodyError ? `${bodyId}-error` : undefined}
          className="w-full resize-y rounded-hm-sm border-0 bg-hm-field p-4 text-[13px] leading-[1.6] text-hm-text aria-invalid:ring-1 aria-invalid:ring-hm-error"
        />
        {bodyError && (
          <p id={`${bodyId}-error`} className="m-0 text-[11px] text-hm-error">
            {bodyError}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 max-[480px]:flex-col-reverse">
        <Button variant="quiet" size="sm" onClick={onCancel} className="max-[480px]:w-full">
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!isValid} className="max-[480px]:w-full">
          Post review
        </Button>
      </div>
    </form>
  );
}
