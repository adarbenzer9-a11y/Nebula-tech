export type CelestialBody = 'moon' | 'mars';

export type ArtifactStatus = 'Sessiz' | 'Yansıtıcı Aktif' | 'Toz Altında';

export type BlueprintModelKey =
  | 'eagle'
  | 'lrv'
  | 'surveyor'
  | 'viking'
  | 'sojourner'
  | 'opportunity';

export interface BlueprintHotspot {
  id: string;
  number: string;
  x: number; // percentage 0-100 inside SVG viewBox
  y: number; // percentage 0-100 inside SVG viewBox
  title: string;
  partCode: string;
  spec: string;
  story: string;
}

export interface Artifact {
  id: string;
  chapterNumber: string;
  accessionId: string;
  name: string;
  subtitle: string;
  body: CelestialBody;
  bodyLabel: string;
  mission: string;
  siteName: string;
  coordinates: string;
  mapPosition: { x: number; y: number }; // percentage on planetary SVG map
  launchYear: number;
  abandonedDate: string;
  yearsSilent: number;
  distanceLabel: string;
  massLeftKg: string;
  dimensions: string;
  status: ArtifactStatus;
  statusNote: string;
  modelKey: BlueprintModelKey;
  heroImage: string;
  photoCatalogId: string;
  photoCamera: string;
  photoCaption: string;
  storyOpening: string;
  storyContinuation: string;
  pullQuote: string;
  pullQuoteAttribution: string;
  finalTransmission: {
    timestamp: string;
    message: string;
    context: string;
  };
  environment: {
    tempRange: string;
    gravity: string;
    signalDelay: string;
    hazard: string;
  };
  xraySummary: string;
  weatheringStages: {
    early: string;
    mid: string;
    present: string;
  };
  hotspots: BlueprintHotspot[];
}

export const HERO_IMAGE_PATH = '/src/assets/images/hero_lunar_horizon_1794574338443.jpg';

export const ARTIFACTS: Artifact[] = [
  {
    id: 'apollo-11-eagle',
    chapterNumber: '01',
    accessionId: 'ARC-AY-1969-01',
    name: 'Eagle İniş Aşaması (LM-5)',
    subtitle: 'Sessizlik Denizi’nde bırakılan altın kanatlı fırlatma rampası',
    body: 'moon',
    bodyLabel: 'Ay',
    mission: 'Apollo 11',
    siteName: 'Mare Tranquillitatis (Sessizlik Denizi)',
    coordinates: '0°40′26.69″K · 23°28′22.69″D',
    mapPosition: { x: 64, y: 46 },
    launchYear: 1969,
    abandonedDate: '21 Temmuz 1969 · 17:54 UTC',
    yearsSilent: 57,
    distanceLabel: '384.400 km',
    massLeftKg: '2.132 kg',
    dimensions: '4,22 m yükseklik · 9,45 m ayak açıklığı',
    status: 'Yansıtıcı Aktif',
    statusNote: 'Yakınındaki LRRR lazer yansıtıcısı Dünya’dan hâlâ ölçüm veriyor',
    modelKey: 'eagle',
    heroImage: '/src/assets/images/archive_apollo11_eagle_1794574340064.jpg',
    photoCatalogId: 'NASA AS11-40-5903',
    photoCamera: 'Hasselblad 500EL · 60mm Biogon · 70mm Ektachrome',
    photoCaption: 'Şek. 1 — Buzz Aldrin tarafından çekilen bu karede Eagle iniş aşaması, bıraktıkları bayrak ve bilimsel aygıtlarla Sessizlik Denizi üzerinde görünüyor.',
    storyOpening:
      '21 Temmuz 1969 öğleden sonra, Neil Armstrong ve Buzz Aldrin üst kabini ateşleyip Ay yörüngesine yükselirken, Eagle’ın alt yarısı bir daha asla hareket etmemek üzere Ay tozuna saplı kaldı. Üst aşamanın ağırlığını azaltmak için her gram hayatiydi; bu yüzden astronotlar Ay botlarını, yaşam destek çantalarını, bir televizyon kamerasını ve bir Hasselblad gövdesini dışarı attılar.',
    storyContinuation:
      'Bugün bile rüzgarın esmediği, yağmurun yağmadığı bu gri ovada Eagle’ın dört örümcek bacağı aynı açıyla duruyor. Sadece 150 dereceye varan güneş ışınları ile eksi 170 derecelik gece soğuğu arasındaki amansız döngü, altın Kapton folyoları yavaş yavaş kırılgan hale getiriyor. Yine de ön bacağındaki paslanmaz çelik plaketteki cümle lekesiz duruyor: "Tüm insanlık adına barış içinde geldik."',
    pullQuote: '“Kartal indi. Ve kalkış anında kendi yuvasını sonsuza dek Sessizlik Denizi’ne emanet etti.”',
    pullQuoteAttribution: 'Apollo 11 Görev Kayıtları, Temmuz 1969',
    finalTransmission: {
      timestamp: '21 TEM 1969 · 17:54:00 UTC',
      message: '“9, 8, 7, 6, 5, durdur... Ateşleme! Çok yumuşak. Sürüş harika.”',
      context: 'Üst aşama ayrılırken Buzz Aldrin’in Houston’a son kalkış sözleri; alt gövde o saniye sessizliğe gömüldü.'
    },
    environment: {
      tempRange: '-173 °C / +127 °C',
      gravity: '1,62 m/s² (0,165 g)',
      signalDelay: '1,28 saniye',
      hazard: 'Mikrometeorit yağmuru ve filtrelenmemiş morötesi radyasyon'
    },
    xraySummary:
      'Dışarıdaki buruşuk altın Kapton battaniyelerin altında dört adet küresel Aerozin-50 ve azot tetroksit yakıt tankı, iniş radar anteni ve boşalmış oksijen tüpleri hâlâ sızdırmazlık mühürleriyle korunuyor.',
    weatheringStages: {
      early: '1969: Kalkış motorunun egzozu çevredeki toz tabakasını süpürdü; Mylar folyolar parlak altın tonunda.',
      mid: '1998: On binlerce gece-gündüz ısıl şoku folyo yapıştırıcılarını gevrekleştirdi; mikro-kraterler belirdi.',
      present: '2026: Güneş rüzgarı ve kozmik ışınlar boyalı bayrak dokusunu ağarttı; gövde ise neredeyse ilk günkü kadar dik.'
    },
    hotspots: [
      {
        id: 'kapton',
        number: '1',
        x: 50,
        y: 44,
        title: 'Altın Kapton Isı Kalkanı',
        partCode: 'Termal Battaniye (MLI)',
        spec: '25 katmanlı alüminize Mylar ve Kapton film',
        story: 'Kabin dışı elektroniği 300 derecelik sıcaklık farkından koruyan bu ince zar, rüzgarsız Ay yüzeyinde hâlâ kalkış anının kıvrımlarını taşıyor.'
      },
      {
        id: 'plaque',
        number: '2',
        x: 41,
        y: 58,
        title: 'İnsanlık Anı Plaketi',
        partCode: 'Paslanmaz Çelik · Ön İniş Bacağı',
        spec: '22,8 × 19,4 cm · Lazer gravür değil, asit aşındırma',
        story: 'Merdivenin dördüncü basamağına sabitlenen plakette Dünya’nın iki yarımküresi, astronotların ve Başkan Nixon’ın imzaları yer alıyor.'
      },
      {
        id: 'engine',
        number: '3',
        x: 50,
        y: 72,
        title: 'DPS İniş Motoru Çanı',
        partCode: 'TRW LMDE-10 · Kısılabilir Motor',
        spec: '45,04 kN maksimum itki · Kolumbiyum alaşım',
        story: 'İnsanoğlunun başka bir gök cismine yumuşak iniş yaptığı ilk kısılabilir roket nozülü; üst aşama fırlatılırken bir fırlatma rampası görevi gördü.'
      },
      {
        id: 'mesa',
        number: '4',
        x: 68,
        y: 51,
        title: 'Atılan Yaşam Çantaları ve Kamera',
        partCode: 'Ağırlık Tasarrufu Envanteri',
        spec: '≈ 102 kg bırakılan ekipman (PLSS, çizmeler, kamera)',
        story: 'Yörüngeye çıkabilmek için astronotlar Ay tozuna bulanmış çizmelerini ve pahalı kameralarını merdiven dibine bırakıp kapıyı kapattı.'
      }
    ]
  },
  {
    id: 'apollo-15-lrv',
    chapterNumber: '02',
    accessionId: 'ARC-AY-1971-04',
    name: 'Ay Taşıtı LRV-1',
    subtitle: 'Hadley Vadisi’nin kenarında park edilmiş ilk elektrikli gezgin',
    body: 'moon',
    bodyLabel: 'Ay',
    mission: 'Apollo 15',
    siteName: 'Palus Putredinis · Hadley Rille',
    coordinates: '26°07′55.99″K · 3°38′01.90″D',
    mapPosition: { x: 46, y: 26 },
    launchYear: 1971,
    abandonedDate: '2 Ağustos 1971 · 17:11 UTC',
    yearsSilent: 55,
    distanceLabel: '384.400 km',
    massLeftKg: '210 kg',
    dimensions: '3,10 m uzunluk · 2,06 m genişlik',
    status: 'Sessiz',
    statusNote: 'Tekerlek izleri LRO uydusu tarafından hâlâ net biçimde görülüyor',
    modelKey: 'lrv',
    heroImage: '/src/assets/images/archive_apollo15_rover_1794574339750.jpg',
    photoCatalogId: 'NASA AS15-88-11901',
    photoCamera: 'Hasselblad 500EL · 60mm lens · Hadley Delta yamacı arka planda',
    photoCaption: 'Şek. 2 — David Scott ve James Irwin’in 27,9 kilometre yol kat ettikleri LRV-1, kalkıştan hemen önce Falcon modülünün doğusuna park edilmiş halde.',
    storyOpening:
      'Apollo 15 astronotları David Scott ve James Irwin, Dünya dışında bir araç kullanan ilk insanlardı. Üç gün boyunca Hadley Kanyonu’nun kıyısında saatte 13 kilometre hıza ulaştılar, 27,9 kilometrelik bir keşif turu attılar. Dönüş vakti geldiğinde aracı Falcon modülünden yaklaşık 90 metre uzağa, ön tekerlekleri kanyona bakacak şekilde park ettiler.',
    storyContinuation:
      'Bu park yeri rastgele seçilmemişti: Aracın önündeki uzaktan kumandalı televizyon kamerası, Falcon’ın Ay’dan kalkışını Dünya’ya canlı yayınlayabilsin diye özellikle konumlandırılmıştı. Kalkış alevi söndüğünde kamera birkaç saat daha o boş iniş ayağına baktı, sonra pilleri tükendi. LRV-1’in örgü titanyum tekerlekleri elli beş yıldır aynı toz izinin içinde bekliyor.',
    pullQuote: '“İnsanoğlu bir vadinin kıyısına elektrikli bir otomobil park etti ve anahtarı almadan eve döndü.”',
    pullQuoteAttribution: 'Kozmik Arkeoloji Küratör Notu',
    finalTransmission: {
      timestamp: '02 AĞU 1971 · 19:25:10 UTC',
      message: '“Kamera eğimi sabitlendi. Falcon yükselişi yakalandı; batarya gerilimi kritik eşiğin altında.”',
      context: 'Houston’daki Ed Fendell’in yerden yönettiği TV kamerası, kalkıştan sonra sönümlenen son sinyali gönderdi.'
    },
    environment: {
      tempRange: '-165 °C / +120 °C',
      gravity: '1,62 m/s² (0,165 g)',
      signalDelay: '1,28 saniye',
      hazard: 'Elektrostatik yüklü keskin Ay tozu yapışması'
    },
    xraySummary:
      'Katlanabilir alüminyum şasinin ön kısmında iki adet 36 volt gümüş-çinko potasyum hidroksit batarya, her tekerlek göbeğinde ise 0,25 beygir gücünde bağımsız elektrik motoru bulunur.',
    weatheringStages: {
      early: '1971: Çamurluklarda kalın gri Ay tozu birikmiş, şemsiye anten Dünya’ya kilitli.',
      mid: '1999: Naylon koltuk kayışları ve plastik izolasyonlar yoğun UV altında kırılganlaştı.',
      present: '2026: 120 derecelik ısıl genleşmeler ince alüminyum perçinleri gevşetmiş olsa da araç bütünlüğünü koruyor.'
    },
    hotspots: [
      {
        id: 'dish',
        number: '1',
        x: 68,
        y: 26,
        title: 'Şemsiye Yüksek Kazançlı Anten',
        partCode: 'Altın Kaplı İnce Tel Örgü',
        spec: '0,96 m çap · S-Band canlı video bağlantısı',
        story: 'Dünya’ya canlı görüntü taşıyan bu narin tel şemsiye, 1971’den beri aynı gökyüzü noktasına dönük duruyor.'
      },
      {
        id: 'camera',
        number: '2',
        x: 56,
        y: 38,
        title: 'Uzaktan Kumandalı RCA TV Kamerası',
        partCode: 'Gözlem Birimi (LCRU)',
        spec: 'Dünya’dan pan/tilt kontrollü renkli kamera',
        story: 'Astronotlar olmadan Falcon’ın kalkışını filme alan göz. Merceği hâlâ boş iniş sahasına bakıyor.'
      },
      {
        id: 'wheels',
        number: '3',
        x: 31,
        y: 74,
        title: 'Örgü Piyano Teli Tekerlekler',
        partCode: 'Boeing / Delco Çinko Kaplı Örgü',
        spec: '81 cm çap · Şevron desenli titanyum sırt',
        story: 'Hava dolu lastikler Ay vakumunda patlayacağı için tekerlekler esnek çelik tel örgüden örülmüştü.'
      },
      {
        id: 'seats',
        number: '4',
        x: 42,
        y: 52,
        title: 'İki Kişilik Boru Çerçeve Koltuk',
        partCode: 'Alüminyum Şasi & Emniyet Kemeri',
        spec: 'Yerçekimsiz ortamda 1/6 ağırlık için optimize edilmiş',
        story: 'Üzerinde Scott’ın çekiç izleri ve Ay tozuna bulanmış kolçaklarla sessiz bir açık hava aracı.'
      }
    ]
  },
  {
    id: 'surveyor-3',
    chapterNumber: '03',
    accessionId: 'ARC-AY-1967-02',
    name: 'Surveyor 3 Uzay Sondası',
    subtitle: 'İnsanlığın başka bir dünyada ziyaret edip parçasını geri getirdiği tek robot',
    body: 'moon',
    bodyLabel: 'Ay',
    mission: 'Surveyor 3 & Apollo 12',
    siteName: 'Oceanus Procellarum (Fırtınalar Okyanusu)',
    coordinates: '3°00′54″G · 23°25′04″B',
    mapPosition: { x: 26, y: 58 },
    launchYear: 1967,
    abandonedDate: '3 Mayıs 1967 (İlk) · 20 Kasım 1969 (Ziyaret)',
    yearsSilent: 59,
    distanceLabel: '384.400 km',
    massLeftKg: '292 kg',
    dimensions: '3,00 m yükseklik · 4,27 m ayak çapı',
    status: 'Sessiz',
    statusNote: 'Kamerası Apollo 12 tarafından sökülüp Dünya müzesine getirildi; gövdesi kraterde kaldı',
    modelKey: 'surveyor',
    heroImage: '/src/assets/images/archive_surveyor3_moon_1794574340282.jpg',
    photoCatalogId: 'NASA AS12-48-7133',
    photoCamera: 'Hasselblad 500EL · Pete Conrad ve Alan Bean arşivi',
    photoCaption: 'Şek. 3 — Apollo 12 astronotlarının “Surveyor Krateri”nin 14 derecelik yamacında bulduğu 2,5 yıllık robot sonda.',
    storyOpening:
      'Nisan 1967’de Fırtınalar Okyanusu’ndaki küçük bir kraterin eğimli duvarına inen Surveyor 3, radarının kafası karıştığı için yüzeyde iki kez zıplamış, ardından 6.315 fotoğraf gönderip ilk Ay gecesinin dondurucu soğuğunda susmuştu. Hikayesi burada bitebilirdi; ancak iki buçuk yıl sonra gökyüzünden iki insan indi.',
    storyContinuation:
      'Kasım 1969’da Apollo 12 astronotları Pete Conrad ve Alan Bean, tam olarak bu kraterin kenarına hassas iniş yaptı. Yürüyerek 163 metre aşağıdaki beyaz iskelete indiler, üzerinde biriken tozu incelediler ve 31 ay Ay’da kalmış olan televizyon kamerasını penseyle söküp Dünya’ya getirdiler. Surveyor 3 ise eksik gözüyle kraterin 14 derecelik yamacında nöbetini sürdürüyor.',
    pullQuote: '“İki buçuk yıldır tek başına uyuyan bir makineye komşu ziyareti: Pete Conrad kamerayı sökerken tarihin ilk uzay restorasyonu yaşandı.”',
    pullQuoteAttribution: 'Apollo 12 Yüzey Yürüyüşü Raporu',
    finalTransmission: {
      timestamp: '03 MAY 1967 · 00:04 UTC',
      message: '“6.315. kare iletildi. İlk Ay gecesi başlıyor; termal eşik düşüşte.”',
      context: 'Surveyor 3 güneş battıktan sonra uyku moduna geçti ve bir daha hiç uyanamadı.'
    },
    environment: {
      tempRange: '-180 °C / +115 °C',
      gravity: '1,62 m/s² (0,165 g)',
      signalDelay: '1,28 saniye',
      hazard: 'Krater yamacı eğimi ve aşırı beyaz boya solması'
    },
    xraySummary:
      'Üçgen alüminyum kafes içinde Vernier itki boruları, sönümleyici bal peteği ayak tamponları ve zamanında bir bakteriyel dayanıklılık efsanesine konu olan köpük yalıtımlı kontrol kutuları bulunur.',
    weatheringStages: {
      early: '1967: Parlak beyaz boyası neredeyse kusursuzdu; kepçe kolu toprak hendekleri kazmıştı.',
      mid: '1969: Apollo 12 ekibi geldiğinde beyaz boyanın ince bir kahverengi-gri kozmik tozla kaplandığını gördü.',
      present: '2026: Kamerası Smithsonian müzesinde sergilenirken, gövdesi krater yamacındaki ilk zıplama izlerinin yanında yatıyor.'
    },
    hotspots: [
      {
        id: 'solar',
        number: '1',
        x: 49,
        y: 22,
        title: 'Dikey Güneş Paneli Direği',
        partCode: '85 W Fotovoltaik Kanat',
        spec: '0,85 m² alan · 3.960 silikon hücre',
        story: 'Karanlık 14 günlük Ay gecesi boyunca pilleri donduğu için bu panel bir daha gövdeyi uyandıramadı.'
      },
      {
        id: 'camera-gap',
        number: '2',
        x: 56,
        y: 41,
        title: 'Sökülen TV Kamerası Yuvası',
        partCode: 'Apollo 12 Örnekleme Noktası',
        spec: '1969’da Alan Bean tarafından kesilip alındı',
        story: 'Ay’da 31 ay kalmış malzemelerin radyasyon direncini ölçmek için gövdeden ayrılan tek parça.'
      },
      {
        id: 'scoop',
        number: '3',
        x: 73,
        y: 57,
        title: 'Pantograf Toprak Kepçesi',
        partCode: 'SMSS Mekanik Kazıcı Kol',
        spec: '1,5 m uzanım · İlk Mars dışı toprak kazısı',
        story: 'Ay zemininin bir insan ağırlığını taşıyıp taşımayacağını test etmek için 4 küçük hendek kazmıştı.'
      },
      {
        id: 'tripod',
        number: '4',
        x: 30,
        y: 73,
        title: 'Üçgen İskele & Ezilen Tamponlar',
        partCode: '7075 Alüminyum Boru Şasi',
        spec: '14° eğimli krater zemininde sabitlenmiş 3 ayak',
        story: 'Zıplama sırasında Ay tozuna batıp çıkan dairesel tabanlar bugün bile eğimli yamaçta sıkıca tutunuyor.'
      }
    ]
  },
  {
    id: 'viking-1',
    chapterNumber: '04',
    accessionId: 'ARC-MR-1976-01',
    name: 'Viking 1 İniş Aracı',
    subtitle: 'Yanlış bir yazılım komutuyla ebediyen susturulan ilk Mars elçisi',
    body: 'mars',
    bodyLabel: 'Mars',
    mission: 'Viking 1 (Thomas Mutch Anıt İstasyonu)',
    siteName: 'Chryse Planitia (Altın Ova)',
    coordinates: '22°28′12″K · 47°58′01″B',
    mapPosition: { x: 34, y: 39 },
    launchYear: 1976,
    abandonedDate: '13 Kasım 1982 (Son İletişim)',
    yearsSilent: 44,
    distanceLabel: '≈ 225 milyon km',
    massLeftKg: '572 kg',
    dimensions: '2,10 m yükseklik · 3,00 m genişlik',
    status: 'Toz Altında',
    statusNote: 'RTG nükleer pilleri hâlâ düşük ısı yayıyor; anteni yönünü kaybetti',
    modelKey: 'viking',
    heroImage: '/src/assets/images/archive_viking1_mars_1794574341234.jpg',
    photoCatalogId: 'NASA JPL P-17433 / SOL 34',
    photoCamera: 'Viking Faksimile Tarayıcı Kamera · Chryse Planitia',
    photoCaption: 'Şek. 4 — 1976 yazında çekilen bu karede Viking 1’in tozlanmaya başlamış güvertesi ve örnek toplama kolu Kızıl Gezegen ufkuna uzanıyor.',
    storyOpening:
      '20 Temmuz 1976’da Chryse Planitia’ya inen Viking 1, Mars yüzeyinden net fotoğraflar ve günlük hava raporları gönderen ilk sabit istasyondu. 90 gün çalışması bekleniyordu; tam 2.245 Mars günü boyunca (6 yıldan fazla) Dünya ile konuştu. Ancak ölümünü getiren şey ne bir fırtına ne de donmuş bir devreydi; insan kaynaklı tek bir bellek hatasıydı.',
    storyContinuation:
      'Kasım 1982’de Dünya’daki mühendisler batarya ömrünü uzatmak için yeni bir yazılım yaması yükledi. Ne var ki yama yanlışlıkla anten yönlendirme verilerinin üzerine yazıldı. Çanak anten Dünya’dan başka bir yöne döndü. Aylarca gökyüzüne kör sinyaller gönderildi ama Viking 1 bir daha hiç cevap vermedi. Bugün Altın Ova’da kırmızı demir oksit tozuna yarı gömülü duruyor.',
    pullQuote: '“Altı yıl boyunca Mars rüzgarlarını dinleyen istasyon, Dünya’dan gelen tek bir hatalı satır kodla körleşti.”',
    pullQuoteAttribution: 'JPL Viking Görev Sonu Arşivi, 1983',
    finalTransmission: {
      timestamp: '11 KAS 1982 · 23:02 UTC (SOL 2245)',
      message: '“Basınç: 7,4 milibar · Güneş batıyor · Bellek bloğu 4401 güncelleniyor...”',
      context: 'Bu güncelleme komutunun ardından yüksek kazançlı anten konumu silindi; 13 Kasım’da bağlantı tamamen koptu.'
    },
    environment: {
      tempRange: '-107 °C / -17 °C',
      gravity: '3,72 m/s² (0,38 g)',
      signalDelay: '4–22 dakika (tek yön)',
      hazard: 'Mevsimsel küresel toz fırtınaları ve pas aşındırması'
    },
    xraySummary:
      'Altıgen gövdenin iki yanında SNAP-19 Plütonyum-238 radyoizotop termoelektrik jeneratörleri (RTG) yer alır. Yakıtın yarı ömrü 87,7 yıl olduğu için gövde bugün bile ılık kalmayı sürdürüyor.',
    weatheringStages: {
      early: '1976: Parlak metalik güverte üzerinde ilk kızıl Mars toz tanecikleri birikmeye başladı.',
      mid: '1999: Yirmi yılı aşkın Mars rüzgarı üçgen ayakların altını kum tepeleriyle kısmen doldurdu.',
      present: '2026: LRO/MRO yörünge fotoğraflarında yalnızca koyu bir leke ve anten gölgesi olarak seçilebiliyor.'
    },
    hotspots: [
      {
        id: 'dish',
        number: '1',
        x: 42,
        y: 22,
        title: 'Yönünü Kaybeden S-Band Çanak',
        partCode: '0,76 m Parabolik Anten',
        spec: 'Yanlış yazılım adreslemesiyle kilitlendi',
        story: 'Görevden düşmesine neden olan nokta: Hatalı yüklenen yama yüzünden anten Dünya yerine boş uzaya bakıyor.'
      },
      {
        id: 'rtg',
        number: '2',
        x: 24,
        y: 54,
        title: 'SNAP-19 Nükleer Güç Silindirleri',
        partCode: 'Plütonyum-238 RTG Çifti',
        spec: '70 W başlangıç gücü · Radyoaktif yarı ömür 87,7 yıl',
        story: 'Güneş panellerine ihtiyaç duymadan çalışan bu kanatlı silindirler hâlâ Mars gecesinde hafif bir sıcaklık yayıyor.'
      },
      {
        id: 'arm',
        number: '3',
        x: 75,
        y: 47,
        title: 'Biyoloji Örnekleme Kolu',
        partCode: '3 m Açılabilir Kepçe Mekanizması',
        spec: 'Toprakta mikrobiyal yaşam izi arayan ilk kol',
        story: 'İniş aracının hemen önündeki “Big Joe” kayasının dibinden aldığı toprak örnekleriyle bilim tarihini değiştirdi.'
      },
      {
        id: 'body',
        number: '4',
        x: 51,
        y: 56,
        title: 'Altıgen Termal Zırh Gövde',
        partCode: 'Alüminyum-Titanyum Biyoloji Laboratuvarı',
        spec: 'Fırlatmadan önce 111 °C’de sterilize edildi',
        story: 'Mars’a Dünya mikrobu taşımamak için fırınlanan gövde, bugün Thomas Mutch Anıt İstasyonu olarak anılıyor.'
      }
    ]
  },
  {
    id: 'sojourner',
    chapterNumber: '05',
    accessionId: 'ARC-MR-1997-03',
    name: 'Sojourner & Pathfinder',
    subtitle: 'Annesini kaybeden 10 kiloluk gezginin sonsuz yürüyüş döngüsü',
    body: 'mars',
    bodyLabel: 'Mars',
    mission: 'Mars Pathfinder',
    siteName: 'Ares Vallis (Antik Taşkın Ovası)',
    coordinates: '19°07′48″K · 33°13′12″B',
    mapPosition: { x: 45, y: 42 },
    launchYear: 1997,
    abandonedDate: '27 Eylül 1997 (Sol 83)',
    yearsSilent: 29,
    distanceLabel: '≈ 191 milyon km',
    massLeftKg: '10,6 kg (Gezgin) + 264 kg (İstasyon)',
    dimensions: '65 cm uzunluk · 48 cm genişlik · 30 cm yükseklik',
    status: 'Toz Altında',
    statusNote: 'Gezginin otonom olarak Carl Sagan İstasyonu etrafında daire çizerek durduğu düşünülüyor',
    modelKey: 'sojourner',
    heroImage: '/src/assets/images/archive_sojourner_mars_1794574340885.jpg',
    photoCatalogId: 'NASA JPL PIA01122',
    photoCamera: 'IMP Stereo Kamera · Carl Sagan Anıt İstasyonu',
    photoCaption: 'Şek. 5 — Mikrodalga fırın boyutundaki Sojourner, Ares Vallis’te “Yogi” adı verilen dev Mars kayasını incelerken.',
    storyOpening:
      '4 Temmuz 1997’de dev hava yastıklarının içinde zıplayarak Mars’a inen Pathfinder, yanında mikrodalga fırın büyüklüğünde bir misafir taşıyordu: Sojourner. Başka bir gezegende tekerlek döndüren ilk otonom gezgindi. Toplamda yalnızca 100 metrelik bir mesafe kat etti ama kayaların kimyasını çözerek Mars’ın eski çağlarda suyla yıkandığını kanıtladı.',
    storyContinuation:
      '27 Eylül 1997’de Pathfinder ana istasyonunun pilleri aşırı soğuğa yenik düşüp sustu. Sojourner doğrudan Dünya ile konuşamıyordu; tek aracısı ana istasyondu. Yazılımındaki acil durum protokolü ise şuydu: “Ana istasyondan sinyal alamazsan, iletişim kurabileceğin bir noktaya gelene kadar onun etrafında dön.” Mühendisler, minik gezginin pilleri donana dek sessiz istasyonun çevresinde yavaşça daireler çizdiğini tahmin ediyor.',
    pullQuote: '“Küçük gezgin cevap beklerken annesinin etrafında daireler çizdi ve sonra onun yanı başında uykuya daldı.”',
    pullQuoteAttribution: 'Mars Pathfinder Mühendislik Anıları',
    finalTransmission: {
      timestamp: '27 EYL 1997 · 10:23 UTC (SOL 83)',
      message: '“IMP telemetrisi kesildi. Gezgin otonom arama döngüsüne hazırlandı.”',
      context: 'Pathfinder son sinyali gönderdi; Ekim 1997’deki tüm kurtarma çağrıları yanıtsız kaldı.'
    },
    environment: {
      tempRange: '-110 °C / -10 °C',
      gravity: '3,72 m/s² (0,38 g)',
      signalDelay: '10,6 dakika',
      hazard: 'Güneş paneli toz birikimi ve lityum pil donması'
    },
    xraySummary:
      'Karbon fiber Warm Electronics Box (WEB) içinde yalnızca bir 80C85 işlemci (eski nesil 8-bit bilgisayar gücü) ve şarj edilemeyen lityum-tiyonil klorür yedek piller yer alır.',
    weatheringStages: {
      early: '1997: Üstteki galyum arsenit güneş paneli temizdi; 6 küçük alüminyum tekerlek kırmızı kumda iz bırakıyordu.',
      mid: '2010: Yıllık toz fırtınaları hem paneli hem ana istasyonun açılmış taçyapraklarını kırmızıya boyadı.',
      present: '2026: Carl Sagan İstasyonu’nun birkaç metre yakınında, rüzgarın sürüklediği ince kum tepelerinin altında dinleniyor.'
    },
    hotspots: [
      {
        id: 'solar-deck',
        number: '1',
        x: 50,
        y: 38,
        title: 'GaAs Güneş Paneli Güvertesi',
        partCode: '16 W Galyum Arsenit Hücre',
        spec: '0,22 m² alan · Sadece gündüz hareket gücü',
        story: 'Yalnızca birkaç ampul kadar elektrik üreten bu ince plaka, küçük gezginin 83 gün boyunca hayatta kalmasını sağladı.'
      },
      {
        id: 'apxs',
        number: '2',
        x: 21,
        y: 54,
        title: 'APXS Kaya Koklayıcı Sensör',
        partCode: 'Alfa Proton X-Işını Spektrometresi',
        spec: 'Kayalara burnunu dayayıp kimyasal bileşim okur',
        story: 'Barnacle Bill ve Yogi kayalarına dokunarak Mars’ın antik volkanik geçmişini ortaya çıkardı.'
      },
      {
        id: 'bogie',
        number: '3',
        x: 49,
        y: 72,
        title: 'Rocker-Bogie Süspansiyonu',
        partCode: '6 Bağımsız Tekerlek Sistemi',
        spec: '13 cm alüminyum tekerlekler · Paslanmaz diş',
        story: 'Kendi tekerlek çapından büyük kayaların üzerinden devrilmeden aşmasını sağlayan bu tasarım sonraki tüm Mars gezginlerinin atası oldu.'
      },
      {
        id: 'antenna',
        number: '4',
        x: 78,
        y: 30,
        title: 'Kısa Menzil UHF Anteni',
        partCode: 'Pathfinder Röle Bağlantısı',
        spec: '9.600 bps modem hızı · Yalnızca 15 m menzil',
        story: 'Dünya’yı hiç doğrudan duymadı; tüm hikayesini hemen yanındaki Carl Sagan istasyonuna fısıldadı.'
      }
    ]
  },
  {
    id: 'opportunity',
    chapterNumber: '06',
    accessionId: 'ARC-MR-2004-02',
    name: 'Opportunity (MER-B)',
    subtitle: '90 gün için gönderilip 14 yıl direnen gezginin son karanlığı',
    body: 'mars',
    bodyLabel: 'Mars',
    mission: 'Mars Exploration Rover (MER-B)',
    siteName: 'Meridiani Planum · Perseverance Vadisi',
    coordinates: '1°57′00″G · 354°28′12″D',
    mapPosition: { x: 56, y: 54 },
    launchYear: 2004,
    abandonedDate: '10 Haziran 2018 (Son Sinyal) · 13 Şubat 2019 (Veda)',
    yearsSilent: 8,
    distanceLabel: '≈ 205 milyon km',
    massLeftKg: '185 kg',
    dimensions: '1,60 m uzunluk · 2,30 m genişlik · 1,50 m yükseklik',
    status: 'Toz Altında',
    statusNote: '45,16 km yol kat ederek Dünya dışı mesafe rekorunu kırdı ve Azim Vadisi’nde durdu',
    modelKey: 'opportunity',
    heroImage: '/src/assets/images/archive_opportunity_mars_1794574341534.jpg',
    photoCatalogId: 'NASA JPL PIA22220 / SOL 5111',
    photoCamera: 'Pancam · Perseverance Vadisi Arka Bakış Panoraması',
    photoCaption: 'Şek. 6 — Opportunity’nin Perseverance Vadisi yamaçlarında bıraktığı son tekerlek izleri ve yaklaşan küresel toz fırtınasının kızıl sisi.',
    storyOpening:
      'Ocak 2004’te Meridiani Planum’daki küçük bir kraterin tam içine ("kozmik bir delikte bir") inen Opportunity, sadece 90 Mars günü çalışmak üzere tasarlanmıştı. Ne var ki Mars rüzgarları güneş panellerindeki tozu zaman zaman süpürerek ona beklenmedik bir ömür bağışladı. 14 yılı aşkın sürede tam 45,16 kilometre sürdü; bir maraton mesafesinden daha uzun.',
    storyContinuation:
      'Mayıs 2018’de gezegeni tamamen saran tarihin en şiddetli toz fırtınalarından biri başladı. Gökyüzü öğle vakti bile zifiri karanlığa gömüldü. 10 Haziran 2018’de Opportunity son veri paketini gönderdi: Güneş ışığı neredeyse sıfırdı, bataryası tükeniyordu. NASA sekiz ay boyunca her sabah ona uyandırma şarkıları gönderdi. 13 Şubat 2019’da Billie Holiday’in “I’ll Be Seeing You” şarkısının ardından görev resmen sonlandırıldı.',
    pullQuote: '“Bataryam azalıyor ve ortalık kararıyor.”',
    pullQuoteAttribution: 'Opportunity’nin 10 Haziran 2018 tarihli son telemetri verisinin şiirsel özeti',
    finalTransmission: {
      timestamp: '10 HAZ 2018 · SOL 5111',
      message: '“Güneş enerjisi: 22 Wh · Optik derinlik (Tau): 10.8 · Karanlık çöküyor.”',
      context: 'Bu verinin ardından gezgin düşük güç uykusuna geçti ve bir daha uyanamadı.'
    },
    environment: {
      tempRange: '-100 °C / +20 °C',
      gravity: '3,72 m/s² (0,38 g)',
      signalDelay: '11,4 dakika',
      hazard: 'Küresel toz örtüsü ve kış soğuğunda saat kayması'
    },
    xraySummary:
      'Altın kaplı yalıtımlı gövde kalbinde RAD6000 işlemci, iki lityum-iyon batarya paketi ve gece donmasını önleyen 8 küçük radyoizotop ısıtıcı (RHU) barındırır.',
    weatheringStages: {
      early: '2004: Parlak yarasa kanadı güneş panelleri, Eagle Krateri’nde temiz siyah hematit kürecikleri inceliyordu.',
      mid: '2012: 30 km devrildi; ön sağ tekerlek dümeni kilitlense de geri geri sürüşle kraterleri aştı.',
      present: '2026: Perseverance Vadisi’nin eğiminde, güneş panelleri kalın kırmızı tozla örtülü şekilde uykuda.'
    },
    hotspots: [
      {
        id: 'pancam',
        number: '1',
        x: 42,
        y: 18,
        title: 'Pancam Stereo Gözler',
        partCode: '1,5 m Direk Üstü Kamera Kafası',
        spec: '228.000’den fazla Mars fotoğrafı çekti',
        story: 'Karanlık çökmeden hemen önce gökyüzünün toz yoğunluğunu ölçen ve son gürültülü fotoğraf karesini gönderen gözler.'
      },
      {
        id: 'wings',
        number: '2',
        x: 68,
        y: 48,
        title: 'Üçlü Üçgen Güneş Kanatları',
        partCode: 'Üç Eklemli Fotovoltaik Dizi',
        spec: '900 Wh başlangıç kapasitesi → 22 Wh son gün',
        story: '14 yıl boyunca Mars rüzgarlarının (“temizleme olayları”) tozunu silkelemesiyle rekor kıran yaşam kaynağı.'
      },
      {
        id: 'idd',
        number: '3',
        x: 24,
        y: 56,
        title: 'IDD Mekanik İnceleme Kolu',
        partCode: 'Kaya Aşındırma Aracı (RAT)',
        spec: 'Mikroskobik kamera + 2 spektrometre taşır',
        story: 'Kayaların içine 5 milimetre oyuk açarak Mars’ın bir zamanlar asidik ve tatlı sularla kaplı olduğunu gösterdi.'
      },
      {
        id: 'wheels-opp',
        number: '4',
        x: 52,
        y: 79,
        title: '45,16 Kilometrelik Tekerlekler',
        partCode: '6 Bağımsız Alüminyum Tekerlek',
        spec: 'Dünya dışı en uzun sürüş rekoru (45.160 m)',
        story: 'İki kez kum tepesine saplanıp haftalarca manevrayla kurtulan bu tekerlekler, Azim Vadisi’nde son izini bıraktı.'
      }
    ]
  }
];
