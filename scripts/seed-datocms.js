const { buildClient } = require('@datocms/cma-client-node');

const CMA_TOKEN = 'f87387b6acebe5d7d76c560339731c';
const client = buildClient({ apiToken: CMA_TOKEN });

async function run() {
  console.log('--- 1. Item Types ophalen ---');
  const existingItemTypes = await client.itemTypes.list();
  const byApiKey = new Map(existingItemTypes.map((it) => [it.api_key, it]));

  const salonSettingType = byApiKey.get('salon_setting');
  const categoryType = byApiKey.get('salon_service_category');
  const serviceType = byApiKey.get('salon_service');
  const staffType = byApiKey.get('salon_staff');

  if (!salonSettingType || !categoryType || !serviceType || !staffType) {
    throw new Error('Niet alle Item Types zijn gevonden. Draai setup eerst.');
  }

  console.log('\n--- 2. SalonSetting record aanmaken / publiceren ---');
  const openingHoursMock = {
    2: [
      { start: '09:00', end: '13:00', label: 'ochtend' },
      { start: '13:30', end: '17:30', label: 'middag' },
    ],
    3: [
      { start: '09:00', end: '13:00', label: 'ochtend' },
      { start: '13:30', end: '17:30', label: 'middag' },
    ],
    4: [
      { start: '09:00', end: '13:00', label: 'ochtend' },
      { start: '13:30', end: '17:30', label: 'middag' },
      { start: '18:00', end: '21:00', label: 'avond' },
    ],
    5: [
      { start: '09:00', end: '13:00', label: 'ochtend' },
      { start: '13:30', end: '17:30', label: 'middag' },
      { start: '18:00', end: '21:00', label: 'avond' },
    ],
    6: [
      { start: '09:00', end: '13:00', label: 'ochtend' },
      { start: '13:30', end: '16:30', label: 'middag' },
    ],
  };

  const settingRecords = await client.items.list({
    filter: { type: salonSettingType.id },
  });

  if (settingRecords.length === 0) {
    console.log('Aanmaken salonSetting record...');
    const settingItem = await client.items.create({
      item_type: { type: 'item_type', id: salonSettingType.id },
      name: 'Atelier Eugène',
      tagline: 'Craftsmanship & Editorial Styling',
      address: 'Ridderkerk, Nederland',
      email: 'hallo@atelier-eugene.nl',
      phone: '+31 180 123 456',
      buffer_minutes: 10,
      deposit_amount_cents: 1500,
      slot_interval_minutes: 15,
      opening_hours: JSON.stringify(openingHoursMock),
    });
    await client.items.publish(settingItem.id);
    console.log('✓ salonSetting record aangemaakt en gepubliceerd:', settingItem.id);
  } else {
    console.log('salonSetting record bestaat al:', settingRecords[0].id);
    // Zorg dat het gepubliceerd is
    try {
      await client.items.publish(settingRecords[0].id);
    } catch {}
  }

  console.log('\n--- 3. Categorieën aanmaken / publiceren ---');
  const categoryMap = new Map();
  const existingCategories = await client.items.list({
    filter: { type: categoryType.id },
  });
  for (const c of existingCategories) {
    categoryMap.set(c.slug, c.id);
  }

  const categoriesToSeed = [
    { title: 'Heren', slug: 'heren', sort_order: 1 },
    { title: 'Dames & Styling', slug: 'dames', sort_order: 2 },
    { title: 'Baard & Care', slug: 'baard', sort_order: 3 },
    { title: 'Kids', slug: 'kids', sort_order: 4 },
  ];

  for (const cat of categoriesToSeed) {
    if (!categoryMap.has(cat.slug)) {
      console.log(`Aanmaken categorie: ${cat.title}...`);
      const item = await client.items.create({
        item_type: { type: 'item_type', id: categoryType.id },
        title: cat.title,
        slug: cat.slug,
        sort_order: cat.sort_order,
      });
      await client.items.publish(item.id);
      categoryMap.set(cat.slug, item.id);
      console.log(`✓ Categorie ${cat.title} gepubliceerd (${item.id})`);
    } else {
      console.log(`Categorie ${cat.title} bestaat al.`);
      try {
        await client.items.publish(categoryMap.get(cat.slug));
      } catch {}
    }
  }

  console.log('\n--- 4. Behandelingen aanmaken / publiceren ---');
  const existingServices = await client.items.list({
    filter: { type: serviceType.id },
  });
  const existingServiceNames = new Set(existingServices.map((s) => s.name));

  const servicesToSeed = [
    {
      name: 'Skin Fade & Hot Towel',
      catSlug: 'heren',
      price_cents: 4500,
      duration_minutes: 45,
      description: 'Wassen, fade tot op de huid, stylen en nekcontour met het mes.',
      is_popular: true,
    },
    {
      name: 'Precision Cut (Klassiek)',
      catSlug: 'heren',
      price_cents: 3500,
      duration_minutes: 30,
      description: 'Schaar- en tondeusewerk, strak afgewerkt. Inclusief styling.',
      is_popular: false,
    },
    {
      name: 'Buzz Cut',
      catSlug: 'heren',
      price_cents: 2250,
      duration_minutes: 15,
      description: 'Eén lengte, overal. Snel, scherp, klaar.',
      is_popular: false,
    },
    {
      name: 'Knippen & Föhnen',
      catSlug: 'dames',
      price_cents: 5900,
      duration_minutes: 60,
      description: 'Consult, wassen, knippen en föhnen in model.',
      is_popular: true,
    },
    {
      name: 'Uitgroei Kleuren',
      catSlug: 'dames',
      price_cents: 7900,
      duration_minutes: 90,
      description: 'Uitgroei bijkleuren incl. inwerktijd, wassen en föhnen.',
      is_popular: false,
    },
    {
      name: 'Balayage Editorial',
      catSlug: 'dames',
      price_cents: 18500,
      duration_minutes: 150,
      description: 'Handgeschilderde highlights, toner en blowout. Plan er een middag voor.',
      is_popular: false,
    },
    {
      name: 'Beard Trim & Line-up',
      catSlug: 'baard',
      price_cents: 2500,
      duration_minutes: 30,
      description: 'Baard in model, contouren met het mes, baardolie.',
      is_popular: true,
    },
    {
      name: 'Kids Cut (t/m 12)',
      catSlug: 'kids',
      price_cents: 2250,
      duration_minutes: 30,
      description: 'Rustig aan, goed resultaat. Ook voor de eerste keer.',
      is_popular: false,
    },
  ];

  for (const s of servicesToSeed) {
    if (!existingServiceNames.has(s.name)) {
      const catId = categoryMap.get(s.catSlug);
      console.log(`Aanmaken behandeling: ${s.name}...`);
      const item = await client.items.create({
        item_type: { type: 'item_type', id: serviceType.id },
        name: s.name,
        category: catId,
        price_cents: s.price_cents,
        duration_minutes: s.duration_minutes,
        description: s.description,
        is_popular: s.is_popular,
      });
      await client.items.publish(item.id);
      console.log(`✓ Behandeling ${s.name} gepubliceerd (${item.id})`);
    } else {
      console.log(`Behandeling ${s.name} bestaat al.`);
      const found = existingServices.find((it) => it.name === s.name);
      if (found) {
        try {
          await client.items.publish(found.id);
        } catch {}
      }
    }
  }

  console.log('\n--- 5. Kappers / Personeel aanmaken / publiceren ---');
  const existingStaff = await client.items.list({
    filter: { type: staffType.id },
  });
  const existingStaffNames = new Set(existingStaff.map((st) => st.name));

  const staffToSeed = [
    {
      name: 'Marcus',
      role: 'Master Barber',
      email: 'marcus@atelier-eugene.nl',
      calendar_id: 'marcus@atelier-eugene.nl',
      is_active: true,
      working_days: '2,3,4,5,6',
    },
    {
      name: 'Sophie',
      role: 'Senior Stylist & Colorist',
      email: 'sophie@atelier-eugene.nl',
      calendar_id: 'sophie@atelier-eugene.nl',
      is_active: true,
      working_days: '2,3,4,6',
    },
    {
      name: 'Dex',
      role: 'Barber & Fade Specialist',
      email: 'dex@atelier-eugene.nl',
      calendar_id: 'dex@atelier-eugene.nl',
      is_active: true,
      working_days: '3,4,5,6',
    },
  ];

  for (const st of staffToSeed) {
    if (!existingStaffNames.has(st.name)) {
      console.log(`Aanmaken kapper: ${st.name}...`);
      const item = await client.items.create({
        item_type: { type: 'item_type', id: staffType.id },
        name: st.name,
        role: st.role,
        avatar: null,
        email: st.email,
        calendar_id: st.calendar_id,
        is_active: st.is_active,
        working_days: st.working_days,
      });
      await client.items.publish(item.id);
      console.log(`✓ Kapper ${st.name} gepubliceerd (${item.id})`);
    } else {
      console.log(`Kapper ${st.name} bestaat al.`);
      const found = existingStaff.find((it) => it.name === st.name);
      if (found) {
        try {
          await client.items.publish(found.id);
        } catch {}
      }
    }
  }

  console.log('\n Klaar! Alle DatoCMS modellen en records staan live in site 212359.');
}

run().catch((err) => {
  console.error('Fout bij uitvoeren seed:', err);
  process.exit(1);
});
