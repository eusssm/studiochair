"use client";

import { useState } from "react";
import { Arrow, Button } from "@/components/ui";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    salon: "",
    city: "",
    email: "",
    phone: "",
    currentSystem: "Treatwell",
    chairs: "1 - 3 stoelen",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending / logging
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border-2 border-ink bg-signal p-8 text-ink shadow-brutal-lg sm:p-12">
        <span className="label-mono">Aanvraag ontvangen</span>
        <h3 className="display mt-2 text-4xl sm:text-6xl">Stoel gereserveerd.</h3>
        <p className="mt-4 max-w-lg text-lg font-bold">
          Dankjewel {formData.name.split(" ")[0]}! We nemen binnen 24 uur contact met je op om te laten zien hoe StudioChair werkt voor {formData.salon || "jouw salon"}.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="brutal-press mt-8 border-2 border-ink bg-card px-6 py-3 font-mono text-sm font-bold uppercase shadow-brutal"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-ink bg-card p-6 shadow-brutal-lg sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="b2b-name" className="label-mono text-ink">
            Jouw naam *
          </label>
          <input
            id="b2b-name"
            type="text"
            required
            placeholder="Bijv. Eugène Maaijen"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-2 block min-h-12 w-full border-2 border-ink bg-paper px-4 font-sans text-base shadow-brutal-sm outline-none focus:shadow-brutal focus-visible:shadow-[3px_3px_0_0_var(--color-signal)]"
          />
        </div>

        <div>
          <label htmlFor="b2b-salon" className="label-mono text-ink">
            Salonnaam *
          </label>
          <input
            id="b2b-salon"
            type="text"
            required
            placeholder="Bijv. Barbershop Rotterdam"
            value={formData.salon}
            onChange={(e) => setFormData({ ...formData, salon: e.target.value })}
            className="mt-2 block min-h-12 w-full border-2 border-ink bg-paper px-4 font-sans text-base shadow-brutal-sm outline-none focus:shadow-brutal focus-visible:shadow-[3px_3px_0_0_var(--color-signal)]"
          />
        </div>

        <div>
          <label htmlFor="b2b-email" className="label-mono text-ink">
            E-mailadres *
          </label>
          <input
            id="b2b-email"
            type="email"
            required
            placeholder="info@jouwsalon.nl"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-2 block min-h-12 w-full border-2 border-ink bg-paper px-4 font-sans text-base shadow-brutal-sm outline-none focus:shadow-brutal focus-visible:shadow-[3px_3px_0_0_var(--color-signal)]"
          />
        </div>

        <div>
          <label htmlFor="b2b-phone" className="label-mono text-ink">
            Telefoonnummer *
          </label>
          <input
            id="b2b-phone"
            type="tel"
            required
            placeholder="06 12 34 56 78"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-2 block min-h-12 w-full border-2 border-ink bg-paper px-4 font-sans text-base shadow-brutal-sm outline-none focus:shadow-brutal focus-visible:shadow-[3px_3px_0_0_var(--color-signal)]"
          />
        </div>

        <div>
          <label htmlFor="b2b-city" className="label-mono text-ink">
            Plaats / Regio
          </label>
          <input
            id="b2b-city"
            type="text"
            placeholder="Bijv. Ridderkerk / Barendrecht"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-2 block min-h-12 w-full border-2 border-ink bg-paper px-4 font-sans text-base shadow-brutal-sm outline-none focus:shadow-brutal focus-visible:shadow-[3px_3px_0_0_var(--color-signal)]"
          />
        </div>

        <div>
          <label htmlFor="b2b-system" className="label-mono text-ink">
            Huidig boekingssysteem
          </label>
          <select
            id="b2b-system"
            value={formData.currentSystem}
            onChange={(e) => setFormData({ ...formData, currentSystem: e.target.value })}
            className="mt-2 block min-h-12 w-full border-2 border-ink bg-paper px-4 font-sans text-base shadow-brutal-sm outline-none focus:shadow-brutal"
          >
            <option value="Treatwell">Treatwell (15-20% commissie)</option>
            <option value="Salonized">Salonized</option>
            <option value="BarberBooking">BarberBooking</option>
            <option value="Ander">Ander systeem</option>
            <option value="Geen">Geen (nog papieren agenda / WhatsApp)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-ink pt-6">
        <Button
          type="submit"
          variant="signal"
          disabled={loading}
          className="w-full justify-center text-base sm:w-auto sm:px-10"
        >
          {loading ? "Versturen…" : (
            <>
              Vrijblijvend Voorstel & Demo Aanvragen <Arrow />
            </>
          )}
        </Button>
        <p className="mt-3 font-mono text-xs text-muted">
          ✓ Geen verplichtingen · Binnen 24 uur antwoord · Live demonstratie op jouw salon afgestemd
        </p>
      </div>
    </form>
  );
}
