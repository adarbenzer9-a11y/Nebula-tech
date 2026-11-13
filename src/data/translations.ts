export type Language = 'tr' | 'en';

export interface UITranslations {
  docTitle: string;
  brand: string;
  nav: {
    map: string;
    studio: string;
    catalog: string;
    timeline: string;
  };
  startStory: string;
  switchLangLabel: string;
  switchLangAria: string;
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
    stats: {
      scopeLabel: string;
      scopeValue: string;
      scopeDesc: string;
      inventoryLabel: string;
      inventoryValue: string;
      inventoryDesc: string;
      spanLabel: string;
      spanValue: string;
      spanDesc: string;
      distanceLabel: string;
      distanceValue: string;
      distanceDesc: string;
    };
  };
  map: {
    kicker: string;
    title: string;
    desc: string;
    moonTab: string;
    marsTab: string;
    moonProjection: string;
    marsProjection: string;
    moonDistance: string;
    marsDistance: string;
    chapterPrefix: string;
    yearsSilentSuffix: string;
    sinceText: (date: string, years: number) => string;
    coordsLabel: string;
    tempLabel: string;
    delayLabel: string;
    statusLabel: string;
    cta: string;
  };
  workshop: {
    kicker: string;
    chapterOf: string;
    finalTxTitle: string;
    accessionTitle: string;
    siteLabel: string;
    abandonedLabel: string;
    massLabel: string;
    dimensionsLabel: string;
    statusNoteLabel: string;
    modelTitle: string;
    modelDesc3d: string;
    modelDesc2d: string;
    tab3d: string;
    tab2d: string;
    prevPrefix: string;
    nextPrefix: string;
  };
  viewer3d: {
    presets: {
      hero: string;
      front: string;
      top: string;
      detail: string;
    };
    sceneTag: string;
    dragHint: string;
    hideControls: string;
    showControls: string;
    explodeLabel: string;
    dustyLabel: string;
    autoOrbit: string;
    resetAria: string;
    resetTitle: string;
    webglFallback: string;
  };
  blueprint2d: {
    modeBlueprint: string;
    modeXray: string;
    modeWeathering: string;
    grid: string;
    zoomOutAria: string;
    zoomInAria: string;
    resetAria: string;
    orthographicTag: string;
    xrayTag: string;
    weatheringTag: string;
    timeSliderLabel: string;
    selectedYearLabel: (year: number, delta: number) => string;
    xrayNoteLabel: string;
    ascentDeparted: string;
    fuelLabel: string;
    oxidizerLabel: string;
    lrvBatteries: string;
    takenByApollo12: string;
    vikingInternal: string;
    sojournerInternal: string;
    oppInternal: string;
  };
  photo: {
    fiducials: string;
    enlarge: string;
    enlargeAria: string;
    closeAria: string;
    loadError: string;
  };
  catalog: {
    kicker: string;
    title: string;
    desc: string;
    allTab: string;
    moonTab: string;
    marsTab: string;
    allStatuses: string;
    emptyTitle: string;
    emptyDesc: string;
    resetFilters: string;
    yearsSilentUnit: string;
    currentlyInspecting: string;
    openStory: string;
  };
  timeline: {
    kicker: string;
    title: string;
    desc: string;
    lastContact: string;
    goToChapter: string;
  };
  footer: {
    subtitle: string;
    top: string;
    map: string;
    studio: string;
    catalog: string;
    timeline: string;
  };
  statusMap: Record<'Sessiz' | 'Yansıtıcı Aktif' | 'Toz Altında', string>;
}

export const TRANSLATIONS: Record<Language, UITranslations> = {
  tr: {
    docTitle: "Terk Edilmiş Ama Unutulmamış — Ay ve Mars'taki NASA Kalıntıları",
    brand: 'Sessiz Kalıntılar',
    nav: {
      map: 'Keşif Haritası',
      studio: '2D & 3D Atölye',
      catalog: 'Arşiv Koleksiyonu',
      timeline: 'Kronoloji',
    },
    startStory: 'Hikayeyi Başlat',
    switchLangLabel: 'English',
    switchLangAria: 'Dili İngilizceye çevir',
    hero: {
      kicker: 'Kozmik Arkeoloji Sergisi · Ay ve Mars (1967 – 2026)',
      title: 'Terk Edilmiş Ama Unutulmamış',
      subtitle:
        'İnsanlık Ay’a ayak bastıktan ve Mars’a tekerlek izleri bıraktıktan sonra eve döndü; ancak makinelerimiz orada kaldı. Rüzgarsız kraterlerde ve kızıl toz fırtınalarının altında uyuyan altı tarihi NASA mirasının hikayesini, arşiv fotoğraflarını, 2D çizimlerini ve etkileşimli 3D modellerini keşfedin.',
      cta: 'Keşfe Başla',
      stats: {
        scopeLabel: 'KEŞİF ALANI',
        scopeValue: '2 Gök Cismi',
        scopeDesc: 'Ay (Luna) ve Mars yüzeyi',
        inventoryLabel: 'ARŞİV ENVANTERİ',
        inventoryValue: '6 Tarihi Kalıntı',
        inventoryDesc: '2D, 3D modeller ve fotoğraflar',
        spanLabel: 'ZAMAN ARALIĞI',
        spanValue: '1967 – 2018',
        spanDesc: '59 yıla uzanan sessiz miras',
        distanceLabel: 'UZAKLIK ÖLÇEĞİ',
        distanceValue: '384 bin – 225M km',
        distanceDesc: 'Dünya’dan tek yön ışık mesafesi',
      },
    },
    map: {
      kicker: '01 · Selenografik & Areografik Harita',
      title: 'Sessizliğin Koordinatları',
      desc: 'Ay ve Mars haritaları üzerinde gezinin; her bir iniş noktasını seçerek orada bırakılan aracın hikayesini ve çevre koşullarını inceleyin.',
      moonTab: 'Ay (Luna) · 3 Kalıntı',
      marsTab: 'Mars · 3 Kalıntı',
      moonProjection: 'AY ÖN YÜZÜ · MERİDYEN PROJEKSİYONU',
      marsProjection: 'MARS EKİP HARİTASI · MERCATÖR PROJEKSİYONU',
      moonDistance: 'ORTALAMA MESAFE: 384.400 KM',
      marsDistance: 'ORTALAMA MESAFE: 225 MİLYON KM',
      chapterPrefix: 'BÖLÜM',
      yearsSilentSuffix: 'yıldır',
      sinceText: (date, years) =>
        `${date} tarihinden bu yana ${years} yıldır yerinde bekliyor.`,
      coordsLabel: 'Koordinatlar',
      tempLabel: 'Yüzey Sıcaklığı',
      delayLabel: 'Sinyal Gecikmesi',
      statusLabel: 'Mevcut Durum',
      cta: '2D / 3D Modeli ve Hikayeyi İncele',
    },
    workshop: {
      kicker: '02 · Hikaye, 2D & 3D İnceleme Atölyesi',
      chapterOf: 'BÖLÜM',
      finalTxTitle: 'KAYDEDİLEN SON İLETİM',
      accessionTitle: 'Arşiv Künyesi ve Fiziksel Envanter',
      siteLabel: 'İniş Bölgesi',
      abandonedLabel: 'Terk Ediliş Tarihi',
      massLabel: 'Bırakılan Kütle',
      dimensionsLabel: 'Boyutlar',
      statusNoteLabel: 'Durum Notu',
      modelTitle: 'Etkileşimli 3D & 2D Model Atölyesi',
      modelDesc3d:
        'Aracı 360° döndürün, parça ayrımı sürgüsüyle katmanları inceleyin ve numaralı noktalara dokunarak o parçanın hikayesini okuyun.',
      modelDesc2d:
        '2D şema üzerindeki numaralı noktalara dokunun; iç yapıyı görmek için İç Yapı (Röntgen) veya yıllar içindeki değişim için Zaman Aşımı sekmesini seçin.',
      tab3d: '3D Etkileşimli Model',
      tab2d: '2D Teknik Çizim',
      prevPrefix: 'Önceki',
      nextPrefix: 'Sonraki',
    },
    viewer3d: {
      presets: {
        hero: 'Genel Açı',
        front: 'Ön Görünüm',
        top: 'Kuş Bakışı',
        detail: 'Yakın Detay',
      },
      sceneTag: '3D SAHNE',
      dragHint: 'Sürükle / Yakınlaştır',
      hideControls: 'Kontrolleri Gizle',
      showControls: 'Kontrolleri Göster',
      explodeLabel: 'Parça Ayrımı',
      dustyLabel: '2026 Tozlu',
      autoOrbit: 'Otomatik Dönüş',
      resetAria: '3D kamerayı sıfırla',
      resetTitle: 'Görünümü Sıfırla',
      webglFallback:
        'Tarayıcınızda 3D WebGL hızlandırması şu anda kullanılamıyor. Yukarıdaki sekmeden 2D Teknik Çizim görünümüne geçebilirsiniz.',
    },
    blueprint2d: {
      modeBlueprint: 'Teknik Çizim',
      modeXray: 'İç Yapı (Röntgen)',
      modeWeathering: 'Zaman Aşımı',
      grid: 'Izgara',
      zoomOutAria: 'Uzaklaştır',
      zoomInAria: 'Yakınlaştır',
      resetAria: 'Görünümü sıfırla',
      orthographicTag: 'ORTOGRAFİK 2D ŞEMA',
      xrayTag: 'İÇ SİSTEM KESİTİ',
      weatheringTag: 'YÜZEY AŞINIMI',
      timeSliderLabel: 'Zaman Çizelgesi Etkisi',
      selectedYearLabel: (year, delta) => `Seçili Yıl: ${year} (${delta} yıl sonra)`,
      xrayNoteLabel: 'İç Yapı Notu:',
      ascentDeparted: 'ÜST AŞAMA (1969’DA AYRILDI)',
      fuelLabel: 'YAKIT',
      oxidizerLabel: 'OKSİDİZÖR',
      lrvBatteries: '2 × 36V GÜMÜŞ-ÇİNKO BATARYA',
      takenByApollo12: 'APOLLO 12 TARAFINDAN ALINDI',
      vikingInternal: 'GC-MS BİYOLOJİ DENEY MODÜLÜ · PU-238 ISITICI',
      sojournerInternal: '80C85 İŞLEMCİ · LİTYUM PİLLER · AEROJEL YALITIM',
      oppInternal: 'RAD6000 · 8× RHU ISITICI · Lİ-İYON',
    },
    photo: {
      fiducials: 'Ölçüm İşaretleri',
      enlarge: 'Büyüt',
      enlargeAria: 'Arşiv fotoğrafını tam ekran büyüt',
      closeAria: 'Tam ekran görünümü kapat',
      loadError: 'Arşiv görüntüsü yüklenemedi.',
    },
    catalog: {
      kicker: '03 · Kozmik Arşiv Koleksiyonu',
      title: 'Bırakılan Envanter Kataloğu',
      desc: 'Herhangi bir kalıntıyı seçerek üstteki 2D ve 3D inceleme atölyesine ve hikaye bölümüne yükleyin.',
      allTab: 'Tümü',
      moonTab: 'Ay Kalıntıları',
      marsTab: 'Mars Kalıntıları',
      allStatuses: 'Tüm Durumlar',
      emptyTitle: 'Seçili filtrelerle eşleşen kalıntı bulunamadı.',
      emptyDesc: 'Tüm Ay ve Mars envanterini görmek için filtreleri sıfırlayabilirsiniz.',
      resetFilters: 'Filtreleri Sıfırla',
      yearsSilentUnit: 'yıl sessiz',
      currentlyInspecting: 'Şu An İnceleniyor',
      openStory: 'Hikayeyi Aç',
    },
    timeline: {
      kicker: '04 · 1967 – 2026 Kronolojisi',
      title: 'Dünya Dışı Sessizliğin Zaman Çizelgesi',
      desc: 'İlk robotik Ay sondasından Mars’ın Azim Vadisi’nde sönen son güneş paneline kadar elli dokuz yıllık keşif izleri.',
      lastContact: 'Son iletişim',
      goToChapter: 'Bölüme Git',
    },
    footer: {
      subtitle:
        'Terk Edilmiş Ama Unutulmamış · NASA Ay ve Mars Görevleri Kozmik Arkeoloji Sergisi',
      top: 'Başlangıç',
      map: 'Keşif Haritası',
      studio: '2D & 3D Atölye',
      catalog: 'Arşiv Koleksiyonu',
      timeline: 'Kronoloji',
    },
    statusMap: {
      Sessiz: 'Sessiz',
      'Yansıtıcı Aktif': 'Yansıtıcı Aktif',
      'Toz Altında': 'Toz Altında',
    },
  },
  en: {
    docTitle: 'Abandoned But Not Forgotten — NASA Relics on the Moon & Mars',
    brand: 'Silent Relics',
    nav: {
      map: 'Discovery Map',
      studio: '2D & 3D Studio',
      catalog: 'Archive Catalog',
      timeline: 'Chronology',
    },
    startStory: 'Begin Story',
    switchLangLabel: 'Türkçe',
    switchLangAria: 'Switch language to Turkish',
    hero: {
      kicker: 'Cosmic Archaeology Exhibition · Moon & Mars (1967 – 2026)',
      title: 'Abandoned But Not Forgotten',
      subtitle:
        'Humanity walked on the Moon, drove across Mars, and returned home—leaving our machines behind. Explore the stories, archival photographs, 2D engineering blueprints, and interactive 3D models of six historic NASA relics resting across airless craters and rust-colored plains.',
      cta: 'Begin Discovery',
      stats: {
        scopeLabel: 'EXHIBITION SCOPE',
        scopeValue: '2 Worlds',
        scopeDesc: 'Lunar & Martian surfaces',
        inventoryLabel: 'ARCHIVE INVENTORY',
        inventoryValue: '6 Historic Relics',
        inventoryDesc: '2D, 3D models & photographs',
        spanLabel: 'TIME SPAN',
        spanValue: '1967 – 2018',
        spanDesc: '59 years of silent heritage',
        distanceLabel: 'DISTANCE SCALE',
        distanceValue: '384k – 225M km',
        distanceDesc: 'One-way distance from Earth',
      },
    },
    map: {
      kicker: '01 · Selenographic & Areographic Atlas',
      title: 'Coordinates of Silence',
      desc: 'Navigate the maps of the Moon and Mars; select any landing site to examine the story and surface conditions of the spacecraft left there.',
      moonTab: 'Moon (Luna) · 3 Relics',
      marsTab: 'Mars · 3 Relics',
      moonProjection: 'LUNAR NEAR SIDE · MERIDIAN PROJECTION',
      marsProjection: 'MARS LANDING ATLAS · MERCATOR PROJECTION',
      moonDistance: 'MEAN DISTANCE: 384,400 KM',
      marsDistance: 'MEAN DISTANCE: 225 MILLION KM',
      chapterPrefix: 'CHAPTER',
      yearsSilentSuffix: 'years',
      sinceText: (date, years) =>
        `Resting in place for ${years} years since ${date}.`,
      coordsLabel: 'Coordinates',
      tempLabel: 'Surface Temp',
      delayLabel: 'Signal Delay',
      statusLabel: 'Current Status',
      cta: 'Inspect 2D / 3D Model & Story',
    },
    workshop: {
      kicker: '02 · Story, 2D & 3D Inspection Studio',
      chapterOf: 'CHAPTER',
      finalTxTitle: 'FINAL RECORDED TRANSMISSION',
      accessionTitle: 'Accession Record & Physical Inventory',
      siteLabel: 'Landing Site',
      abandonedLabel: 'Abandoned Date',
      massLabel: 'Mass Left Behind',
      dimensionsLabel: 'Dimensions',
      statusNoteLabel: 'Condition Note',
      modelTitle: 'Interactive 3D & 2D Model Studio',
      modelDesc3d:
        'Orbit the spacecraft 360°, separate sub-assemblies with the exploded-view slider, and tap numbered markers to read each component’s story.',
      modelDesc2d:
        'Click numbered markers on the 2D blueprint; switch to Internal X-Ray or Weathering Timeline to see how decades on another world transform the hardware.',
      tab3d: '3D Interactive Model',
      tab2d: '2D Technical Blueprint',
      prevPrefix: 'Previous',
      nextPrefix: 'Next',
    },
    viewer3d: {
      presets: {
        hero: 'Overview',
        front: 'Front View',
        top: 'Top-Down',
        detail: 'Close-Up',
      },
      sceneTag: '3D STAGE',
      dragHint: 'Drag / Zoom',
      hideControls: 'Hide Controls',
      showControls: 'Show Controls',
      explodeLabel: 'Exploded View',
      dustyLabel: '2026 Dusty',
      autoOrbit: 'Auto-Orbit',
      resetAria: 'Reset 3D camera',
      resetTitle: 'Reset View',
      webglFallback:
        '3D WebGL acceleration is currently unavailable in your browser. Please switch to the 2D Technical Blueprint tab above.',
    },
    blueprint2d: {
      modeBlueprint: 'Blueprint',
      modeXray: 'Internal (X-Ray)',
      modeWeathering: 'Weathering',
      grid: 'Grid',
      zoomOutAria: 'Zoom out',
      zoomInAria: 'Zoom in',
      resetAria: 'Reset view',
      orthographicTag: 'ORTHOGRAPHIC 2D SCHEMATIC',
      xrayTag: 'INTERNAL CUTAWAY',
      weatheringTag: 'SURFACE WEATHERING',
      timeSliderLabel: 'Timeline Exposure',
      selectedYearLabel: (year, delta) => `Selected Year: ${year} (${delta} yrs later)`,
      xrayNoteLabel: 'Internal Cutaway Note:',
      ascentDeparted: 'ASCENT STAGE (DEPARTED 1969)',
      fuelLabel: 'FUEL',
      oxidizerLabel: 'OXIDIZER',
      lrvBatteries: '2 × 36V SILVER-ZINC BATTERIES',
      takenByApollo12: 'RETRIEVED BY APOLLO 12',
      vikingInternal: 'GC-MS BIOLOGY LAB · PU-238 HEATERS',
      sojournerInternal: '80C85 CPU · LITHIUM CELLS · AEROGEL',
      oppInternal: 'RAD6000 · 8× RHU HEATERS · LI-ION',
    },
    photo: {
      fiducials: 'Reseau Crosses',
      enlarge: 'Enlarge',
      enlargeAria: 'Open full-screen archival photograph',
      closeAria: 'Close full-screen view',
      loadError: 'Archival image could not be loaded.',
    },
    catalog: {
      kicker: '03 · Cosmic Archive Collection',
      title: 'Left-Behind Inventory Catalog',
      desc: 'Select any artifact to load its story, archival imagery, and 2D / 3D inspection models in the studio above.',
      allTab: 'All',
      moonTab: 'Lunar Relics',
      marsTab: 'Martian Relics',
      allStatuses: 'All Statuses',
      emptyTitle: 'No artifacts match the selected filters.',
      emptyDesc: 'Reset filters to browse the complete Moon and Mars archive.',
      resetFilters: 'Reset Filters',
      yearsSilentUnit: 'yrs silent',
      currentlyInspecting: 'Inspecting Now',
      openStory: 'Open Story',
    },
    timeline: {
      kicker: '04 · 1967 – 2026 Chronology',
      title: 'Timeline of Off-World Silence',
      desc: 'Fifty-nine years of quiet footsteps—from the first robotic lunar scout to the final solar-powered rover resting in Perseverance Valley.',
      lastContact: 'Last contact',
      goToChapter: 'Go to Chapter',
    },
    footer: {
      subtitle:
        'Abandoned But Not Forgotten · Cosmic Archaeology Exhibition of NASA Moon & Mars Missions',
      top: 'Top',
      map: 'Discovery Map',
      studio: '2D & 3D Studio',
      catalog: 'Archive Catalog',
      timeline: 'Chronology',
    },
    statusMap: {
      Sessiz: 'Silent',
      'Yansıtıcı Aktif': 'Reflector Active',
      'Toz Altında': 'Under Dust',
    },
  },
};
