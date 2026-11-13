import * as THREE from 'three';
import type { BlueprintModelKey } from '../data/artifacts';
import { createKaptonFoilTexture, createSolarPanelTexture } from './proceduralTextures';

export interface BuiltSpacecraft3D {
  root: THREE.Group;
  explodableParts: THREE.Object3D[];
  hotspotMeshes: Map<string, THREE.Object3D>;
  hotspotAnchors: Map<string, THREE.Vector3>;
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  };
}

function registerExplodable(
  obj: THREE.Object3D,
  offset: THREE.Vector3,
  list: THREE.Object3D[]
) {
  obj.userData.basePosition = obj.position.clone();
  obj.userData.explodeOffset = offset;
  list.push(obj);
}

function addTubeStrut(
  parent: THREE.Object3D,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  mat: THREE.Material,
  geos: THREE.BufferGeometry[]
) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, 10);
  geos.push(geo);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(p1).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function buildSpacecraft3D(
  modelKey: BlueprintModelKey,
  dustLevel: number,
  maxAnisotropy: number
): BuiltSpacecraft3D {
  const root = new THREE.Group();
  const explodableParts: THREE.Object3D[] = [];
  const hotspotMeshes = new Map<string, THREE.Object3D>();
  const hotspotAnchors = new Map<string, THREE.Vector3>();

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const kaptonTex = createKaptonFoilTexture(maxAnisotropy);
  textures.push(kaptonTex.map, kaptonTex.bumpMap);

  const isMars = modelKey === 'viking' || modelKey === 'sojourner' || modelKey === 'opportunity';
  const dustColor = isMars ? new THREE.Color('#a4502b') : new THREE.Color('#777671');

  const kaptonMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e0a63b').lerp(dustColor, dustLevel * 0.32),
      map: kaptonTex.map,
      bumpMap: kaptonTex.bumpMap,
      bumpScale: 0.04,
      metalness: 0.88 - dustLevel * 0.25,
      roughness: 0.26 + dustLevel * 0.35,
    })
  );

  const brushedAlumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c8ccd2').lerp(dustColor, dustLevel * 0.4),
      metalness: 0.82 - dustLevel * 0.2,
      roughness: 0.34 + dustLevel * 0.32,
    })
  );

  const darkTitaniumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2c3038').lerp(dustColor, dustLevel * 0.3),
      metalness: 0.72,
      roughness: 0.56 + dustLevel * 0.22,
    })
  );

  const matteWhiteMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e6e3da').lerp(dustColor, dustLevel * 0.45),
      metalness: 0.12,
      roughness: 0.72 + dustLevel * 0.2,
    })
  );

  const solarTex = createSolarPanelTexture(isMars ? 'mars' : 'lunar', dustLevel, maxAnisotropy);
  textures.push(solarTex);
  const solarMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: solarTex,
      metalness: 0.35,
      roughness: 0.28 + dustLevel * 0.45,
    })
  );

  const lensMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#1b3556',
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    })
  );

  const accentCopperMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#cf7336').lerp(dustColor, dustLevel * 0.25),
      metalness: 0.76,
      roughness: 0.32,
    })
  );

  const createFootpad = (radius: number, mat: THREE.Material) => {
    const points = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(radius, 0.02),
      new THREE.Vector2(radius * 0.92, 0.09),
      new THREE.Vector2(0.08, 0.12),
      new THREE.Vector2(0, 0.12),
    ];
    const geo = trackGeo(new THREE.LatheGeometry(points, 20));
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  if (modelKey === 'eagle') {
    // 1. Octagonal Descent Body (Primary Silhouette)
    const hullGroup = new THREE.Group();
    const hullGeo = trackGeo(new THREE.CylinderGeometry(1.42, 1.42, 1.15, 8));
    const hull = new THREE.Mesh(hullGeo, kaptonMat);
    hull.position.y = 1.55;
    hull.rotation.y = Math.PI / 8;
    hull.castShadow = true;
    hull.receiveShadow = true;
    hullGroup.add(hull);

    // Upper structural ring (where Ascent stage detached)
    const collarGeo = trackGeo(new THREE.CylinderGeometry(1.02, 1.15, 0.16, 8));
    const collar = new THREE.Mesh(collarGeo, darkTitaniumMat);
    collar.position.y = 2.18;
    collar.rotation.y = Math.PI / 8;
    collar.castShadow = true;
    hullGroup.add(collar);

    registerExplodable(hullGroup, new THREE.Vector3(0, 0.65, 0), explodableParts);
    root.add(hullGroup);
    hotspotMeshes.set('kapton', hull);
    hotspotAnchors.set('kapton', new THREE.Vector3(0.4, 1.8, 1.25));

    // 2. Descent Engine Bell
    const bellGroup = new THREE.Group();
    const bellPts = [
      new THREE.Vector2(0.18, 0.75),
      new THREE.Vector2(0.28, 0.55),
      new THREE.Vector2(0.52, 0.15),
      new THREE.Vector2(0.62, 0),
    ];
    const bellGeo = trackGeo(new THREE.LatheGeometry(bellPts, 24));
    const bell = new THREE.Mesh(bellGeo, darkTitaniumMat);
    bell.position.y = 0.28;
    bell.castShadow = true;
    bellGroup.add(bell);
    registerExplodable(bellGroup, new THREE.Vector3(0, -0.35, 0), explodableParts);
    root.add(bellGroup);
    hotspotMeshes.set('engine', bell);
    hotspotAnchors.set('engine', new THREE.Vector3(0, 0.65, 0.62));

    // 3. Four Articulated Landing Struts + Footpads + Ladder + Plaque
    const legAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    legAngles.forEach((ang, idx) => {
      const legGroup = new THREE.Group();
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);

      const topOuter = new THREE.Vector3(cos * 1.38, 1.72, sin * 1.38);
      const topInner = new THREE.Vector3(cos * 1.25, 1.15, sin * 1.25);
      const footPos = new THREE.Vector3(cos * 2.25, 0.04, sin * 2.25);

      addTubeStrut(legGroup, topOuter, footPos, 0.055, kaptonMat, geometries);
      addTubeStrut(
        legGroup,
        topInner,
        footPos.clone().lerp(topOuter, 0.36),
        0.038,
        brushedAlumMat,
        geometries
      );

      const pad = createFootpad(0.36, kaptonMat);
      pad.position.set(footPos.x, 0, footPos.z);
      legGroup.add(pad);

      // Front leg (idx === 1 -> +Z) gets ladder & plaque
      if (idx === 1) {
        for (let r = 0; r < 6; r++) {
          const t = 0.22 + r * 0.12;
          const rungPos = topOuter.clone().lerp(footPos, t);
          const rungGeo = trackGeo(new THREE.BoxGeometry(0.34, 0.028, 0.028));
          const rung = new THREE.Mesh(rungGeo, brushedAlumMat);
          rung.position.copy(rungPos).add(new THREE.Vector3(0, 0, 0.05));
          rung.castShadow = true;
          legGroup.add(rung);
        }
        const plaqueGeo = trackGeo(new THREE.BoxGeometry(0.28, 0.18, 0.025));
        const plaque = new THREE.Mesh(plaqueGeo, accentCopperMat);
        const pPos = topOuter.clone().lerp(footPos, 0.45);
        plaque.position.copy(pPos).add(new THREE.Vector3(0, 0, 0.08));
        plaque.rotation.x = -0.35;
        legGroup.add(plaque);
        hotspotMeshes.set('plaque', plaque);
        hotspotAnchors.set('plaque', plaque.position.clone().add(new THREE.Vector3(0, 0.12, 0.1)));
      }

      registerExplodable(
        legGroup,
        new THREE.Vector3(cos * 0.55, 0, sin * 0.55),
        explodableParts
      );
      root.add(legGroup);
    });

    // 4. Discarded MESA Bay & Equipment on the Lunar Dust
    const gearGroup = new THREE.Group();
    const plssGeo = trackGeo(new THREE.BoxGeometry(0.42, 0.52, 0.26));
    const plss = new THREE.Mesh(plssGeo, matteWhiteMat);
    plss.position.set(1.65, 0.26, 1.35);
    plss.rotation.y = 0.4;
    plss.castShadow = true;
    gearGroup.add(plss);

    const camGeo = trackGeo(new THREE.BoxGeometry(0.22, 0.18, 0.24));
    const cam = new THREE.Mesh(camGeo, brushedAlumMat);
    cam.position.set(1.18, 0.09, 1.62);
    cam.rotation.y = -0.3;
    cam.castShadow = true;
    gearGroup.add(cam);

    registerExplodable(gearGroup, new THREE.Vector3(0.45, 0, 0.45), explodableParts);
    root.add(gearGroup);
    hotspotMeshes.set('mesa', plss);
    hotspotAnchors.set('mesa', new THREE.Vector3(1.55, 0.6, 1.4));
  } else if (modelKey === 'lrv') {
    // 1. Beveled Aluminum Chassis
    const chassisGroup = new THREE.Group();
    const frameGeo = trackGeo(new THREE.BoxGeometry(2.7, 0.16, 1.48));
    const frame = new THREE.Mesh(frameGeo, brushedAlumMat);
    frame.position.y = 0.56;
    frame.castShadow = true;
    frame.receiveShadow = true;
    chassisGroup.add(frame);

    // Front electronics console
    const consoleGeo = trackGeo(new THREE.BoxGeometry(0.45, 0.34, 0.85));
    const consoleBox = new THREE.Mesh(consoleGeo, matteWhiteMat);
    consoleBox.position.set(0.95, 0.78, 0);
    consoleBox.castShadow = true;
    chassisGroup.add(consoleBox);

    registerExplodable(chassisGroup, new THREE.Vector3(0, 0.25, 0), explodableParts);
    root.add(chassisGroup);

    // 2. Dual Tubular Seats
    const seatGroup = new THREE.Group();
    [-0.36, 0.36].forEach((zOff) => {
      const base = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.46, 0.06, 0.48)), matteWhiteMat);
      base.position.set(-0.15, 0.72, zOff);
      base.castShadow = true;
      seatGroup.add(base);

      const back = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.06, 0.55, 0.46)), matteWhiteMat);
      back.position.set(-0.38, 0.98, zOff);
      back.rotation.z = 0.15;
      back.castShadow = true;
      seatGroup.add(back);
    });
    registerExplodable(seatGroup, new THREE.Vector3(-0.3, 0.65, 0), explodableParts);
    root.add(seatGroup);
    hotspotMeshes.set('seats', seatGroup);
    hotspotAnchors.set('seats', new THREE.Vector3(-0.25, 1.25, 0.35));

    // 3. Four Wire-Mesh Wheels & Dust Fenders
    const wheelGroup = new THREE.Group();
    const wheelPositions: [number, number][] = [
      [0.95, 0.84],
      [0.95, -0.84],
      [-0.95, 0.84],
      [-0.95, -0.84],
    ];
    wheelPositions.forEach(([wx, wz]) => {
      const tireGeo = trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 24));
      const tire = new THREE.Mesh(tireGeo, darkTitaniumMat);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(wx, 0.38, wz);
      tire.castShadow = true;
      tire.receiveShadow = true;
      wheelGroup.add(tire);

      const hub = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.25, 16)),
        brushedAlumMat
      );
      hub.rotation.x = Math.PI / 2;
      hub.position.set(wx, 0.38, wz);
      wheelGroup.add(hub);

      const fender = new THREE.Mesh(
        trackGeo(
          new THREE.CylinderGeometry(0.46, 0.46, 0.26, 16, 1, true, -Math.PI * 0.35, Math.PI * 0.7)
        ),
        accentCopperMat
      );
      fender.rotation.x = Math.PI / 2;
      fender.rotation.z = Math.PI / 2;
      fender.position.set(wx, 0.46, wz);
      fender.material.side = THREE.DoubleSide;
      wheelGroup.add(fender);
    });
    registerExplodable(wheelGroup, new THREE.Vector3(0, -0.22, 0), explodableParts);
    root.add(wheelGroup);
    hotspotMeshes.set('wheels', wheelGroup);
    hotspotAnchors.set('wheels', new THREE.Vector3(-0.95, 0.55, 0.92));

    // 4. LCRU TV Camera Mast
    const camGroup = new THREE.Group();
    addTubeStrut(
      camGroup,
      new THREE.Vector3(0.75, 0.64, -0.28),
      new THREE.Vector3(0.75, 1.38, -0.28),
      0.032,
      brushedAlumMat,
      geometries
    );
    const camBody = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.34, 0.22, 0.22)),
      brushedAlumMat
    );
    camBody.position.set(0.78, 1.44, -0.28);
    camBody.castShadow = true;
    camGroup.add(camBody);

    const camLens = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.065, 0.065, 0.12, 16)),
      lensMat
    );
    camLens.rotation.z = Math.PI / 2;
    camLens.position.set(0.96, 1.44, -0.28);
    camGroup.add(camLens);

    registerExplodable(camGroup, new THREE.Vector3(0.35, 0.85, -0.2), explodableParts);
    root.add(camGroup);
    hotspotMeshes.set('camera', camBody);
    hotspotAnchors.set('camera', new THREE.Vector3(0.85, 1.62, -0.28));

    // 5. High-Gain Umbrella Dish Antenna
    const dishGroup = new THREE.Group();
    addTubeStrut(
      dishGroup,
      new THREE.Vector3(1.12, 0.64, 0.28),
      new THREE.Vector3(1.12, 1.72, 0.28),
      0.028,
      brushedAlumMat,
      geometries
    );
    const dishPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.28, 0.06),
      new THREE.Vector2(0.56, 0.24),
    ];
    const dishMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: '#d4943a',
        metalness: 0.78,
        roughness: 0.35,
        side: THREE.DoubleSide,
      })
    );
    const dish = new THREE.Mesh(trackGeo(new THREE.LatheGeometry(dishPts, 16)), dishMat);
    dish.position.set(1.12, 1.72, 0.28);
    dish.rotation.z = -0.35;
    dish.castShadow = true;
    dishGroup.add(dish);

    registerExplodable(dishGroup, new THREE.Vector3(0.45, 1.15, 0.25), explodableParts);
    root.add(dishGroup);
    hotspotMeshes.set('dish', dish);
    hotspotAnchors.set('dish', new THREE.Vector3(1.15, 2.05, 0.28));
  } else if (modelKey === 'surveyor') {
    // 1. Triangular Tubular Tripod Chassis + 3 Legs
    const frameGroup = new THREE.Group();
    const coreBox = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.68, 0.68, 0.32, 3)),
      matteWhiteMat
    );
    coreBox.position.y = 0.85;
    coreBox.castShadow = true;
    frameGroup.add(coreBox);

    [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].forEach((ang) => {
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);
      const top = new THREE.Vector3(cos * 0.56, 0.85, sin * 0.56);
      const foot = new THREE.Vector3(cos * 1.48, 0.04, sin * 1.48);
      addTubeStrut(frameGroup, top, foot, 0.042, brushedAlumMat, geometries);
      const pad = createFootpad(0.24, matteWhiteMat);
      pad.position.set(foot.x, 0, foot.z);
      frameGroup.add(pad);
    });
    registerExplodable(frameGroup, new THREE.Vector3(0, -0.15, 0), explodableParts);
    root.add(frameGroup);
    hotspotMeshes.set('tripod', frameGroup);
    hotspotAnchors.set('tripod', new THREE.Vector3(-1.15, 0.35, 0.75));

    // 2. Central Mast & Photovoltaic Solar Wing
    const mastGroup = new THREE.Group();
    addTubeStrut(
      mastGroup,
      new THREE.Vector3(0, 0.98, 0),
      new THREE.Vector3(0, 2.55, 0),
      0.045,
      brushedAlumMat,
      geometries
    );
    const panel = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.12, 0.72, 0.05)), solarMat);
    panel.position.set(0, 2.45, 0);
    panel.rotation.x = 0.55;
    panel.castShadow = true;
    mastGroup.add(panel);
    registerExplodable(mastGroup, new THREE.Vector3(0, 0.95, 0), explodableParts);
    root.add(mastGroup);
    hotspotMeshes.set('solar', panel);
    hotspotAnchors.set('solar', new THREE.Vector3(0, 2.65, 0.2));

    // 3. Empty TV Camera Bracket (Removed by Apollo 12)
    const camMountGroup = new THREE.Group();
    const mountBracket = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.26, 0.38, 0.26)),
      accentCopperMat
    );
    mountBracket.position.set(0.32, 1.32, 0.35);
    camMountGroup.add(mountBracket);
    registerExplodable(camMountGroup, new THREE.Vector3(0.35, 0.45, 0.35), explodableParts);
    root.add(camMountGroup);
    hotspotMeshes.set('camera-gap', mountBracket);
    hotspotAnchors.set('camera-gap', new THREE.Vector3(0.45, 1.5, 0.45));

    // 4. Soil Mechanics Pantograph Arm
    const armGroup = new THREE.Group();
    const pA = new THREE.Vector3(0.56, 0.92, 0);
    const pB = new THREE.Vector3(1.15, 1.12, 0.12);
    const pC = new THREE.Vector3(1.62, 0.65, 0.18);
    addTubeStrut(armGroup, pA, pB, 0.025, brushedAlumMat, geometries);
    addTubeStrut(armGroup, pB, pC, 0.025, brushedAlumMat, geometries);
    const scoop = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.22, 0.12, 0.14)),
      accentCopperMat
    );
    scoop.position.copy(pC);
    scoop.castShadow = true;
    armGroup.add(scoop);
    registerExplodable(armGroup, new THREE.Vector3(0.65, 0.2, 0.2), explodableParts);
    root.add(armGroup);
    hotspotMeshes.set('scoop', scoop);
    hotspotAnchors.set('scoop', new THREE.Vector3(1.65, 0.85, 0.2));
  } else if (modelKey === 'viking') {
    // 1. Hexagonal Thermal Body + 3 Landing Legs
    const bodyGroup = new THREE.Group();
    const hexBody = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.18, 1.18, 0.48, 6)),
      brushedAlumMat
    );
    hexBody.position.y = 0.96;
    hexBody.castShadow = true;
    hexBody.receiveShadow = true;
    bodyGroup.add(hexBody);

    // Cylindrical Facsimile Cameras
    [-0.36, 0.36].forEach((xOff) => {
      const cam = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.38, 16)),
        matteWhiteMat
      );
      cam.position.set(xOff, 1.38, 0.35);
      cam.castShadow = true;
      bodyGroup.add(cam);
    });

    [Math.PI / 6, (5 * Math.PI) / 6, (3 * Math.PI) / 2].forEach((ang) => {
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);
      const top = new THREE.Vector3(cos * 1.02, 0.82, sin * 1.02);
      const foot = new THREE.Vector3(cos * 1.65, 0.04, sin * 1.65);
      addTubeStrut(bodyGroup, top, foot, 0.048, darkTitaniumMat, geometries);
      const pad = createFootpad(0.26, brushedAlumMat);
      pad.position.set(foot.x, 0, foot.z);
      bodyGroup.add(pad);
    });
    registerExplodable(bodyGroup, new THREE.Vector3(0, 0.15, 0), explodableParts);
    root.add(bodyGroup);
    hotspotMeshes.set('body', hexBody);
    hotspotAnchors.set('body', new THREE.Vector3(0, 1.15, 1.1));

    // 2. Twin SNAP-19 RTG Nuclear Cylinders
    const rtgGroup = new THREE.Group();
    [-1.28, 1.28].forEach((xOff) => {
      const cyl = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 0.62, 16)),
        darkTitaniumMat
      );
      cyl.rotation.z = Math.PI / 2;
      cyl.position.set(xOff, 0.98, 0);
      cyl.castShadow = true;
      rtgGroup.add(cyl);

      // Cooling fins
      for (let f = 0; f < 4; f++) {
        const fin = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.58, 0.56, 0.025)),
          accentCopperMat
        );
        fin.position.set(xOff, 0.98, 0);
        fin.rotation.x = (f * Math.PI) / 4;
        rtgGroup.add(fin);
      }
    });
    registerExplodable(rtgGroup, new THREE.Vector3(-0.65, 0.25, 0), explodableParts);
    root.add(rtgGroup);
    hotspotMeshes.set('rtg', rtgGroup);
    hotspotAnchors.set('rtg', new THREE.Vector3(-1.35, 1.32, 0));

    // 3. Misaligned S-Band Parabolic Dish
    const dishGroup = new THREE.Group();
    addTubeStrut(
      dishGroup,
      new THREE.Vector3(-0.35, 1.2, -0.35),
      new THREE.Vector3(-0.35, 1.98, -0.35),
      0.036,
      brushedAlumMat,
      geometries
    );
    const dishPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.32, 0.08),
      new THREE.Vector2(0.58, 0.26),
    ];
    const dish = new THREE.Mesh(trackGeo(new THREE.LatheGeometry(dishPts, 24)), matteWhiteMat);
    dish.position.set(-0.35, 2.02, -0.35);
    dish.rotation.x = 0.68;
    dish.rotation.z = -0.35;
    dish.castShadow = true;
    dishGroup.add(dish);
    registerExplodable(dishGroup, new THREE.Vector3(-0.2, 0.95, -0.2), explodableParts);
    root.add(dishGroup);
    hotspotMeshes.set('dish', dish);
    hotspotAnchors.set('dish', new THREE.Vector3(-0.4, 2.35, -0.2));

    // 4. Biology Soil-Sampling Arm
    const armGroup = new THREE.Group();
    const a1 = new THREE.Vector3(0.88, 1.04, 0.52);
    const a2 = new THREE.Vector3(1.48, 1.18, 0.95);
    const a3 = new THREE.Vector3(1.88, 0.35, 1.12);
    addTubeStrut(armGroup, a1, a2, 0.032, brushedAlumMat, geometries);
    addTubeStrut(armGroup, a2, a3, 0.028, brushedAlumMat, geometries);
    const claw = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.18, 0.14, 0.2)),
      accentCopperMat
    );
    claw.position.copy(a3);
    claw.castShadow = true;
    armGroup.add(claw);
    registerExplodable(armGroup, new THREE.Vector3(0.55, 0.2, 0.45), explodableParts);
    root.add(armGroup);
    hotspotMeshes.set('arm', claw);
    hotspotAnchors.set('arm', new THREE.Vector3(1.75, 0.8, 1.05));
  } else if (modelKey === 'sojourner') {
    // 1. Warm Electronics Box (WEB)
    const webGroup = new THREE.Group();
    const web = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.42, 0.42, 1.08)),
      kaptonMat
    );
    web.position.y = 0.56;
    web.castShadow = true;
    web.receiveShadow = true;
    webGroup.add(web);

    // Stereo hazard cameras
    [-0.22, 0.22].forEach((zOff) => {
      const eye = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.1, 14)),
        lensMat
      );
      eye.rotation.z = Math.PI / 2;
      eye.position.set(0.74, 0.66, zOff);
      webGroup.add(eye);
    });
    registerExplodable(webGroup, new THREE.Vector3(0, 0.35, 0), explodableParts);
    root.add(webGroup);

    // 2. GaAs Solar Deck
    const deckGroup = new THREE.Group();
    const deck = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.62, 0.06, 1.24)),
      solarMat
    );
    deck.position.y = 0.82;
    deck.castShadow = true;
    deckGroup.add(deck);

    // UHF Whip Antenna
    addTubeStrut(
      deckGroup,
      new THREE.Vector3(-0.62, 0.84, -0.42),
      new THREE.Vector3(-0.78, 1.78, -0.42),
      0.018,
      brushedAlumMat,
      geometries
    );
    registerExplodable(deckGroup, new THREE.Vector3(0, 0.88, 0), explodableParts);
    root.add(deckGroup);
    hotspotMeshes.set('solar-deck', deck);
    hotspotAnchors.set('solar-deck', new THREE.Vector3(0.15, 0.96, 0.25));
    hotspotMeshes.set('antenna', deckGroup);
    hotspotAnchors.set('antenna', new THREE.Vector3(-0.76, 1.72, -0.42));

    // 3. Rear APXS Spectrometer
    const apxsGroup = new THREE.Group();
    const apxsHead = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.16, 0.26, 16)),
      accentCopperMat
    );
    apxsHead.rotation.z = Math.PI / 2;
    apxsHead.position.set(-1.02, 0.46, 0);
    apxsHead.castShadow = true;
    apxsGroup.add(apxsHead);
    addTubeStrut(
      apxsGroup,
      new THREE.Vector3(-0.7, 0.52, 0),
      new THREE.Vector3(-0.92, 0.46, 0),
      0.032,
      brushedAlumMat,
      geometries
    );
    registerExplodable(apxsGroup, new THREE.Vector3(-0.55, 0.15, 0), explodableParts);
    root.add(apxsGroup);
    hotspotMeshes.set('apxs', apxsHead);
    hotspotAnchors.set('apxs', new THREE.Vector3(-1.08, 0.68, 0));

    // 4. Rocker-Bogie 6-Wheel Suspension
    const bogieGroup = new THREE.Group();
    [-0.68, 0.68].forEach((zSide) => {
      const xs = [-0.66, 0, 0.66];
      xs.forEach((wx) => {
        const wheel = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 20)),
          brushedAlumMat
        );
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.22, zSide);
        wheel.castShadow = true;
        wheel.receiveShadow = true;
        bogieGroup.add(wheel);

        const hub = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 12)),
          darkTitaniumMat
        );
        hub.rotation.x = Math.PI / 2;
        hub.position.set(wx, 0.22, zSide);
        bogieGroup.add(hub);
      });
      addTubeStrut(
        bogieGroup,
        new THREE.Vector3(-0.66, 0.22, zSide),
        new THREE.Vector3(0, 0.52, zSide),
        0.025,
        brushedAlumMat,
        geometries
      );
      addTubeStrut(
        bogieGroup,
        new THREE.Vector3(0, 0.22, zSide),
        new THREE.Vector3(0, 0.52, zSide),
        0.025,
        brushedAlumMat,
        geometries
      );
      addTubeStrut(
        bogieGroup,
        new THREE.Vector3(0, 0.52, zSide),
        new THREE.Vector3(0.66, 0.22, zSide),
        0.025,
        brushedAlumMat,
        geometries
      );
    });
    registerExplodable(bogieGroup, new THREE.Vector3(0, -0.25, 0), explodableParts);
    root.add(bogieGroup);
    hotspotMeshes.set('bogie', bogieGroup);
    hotspotAnchors.set('bogie', new THREE.Vector3(0, 0.42, 0.82));
  } else {
    // Opportunity (MER-B)
    // 1. Warm Electronics Box Body
    const bodyGroup = new THREE.Group();
    const webBody = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.16, 0.48, 0.92)),
      kaptonMat
    );
    webBody.position.y = 0.78;
    webBody.castShadow = true;
    webBody.receiveShadow = true;
    bodyGroup.add(webBody);
    registerExplodable(bodyGroup, new THREE.Vector3(0, 0.2, 0), explodableParts);
    root.add(bodyGroup);

    // 2. Triangular Bat-Wing Solar Array Deck
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0.85, 0);
    wingShape.lineTo(-0.55, 1.32);
    wingShape.lineTo(-0.88, 0.82);
    wingShape.lineTo(-0.88, -0.82);
    wingShape.lineTo(-0.55, -1.32);
    wingShape.closePath();

    const wingGeo = trackGeo(
      new THREE.ExtrudeGeometry(wingShape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2,
      })
    );
    wingGeo.rotateX(Math.PI / 2);

    const wingsGroup = new THREE.Group();
    const wings = new THREE.Mesh(wingGeo, solarMat);
    wings.position.y = 1.06;
    wings.castShadow = true;
    wings.receiveShadow = true;
    wingsGroup.add(wings);

    // High-gain gimballed dish
    const hgDish = new THREE.Mesh(
      trackGeo(
        new THREE.LatheGeometry(
          [new THREE.Vector2(0, 0), new THREE.Vector2(0.26, 0.09)],
          18
        )
      ),
      matteWhiteMat
    );
    hgDish.position.set(-0.48, 1.32, 0.36);
    hgDish.rotation.z = 0.45;
    hgDish.castShadow = true;
    wingsGroup.add(hgDish);

    registerExplodable(wingsGroup, new THREE.Vector3(0, 0.72, 0), explodableParts);
    root.add(wingsGroup);
    hotspotMeshes.set('wings', wings);
    hotspotAnchors.set('wings', new THREE.Vector3(-0.35, 1.18, 1.05));

    // 3. Pancam Mast & Stereo Camera Head
    const mastGroup = new THREE.Group();
    addTubeStrut(
      mastGroup,
      new THREE.Vector3(0.42, 1.05, 0.22),
      new THREE.Vector3(0.42, 2.02, 0.22),
      0.042,
      matteWhiteMat,
      geometries
    );
    const headBar = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.18, 0.18, 0.56)),
      matteWhiteMat
    );
    headBar.position.set(0.44, 2.08, 0.22);
    headBar.castShadow = true;
    mastGroup.add(headBar);

    [-0.18, 0.18].forEach((zOff) => {
      const eye = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 14)),
        lensMat
      );
      eye.rotation.z = Math.PI / 2;
      eye.position.set(0.54, 2.08, 0.22 + zOff);
      mastGroup.add(eye);
    });
    registerExplodable(mastGroup, new THREE.Vector3(0.2, 1.05, 0.15), explodableParts);
    root.add(mastGroup);
    hotspotMeshes.set('pancam', headBar);
    hotspotAnchors.set('pancam', new THREE.Vector3(0.45, 2.32, 0.22));

    // 4. Front IDD Robotic Arm + Rock Abrasion Tool
    const iddGroup = new THREE.Group();
    const j1 = new THREE.Vector3(0.62, 0.76, -0.18);
    const j2 = new THREE.Vector3(1.12, 0.92, -0.12);
    const j3 = new THREE.Vector3(1.36, 0.42, 0.05);
    addTubeStrut(iddGroup, j1, j2, 0.028, brushedAlumMat, geometries);
    addTubeStrut(iddGroup, j2, j3, 0.026, brushedAlumMat, geometries);
    const rat = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16)),
      accentCopperMat
    );
    rat.position.copy(j3);
    rat.rotation.z = 0.6;
    rat.castShadow = true;
    iddGroup.add(rat);
    registerExplodable(iddGroup, new THREE.Vector3(0.65, 0.2, 0), explodableParts);
    root.add(iddGroup);
    hotspotMeshes.set('idd', rat);
    hotspotAnchors.set('idd', new THREE.Vector3(1.38, 0.62, 0.05));

    // 5. 6 Rugged Rocker-Bogie Wheels
    const wheelGroup = new THREE.Group();
    [-0.78, 0.78].forEach((zSide) => {
      [-0.76, 0, 0.76].forEach((wx) => {
        const w = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 0.16, 20)),
          darkTitaniumMat
        );
        w.rotation.x = Math.PI / 2;
        w.position.set(wx, 0.25, zSide);
        w.castShadow = true;
        w.receiveShadow = true;
        wheelGroup.add(w);

        const rim = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 14)),
          brushedAlumMat
        );
        rim.rotation.x = Math.PI / 2;
        rim.position.set(wx, 0.25, zSide);
        wheelGroup.add(rim);
      });
      addTubeStrut(
        wheelGroup,
        new THREE.Vector3(-0.76, 0.25, zSide),
        new THREE.Vector3(0, 0.64, zSide),
        0.028,
        brushedAlumMat,
        geometries
      );
      addTubeStrut(
        wheelGroup,
        new THREE.Vector3(0, 0.25, zSide),
        new THREE.Vector3(0, 0.64, zSide),
        0.028,
        brushedAlumMat,
        geometries
      );
      addTubeStrut(
        wheelGroup,
        new THREE.Vector3(0, 0.64, zSide),
        new THREE.Vector3(0.76, 0.25, zSide),
        0.028,
        brushedAlumMat,
        geometries
      );
    });
    registerExplodable(wheelGroup, new THREE.Vector3(0, -0.25, 0), explodableParts);
    root.add(wheelGroup);
    hotspotMeshes.set('wheels-opp', wheelGroup);
    hotspotAnchors.set('wheels-opp', new THREE.Vector3(0, 0.42, 0.92));
  }

  return {
    root,
    explodableParts,
    hotspotMeshes,
    hotspotAnchors,
    disposables: { geometries, materials, textures },
  };
}
