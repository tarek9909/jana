const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');
const { URL } = require('url');

const connectionString = process.env.DATABASE_URL || 'mysql://root:mysql@localhost:3306/jana_interior_designer';
const url = new URL(connectionString);
const poolConfig = {
  host: url.hostname || '127.0.0.1',
  port: parseInt(url.port || '3306', 10),
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'jana_interior_designer'),
  allowPublicKeyRetrieval: true,
  connectionLimit: 5,
};

const adapter = new PrismaMariaDb(poolConfig);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Seed Admin User
  const adminUsername = 'admin';
  const defaultPassword = 'adminpassword123';
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await prisma.admin.create({
      data: {
        username: adminUsername,
        password: hashedPassword
      }
    });
    console.log(`Seeded admin user: Username: "${adminUsername}", Password: "${defaultPassword}"`);
  } else {
    console.log('Admin user already exists.');
  }

  // 2. Seed default Site Settings
  const existingSettings = await prisma.siteSettings.findFirst({
    where: { id: 1 }
  });

  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        id: 1,
        siteName: "Studio Eliza Vance",
        heroTitle: "Curating Luxury Spaces",
        heroSubtitle: "Bespoke interior architecture and design for sophisticated homes. We blend timeless elegance with modern function.",
        aboutTitle: "Our Philosophy",
        aboutText: "We believe that interior design is not just about making spaces beautiful, but about curating environments that inspire and enrich daily life. Our work is defined by clean lines, rich natural textures, and a harmonious balance between light and form. Every project is a collaborative journey to translate our client's unique essence into a tangible, sophisticated environment.",
        contactEmail: "studio@elizavance.com",
        contactPhone: "+1 (555) 123-4567",
        contactAddress: "124 Elegant Way, Suite A, New York, NY 10001",
        primaryBeige: "#F4EFEA",
        primaryWhite: "#FAFAF9",
        primaryCharcoal: "#1C1B1A",
        primaryAccent: "#8B7E74",
        copyrightText: "© 2026 Studio Eliza Vance. All Rights Reserved.",
        heroTag: "Interior Architecture & Design",
        footerManifesto: "Curating architectural balance, rich natural textures, and bespoke modern environments.",
        portfolioDesc: "A gallery of luxury residential and commercial environments curated with spatial elegance.",
        servicesDesc: "From luxury residential designs to curated art programs, we guide you through space planning, selection, and placement.",
        contactDesc: "We design residential and commercial environments worldwide. Fill out our project form to tell us about your layout goals.",
        instagramUrl: "#",
        pinterestUrl: "#",
        linkedinUrl: "#"
      }
    });
    console.log('Seeded default site settings.');
  } else {
    console.log('Site settings already exist.');
  }

  // 3. Seed default Services
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    const services = [
      {
        title: "Residential Interior Design",
        description: "Full-service luxury residential design, including space planning, custom furniture curation, material selections, and project management from concept to completion.",
        icon: "Home",
        priceRange: "$$$"
      },
      {
        title: "Commercial & Boutique Spaces",
        description: "Elevated design solutions for modern retail, high-end offices, and hospitality settings that reflect brand identity and optimize guest experience.",
        icon: "Briefcase",
        priceRange: "$$$$"
      },
      {
        title: "Art Curation & Styling",
        description: "Assisting with the selection of fine art, antique sourcing, visual styling, and placement of decorative elements to give spaces a finished, custom feel.",
        icon: "Sparkles",
        priceRange: "$$"
      }
    ];

    for (const service of services) {
      await prisma.service.create({
        data: service
      });
    }
    console.log('Seeded default services.');
  } else {
    console.log('Services table already populated.');
  }

  // 4. Seed a default Project to show in the gallery
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    const defaultProject = await prisma.project.create({
      data: {
        title: "Chelsea Penthouse",
        slug: "chelsea-penthouse",
        description: "A luxury multi-level penthouse in Chelsea featuring high ceilings, warm plaster walls, bespoke marble details, and custom architectural metalwork. The project emphasizes negative space and minimal geometry, creating a serene urban sanctuary.",
        location: "Chelsea, NY",
        year: "2024",
        isFeatured: true,
        category: "Residential",
        coverImage: "/uploads/chelsea-penthouse-cover.jpg",
        images: {
          create: [
            { url: "/uploads/chelsea-penthouse-living.jpg" },
            { url: "/uploads/chelsea-penthouse-kitchen.jpg" }
          ]
        }
      }
    });
    console.log(`Seeded default project: ${defaultProject.title}`);
  } else {
    console.log('Projects table already populated.');
  }

  // 5. Seed some inquiries (leads) to show in the dashboard inbox
  const inquiryCount = await prisma.inquiry.count();
  if (inquiryCount === 0) {
    const defaultInquiries = [
      {
        name: "Sarah Jenkins",
        email: "sarah.j@example.com",
        phone: "+1 (555) 890-1234",
        message: "Hi Eliza, I recently bought a townhouse in Brooklyn and love your minimalist, texture-rich aesthetic. I would love to schedule a consultation to discuss redesigning our living room and master suite this autumn. Looking forward to hearing from you!",
        status: "UNREAD"
      },
      {
        name: "David Chen",
        email: "dchen@boutiquegroup.com",
        phone: "+1 (555) 456-7890",
        message: "Hello. We are opening a new boutique office in Soho and need full space planning and furniture curation for our reception and meeting rooms. We have a timeline of 3 months and would like to review some design directions with your studio.",
        status: "UNREAD"
      }
    ];

    for (const inquiry of defaultInquiries) {
      await prisma.inquiry.create({
        data: inquiry
      });
    }
    console.log('Seeded default inquiries.');
  } else {
    console.log('Inquiries table already populated.');
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
