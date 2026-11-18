import type { Localized } from "./types";
import type { ProcessStepId } from "./process";

export type ServiceSlug =
  | "homogeneous-vinyl"
  | "vinyl-tiles-lvt"
  | "sports-flooring"
  | "gym-flooring"
  | "anti-static-esd"
  | "carpet";

export interface SpecRow {
  label: Localized;
  value: Localized;
  /** true while the value is a placeholder waiting for the real product data sheet */
  todo?: boolean;
}

export interface Service {
  slug: ServiceSlug;
  /** Key into the procedural texture generators in components/hero/textures.ts */
  texture: ServiceSlug;
  /** Colour of the 8 px "thickness edge" under each sample swatch */
  edge: string;
  name: Localized;
  /** One line under the swatch */
  use: Localized;
  /** One line on the hero spec card */
  spec: Localized;
  intro: Localized;
  overview: Localized[];
  applications: Localized[];
  specs: SpecRow[];
  steps: ProcessStepId[];
  faq: { q: Localized; a: Localized }[];
  /** Words used in the prefilled WhatsApp message */
  whatsappName: Localized;
}

const L = (en: string, ms: string): Localized => ({ en, ms });

const specLabels = {
  thickness: L("Total thickness", "Ketebalan keseluruhan"),
  wear: L("Wear layer", "Lapisan haus"),
  slip: L("Slip rating", "Penarafan gelincir"),
  fire: L("Fire rating", "Penarafan api"),
  warranty: L("Warranty", "Waranti"),
};

// TODO: replace every spec value marked `todo: true` with the figures from the product data sheet
export const services: Service[] = [
  {
    slug: "homogeneous-vinyl",
    texture: "homogeneous-vinyl",
    edge: "#8EA79E",
    name: L("Homogeneous vinyl", "Lantai vinil homogenus"),
    use: L("Hospitals and labs. Welded seams, coved skirting.", "Hospital dan makmal. Sambungan dikimpal, skirting cove."),
    spec: L("2.0 mm, colour through the full thickness", "2.0 mm, warna menembusi seluruh ketebalan"),
    whatsappName: L("homogeneous vinyl", "lantai vinil homogenus"),
    intro: L(
      "One solid layer of vinyl, the same colour all the way through. We hot-weld every seam and run it up the wall as coved skirting, so there is nowhere for dirt or bacteria to sit.",
      "Satu lapisan vinil padu dengan warna yang sama dari atas hingga bawah. Setiap sambungan kami kimpal panas dan kami naikkan ke dinding sebagai skirting cove, supaya tiada celah untuk kotoran atau bakteria.",
    ),
    overview: [
      L(
        "Homogeneous vinyl is the standard floor for wards, operating theatres, emergency departments, clinics and labs. Because the pattern runs through the full thickness, scuffs and wear don't show through to a different colour, and the floor can be buffed and resealed for years.",
        "Vinil homogenus ialah lantai standard untuk wad, dewan bedah, jabatan kecemasan, klinik dan makmal. Corak dan warnanya menembusi seluruh ketebalan, jadi calar dan haus tidak menampakkan warna lain, dan lantai boleh digilap dan dimeteri semula selama bertahun-tahun.",
      ),
      L(
        "The floor is only as flat as the slab under it. We test moisture, grind off old adhesive, and pour self-levelling screed before the first roll goes down. Then we groove each seam and weld it with a matching rod.",
        "Kerataan lantai bergantung pada slab di bawahnya. Kami uji kelembapan, kikis gam lama, dan tuang simen perata sendiri (self-levelling) sebelum gulungan pertama dipasang. Kemudian setiap sambungan kami alur dan kimpal dengan rod yang sepadan.",
      ),
    ],
    applications: [
      L("Wards, emergency departments and operating theatres", "Wad, jabatan kecemasan dan dewan bedah"),
      L("Clinics, dental surgeries and labs", "Klinik, klinik pergigian dan makmal"),
      L("School corridors and classrooms", "Koridor dan bilik darjah sekolah"),
      L("Food preparation and pharmacy areas", "Kawasan penyediaan makanan dan farmasi"),
    ],
    specs: [
      { label: specLabels.thickness, value: L("2.0 mm", "2.0 mm"), todo: true },
      { label: specLabels.wear, value: L("Full thickness (homogeneous)", "Seluruh ketebalan (homogenus)"), todo: true },
      { label: specLabels.slip, value: L("R9 / DIN 51130", "R9 / DIN 51130"), todo: true },
      { label: specLabels.fire, value: L("Bfl-s1 (EN 13501-1)", "Bfl-s1 (EN 13501-1)"), todo: true },
      { label: specLabels.warranty, value: L("10 years manufacturer, 1 year workmanship", "10 tahun pengeluar, 1 tahun mutu kerja"), todo: true },
    ],
    steps: ["survey", "moisture", "grinding", "levelling", "adhesive", "laying", "welding", "cove", "handover"],
    faq: [
      {
        q: L("Can you work while the ward or department stays open?", "Bolehkah kerja dibuat semasa wad atau jabatan masih beroperasi?"),
        a: L(
          "Yes. We split the area into zones, close off one at a time with dust screens, and hand each zone back before moving on. That is how we replaced the floor in the emergency department at Hospital Jempol.",
          "Boleh. Kami bahagikan kawasan kepada zon, tutup satu zon pada satu masa dengan penghadang habuk, dan serahkan semula setiap zon sebelum beralih ke zon seterusnya. Begitulah cara kami menukar lantai di Jabatan Kecemasan Hospital Jempol.",
        ),
      },
      {
        q: L("Why weld the seams?", "Kenapa sambungan perlu dikimpal?"),
        a: L(
          "A welded seam is sealed, so water, cleaning chemicals and bacteria can't get under the vinyl. A butt joint without a weld opens up over time and starts to collect dirt.",
          "Sambungan yang dikimpal adalah kedap, jadi air, bahan kimia pembersih dan bakteria tidak boleh masuk ke bawah vinil. Sambungan biasa tanpa kimpalan akan terbuka lama-kelamaan dan mula mengumpul kotoran.",
        ),
      },
      {
        q: L("How dry does the slab need to be?", "Sekering mana slab perlu sebelum dipasang?"),
        a: L(
          "We check it with a moisture meter before we quote the prep. If readings are high we use a moisture-tolerant primer or wait for the slab to dry, rather than risk the adhesive failing later.",
          "Kami periksa dengan meter kelembapan sebelum memberi sebut harga kerja penyediaan. Jika bacaan tinggi, kami guna primer tahan lembap atau tunggu slab kering, daripada mengambil risiko gam gagal kemudian.",
        ),
      },
      {
        q: L("What is coved skirting?", "Apakah skirting cove?"),
        a: L(
          "We bend the vinyl up the wall over a cove former, usually 100 to 150 mm high, so the floor and wall meet in a curve instead of a corner. It is easier to clean and is what most hospital specs ask for.",
          "Kami lenturkan vinil naik ke dinding di atas cove former, biasanya setinggi 100 hingga 150 mm, supaya lantai dan dinding bertemu dalam bentuk lengkung, bukan bucu. Lebih mudah dibersihkan dan memang dikehendaki oleh kebanyakan spesifikasi hospital.",
        ),
      },
    ],
  },
  {
    slug: "vinyl-tiles-lvt",
    texture: "vinyl-tiles-lvt",
    edge: "#8C6A48",
    name: L("Vinyl tiles (LVT)", "Jubin vinil (LVT)"),
    use: L("Offices, shops and homes. Wood and stone looks.", "Pejabat, kedai dan rumah. Rupa kayu dan batu."),
    spec: L("2.5 mm, 0.55 mm wear layer", "2.5 mm, lapisan haus 0.55 mm"),
    whatsappName: L("vinyl tiles (LVT)", "jubin vinil (LVT)"),
    intro: L(
      "Planks and tiles with a printed wood or stone look under a clear wear layer. Quiet underfoot, easy to replace one plank at a time, and quick to lay.",
      "Papan dan jubin dengan corak kayu atau batu bercetak di bawah lapisan haus yang jernih. Senyap apabila dipijak, mudah ditukar satu keping demi satu keping, dan cepat dipasang.",
    ),
    overview: [
      L(
        "Luxury vinyl tile (LVT) gives you the look of timber or stone without the upkeep. We lay glue-down LVT for commercial spaces, where it stays put under office chairs and trolleys, and click LVT where a floating floor makes more sense.",
        "Jubin vinil mewah (LVT) memberi rupa kayu atau batu tanpa penjagaan yang rumit. Kami pasang LVT jenis gam untuk ruang komersial, supaya ia kekal di tempatnya walaupun dilalui kerusi pejabat dan troli, dan LVT jenis klik apabila lantai terapung lebih sesuai.",
      ),
      L(
        "Thin tiles show every bump in the slab, so we skim and level first. Then we set out from the centre of the room so the cut planks at the walls come out even.",
        "Jubin yang nipis akan menampakkan setiap bonggol pada slab, jadi kami ratakan dahulu. Kemudian kami mula menyusun dari tengah bilik supaya kepingan yang dipotong di tepi dinding sama saiz.",
      ),
    ],
    applications: [
      L("Offices and meeting rooms", "Pejabat dan bilik mesyuarat"),
      L("Retail and showrooms", "Kedai runcit dan bilik pameran"),
      L("Homes and condominiums", "Rumah dan kondominium"),
      L("Hotels and serviced apartments", "Hotel dan pangsapuri servis"),
    ],
    specs: [
      { label: specLabels.thickness, value: L("2.5 mm (glue-down), 5 mm (click)", "2.5 mm (gam), 5 mm (klik)"), todo: true },
      { label: specLabels.wear, value: L("0.55 mm", "0.55 mm"), todo: true },
      { label: specLabels.slip, value: L("R10", "R10"), todo: true },
      { label: specLabels.fire, value: L("Bfl-s1 (EN 13501-1)", "Bfl-s1 (EN 13501-1)"), todo: true },
      { label: specLabels.warranty, value: L("15 years commercial, 1 year workmanship", "15 tahun komersial, 1 tahun mutu kerja"), todo: true },
    ],
    steps: ["survey", "moisture", "grinding", "levelling", "adhesive", "laying", "handover"],
    faq: [
      {
        q: L("Can LVT go over my existing tiles?", "Bolehkah LVT dipasang di atas jubin sedia ada?"),
        a: L(
          "Often, yes, if the old tiles are sound and flat. We fill the grout lines with a levelling compound so they don't show through. Loose or hollow tiles have to come up first.",
          "Selalunya boleh, jika jubin lama masih kukuh dan rata. Kami isi garisan grout dengan bahan perata supaya tidak terkesan di permukaan. Jubin yang longgar atau kopong perlu dibuang dahulu.",
        ),
      },
      {
        q: L("Glue-down or click?", "Jenis gam atau klik?"),
        a: L(
          "Glue-down for offices, shops and anywhere with rolling loads. Click for homes where you may want to lift it later. We'll recommend one after the site survey.",
          "Jenis gam untuk pejabat, kedai dan tempat yang dilalui beban beroda. Jenis klik untuk rumah jika anda mungkin mahu menanggalkannya kelak. Kami akan cadangkan selepas tinjauan tapak.",
        ),
      },
      {
        q: L("How long does it take?", "Berapa lama masa pemasangan?"),
        a: L(
          "A typical 100 m² office takes two to three days including prep, provided the slab is dry.",
          "Pejabat biasa seluas 100 m² mengambil masa dua hingga tiga hari termasuk kerja penyediaan, dengan syarat slab sudah kering.",
        ),
      },
    ],
  },
  {
    slug: "sports-flooring",
    texture: "sports-flooring",
    edge: "#B78F5E",
    name: L("Sports flooring", "Lantai sukan"),
    use: L("Badminton, futsal and multipurpose halls.", "Gelanggang badminton, futsal dan dewan serbaguna."),
    spec: L("4.5 mm, cushioned backing, court lines marked", "4.5 mm, lapik berkusyen, garisan gelanggang ditanda"),
    whatsappName: L("sports vinyl flooring", "lantai vinil sukan"),
    intro: L(
      "Cushioned vinyl that takes the shock out of every landing, with a surface that grips without burning. We lay it, weld it and paint the court lines.",
      "Vinil berkusyen yang menyerap hentakan setiap kali mendarat, dengan permukaan yang mencengkam tanpa melecetkan. Kami pasang, kimpal dan cat garisan gelanggang.",
    ),
    overview: [
      L(
        "Sports vinyl has a foam backing under a textured wear layer. It is the usual floor for indoor badminton and futsal courts, school halls and multipurpose rooms that host assemblies one day and games the next.",
        "Vinil sukan mempunyai lapik busa di bawah lapisan haus bertekstur. Ia lantai biasa untuk gelanggang badminton dan futsal dalaman, dewan sekolah dan bilik serbaguna yang digunakan untuk perhimpunan pada satu hari dan permainan pada hari berikutnya.",
      ),
      L(
        "Players notice any dip in a court, so the slab is levelled first. Rolls are laid across the court, welded, and marked to the governing body's dimensions.",
        "Pemain akan perasan jika ada lekuk di gelanggang, jadi slab diratakan dahulu. Gulungan dipasang merentasi gelanggang, dikimpal, dan ditanda mengikut ukuran badan induk sukan.",
      ),
    ],
    applications: [
      L("Badminton and futsal courts", "Gelanggang badminton dan futsal"),
      L("School and community halls", "Dewan sekolah dan dewan komuniti"),
      L("Multipurpose rooms and dance studios", "Bilik serbaguna dan studio tarian"),
      L("Table tennis and volleyball halls", "Dewan pingpong dan bola tampar"),
    ],
    specs: [
      { label: specLabels.thickness, value: L("4.5 to 6.0 mm", "4.5 hingga 6.0 mm"), todo: true },
      { label: specLabels.wear, value: L("0.7 mm, textured", "0.7 mm, bertekstur"), todo: true },
      { label: specLabels.slip, value: L("EN 13036-4, 80 to 110", "EN 13036-4, 80 hingga 110"), todo: true },
      { label: specLabels.fire, value: L("Cfl-s1 (EN 13501-1)", "Cfl-s1 (EN 13501-1)"), todo: true },
      { label: specLabels.warranty, value: L("5 years manufacturer, 1 year workmanship", "5 tahun pengeluar, 1 tahun mutu kerja"), todo: true },
    ],
    steps: ["survey", "moisture", "grinding", "levelling", "adhesive", "laying", "welding", "handover"],
    faq: [
      {
        q: L("Do you mark the court lines?", "Adakah anda menanda garisan gelanggang?"),
        a: L(
          "Yes. We mark and paint badminton, futsal, volleyball or basketball lines with polyurethane line paint, in the colours you choose.",
          "Ya. Kami tanda dan cat garisan badminton, futsal, bola tampar atau bola keranjang dengan cat garisan poliuretana, mengikut warna pilihan anda.",
        ),
      },
      {
        q: L("Can it go on an existing timber or tiled floor?", "Bolehkah ia dipasang di atas lantai kayu atau jubin sedia ada?"),
        a: L(
          "Usually it is laid on concrete. Over tiles it can work if they are well bonded. Over old timber we normally lift it first, as it moves too much.",
          "Biasanya ia dipasang di atas konkrit. Di atas jubin ia boleh jika jubin melekat kukuh. Di atas kayu lama biasanya kami tanggalkan kayu dahulu kerana ia terlalu banyak bergerak.",
        ),
      },
    ],
  },
  {
    slug: "gym-flooring",
    texture: "gym-flooring",
    edge: "#111414",
    name: L("Gym flooring", "Lantai gimnasium"),
    use: L("Rubber tiles and rolls for weights areas.", "Jubin dan gulungan getah untuk kawasan angkat berat."),
    spec: L("15 mm rubber tile, EPDM fleck", "Jubin getah 15 mm, bintik EPDM"),
    whatsappName: L("gym flooring", "lantai gimnasium"),
    intro: L(
      "Dense rubber that protects the slab when a barbell drops, and protects the people training on it. Tiles for weights areas, rolls for cardio and functional zones.",
      "Getah padat yang melindungi slab apabila barbel jatuh, dan melindungi orang yang berlatih di atasnya. Jubin untuk kawasan angkat berat, gulungan untuk zon kardio dan latihan fungsian.",
    ),
    overview: [
      L(
        "We lay recycled rubber tiles and rolls with a coloured EPDM fleck. Thicker tiles go under free weights and racks; thinner rolls go under treadmills and in studios.",
        "Kami pasang jubin dan gulungan getah kitar semula dengan bintik EPDM berwarna. Jubin yang lebih tebal diletakkan di bawah pemberat bebas dan rak; gulungan yang lebih nipis di bawah treadmill dan di studio.",
      ),
      L(
        "Rubber is heavy and needs a flat, clean base. We bond it with polyurethane adhesive so the joints stay tight even under heavy use.",
        "Getah berat dan perlukan tapak yang rata dan bersih. Kami lekatkan dengan gam poliuretana supaya sambungan kekal rapat walaupun digunakan dengan kuat.",
      ),
    ],
    applications: [
      L("Commercial and hotel gyms", "Gimnasium komersial dan hotel"),
      L("Free weights and lifting platforms", "Kawasan pemberat bebas dan platform angkat"),
      L("Condo and corporate fitness rooms", "Bilik kecergasan kondominium dan korporat"),
      L("School and university sports centres", "Pusat sukan sekolah dan universiti"),
    ],
    specs: [
      { label: specLabels.thickness, value: L("6 mm rolls, 15 to 30 mm tiles", "Gulungan 6 mm, jubin 15 hingga 30 mm"), todo: true },
      { label: specLabels.wear, value: L("Solid rubber, EPDM fleck through", "Getah padu, bintik EPDM menembusi"), todo: true },
      { label: specLabels.slip, value: L("R10", "R10"), todo: true },
      { label: specLabels.fire, value: L("Efl (EN 13501-1)", "Efl (EN 13501-1)"), todo: true },
      { label: specLabels.warranty, value: L("5 years manufacturer, 1 year workmanship", "5 tahun pengeluar, 1 tahun mutu kerja"), todo: true },
    ],
    steps: ["survey", "moisture", "grinding", "levelling", "adhesive", "laying", "handover"],
    faq: [
      {
        q: L("How thick should the tiles be for a weights area?", "Berapa tebal jubin untuk kawasan angkat berat?"),
        a: L(
          "For dumbbells and general weights, 15 to 20 mm. For deadlifts and dropped barbells, 30 mm or a dedicated lifting platform.",
          "Untuk dumbbell dan pemberat biasa, 15 hingga 20 mm. Untuk deadlift dan barbel yang dijatuhkan, 30 mm atau platform angkat khas.",
        ),
      },
      {
        q: L("Does rubber flooring smell?", "Adakah lantai getah berbau?"),
        a: L(
          "New recycled rubber has some smell for the first few weeks. Good ventilation clears it. We can also supply low-odour grades.",
          "Getah kitar semula yang baharu ada sedikit bau untuk beberapa minggu pertama. Pengudaraan yang baik akan menghilangkannya. Kami juga boleh membekalkan gred berbau rendah.",
        ),
      },
    ],
  },
  {
    slug: "anti-static-esd",
    texture: "anti-static-esd",
    edge: "#A9AFAC",
    name: L("Anti-static (ESD)", "Anti-statik (ESD)"),
    use: L("Server rooms and electronics, with a copper earthing grid.", "Bilik server dan elektronik, dengan grid pembumian kuprum."),
    spec: L("2.0 mm conductive vinyl on a copper grid", "Vinil konduktif 2.0 mm di atas grid kuprum"),
    whatsappName: L("anti-static (ESD) flooring", "lantai anti-statik (ESD)"),
    intro: L(
      "Conductive vinyl laid over a copper tape grid and bonded to earth, so static is carried away before it can reach a circuit board.",
      "Vinil konduktif dipasang di atas grid pita kuprum dan disambung ke bumi, supaya cas statik disalurkan keluar sebelum sempat sampai ke papan litar.",
    ),
    overview: [
      L(
        "An ESD floor only works if every part of it is connected. We lay copper tape in a grid under the vinyl, use conductive adhesive, weld the seams with conductive rod, and connect the grid to the building's earth point.",
        "Lantai ESD hanya berfungsi jika setiap bahagiannya bersambung. Kami pasang pita kuprum dalam bentuk grid di bawah vinil, guna gam konduktif, kimpal sambungan dengan rod konduktif, dan sambungkan grid ke titik bumi bangunan.",
      ),
      L(
        "When the floor is down we test the resistance at points across the room and give you the readings in the handover report.",
        "Selepas lantai siap, kami uji rintangan di beberapa titik di seluruh bilik dan sertakan bacaannya dalam laporan serahan.",
      ),
    ],
    applications: [
      L("Data centres and server rooms", "Pusat data dan bilik server"),
      L("Electronics assembly and repair", "Pemasangan dan pembaikan elektronik"),
      L("Cleanrooms and labs", "Bilik bersih dan makmal"),
      L("Control rooms and telecom rooms", "Bilik kawalan dan bilik telekom"),
    ],
    specs: [
      { label: specLabels.thickness, value: L("2.0 mm", "2.0 mm"), todo: true },
      { label: specLabels.wear, value: L("Full thickness (homogeneous)", "Seluruh ketebalan (homogenus)"), todo: true },
      { label: specLabels.slip, value: L("R9", "R9"), todo: true },
      { label: specLabels.fire, value: L("Bfl-s1 (EN 13501-1)", "Bfl-s1 (EN 13501-1)"), todo: true },
      { label: { en: "Resistance", ms: "Rintangan" }, value: L("2.5 × 10⁴ to 10⁶ Ω (IEC 61340)", "2.5 × 10⁴ hingga 10⁶ Ω (IEC 61340)"), todo: true },
      { label: specLabels.warranty, value: L("10 years manufacturer, 1 year workmanship", "10 tahun pengeluar, 1 tahun mutu kerja"), todo: true },
    ],
    steps: ["survey", "moisture", "grinding", "levelling", "adhesive", "laying", "welding", "handover"],
    faq: [
      {
        q: L("Can ESD vinyl go on a raised floor?", "Bolehkah vinil ESD dipasang di atas lantai bertingkat (raised floor)?"),
        a: L(
          "Yes. On raised-floor panels we bond the vinyl to each panel and earth the pedestals. On a solid slab we use the copper grid.",
          "Boleh. Untuk panel lantai bertingkat, kami lekatkan vinil pada setiap panel dan bumikan kaki penyokongnya. Untuk slab padu, kami guna grid kuprum.",
        ),
      },
      {
        q: L("Do you test the floor after installing?", "Adakah lantai diuji selepas dipasang?"),
        a: L(
          "Yes. We measure point-to-point and point-to-ground resistance and include the readings in the handover report.",
          "Ya. Kami ukur rintangan titik-ke-titik dan titik-ke-bumi, dan sertakan bacaannya dalam laporan serahan.",
        ),
      },
    ],
  },
  {
    slug: "carpet",
    texture: "carpet",
    edge: "#3E4746",
    name: L("Carpet", "Permaidani"),
    use: L("Offices, hotels and prayer halls.", "Pejabat, hotel dan surau."),
    spec: L("Loop-pile carpet tile, 50 × 50 cm", "Jubin permaidani gelung, 50 × 50 cm"),
    whatsappName: L("carpet", "permaidani"),
    intro: L(
      "Carpet tiles and broadloom for rooms that need to be quiet and warm underfoot. Tiles for offices, broadloom for hotels, prayer halls and function rooms.",
      "Jubin permaidani dan permaidani lebar (broadloom) untuk ruang yang perlu senyap dan selesa dipijak. Jubin untuk pejabat, broadloom untuk hotel, surau dan dewan majlis.",
    ),
    overview: [
      L(
        "Carpet tiles let you replace a stained patch instead of a whole room, and they lift for access to floor boxes. Broadloom gives a seamless finish for large rooms and prayer halls with saf lines.",
        "Jubin permaidani membolehkan anda menukar bahagian yang kotor sahaja, bukan seluruh bilik, dan boleh diangkat untuk akses ke kotak lantai. Broadloom memberi kemasan tanpa sambungan untuk bilik besar dan surau dengan garisan saf.",
      ),
      L(
        "We set out the tiles so the pattern runs true across the room, and use tackifier so they stay down but can still be lifted.",
        "Kami susun jubin supaya coraknya lurus di seluruh bilik, dan guna gam tackifier supaya jubin kekal di tempatnya tetapi masih boleh diangkat.",
      ),
    ],
    applications: [
      L("Open-plan offices", "Pejabat pelan terbuka"),
      L("Hotel rooms and corridors", "Bilik dan koridor hotel"),
      L("Prayer halls and surau", "Dewan solat dan surau"),
      L("Auditoriums and function rooms", "Auditorium dan dewan majlis"),
    ],
    specs: [
      { label: specLabels.thickness, value: L("6 to 8 mm", "6 hingga 8 mm"), todo: true },
      { label: { en: "Pile", ms: "Bulu" }, value: L("Loop pile, solution-dyed nylon", "Bulu gelung, nilon dicelup larutan"), todo: true },
      { label: specLabels.slip, value: L("Not applicable", "Tidak berkaitan"), todo: true },
      { label: specLabels.fire, value: L("Bfl-s1 (EN 13501-1)", "Bfl-s1 (EN 13501-1)"), todo: true },
      { label: specLabels.warranty, value: L("10 years wear, 1 year workmanship", "10 tahun haus, 1 tahun mutu kerja"), todo: true },
    ],
    steps: ["survey", "moisture", "grinding", "levelling", "adhesive", "laying", "handover"],
    faq: [
      {
        q: L("Can you lay saf lines for a prayer hall?", "Bolehkah anda pasang garisan saf untuk surau?"),
        a: L(
          "Yes. We set out the saf lines square to the qibla direction you give us, using broadloom with woven lines or contrasting tiles.",
          "Boleh. Kami susun garisan saf tepat mengikut arah kiblat yang anda berikan, menggunakan broadloom bergaris atau jubin berwarna kontras.",
        ),
      },
      {
        q: L("Tiles or broadloom?", "Jubin atau broadloom?"),
        a: L(
          "Tiles for offices and anywhere with floor boxes or heavy wear. Broadloom for hotels, prayer halls and rooms where you want one seamless surface.",
          "Jubin untuk pejabat dan tempat yang ada kotak lantai atau laluan yang sibuk. Broadloom untuk hotel, surau dan bilik yang memerlukan satu permukaan tanpa sambungan.",
        ),
      },
    ],
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
