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
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Hermitage Intimate",
          pax: 100,
          price: BigInt(75000000),
          features: JSON.stringify([
            "Ballroom utama (6 jam)",
            "Catering 100 pax (buffet)",
            "Dekorasi bunga standar",
            "Sound system & microphone",
            "Ruang ganti pengantin",
            "Parkir 20 mobil",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Intimate di The Hermitage",
        },
        {
          name: "Hermitage Grand",
          pax: 200,
          price: BigInt(135000000),
          features: JSON.stringify([
            "Ballroom utama (8 jam)",
            "Catering 200 pax (buffet + welcome drink)",
            "Dekorasi bunga premium",
            "Sound system & microphone",
            "Lighting dasar",
            "Ruang ganti pengantin",
            "Parkir 40 mobil",
            "Wedding cake 3 tier",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Grand di The Hermitage",
        },
        {
          name: "Hermitage Royale",
          pax: 300,
          price: BigInt(210000000),
          features: JSON.stringify([
            "Ballroom utama + pre-function area (10 jam)",
            "Catering 300 pax (buffet + food station + welcome drink)",
            "Dekorasi bunga premium + pelaminan custom",
            "Sound system & microphone",
            "Lighting premium + dry ice",
            "Ruang ganti pengantin VIP",
            "Parkir valet 60 mobil",
            "Wedding cake 5 tier",
            "Photo booth",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Royale di The Hermitage",
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
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Bonjol Classic",
          pax: 100,
          price: BigInt(45000000),
          features: JSON.stringify([
            "Ruang utama (6 jam)",
            "Catering 100 pax (prasmanan)",
            "Dekorasi bunga lokal",
            "Sound system standar",
            "Ruang ganti",
            "Parkir 15 mobil",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Bonjol Classic di Rumah Imam Bonjol",
        },
        {
          name: "Bonjol Prestige",
          pax: 200,
          price: BigInt(85000000),
          features: JSON.stringify([
            "Ruang utama + taman (8 jam)",
            "Catering 200 pax (prasmanan + welcome drink)",
            "Dekorasi bunga premium",
            "Sound system + band akustik",
            "Lighting taman",
            "Ruang ganti pengantin",
            "Parkir 30 mobil",
            "Wedding cake 2 tier",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Bonjol Prestige di Rumah Imam Bonjol",
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
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=800",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Tirtha Garden",
          pax: 150,
          price: BigInt(150000000),
          features: JSON.stringify([
            "Garden terrace (8 jam)",
            "Catering 150 pax (buffet internasional)",
            "Dekorasi tropis premium",
            "Sound system + DJ",
            "Lighting taman",
            "Ruang ganti pengantin",
            "Welcome drink bar",
            "Fotografer (4 jam)",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Garden di Tirtha Bridal",
        },
        {
          name: "Tirtha Sunset",
          pax: 250,
          price: BigInt(250000000),
          features: JSON.stringify([
            "Garden terrace + cliff deck (10 jam)",
            "Catering 250 pax (buffet + live station)",
            "Dekorasi tropis premium + flower arch",
            "Sound system + DJ + MC",
            "Lighting taman + fairy lights",
            "Ruang ganti pengantin VIP",
            "Welcome drink + signature cocktail bar",
            "Fotografer + videografer (8 jam)",
            "Fireworks (5 menit)",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Sunset di Tirtha Bridal",
        },
        {
          name: "Tirtha Ultimate",
          pax: 400,
          price: BigInt(400000000),
          features: JSON.stringify([
            "Seluruh venue (12 jam)",
            "Catering 400 pax (buffet + live station + dessert bar)",
            "Dekorasi tropis luxury + flower dome",
            "Sound system + DJ + MC + live band",
            "Premium lighting + fireworks display",
            "Ruang ganti pengantin presidential",
            "Welcome drink + premium open bar",
            "Fotografer + videografer (12 jam)",
            "Drone footage",
            "Wedding planner dedicated",
            "Transport shuttle tamu",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Ultimate di Tirtha Bridal",
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
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      "https://images.unsplash.com/photo-1478146059778-acee06e6a1f1?w=800",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Sasana Adiluhung",
          pax: 200,
          price: BigInt(55000000),
          features: JSON.stringify([
            "Pendopo utama (6 jam)",
            "Catering 200 pax (prasmanan Jawa)",
            "Dekorasi tradisional",
            "Sound system + gamelan",
            "Ruang ganti",
            "Parkir 30 mobil",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Sasana Adiluhung di Gedung Sasana Budaya",
        },
        {
          name: "Sasana Agung",
          pax: 400,
          price: BigInt(110000000),
          features: JSON.stringify([
            "Pendopo utama + pendopo VIP (8 jam)",
            "Catering 400 pax (prasmanan + live station)",
            "Dekorasi tradisional premium",
            "Sound system + gamelan + MC",
            "Lighting panggung",
            "Ruang ganti pengantin VIP",
            "Parkir valet 60 mobil",
            "Wedding cake 3 tier",
            "Tari penyambutan",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Sasana Agung di Gedung Sasana Budaya",
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
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
      "https://images.unsplash.com/photo-1574695141973-1a48c5783ed6?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Meridien Classic",
          pax: 150,
          price: BigInt(95000000),
          features: JSON.stringify([
            "Ballroom (8 jam)",
            "Catering 150 pax (buffet internasional)",
            "Dekorasi bunga modern",
            "Sound system premium",
            "Basic lighting",
            "Ruang ganti pengantin",
            "Parkir valet 30 mobil",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Meridien Classic di Le Meridien",
        },
        {
          name: "Meridien Prestige",
          pax: 300,
          price: BigInt(175000000),
          features: JSON.stringify([
            "Grand Ballroom (10 jam)",
            "Catering 300 pax (buffet + live station + dessert bar)",
            "Dekorasi bunga premium",
            "Sound system + DJ + MC",
            "Premium lighting + LED screen",
            "Ruang ganti pengantin VIP",
            "Parkir valet 50 mobil",
            "Wedding cake 4 tier",
            "Photo booth + roaming photo",
            "Welcome drink bar",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Meridien Prestige di Le Meridien",
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

  // Delete existing data in correct order (packages first due to FK)
  await prisma.$executeRaw`DELETE FROM \`Package\``;
  await prisma.$executeRaw`DELETE FROM \`Venue\``;

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
