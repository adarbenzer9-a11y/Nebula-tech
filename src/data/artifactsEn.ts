import type { Artifact } from './artifacts';
import type { Language } from './translations';

type ArtifactEnglishOverlay = Pick<
  Artifact,
  | 'name'
  | 'subtitle'
  | 'bodyLabel'
  | 'abandonedDate'
  | 'distanceLabel'
  | 'dimensions'
  | 'statusNote'
  | 'photoCaption'
  | 'storyOpening'
  | 'storyContinuation'
  | 'pullQuote'
  | 'pullQuoteAttribution'
  | 'finalTransmission'
  | 'environment'
  | 'xraySummary'
  | 'weatheringStages'
> & {
  hotspots: Record<string, { title: string; partCode: string; spec: string; story: string }>;
};

const ARTIFACTS_EN: Record<string, ArtifactEnglishOverlay> = {
  'apollo-11-eagle': {
    name: 'Eagle Descent Stage (LM-5)',
    subtitle: 'The gold-winged launchpad left standing in the Sea of Tranquility',
    bodyLabel: 'Moon',
    abandonedDate: 'July 21, 1969 · 17:54 UTC',
    distanceLabel: '384,400 km',
    dimensions: '4.22 m height · 9.45 m footpad span',
    statusNote: 'Nearby LRRR laser retroreflector still returns distance pulses to Earth',
    photoCaption:
      'Fig. 1 — Captured by Buzz Aldrin, showing the Eagle descent stage standing silently beside the deployed flag and scientific experiments on Mare Tranquillitatis.',
    storyOpening:
      'On the afternoon of July 21, 1969, as Neil Armstrong and Buzz Aldrin ignited the ascent engine to climb back toward lunar orbit, the lower half of Eagle stayed anchored in the gray regolith forever. Every gram mattered for the climb off the Moon—so the crew tossed out their lunar overshoes, life-support backpacks, a television camera, and a Hasselblad body before sealing the hatch.',
    storyContinuation:
      'Today, on a windless plain untouched by rain or erosion, Eagle’s four spider-like legs remain locked at the exact angle they settled into in 1969. Only the brutal 300-degree swing between scorching lunar noon and minus 170-degree night slowly embrittles its crinkled golden Kapton blankets. Yet on the forward strut, the stainless-steel plaque still reads without a speck of rust: “We came in peace for all mankind.”',
    pullQuote:
      '“The Eagle had landed—and at liftoff, it entrusted its own golden cradle to the Sea of Tranquility forever.”',
    pullQuoteAttribution: 'Apollo 11 Mission Logs, July 1969',
    finalTransmission: {
      timestamp: '21 JUL 1969 · 17:54:00 UTC',
      message: '“9, 8, 7, 6, 5, abort stage... Ignition! Very smooth. Very quiet ride.”',
      context:
        'Buzz Aldrin’s call to Houston as the ascent stage separated, leaving the lower stage in eternal silence.',
    },
    environment: {
      tempRange: '-173 °C / +127 °C',
      gravity: '1.62 m/s² (0.165 g)',
      signalDelay: '1.28 seconds',
      hazard: 'Micrometeoroid pitting and unfiltered solar ultraviolet radiation',
    },
    xraySummary:
      'Beneath the crinkled golden Kapton thermal blankets sit four spherical Aerozine-50 and nitrogen tetroxide propellant tanks, the landing radar dish, and depleted oxygen reservoirs sealed inside an octagonal aluminum frame.',
    weatheringStages: {
      early:
        '1969: Ascent exhaust swept away loose surface dust; Mylar foils gleamed bright metallic gold.',
      mid: '1998: Tens of thousands of thermal shock cycles embrittled adhesive seams and pitted foil surfaces.',
      present:
        '2026: Solar wind and cosmic rays have bleached painted markings, yet the descent frame stands nearly intact.',
    },
    hotspots: {
      kapton: {
        title: 'Gold Kapton Thermal Shield',
        partCode: 'Multi-Layer Insulation (MLI)',
        spec: '25-layer aluminized Mylar & Kapton film',
        story:
          'Engineered to shield delicate propellant tanks across a 300 °C temperature swing, these wrinkled golden sheets still preserve the exact creases from liftoff.',
      },
      plaque: {
        title: 'Lunar Commemorative Plaque',
        partCode: 'Stainless Steel · Forward Strut',
        spec: '22.8 × 19.4 cm · Acid-etched engraving',
        story:
          'Bolted to the fourth rung of the ladder, bearing hemispheres of Earth and the signatures of Armstrong, Aldrin, Collins, and President Nixon.',
      },
      engine: {
        title: 'DPS Descent Engine Bell',
        partCode: 'TRW LMDE-10 · Throttleable Engine',
        spec: '45.04 kN max thrust · Columbium alloy',
        story:
          'The first throttleable rocket nozzle to carry humans to a soft landing on another world—later serving as the launchpad for the ascent cabin.',
      },
      mesa: {
        title: 'Discarded Life-Support Packs & Gear',
        partCode: 'Weight-Saving Jettison Inventory',
        spec: '≈ 102 kg left beside the footpad (PLSS, boots, camera)',
        story:
          'To ensure enough fuel margin for lunar orbit rendezvous, dust-caked boots and precision cameras were tossed out onto the regolith.',
      },
    },
  },
  'apollo-15-lrv': {
    name: 'Lunar Roving Vehicle LRV-1',
    subtitle: 'The first electric car parked along the rim of Hadley Rille',
    bodyLabel: 'Moon',
    abandonedDate: 'August 2, 1971 · 17:11 UTC',
    distanceLabel: '384,400 km',
    dimensions: '3.10 m length · 2.06 m width',
    statusNote: 'Tire tracks remain clearly visible in Lunar Reconnaissance Orbiter imagery',
    photoCaption:
      'Fig. 2 — After driving 27.9 km across lunar craters, David Scott and James Irwin parked LRV-1 east of the Falcon lander before liftoff.',
    storyOpening:
      'Apollo 15 astronauts David Scott and James Irwin were the first humans to drive an automobile off Earth. Over three days beside the winding canyon of Hadley Rille, they reached 13 km/h and covered 27.9 kilometers. When departure arrived, they parked the rover roughly 90 meters from the Falcon lander, angling its front wheels toward the canyon.',
    storyContinuation:
      'That parking spot was chosen with care: the remote-controlled television camera mounted on the rover’s bow was aimed back at Falcon so flight controllers in Houston could pan and tilt it to broadcast humanity’s liftoff live. After the ascent flame vanished, the camera stared at the empty lander legs for a few hours until its silver-zinc batteries faded. Fifty-five years later, LRV-1 still waits in its own tire tracks.',
    pullQuote:
      '“Humanity parked an electric car beside an alien canyon and went home without taking the keys.”',
    pullQuoteAttribution: 'Cosmic Archaeology Curatorial Note',
    finalTransmission: {
      timestamp: '02 AUG 1971 · 19:25:10 UTC',
      message:
        '“Camera tilt locked. Falcon ascent tracked; battery bus dropping below operational threshold.”',
      context:
        'Controlled remotely from Houston by Ed Fendell, the rover’s TV camera transmitted until its batteries expired.',
    },
    environment: {
      tempRange: '-165 °C / +120 °C',
      gravity: '1.62 m/s² (0.165 g)',
      signalDelay: '1.28 seconds',
      hazard: 'Electrostatically charged abrasive lunar dust clinging to hinges',
    },
    xraySummary:
      'Inside the folding aluminum chassis sit two 36-volt silver-zinc potassium hydroxide batteries and four independent 0.25-horsepower traction motors housed inside the wheel hubs.',
    weatheringStages: {
      early:
        '1971: Fine gray lunar dust coated the orange fenders while the umbrella dish pointed accurately at Earth.',
      mid: '1999: Nylon seat straps and polymer wire insulation gradually yellowed and cracked under raw solar UV.',
      present:
        '2026: Extreme day-night thermal cycling has stressed rivets, yet the wire-mesh wheels still support the chassis.',
    },
    hotspots: {
      dish: {
        title: 'Umbrella High-Gain Antenna',
        partCode: 'Gold-Plated Wire Mesh Dish',
        spec: '0.96 m diameter · S-Band live video link',
        story:
          'This delicate foldable mesh umbrella beamed live color television directly from Hadley Rille back into living rooms on Earth.',
      },
      camera: {
        title: 'Remote-Controlled RCA TV Camera',
        partCode: 'Lunar Communications Relay Unit (LCRU)',
        spec: 'Ground-commanded pan/tilt color camera',
        story:
          'The robotic eye that watched Falcon blast off into the black lunar sky—its lens remains aimed at the empty descent stage.',
      },
      wheels: {
        title: 'Woven Piano-Wire Mesh Wheels',
        partCode: 'Boeing / Delco Zinc-Coated Mesh',
        spec: '81 cm diameter · Titanium chevron treads',
        story:
          'Rubber tires would fail in vacuum and extreme cold, so engineers wove springy steel mesh hoops that flex softly over lunar boulders.',
      },
      seats: {
        title: 'Dual Tubular Mesh Seats',
        partCode: 'Aluminum Frame & Restraint Straps',
        spec: 'Engineered for 1/6th lunar gravity',
        story:
          'Two dusty open-air seats where Scott and Irwin sat in bulky pressurized A7LB spacesuits.',
      },
    },
  },
  'surveyor-3': {
    name: 'Surveyor 3 Lunar Probe',
    subtitle: 'The only robot on another world ever visited and sampled by astronauts',
    bodyLabel: 'Moon',
    abandonedDate: 'May 3, 1967 (Silent) · Nov 20, 1969 (Visited)',
    distanceLabel: '384,400 km',
    dimensions: '3.00 m height · 4.27 m footpad span',
    statusNote: 'TV camera was removed by Apollo 12 and returned to Earth; frame remains in crater',
    photoCaption:
      'Fig. 3 — Apollo 12 astronauts found the 2.5-year-old Surveyor 3 resting intact on the 14-degree inner slope of Surveyor Crater.',
    storyOpening:
      'Landing inside a small crater in the Ocean of Storms in April 1967, Surveyor 3 bounced twice when its radar briefly lost lock, then snapped 6,315 photographs before freezing during its first two-week lunar night. Its story might have ended there—until two humans walked down the crater rim two and a half years later.',
    storyContinuation:
      'In November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean landed within walking distance of the silent probe. Strolling 163 meters down the crater wall, they inspected the dust-coated white tripod and used surgical shears to detach its television camera for return to Earth. Missing its robotic eye, Surveyor 3 still keeps watch on the crater slope.',
    pullQuote:
      '“A neighborly visit to a machine sleeping alone for two and a half years: humanity’s first off-world salvage.”',
    pullQuoteAttribution: 'Apollo 12 Surface EVA Report',
    finalTransmission: {
      timestamp: '03 MAY 1967 · 00:04 UTC',
      message: '“Frame 6,315 transmitted. Lunar sunset commencing; thermal bus declining.”',
      context:
        'Surveyor 3 powered down as freezing lunar darkness fell and never responded to wake-up calls.',
    },
    environment: {
      tempRange: '-180 °C / +115 °C',
      gravity: '1.62 m/s² (0.165 g)',
      signalDelay: '1.28 seconds',
      hazard: 'Steep 14° crater slope and solar paint darkening',
    },
    xraySummary:
      'Inside the triangular aluminum spaceframe sit three Vernier throttleable thrusters, crushable honeycomb footpads, and foam-insulated electronics compartments.',
    weatheringStages: {
      early:
        '1967: Crisp white thermal paint reflected harsh sunlight while its scoop dug four soil trenches.',
      mid: '1969: Apollo 12 crews observed the white paint had tanned to a warm dusty gray-brown.',
      present:
        '2026: While its camera sits in a museum in Washington, the headless tripod still anchors itself in the crater dust.',
    },
    hotspots: {
      solar: {
        title: 'Vertical Solar Panel Mast',
        partCode: '85 W Photovoltaic Array',
        spec: '0.85 m² area · 3,960 silicon cells',
        story:
          'Designed to power daytime photography, though the battery never survived the -180 °C freeze of the first lunar night.',
      },
      'camera-gap': {
        title: 'Empty TV Camera Mount',
        partCode: 'Apollo 12 Sample Retrieval Site',
        spec: 'Detached by Alan Bean in Nov 1969',
        story:
          'Removed after 31 months on the Moon so scientists could measure how vacuum and radiation age spacecraft alloys.',
      },
      scoop: {
        title: 'Pantograph Soil Sampler Scoop',
        partCode: 'SMSS Mechanical Arm',
        spec: '1.5 m reach · First lunar trenching tool',
        story:
          'Dug tiny trenches into the lunar soil to prove the surface could safely support the weight of future Apollo landers.',
      },
      tripod: {
        title: 'Tubular Tripod & Crushable Pads',
        partCode: '7075 Aluminum Truss',
        spec: 'Anchored on a 14° crater slope',
        story:
          'Its honeycomb footpads absorbed two unexpected landing bounces and still rest inside those faint 1967 impact dimples.',
      },
    },
  },
  'viking-1': {
    name: 'Viking 1 Mars Lander',
    subtitle: 'Mars’s first long-term ambassador, silenced forever by a single faulty command',
    bodyLabel: 'Mars',
    abandonedDate: 'November 13, 1982 (Last Signal)',
    distanceLabel: '≈ 225 million km',
    dimensions: '2.10 m height · 3.00 m width',
    statusNote: 'Plutonium RTGs still radiate faint warmth; high-gain dish lost Earth lock',
    photoCaption:
      'Fig. 4 — Captured in the summer of 1976, showing Viking 1’s dust-speckled deck and sampling arm reaching across Chryse Planitia.',
    storyOpening:
      'Touching down on Chryse Planitia on July 20, 1976, Viking 1 became the first spacecraft to operate long-term on Mars, sending crystal-clear panoramas and daily weather reports. Built for a 90-day mission, it endured for 2,245 Martian sols—over six Earth years. Yet its end came not from a dust storm or hardware failure, but from a single human software mistake.',
    storyContinuation:
      'In November 1982, engineers uploaded a routine memory patch to improve battery charging. Tragically, the patch overwrote data used to calculate the pointing angle of the high-gain dish antenna. The dish slewed away from Earth, severing contact permanently. Today Viking 1 rests half-drifted in iron-oxide sand at Thomas Mutch Memorial Station.',
    pullQuote:
      '“After listening to Martian winds for six years, the station was deafened by a single misplaced block of code from Earth.”',
    pullQuoteAttribution: 'JPL Viking End-of-Mission Report, 1983',
    finalTransmission: {
      timestamp: '11 NOV 1982 · 23:02 UTC (SOL 2245)',
      message:
        '“Pressure: 7.4 millibars · Sunset approaching · Updating memory block 4401...”',
      context:
        'Immediately after this patch upload, antenna pointing memory was overwritten; contact ceased two days later.',
    },
    environment: {
      tempRange: '-107 °C / -17 °C',
      gravity: '3.72 m/s² (0.38 g)',
      signalDelay: '4–22 minutes (one-way)',
      hazard: 'Seasonal global dust storms and ferric oxide accumulation',
    },
    xraySummary:
      'Flanking the hexagonal biology laboratory are twin SNAP-19 Plutonium-238 radioisotope thermoelectric generators (RTGs). With an 87.7-year half-life, they still keep the core faintly warm today.',
    weatheringStages: {
      early:
        '1976: Bright metallic deck panels began collecting their first fine dusting of red Martian silt.',
      mid: '1999: Over two decades of thin wind steadily banked small sand drifts against the three footpads.',
      present:
        '2026: Spotted from orbit by MRO as a tiny dark speck casting a faint shadow across the Golden Plain.',
    },
    hotspots: {
      dish: {
        title: 'Misaligned S-Band Parabolic Dish',
        partCode: '0.76 m High-Gain Antenna',
        spec: 'Locked off-axis by faulty memory patch',
        story:
          'The silent point of failure: pointed away from Earth’s sky ever since the November 1982 software upload.',
      },
      rtg: {
        title: 'SNAP-19 Nuclear Power Cylinders',
        partCode: 'Plutonium-238 RTG Pair',
        spec: '70 W initial output · 87.7-year half-life',
        story:
          'Immune to dust storms, these finned cylinders still emit gentle radioactive warmth into the frigid Martian night.',
      },
      arm: {
        title: 'Biology Soil-Sampling Arm',
        partCode: '3 m Retractable Collector Boom',
        spec: 'First robotic arm to test Martian soil for life',
        story:
          'Scooped soil beside the “Big Joe” boulder, initiating humanity’s first direct search for extraterrestrial microbes.',
      },
      body: {
        title: 'Hexagonal Sterilized Chassis',
        partCode: 'Aluminum-Titanium Biology Lab',
        spec: 'Dry-heat sterilized at 111 °C before launch',
        story:
          'Baked before leaving Earth to protect Mars from terrestrial microbes; designated Thomas Mutch Memorial Station.',
      },
    },
  },
  sojourner: {
    name: 'Sojourner & Pathfinder',
    subtitle: 'The 10-kilogram rover that circled its silent mother station until sleep',
    bodyLabel: 'Mars',
    abandonedDate: 'September 27, 1997 (Sol 83)',
    distanceLabel: '≈ 191 million km',
    dimensions: '65 cm length · 48 cm width · 30 cm height',
    statusNote: 'Autonomous failsafe likely kept it circling Carl Sagan Memorial Station',
    photoCaption:
      'Fig. 5 — Microwave-sized Sojourner pressing its alpha-proton spectrometer against the Martian boulder nicknamed “Yogi” in Ares Vallis.',
    storyOpening:
      'Bouncing to a stop inside giant airbags on July 4, 1997, Mars Pathfinder unfolded its petals to release a microwave-sized pioneer: Sojourner. As the first wheeled robot to rove another planet, it drove roughly 100 meters in total—yet proved that Ares Vallis had once been swept by catastrophic ancient floods.',
    storyContinuation:
      'On September 27, 1997, the Pathfinder base station’s main battery finally succumbed to Martian cold. Because Sojourner could not talk directly to Earth, its software held an autonomous contingency rule: if contact with the lander is lost, drive in slow circles around it while searching for a signal. Engineers believe the little rover kept circling its silent mother until its own batteries froze.',
    pullQuote:
      '“Waiting for an answer that never came, the tiny rover circled its silent mother station until sleep overtook it.”',
    pullQuoteAttribution: 'Mars Pathfinder Engineering Recollections',
    finalTransmission: {
      timestamp: '27 SEP 1997 · 10:23 UTC (SOL 83)',
      message:
        '“IMP telemetry carrier lost. Rover entering autonomous base-search loop.”',
      context:
        'Pathfinder’s final signal; all recovery attempts throughout October 1997 met silence.',
    },
    environment: {
      tempRange: '-110 °C / -10 °C',
      gravity: '3.72 m/s² (0.38 g)',
      signalDelay: '10.6 minutes',
      hazard: 'Solar deck dust accumulation and lithium cell freezing',
    },
    xraySummary:
      'Inside its aerogel-insulated Warm Electronics Box lives an Intel 80C85 processor—roughly the computing power of an early home computer—paired with non-rechargeable lithium backup cells.',
    weatheringStages: {
      early:
        '1997: The dark gallium-arsenide solar deck gleamed cleanly as six little aluminum wheels etched crisp tracks.',
      mid: '2010: Annual Martian dust devils gradually coated both rover and lander petals in uniform rust.',
      present:
        '2026: Resting only a few meters from Carl Sagan Memorial Station beneath drifting wind-blown sand.',
    },
    hotspots: {
      'solar-deck': {
        title: 'GaAs Solar Panel Deck',
        partCode: '16 W Gallium Arsenide Array',
        spec: '0.22 m² area · Daytime-only drive power',
        story:
          'Generating barely enough wattage to light a small household bulb, this slim plate powered 83 sols of historic exploration.',
      },
      apxs: {
        title: 'APXS Rock-Sniffing Spectrometer',
        partCode: 'Alpha Proton X-Ray Spectrometer',
        spec: 'Presses flush against boulders to read chemistry',
        story:
          'Touched Barnacle Bill and Yogi rocks to reveal Mars’s volcanic and water-altered past.',
      },
      bogie: {
        title: 'Rocker-Bogie Suspension',
        partCode: '6-Wheel Articulated Drive',
        spec: '13 cm aluminum wheels · Stainless cleats',
        story:
          'Capable of climbing obstacles larger than its own wheels—a mechanical blueprint inherited by Spirit, Opportunity, Curiosity, and Perseverance.',
      },
      antenna: {
        title: 'Short-Range UHF Whip Antenna',
        partCode: 'Pathfinder Relay Link',
        spec: '9,600 bps modem · 15 m effective range',
        story:
          'Never heard Earth directly; every discovery had to be whispered across a few meters to Carl Sagan Station.',
      },
    },
  },
  opportunity: {
    name: 'Opportunity (MER-B)',
    subtitle: 'Sent for 90 days, endured 14 years before the great dust storm’s twilight',
    bodyLabel: 'Mars',
    abandonedDate: 'June 10, 2018 (Last Signal) · Feb 13, 2019 (Farewell)',
    distanceLabel: '≈ 205 million km',
    dimensions: '1.60 m length · 2.30 m width · 1.50 m height',
    statusNote: 'Set the off-world driving record of 45.16 km before stopping in Perseverance Valley',
    photoCaption:
      'Fig. 6 — Looking back along Opportunity’s winding wheel tracks across Perseverance Valley as the 2018 global dust storm turned midday into amber twilight.',
    storyOpening:
      'Landing squarely inside Eagle Crater on Meridiani Planum in January 2004, Opportunity was built to survive just 90 Martian days. Instead, Martian gusts periodically swept dust off its solar wings, granting it over fourteen years of life and an off-world marathon record of 45.16 kilometers.',
    storyContinuation:
      'In May 2018, a planet-encircling dust storm blotted out the Sun, turning high noon as black as midnight. On June 10, 2018, Opportunity sent its final telemetry packet: solar power had collapsed and the clock was drifting. For eight months, NASA beamed daily wake-up songs across the void—ending on February 13, 2019 with Billie Holiday’s “I’ll Be Seeing You.”',
    pullQuote: '“My battery is low and it’s getting dark.”',
    pullQuoteAttribution: 'Poetic distillation of Opportunity’s final telemetry, June 10, 2018',
    finalTransmission: {
      timestamp: '10 JUN 2018 · SOL 5111',
      message: '“Solar array energy: 22 Wh · Atmospheric Tau: 10.8 · Darkness falling.”',
      context:
        'Following this downlinked packet, the rover entered low-power fault sleep and never awoke.',
    },
    environment: {
      tempRange: '-100 °C / +20 °C',
      gravity: '3.72 m/s² (0.38 g)',
      signalDelay: '11.4 minutes',
      hazard: 'Planet-encircling dust opacity and unheated clock drift',
    },
    xraySummary:
      'Inside its gold-insulated Warm Electronics Box sit a radiation-hardened RAD6000 processor, dual lithium-ion battery packs, and eight tiny plutonium radioisotope heater units (RHUs).',
    weatheringStages: {
      early:
        '2004: Clean bat-wing solar arrays gleamed brightly as Opportunity studied dark hematite “blueberries.”',
      mid: '2012: Beyond 30 km driven; despite a stiff front steering actuator, it tackled crater rims in reverse.',
      present:
        '2026: Resting quietly on the slope of Perseverance Valley beneath a thick blanket of 2018 storm dust.',
    },
    hotspots: {
      pancam: {
        title: 'Pancam Stereo Eyes',
        partCode: '1.5 m Mast Camera Head',
        spec: 'Captured over 228,000 Martian images',
        story:
          'Measured the thickening storm opacity right before sending its final noisy thumbnail of a darkened sun.',
      },
      wings: {
        title: 'Triangular Solar Wing Array',
        partCode: 'Triple-Junction Photovoltaic Wings',
        spec: '900 Wh launch peak → 22 Wh final sol',
        story:
          'Kept alive for 14 years thanks to lucky Martian wind “cleaning events” until the 2018 global storm overwhelmed them.',
      },
      idd: {
        title: 'IDD Robotic Arm & Rock Abrasion Tool',
        partCode: 'Instrument Deployment Device (RAT)',
        spec: 'Microscopic imager + dual spectrometers',
        story:
          'Ground 5-millimeter holes into bedrock, proving liquid water once soaked Meridiani Planum.',
      },
      'wheels-opp': {
        title: '45.16-Kilometer Aluminum Wheels',
        partCode: '6 Independent Rocker-Bogie Wheels',
        spec: 'Longest off-world drive in history (45,160 m)',
        story:
          'Twice freed from treacherous sand ripples over weeks of testing, finally coming to rest in Perseverance Valley.',
      },
    },
  },
};

export function getLocalizedArtifact(artifact: Artifact, lang: Language): Artifact {
  if (lang === 'tr') return artifact;
  const en = ARTIFACTS_EN[artifact.id];
  if (!en) return artifact;
  return {
    ...artifact,
    name: en.name,
    subtitle: en.subtitle,
    bodyLabel: en.bodyLabel,
    abandonedDate: en.abandonedDate,
    distanceLabel: en.distanceLabel,
    dimensions: en.dimensions,
    statusNote: en.statusNote,
    photoCaption: en.photoCaption,
    storyOpening: en.storyOpening,
    storyContinuation: en.storyContinuation,
    pullQuote: en.pullQuote,
    pullQuoteAttribution: en.pullQuoteAttribution,
    finalTransmission: en.finalTransmission,
    environment: en.environment,
    xraySummary: en.xraySummary,
    weatheringStages: en.weatheringStages,
    hotspots: artifact.hotspots.map((hs) => {
      const hsEn = en.hotspots[hs.id];
      return hsEn ? { ...hs, ...hsEn } : hs;
    }),
  };
}
