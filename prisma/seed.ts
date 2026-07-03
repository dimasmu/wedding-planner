import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";

const adapter = new PrismaMariaDb(process.env["DATABASE_URL"] ?? "");
const prisma = new PrismaClient({ adapter });

const venues = [
  {
    slug: "the-hermitage",
    name: "The Hermitage",
    location: "Jakarta",
    status: "published",
    description:
      "The Hermitage menawarkan suasana elegan klasik Eropa di jantung Jakarta. Ballroom megah dengan kapasitas hingga 500 tamu, dikelilingi taman tropis yang asri. Sempurna untuk pernikahan grand dan intimate.",
    maxCapacity: 500,
    images: JSON.stringify([]),
    packages: {
      create: [
        {
          name: "Hermitage Intimate",
          pax: 100,
          price: BigInt(75000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Buffet 100 pax (6 jam)</li><li>Soft drinks & free-flow water</li><li>Welcome drink</li></ul><h3>🏨 Venue</h3><ul><li>Ballroom utama (6 jam)</li><li>Ruang ganti pengantin</li><li>Parkir 20 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi bunga standar</li><li>Sound system & microphone</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Intimate di The Hermitage",
        },
        {
          name: "Hermitage Grand",
          pax: 200,
          price: BigInt(135000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Buffet 200 pax (8 jam)</li><li>Welcome drink</li><li>Soft drinks & free-flow water</li></ul><h3>🏨 Venue</h3><ul><li>Ballroom utama (8 jam)</li><li>Ruang ganti pengantin</li><li>Parkir 40 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi bunga premium</li><li>Sound system & microphone</li><li>Lighting dasar</li></ul><h3>🎂 Bonus</h3><ul><li>Wedding cake 3 tier</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Grand di The Hermitage",
        },
        {
          name: "Hermitage Royale",
          pax: 300,
          price: BigInt(210000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Buffet 300 pax (10 jam)</li><li>Food station</li><li>Welcome drink</li><li>Soft drinks</li></ul><h3>🏨 Venue</h3><ul><li>Ballroom utama + pre-function area (10 jam)</li><li>Ruang ganti pengantin VIP</li><li>Parkir valet 60 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi bunga premium + pelaminan custom</li><li>Sound system & microphone</li><li>Lighting premium + dry ice</li></ul><h3>📸 Dokumentasi</h3><ul><li>Photo booth</li></ul><h3>🎂 Bonus</h3><ul><li>Wedding cake 5 tier</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Royale di The Hermitage",
        },
      ],
    },
  },
  {
    slug: "rumah-imam-bonjol",
    name: "Rumah Imam Bonjol",
    location: "Bandung",
    status: "published",
    description:
      "Bangunan heritage kolonial yang telah direstorasi dengan indah. Memadukan arsitektur klasik dengan sentuhan modern, menciptakan suasana romantis yang hangat di tengah udara sejuk Bandung.",
    maxCapacity: 300,
    images: JSON.stringify([]),
    packages: {
      create: [
        {
          name: "Bonjol Classic",
          pax: 100,
          price: BigInt(45000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Catering 100 pax (prasmanan)</li><li>Soft drinks</li></ul><h3>🏨 Venue</h3><ul><li>Ruang utama (6 jam)</li><li>Ruang ganti</li><li>Parkir 15 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi bunga lokal</li><li>Sound system standar</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Bonjol Classic di Rumah Imam Bonjol",
        },
        {
          name: "Bonjol Prestige",
          pax: 200,
          price: BigInt(85000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Catering 200 pax (prasmanan + welcome drink)</li><li>Soft drinks</li></ul><h3>🏨 Venue</h3><ul><li>Ruang utama + taman (8 jam)</li><li>Ruang ganti pengantin</li><li>Parkir 30 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi bunga premium</li><li>Lighting taman</li></ul><h3>🎵 Entertainment</h3><ul><li>Sound system + band akustik</li></ul><h3>🎂 Bonus</h3><ul><li>Wedding cake 2 tier</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Bonjol Prestige di Rumah Imam Bonjol",
        },
      ],
    },
  },
  {
    slug: "tirtha-bridal",
    name: "Tirtha Bridal",
    location: "Bali",
    status: "published",
    description:
      "Venue pernikahan ikonik di atas tebing dengan pemandangan Samudra Hindia. Kapel kaca yang memukau dan taman tropis yang terawat sempurna. Destinasi impian untuk wedding yang tak terlupakan.",
    maxCapacity: 400,
    images: JSON.stringify([]),
    packages: {
      create: [
        {
          name: "Tirtha Garden",
          pax: 150,
          price: BigInt(150000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Buffet internasional 150 pax (8 jam)</li><li>Welcome drink bar</li><li>Soft drinks</li></ul><h3>🏨 Venue</h3><ul><li>Garden terrace (8 jam)</li><li>Ruang ganti pengantin</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi tropis premium</li><li>Lighting taman</li></ul><h3>📸 Dokumentasi</h3><ul><li>Fotografer (4 jam)</li></ul><h3>🎵 Entertainment</h3><ul><li>Sound system + DJ</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Garden di Tirtha Bridal",
        },
        {
          name: "Tirtha Sunset",
          pax: 250,
          price: BigInt(250000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Buffet 250 pax (10 jam)</li><li>Live station</li><li>Welcome drink + signature cocktail bar</li></ul><h3>🏨 Venue</h3><ul><li>Garden terrace + cliff deck (10 jam)</li><li>Ruang ganti pengantin VIP</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi tropis premium + flower arch</li><li>Lighting taman + fairy lights</li></ul><h3>📸 Dokumentasi</h3><ul><li>Fotografer + videografer (8 jam)</li></ul><h3>🎵 Entertainment</h3><ul><li>Sound system + DJ + MC</li></ul><h3>🎆 Special</h3><ul><li>Fireworks (5 menit)</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Sunset di Tirtha Bridal",
        },
        {
          name: "Tirtha Ultimate",
          pax: 400,
          price: BigInt(400000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Buffet 400 pax (12 jam)</li><li>Live station + dessert bar</li><li>Welcome drink + premium open bar</li></ul><h3>🏨 Venue</h3><ul><li>Seluruh venue (12 jam)</li><li>Ruang ganti pengantin presidential</li><li>Transport shuttle tamu</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi tropis luxury + flower dome</li><li>Premium lighting + fireworks display</li></ul><h3>📸 Dokumentasi</h3><ul><li>Fotografer + videografer (12 jam)</li><li>Drone footage</li></ul><h3>🎵 Entertainment</h3><ul><li>Sound system + DJ + MC + live band</li></ul><h3>🤝 Layanan</h3><ul><li>Wedding planner dedicated</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Ultimate di Tirtha Bridal",
        },
      ],
    },
  },
  {
    slug: "sasana-budaya",
    name: "Gedung Sasana Budaya",
    location: "Yogyakarta",
    status: "published",
    description:
      "Gedung pertemuan megah bernuansa Jawa klasik di pusat kota Yogyakarta. Arsitektur joglo yang megah dengan sentuhan modern, menciptakan harmoni sempurna antara tradisi dan kemewahan.",
    maxCapacity: 600,
    images: JSON.stringify([]),
    packages: {
      create: [
        {
          name: "Sasana Adiluhung",
          pax: 200,
          price: BigInt(55000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Catering 200 pax (prasmanan Jawa)</li><li>Soft drinks</li></ul><h3>🏨 Venue</h3><ul><li>Pendopo utama (6 jam)</li><li>Ruang ganti</li><li>Parkir 30 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi tradisional</li></ul><h3>🎵 Entertainment</h3><ul><li>Sound system + gamelan</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Sasana Adiluhung di Gedung Sasana Budaya",
        },
        {
          name: "Sasana Agung",
          pax: 400,
          price: BigInt(110000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Catering 400 pax (prasmanan + live station)</li><li>Soft drinks</li></ul><h3>🏨 Venue</h3><ul><li>Pendopo utama + pendopo VIP (8 jam)</li><li>Ruang ganti pengantin VIP</li><li>Parkir valet 60 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi tradisional premium</li><li>Lighting panggung</li></ul><h3>🎵 Entertainment</h3><ul><li>Sound system + gamelan + MC</li></ul><h3>🎭 Tradisi</h3><ul><li>Tari penyambutan</li></ul><h3>🎂 Bonus</h3><ul><li>Wedding cake 3 tier</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Sasana Agung di Gedung Sasana Budaya",
        },
      ],
    },
  },
  {
    slug: "le-meridien",
    name: "Le Meridien",
    location: "Jakarta",
    status: "published",
    description:
      "Ballroom hotel bintang lima dengan akses langsung ke pusat bisnis Jakarta. Desain kontemporer yang sophisticated dengan teknologi terkini dan layanan bertaraf internasional.",
    maxCapacity: 350,
    images: JSON.stringify([]),
    packages: {
      create: [
        {
          name: "Meridien Classic",
          pax: 150,
          price: BigInt(95000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Buffet internasional 150 pax (8 jam)</li><li>Soft drinks</li></ul><h3>🏨 Venue</h3><ul><li>Ballroom (8 jam)</li><li>Ruang ganti pengantin</li><li>Parkir valet 30 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi bunga modern</li><li>Basic lighting</li></ul><h3>🎵 Entertainment</h3><ul><li>Sound system premium</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Meridien Classic di Le Meridien",
        },
        {
          name: "Meridien Prestige",
          pax: 300,
          price: BigInt(175000000),
          content:
            '<h3>🍴 Food & Beverages</h3><ul><li>Buffet 300 pax (10 jam)</li><li>Live station + dessert bar</li><li>Welcome drink bar</li></ul><h3>🏨 Venue</h3><ul><li>Grand Ballroom (10 jam)</li><li>Ruang ganti pengantin VIP</li><li>Parkir valet 50 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi bunga premium</li><li>Premium lighting + LED screen</li></ul><h3>📸 Dokumentasi</h3><ul><li>Photo booth + roaming photo</li></ul><h3>🎵 Entertainment</h3><ul><li>Sound system + DJ + MC</li></ul><h3>🎂 Bonus</h3><ul><li>Wedding cake 4 tier</li></ul>',
          bookingUrl:
            "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Meridien Prestige di Le Meridien",
        },
      ],
    },
  },
];

async function main() {
  console.log("Seeding database...");

  // Seed admin and editor users
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const editorPasswordHash = await bcrypt.hash("editor123", 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@solaproject.com" } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        id: Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        name: "Admin",
        email: "admin@solaproject.com",
        passwordHash: adminPasswordHash,
        role: "admin",
      },
    });
    console.log("Created admin user");
  }

  const existingEditor = await prisma.user.findUnique({ where: { email: "editor@solaproject.com" } });
  if (!existingEditor) {
    await prisma.user.create({
      data: {
        id: Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        name: "Editor",
        email: "editor@solaproject.com",
        passwordHash: editorPasswordHash,
        role: "editor",
      },
    });
    console.log("Created editor user");
  }

  // Create venues with packages
  for (const venueData of venues) {
    await prisma.venue.create({ data: venueData });
    console.log(`Created venue: ${venueData.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
