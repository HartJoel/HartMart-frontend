import { useId, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import type { ReviewInput } from "@/types/review";

type ReviewFormProps = {
  initial?: ReviewInput;
  submitting?: boolean;
  onSubmit: (input: ReviewInput) => void;
  onCancel: () => void;
};

type ReviewField = keyof ReviewInput;

const emptyReview: ReviewInput = { rating: 0, comment: "" };

function validate({ rating, comment }: ReviewInput): Partial<Record<ReviewField, string>> {
  const errors: Partial<Record<ReviewField, string>> = {};
  if (rating < 1) errors.rating = "Choose a rating.";
  if (comment.trim().length < 10) errors.comment = "Add a few more words, at least 10 characters.";
  return errors;
}

/** Star rating and written comment for one item. Submit stays disabled until the review is complete. */
export default function ReviewForm({ initial = emptyReview, submitting, onSubmit, onCancel }: ReviewFormProps) {
  const [values, setValues] = useState<ReviewInput>(initial);
  const [touched, setTouched] = useState<Partial<Record<ReviewField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const ratingName = useId();
  const commentId = useId();

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

    onSubmit({ rating: values.rating, comment: values.comment.trim() });
  }

  const ratingError = errorFor("rating");
  const commentError = errorFor("comment");

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

      <div className="flex flex-col gap-2">
        <label htmlFor={commentId} className="text-[13px] font-[600]">
          Your review
        </label>
        <textarea
          id={commentId}
          rows={5}
          value={values.comment}
          placeholder="What did you like, and what could be better?"
          onChange={(event) => setValues((current) => ({ ...current, comment: event.target.value }))}
          onBlur={() => touch("comment")}
          aria-invalid={commentError ? true : undefined}
          aria-describedby={commentError ? `${commentId}-error` : undefined}
          className="w-full resize-y rounded-hm-sm border-0 bg-hm-field p-4 text-[13px] leading-[1.6] text-hm-text aria-invalid:ring-1 aria-invalid:ring-hm-error"
        />
        {commentError && (
          <p id={`${commentId}-error`} className="m-0 text-[11px] text-hm-error">
            {commentError}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 max-[480px]:flex-col-reverse">
        <Button variant="quiet" size="sm" onClick={onCancel} className="max-[480px]:w-full">
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!isValid || submitting} className="max-[480px]:w-full">
          {submitting ? "Posting…" : "Post review"}
        </Button>
      </div>
    </form>
  );
}
