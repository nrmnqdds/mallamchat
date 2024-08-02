"use client";

import { usePostHog } from "posthog-js/react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const posthog = usePostHog();
  posthog?.capture("$exception", {
    message: error.message,
  });

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        type="button"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
