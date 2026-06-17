"use client";

export default function Error({ error }: { error: Error }) {
  return <p>Could not fetch filtered notes. {error.message}</p>;
}
