"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function ProductImage({
  src,
  alt,
  sizes = "100vw",
  containerClass = "",
  imageClass = "object-cover",
  placeholderLabel = "SABA MODEST",
  absolute = false,
}) {
  const [failed, setFailed] = useState(false);
  const validSource = typeof src === "string" && /^https?:\/\//i.test(src);

  return (
    <div className={`${absolute ? "absolute inset-0" : "relative"} overflow-hidden bg-section-alt ${containerClass}`}>
      {validSource && !failed ? (
        <Image
          src={src}
          alt={alt || ""}
          fill
          unoptimized
          sizes={sizes}
          onError={() => setFailed(true)}
          className={imageClass}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-section-alt text-brand">
          <ImageOff size={20} strokeWidth={1.5} />
          {placeholderLabel && <span className="text-center text-[10px] tracking-[0.12em]">{placeholderLabel}</span>}
        </div>
      )}
    </div>
  );
}
