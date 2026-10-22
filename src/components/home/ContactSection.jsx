import ContactOptions from "@/components/shared/ContactOptions";

export default function ContactSection() {
  return (
    <section className="site-container py-16 sm:py-20" aria-labelledby="contact-heading">
      <div className="mb-8 max-w-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">We are here to help</p>
        <h2 id="contact-heading" className="display-font mt-3 text-3xl sm:text-4xl">Contact SABA MODEST</h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Choose the contact method that works best for you. Replace the demo destinations in the centralized contact configuration to activate each link.
        </p>
      </div>
      <ContactOptions />
    </section>
  );
}
