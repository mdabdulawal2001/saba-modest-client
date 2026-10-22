"use client";

import Image from "next/image";
import { useState } from "react";

export default function UserAvatar({ user, className = "h-8 w-8" }) {
  const image = typeof user?.image === "string" ? user.image.trim() : "";
  const [failedImage, setFailedImage] = useState("");
  let validImage = false;

  try {
    const parsed = new URL(image);
    validImage = ["https:", "http:"].includes(parsed.protocol) && !parsed.username && !parsed.password;
  } catch {
    validImage = false;
  }

  const initial = user?.name?.trim()?.charAt(0)?.toLocaleUpperCase() || "U";
  const displayImage = validImage && failedImage !== image;

  return (
    <span
      aria-hidden="true"
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-brand/15 font-semibold text-brand ${className}`}
    >
      {displayImage ? (
        <Image
          key={image}
          src={image}
          alt=""
          fill
          unoptimized
          referrerPolicy="no-referrer"
          sizes="40px"
          onError={() => setFailedImage(image)}
          className="object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}
