"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2000&q=85",
    alt: "A woman in a flowing neutral-toned outfit",
    eyebrow: "SABA MODEST · NEW SEASON",
    title: "Elegance in every layer.",
    copy: "Find thoughtfully selected pieces for the moments that matter and the everyday in between.",
    href: "/items",
    action: "Explore the collection",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=85",
    alt: "A curated fashion collection in warm natural light",
    eyebrow: "EASY, EVERYDAY STYLE",
    title: "Made for your kind of beautiful.",
    copy: "Discover comfortable silhouettes and considered details, chosen with modest style in mind.",
    href: "/items?category=Casual",
    action: "Shop everyday pieces",
  },
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=85",
    alt: "A fashion portrait in soft, warm light",
    eyebrow: "A LITTLE SOMETHING SPECIAL",
    title: "A graceful look, your way.",
    copy: "Explore refined finds for celebrations, gatherings, and every occasion in between.",
    href: "/items?category=Party%20Wear",
    action: "Find your occasion look",
  },
];

export default function HeroSlider() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const reduceMotion = useReducedMotion();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const navigateToSlide = (index) => {
    const swiper = swiperRef.current;
    if (swiper && !swiper.destroyed) swiper.slideToLoop(index);
  };

  const navigateSlide = (direction) => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    if (direction === "previous") swiper.slidePrev();
    else swiper.slideNext();
  };

  return (
    <section aria-label="Featured collection" className="site-container pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0f192a] text-white sm:rounded-[2rem]">
        {mounted ? (
          <>
            <Swiper
              modules={[A11y, Autoplay]}
              onSwiper={(instance) => { swiperRef.current = instance; }}
              onBeforeDestroy={(instance) => {
                if (swiperRef.current === instance) swiperRef.current = null;
              }}
              onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
              slidesPerView={1}
              loop
              autoplay={reduceMotion ? false : { delay: 6000, disableOnInteraction: false }}
              className="h-[470px] sm:h-[510px] lg:h-[610px]"
              a11y={{ prevSlideMessage: "Previous featured look", nextSlideMessage: "Next featured look" }}
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.title}>
                  <div className="absolute inset-0">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={slide.title === slides[0].title}
                      unoptimized
                      sizes="100vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
                  </div>
                  <div className="relative flex h-full items-center px-6 pb-16 pt-10 sm:px-12 lg:px-20">
                    <div className="max-w-2xl">
                      <p className="text-[10px] font-bold tracking-[0.24em] text-[#b6eff3] sm:text-xs">
                        {slide.eyebrow}
                      </p>
                      <h1 className="display-font mt-5 max-w-xl text-4xl leading-[1.08] sm:text-5xl lg:text-7xl">
                        {slide.title}
                      </h1>
                      <p className="mt-5 max-w-lg text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
                        {slide.copy}
                      </p>
                      <Link
                        href={slide.href}
                        className="button-hero mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold"
                      >
                        {slide.action}
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between sm:bottom-7 sm:left-10 sm:right-10">
              <div className="flex items-center gap-2" aria-label="Choose a slide">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    aria-label={`Show slide ${index + 1}: ${slide.title}`}
                    aria-current={activeIndex === index}
                    onClick={() => navigateToSlide(index)}
                    className={`h-2 rounded-full transition-all ${activeIndex === index ? "w-7 bg-white" : "w-2 bg-white/60 hover:bg-white"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => navigateSlide("previous")}
                  className="button-overlay grid h-10 w-10 place-items-center rounded-full backdrop-blur"
                >
                  <ArrowLeft size={17} />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => navigateSlide("next")}
                  className="button-overlay grid h-10 w-10 place-items-center rounded-full backdrop-blur"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="relative h-[470px] sm:h-[510px] lg:h-[610px]">
            <Image src={slides[0].image} alt={slides[0].alt} fill priority unoptimized sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
            <div className="relative flex h-full items-center px-6 pb-16 pt-10 sm:px-12 lg:px-20">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold tracking-[0.24em] text-[#b6eff3] sm:text-xs">{slides[0].eyebrow}</p>
                <h1 className="display-font mt-5 max-w-xl text-4xl leading-[1.08] sm:text-5xl lg:text-7xl">{slides[0].title}</h1>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/85 sm:text-base sm:leading-8">{slides[0].copy}</p>
                <Link href={slides[0].href} className="button-hero mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold">{slides[0].action}</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
