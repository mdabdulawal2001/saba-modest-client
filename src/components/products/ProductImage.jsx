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
    <div className={`${absolute ? "absolute inset-0" : "relative"} overflow-hidden bg-[#eee7dc] dark:bg-[#332f28] ${containerClass}`}>
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#e8ddd1] to-[#c9ad97] text-[#694c40] dark:from-[#4a4037] dark:to-[#332b25] dark:text-[#e5cbb7]">
          <ImageOff size={20} strokeWidth={1.5} />
          {placeholderLabel && <span className="text-center text-[10px] tracking-[0.12em]">{placeholderLabel}</span>}
        </div>
      )}
    </div>
  );
}
