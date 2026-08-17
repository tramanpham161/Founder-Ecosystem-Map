# UK Founder Ecosystem & Stage Map

An interactive directory, geospatial map, and venture milestone stage tracker for enterprise support organisations, incubators, accelerators, and investor readiness initiatives across all four UK nations (England, Scotland, Wales, and Northern Ireland).

---

## 🧭 Project Overview

The **OAHA UK Founder Ecosystem & Stage Map** provides founders, ecosystem leaders, and policymakers with a clear, structured view of available enterprise support programmes across the United Kingdom. It connects regional geography with founder stage milestones and community focus areas.

### 🎯 Key Capabilities

1. **5-Stage Milestone Distribution Scale**
   - **Stage 1 (Awareness & ideation):** Community workshops, hackathons, and early enterprise exploration.
   - **Stage 2 (Incubator):** Structured validation, co-working, and proof-of-concept development.
   - **Stage 3 (Accelerator):** Cohort-based scaling, commercial acceleration, and mentorship.
   - **Stage 4 (Investor readiness):** Pitch deck refinement, financial modeling, and syndicate preparation.
   - **Stage 5 (Early finance & VC access):** Seed grants, equity financing, and institutional venture capital rounds.
   - *Interactive scale*: Circle dimensions dynamically resize according to the volume of active organisations per stage, linked via a connected milestone pipeline.

2. **Interactive UK Geospatial Map**
   - High-precision SVG map with coordinate-accurate pins across the 4 UK nations.
   - Region boundaries for Scotland, Wales, Northern Ireland, and English regions.
   - Color-coded badges by sector and live hover/click selection synced with the detail pane.

3. **Multi-Criteria Filtering & Search**
   - **Location / Nation filter**: UK-Wide, England, Scotland, Wales, Northern Ireland.
   - **Founder Community Focus**: All founders, Black & Brown founders, Female & Non-binary founders, LGBTQ+ founders, Neurodivergent founders, Migrant & Refugee founders, Social enterprise founders, Youth / Student founders.
   - **Stage Filtering**: Click any stage circle to filter the directory and map pins instantly.
   - **Instant Search**: Real-time matching across organisation names, cities, sectors, directors, and active initiatives.

4. **Detailed Organisation Dossier**
   - Direct contact channels, verified website links, leadership contacts, and location data.
   - Active initiatives breakdown, current co-funding and partnership opportunities.
   - Direct interactive enquiry modal for ecosystem matchmaking.

5. **Full Directory Ledger & CSV Export**
   - High-contrast table with custom sorting by name, location, and supported stages.
   - Instant client-side CSV export generator downloading full ledger metadata.

---

## 🎨 Design & Visual Identity

The interface adheres strictly to the official OAHA color system:
- **Teal / Cyan:** `#25B4BE`
- **Leaf Green:** `#3FB049`
- **Warm Orange:** `#F79B1C`
- **Slate Grey:** `#8A9091`
- **Dark Slate Base:** `#1A2521`
- **Light Slate Canvas:** `#FBFBF9` and `#FFFFFF`

---

## 📊 Data & Demonstrator Notice

> **Note for GitHub users and developers:**
> All organisation profiles, director names, email addresses, active initiatives, and funding figures currently populated in `src/data/organisations.ts` are **synthetic sample data** designed for platform prototyping, layout testing, and milestone stage mapping. In future releases, validated ecosystem registries and direct partner intake forms can replace the sample data.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Design Archetype:** Clean, high-contrast typography, strict geometric spacing, and accessible contrast ratios.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/uk-founder-ecosystem-map.git

# Navigate to project root
cd uk-founder-ecosystem-map

# Install dependencies
npm install

# Start local development server (runs on http://localhost:3000)
npm run dev
```

### Production Build

```bash
# Compile and bundle for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── EcosystemMap.tsx       # Interactive UK SVG map with coordinates
│   │   ├── FilterBar.tsx          # Nation & founder demographic filters
│   │   ├── Header.tsx             # Main header with OAHA emblem & live count
│   │   ├── OahaLogo.tsx           # Official 4-color OAHA vector mark
│   │   ├── OrganisationDetail.tsx # Deep-dive profile & initiative panel
│   │   ├── OrganisationTable.tsx  # Standout ledger with multi-column sorting & CSV export
│   │   ├── SendMessageModal.tsx   # Direct enquiry dialog
│   │   └── StageScale.tsx         # Sized 5-stage venture pipeline
│   ├── data/
│   │   └── organisations.ts       # Sample ecosystem datasets & config
│   ├── types.ts                   # Core TypeScript interfaces
│   ├── App.tsx                    # Top-level state and orchestration
│   ├── main.tsx                   # React DOM entrypoint
│   └── index.css                  # Global Tailwind styles
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
