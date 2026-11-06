"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CAMERA_PRESETS = [
  { id: "hero", label: "Perspective", shortLabel: "3D", yaw: -0.64, pitch: 0.19, distance: 5.4 },
  { id: "left", label: "Driver Side", shortLabel: "Left", yaw: 0.0, pitch: 0.08, distance: 5.3 },
  { id: "right", label: "Passenger", shortLabel: "Right", yaw: Math.PI, pitch: 0.08, distance: 5.3 },
  { id: "front", label: "Front", shortLabel: "Front", yaw: -Math.PI / 2, pitch: 0.11, distance: 5.1 },
  { id: "rear", label: "Rear", shortLabel: "Rear", yaw: Math.PI / 2, pitch: 0.11, distance: 5.1 },
  { id: "roof", label: "Top View", shortLabel: "Top", yaw: -0.55, pitch: 0.85, distance: 5.7 },
];

function CameraAngleIcon({ presetId }) {
  switch (presetId) {
    case "left":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 15V9.5L6 6.5h11.5a2 2 0 0 1 2 2V15H2.5Z" />
          <circle cx="7" cy="15.5" r="2" />
          <circle cx="16.5" cy="15.5" r="2" />
        </svg>
      );
    case "right":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 15V9.5L18 6.5H6.5a2 2 0 0 0-2 2V15h17Z" />
          <circle cx="7.5" cy="15.5" r="2" />
          <circle cx="17" cy="15.5" r="2" />
        </svg>
      );
    case "front":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="5" width="14" height="11" rx="2.5" />
          <path d="M5 11h14" />
          <path d="M7 16v2.5M17 16v2.5" />
          <circle cx="8" cy="13.5" r="1" />
          <circle cx="16" cy="13.5" r="1" />
        </svg>
      );
    case "rear":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="5" width="14" height="11" rx="2" />
          <path d="M12 5v11" />
          <path d="M7 16v2.5M17 16v2.5" />
        </svg>
      );
    case "roof":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="3" width="12" height="18" rx="3" />
          <path d="M6 8.5h12M6 16.5h12" />
        </svg>
      );
    case "hero":
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 12 20 7.5M12 12v9M12 12 4 7.5" />
        </svg>
      );
  }
}

const VEHICLE_ICON_OPTIONS = [
  { id: "cargo-van", label: "Cargo Van" },
  { id: "sprinter", label: "High-Roof Van" },
  { id: "box-truck", label: "Box Truck" },
  { id: "pickup", label: "Pickup Truck" },
  { id: "suv", label: "SUV / Fleet" },
  { id: "sedan", label: "Sedan / Coupe" },
];

function inferDefaultIconId(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("sprinter")) return "sprinter";
  if (lower.includes("truck") || lower.includes("box")) return "box-truck";
  if (lower.includes("pickup") || lower.includes("raptor")) return "pickup";
  if (lower.includes("suv")) return "suv";
  return "cargo-van";
}

function humanizeFilenameClient(filename = "") {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function VehicleIcon({ iconId = "cargo-van", size = 16 }) {
  switch (iconId) {
    case "sprinter":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 16V7a2 2 0 0 1 2-2h11.5l3.2 4.5L22 12v4H2Z" />
          <path d="M15 5v6h5.5" />
          <circle cx="6.5" cy="16.5" r="2" />
          <circle cx="17.5" cy="16.5" r="2" />
        </svg>
      );
    case "box-truck":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="13" height="10" rx="1" />
          <path d="M15 9h4l3 3.5V15h-7V9Z" />
          <circle cx="6.5" cy="16.5" r="2" />
          <circle cx="18" cy="16.5" r="2" />
        </svg>
      );
    case "pickup":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h7V7h5.5l2.8 4H22v4H2v-3Z" />
          <circle cx="6.5" cy="16" r="2" />
          <circle cx="17.5" cy="16" r="2" />
        </svg>
      );
    case "suv":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 15v-4l2.2-4.2h11.2L19 10l3 1.5V15H3Z" />
          <path d="M10.5 6.8v4.2" />
          <circle cx="6.8" cy="16" r="2" />
          <circle cx="17.2" cy="16" r="2" />
        </svg>
      );
    case "sedan":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 14.5v-2.2l3.8-3.8h8.8l3.6 3.2L22 12.8v1.7H2Z" />
          <circle cx="6.5" cy="15.5" r="2" />
          <circle cx="17.5" cy="15.5" r="2" />
        </svg>
      );
    case "cargo-van":
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 15V8.5a1.5 1.5 0 0 1 1.5-1.5h11.2l3.3 4 3 1.5V15H2.5Z" />
          <path d="M14.5 7v4.5h4.8" />
          <circle cx="6.5" cy="16" r="2" />
          <circle cx="17.5" cy="16" r="2" />
        </svg>
      );
  }
}

const LOCAL_DB_NAME = "vws_local_studio_db";
const LOCAL_DB_VERSION = 1;
const STORE_MODELS = "custom_models";
const STORE_WRAPS = "custom_wraps";

function openLocalStudioDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }
    const req = window.indexedDB.open(LOCAL_DB_NAME, LOCAL_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_MODELS)) {
        db.createObjectStore(STORE_MODELS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_WRAPS)) {
        db.createObjectStore(STORE_WRAPS, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getSavedCustomModelsFromDB() {
  const db = await openLocalStudioDB();
  if (!db) return [];
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_MODELS, "readonly");
    const store = tx.objectStore(STORE_MODELS);
    const req = store.getAll();
    req.onsuccess = () => {
      const rows = req.result || [];
      rows.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      const mapped = rows.map((row) => {
        const blob = new Blob([row.buffer], { type: "model/gltf-binary" });
        const url = URL.createObjectURL(blob);
        return {
          id: row.id,
          name: row.name,
          filename: row.filename,
          iconId: row.iconId || "cargo-van",
          url,
          isCustom: true,
        };
      });
      resolve(mapped);
    };
    req.onerror = () => resolve([]);
  });
}

async function saveCustomModelToDB(record) {
  const db = await openLocalStudioDB();
  if (!db) return;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MODELS, "readwrite");
    tx.objectStore(STORE_MODELS).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteCustomModelFromDB(id) {
  const db = await openLocalStudioDB();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_MODELS, "readwrite");
    tx.objectStore(STORE_MODELS).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

async function getSavedCustomWrapsFromDB() {
  const db = await openLocalStudioDB();
  if (!db) return [];
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_WRAPS, "readonly");
    const store = tx.objectStore(STORE_WRAPS);
    const req = store.getAll();
    req.onsuccess = () => {
      const rows = req.result || [];
      rows.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      const mapped = rows.map((row) => {
        const blob = new Blob([row.buffer], { type: row.mimeType || "image/png" });
        const url = URL.createObjectURL(blob);
        let thumbUrl = url;
        if (row.thumbBuffer) {
          const thumbBlob = new Blob([row.thumbBuffer], { type: "image/png" });
          thumbUrl = URL.createObjectURL(thumbBlob);
        }
        return {
          id: row.id,
          name: row.name,
          url,
          thumbUrl,
          mode: row.mode || "single",
          isCustom: true,
        };
      });
      resolve(mapped);
    };
    req.onerror = () => resolve([]);
  });
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function canvasToArrayBuffer(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas export failed"));
        return;
      }
      blob.arrayBuffer().then(resolve).catch(reject);
    }, "image/png");
  });
}

const MULTI_VIEW_SLOTS = [
  { id: "left", label: "Driver Side", sub: "Left Profile", wide: true },
  { id: "right", label: "Passenger Side", sub: "Right Profile", wide: true },
  { id: "front", label: "Front / Hood", sub: "Front Fascia", wide: false },
  { id: "rear", label: "Rear Doors", sub: "Tailgate", wide: false },
  { id: "top", label: "Roof / Top", sub: "Overhead", wide: false },
];

async function buildMultiViewAtlasBuffers(viewsMap) {
  // 2048x2048 5-region atlas:
  // Row 0: Left (0..1024, 0..1024), Right (1024..2048, 0..1024)
  // Row 1: Front (0..682, 1024..2048), Rear (682..1365, 1024..2048), Top (1365..2048, 1024..2048)
  const atlas = document.createElement("canvas");
  atlas.width = 2048;
  atlas.height = 2048;
  const ctx = atlas.getContext("2d");

  // Fill base with Factory Pearl White so unassigned views remain OEM Pearl White
  ctx.fillStyle = "#F4F5F7";
  ctx.fillRect(0, 0, atlas.width, atlas.height);

  const regions = {
    left: { x: 0, y: 0, w: 1024, h: 1024 },
    right: { x: 1024, y: 0, w: 1024, h: 1024 },
    front: { x: 0, y: 1024, w: 682, h: 1024 },
    rear: { x: 682, y: 1024, w: 683, h: 1024 },
    top: { x: 1365, y: 1024, w: 683, h: 1024 },
  };

  const loadedImages = [];
  for (const slot of MULTI_VIEW_SLOTS) {
    const entry = viewsMap[slot.id];
    if (entry?.previewUrl) {
      const img = await loadImageElement(entry.previewUrl);
      const r = regions[slot.id];
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
      loadedImages.push(img);
    }
  }

  // Create clean swatch preview thumbnail (640x360)
  const thumb = document.createElement("canvas");
  thumb.width = 640;
  thumb.height = 360;
  const tctx = thumb.getContext("2d");
  tctx.fillStyle = "#F4F5F7";
  tctx.fillRect(0, 0, thumb.width, thumb.height);

  if (loadedImages.length === 1) {
    tctx.drawImage(loadedImages[0], 0, 0, thumb.width, thumb.height);
  } else if (loadedImages.length >= 2) {
    const count = Math.min(loadedImages.length, 4);
    const sliceW = thumb.width / count;
    for (let i = 0; i < count; i++) {
      tctx.drawImage(loadedImages[i], i * sliceW, 0, sliceW, thumb.height);
    }
  }

  const [atlasBuffer, thumbBuffer] = await Promise.all([
    canvasToArrayBuffer(atlas),
    canvasToArrayBuffer(thumb),
  ]);
  return { atlasBuffer, thumbBuffer };
}

async function saveCustomWrapToDB(record) {
  const db = await openLocalStudioDB();
  if (!db) return;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WRAPS, "readwrite");
    tx.objectStore(STORE_WRAPS).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteCustomWrapFromDB(id) {
  const db = await openLocalStudioDB();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_WRAPS, "readwrite");
    tx.objectStore(STORE_WRAPS).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

function mat4Identity() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

function mat4Multiply(a, b) {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function mat4FromTRS(t = [0, 0, 0], q = [0, 0, 0, 1], s = [1, 1, 1]) {
  const [x, y, z, w] = q;
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  const [sx, sy, sz] = s;

  return new Float32Array([
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    t[0], t[1], t[2], 1,
  ]);
}

function mat4PerspectiveOffset(fovy, aspect, near, far, offsetX = 0, offsetY = 0) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    offsetX, offsetY, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function mat4LookAt(eye, center, up) {
  let zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len; zy /= len; zz /= len;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len; xy /= len; xz /= len;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
    -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
    -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
    1,
  ]);
}

function transformPoint(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

function transformNormal(m, nx, ny, nz) {
  const rx = m[0] * nx + m[4] * ny + m[8] * nz;
  const ry = m[1] * nx + m[5] * ny + m[9] * nz;
  const rz = m[2] * nx + m[6] * ny + m[10] * nz;
  const len = Math.hypot(rx, ry, rz) || 1;
  return [rx / len, ry / len, rz / len];
}

async function parseGLB(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const magic = view.getUint32(0, true);
  if (magic !== 0x46546c67) {
    throw new Error("Invalid GLB file.");
  }

  const jsonLen = view.getUint32(12, true);
  const jsonBytes = new Uint8Array(arrayBuffer, 20, jsonLen);
  const json = JSON.parse(new TextDecoder("utf-8").decode(jsonBytes));

  const binChunkStart = 20 + jsonLen;
  const binDataOffset = binChunkStart + 8;

  function readAccessor(accessorIndex) {
    if (accessorIndex === undefined || accessorIndex === null) return null;
    const acc = json.accessors[accessorIndex];
    const bv = json.bufferViews[acc.bufferView];
    const byteOffset = binDataOffset + (bv.byteOffset || 0) + (acc.byteOffset || 0);
    const numComponents =
      acc.type === "SCALAR" ? 1 : acc.type === "VEC2" ? 2 : acc.type === "VEC3" ? 3 : 4;
    const compSize =
      acc.componentType === 5126 || acc.componentType === 5125
        ? 4
        : acc.componentType === 5123 || acc.componentType === 5122
        ? 2
        : 1;
    const stride = bv.byteStride || numComponents * compSize;
    const out = new Float32Array(acc.count * numComponents);

    for (let i = 0; i < acc.count; i++) {
      const base = byteOffset + i * stride;
      for (let c = 0; c < numComponents; c++) {
        const addr = base + c * compSize;
        let val = 0;
        if (acc.componentType === 5126) val = view.getFloat32(addr, true);
        else if (acc.componentType === 5125) val = view.getUint32(addr, true);
        else if (acc.componentType === 5123) {
          val = view.getUint16(addr, true);
          if (acc.normalized) val /= 65535;
        } else if (acc.componentType === 5121) {
          val = view.getUint8(addr);
          if (acc.normalized) val /= 255;
        } else if (acc.componentType === 5122) {
          val = view.getInt16(addr, true);
          if (acc.normalized) val = Math.max(val / 32767, -1);
        } else if (acc.componentType === 5120) {
          val = view.getInt8(addr);
          if (acc.normalized) val = Math.max(val / 127, -1);
        }
        out[i * numComponents + c] = val;
      }
    }
    return { data: out, count: acc.count, numComponents };
  }

  const images = [];
  if (json.images) {
    for (const imgDef of json.images) {
      if (imgDef.bufferView !== undefined) {
        const bv = json.bufferViews[imgDef.bufferView];
        const slice = new Uint8Array(arrayBuffer, binDataOffset + (bv.byteOffset || 0), bv.byteLength);
        const blob = new Blob([slice], { type: imgDef.mimeType || "image/png" });
        const url = URL.createObjectURL(blob);
        const img = await new Promise((resolve) => {
          const el = new window.Image();
          el.onload = () => resolve(el);
          el.onerror = () => resolve(null);
          el.src = url;
        });
        URL.revokeObjectURL(url);
        images.push(img);
      } else {
        images.push(null);
      }
    }
  }

  const nodes = json.nodes || [];
  const childSet = new Set();
  nodes.forEach((n) => (n.children || []).forEach((c) => childSet.add(c)));
  const rootIndices =
    json.scenes && json.scenes[0]?.nodes
      ? json.scenes[0].nodes
      : nodes.map((_, idx) => idx).filter((idx) => !childSet.has(idx));

  const rawParts = [];
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  function visitNode(nodeIdx, parentMat) {
    const node = nodes[nodeIdx];
    if (!node) return;
    const localMat = node.matrix
      ? new Float32Array(node.matrix)
      : mat4FromTRS(node.translation, node.rotation, node.scale);
    const worldMat = mat4Multiply(parentMat, localMat);

    if (node.mesh !== undefined && json.meshes?.[node.mesh]) {
      const mesh = json.meshes[node.mesh];
      for (const prim of mesh.primitives || []) {
        if (prim.mode !== undefined && prim.mode !== 4) continue;
        const posAcc = readAccessor(prim.attributes.POSITION);
        if (!posAcc) continue;
        const normAcc = readAccessor(prim.attributes.NORMAL);
        const colAcc = readAccessor(prim.attributes.COLOR_0);
        const uvAcc = readAccessor(prim.attributes.TEXCOORD_0);
        const idxAcc = readAccessor(prim.indices);

        const mat = json.materials?.[prim.material] || {};
        const pbr = mat.pbrMetallicRoughness || {};
        const baseColor = pbr.baseColorFactor || [0.92, 0.93, 0.94, 1.0];
        const matName = (mat.name || mesh.name || "").toLowerCase();
        const isNamedBody =
          /carpaint|paint|carrosserie|body|exterior|coachwork|shell|skin/i.test(matName) &&
          !/glass|vitre|window|tire|wheel|rim|disk|chassis|shassis|interior|interrieur|plastic|black|light|phare|mirror|badge|plate/i.test(
            matName
          );
        const isGlass =
          !isNamedBody &&
          (/glass|vitre|window|windshield|light_glass|red_glass/i.test(matName) ||
            ((mat.alphaMode === "BLEND" || Boolean(mat.extensions?.KHR_materials_transmission)) &&
              baseColor[3] < 0.88));

        let texImage = null;
        let texIndex = null;
        if (pbr.baseColorTexture !== undefined) {
          const texDef = json.textures?.[pbr.baseColorTexture.index];
          const srcIdx = texDef ? texDef.source : pbr.baseColorTexture.index;
          texIndex = srcIdx;
          texImage = images[srcIdx] || null;
        }

        const vertCount = idxAcc ? idxAcc.count : posAcc.count;
        const positions = new Float32Array(vertCount * 3);
        const normals = new Float32Array(vertCount * 3);
        const colors = new Float32Array(vertCount * 3);
        const uvs = new Float32Array(vertCount * 2);

        for (let i = 0; i < vertCount; i++) {
          const vi = idxAcc ? Math.round(idxAcc.data[i]) : i;
          const [wx, wy, wz] = transformPoint(
            worldMat,
            posAcc.data[vi * 3],
            posAcc.data[vi * 3 + 1],
            posAcc.data[vi * 3 + 2]
          );
          positions[i * 3] = wx;
          positions[i * 3 + 1] = wy;
          positions[i * 3 + 2] = wz;

          if (wx < minX) minX = wx;
          if (wx > maxX) maxX = wx;
          if (wy < minY) minY = wy;
          if (wy > maxY) maxY = wy;
          if (wz < minZ) minZ = wz;
          if (wz > maxZ) maxZ = wz;

          if (normAcc) {
            const [nx, ny, nz] = transformNormal(
              worldMat,
              normAcc.data[vi * 3],
              normAcc.data[vi * 3 + 1],
              normAcc.data[vi * 3 + 2]
            );
            normals[i * 3] = nx;
            normals[i * 3 + 1] = ny;
            normals[i * 3 + 2] = nz;
          }

          if (colAcc) {
            const stride = colAcc.numComponents;
            colors[i * 3] = colAcc.data[vi * stride];
            colors[i * 3 + 1] = colAcc.data[vi * stride + 1];
            colors[i * 3 + 2] = colAcc.data[vi * stride + 2];
          } else {
            colors[i * 3] = baseColor[0];
            colors[i * 3 + 1] = baseColor[1];
            colors[i * 3 + 2] = baseColor[2];
          }

          if (uvAcc) {
            uvs[i * 2] = uvAcc.data[vi * 2];
            uvs[i * 2 + 1] = uvAcc.data[vi * 2 + 1];
          }
        }

        if (!normAcc) {
          for (let i = 0; i < vertCount; i += 3) {
            const ax = positions[i * 3], ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
            const bx = positions[(i + 1) * 3] - ax, by = positions[(i + 1) * 3 + 1] - ay, bz = positions[(i + 1) * 3 + 2] - az;
            const cx = positions[(i + 2) * 3] - ax, cy = positions[(i + 2) * 3 + 1] - ay, cz = positions[(i + 2) * 3 + 2] - az;
            let nx = by * cz - bz * cy, ny = bz * cx - bx * cz, nz = bx * cy - by * cx;
            const len = Math.hypot(nx, ny, nz) || 1;
            nx /= len; ny /= len; nz /= len;
            for (let k = 0; k < 3; k++) {
              normals[(i + k) * 3] = nx;
              normals[(i + k) * 3 + 1] = ny;
              normals[(i + k) * 3 + 2] = nz;
            }
          }
        }

        rawParts.push({
          positions,
          normals,
          colors,
          uvs,
          vertCount,
          isGlass,
          isNamedBody,
          hasColAttr: Boolean(colAcc),
          baseColor,
          baseAlpha: baseColor[3] ?? 1.0,
          texImage,
          texIndex,
          matIndex: prim.material,
          matName,
        });
      }
    }

    for (const childIdx of node.children || []) {
      visitNode(childIdx, worldMat);
    }
  }

  for (const rIdx of rootIndices) {
    visitNode(rIdx, mat4Identity());
  }

  // If the model's length is along Z instead of X, rotate 90° around Y so all vehicles share the exact same canonical orientation (X = length, Y = height, Z = width)
  if (maxZ - minZ > maxX - minX) {
    let nMinX = Infinity, nMaxX = -Infinity, nMinZ = Infinity, nMaxZ = -Infinity;
    for (const part of rawParts) {
      for (let i = 0; i < part.vertCount; i++) {
        const ox = part.positions[i * 3];
        const oz = part.positions[i * 3 + 2];
        const rx = oz;
        const rz = -ox;
        part.positions[i * 3] = rx;
        part.positions[i * 3 + 2] = rz;
        if (rx < nMinX) nMinX = rx;
        if (rx > nMaxX) nMaxX = rx;
        if (rz < nMinZ) nMinZ = rz;
        if (rz > nMaxZ) nMaxZ = rz;

        const onx = part.normals[i * 3];
        const onz = part.normals[i * 3 + 2];
        part.normals[i * 3] = onz;
        part.normals[i * 3 + 2] = -onx;
      }
    }
    minX = nMinX;
    maxX = nMaxX;
    minZ = nMinZ;
    maxZ = nMaxZ;
  }

  // Balanced studio scale (2.15 units max dimension so the vehicle has generous breathing room)
  const sizeX = maxX - minX || 1;
  const sizeY = maxY - minY || 1;
  const sizeZ = maxZ - minZ || 1;
  const maxDim = Math.max(sizeX, sizeY, sizeZ);
  const scale = 2.15 / maxDim;
  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const cz = (minZ + maxZ) * 0.5;

  // Universal 3-Tier Exterior Body Paint Detection across all GLB conventions
  const hasAnyNamedBody = rawParts.some((p) => p.isNamedBody);
  const hasAnyColAttr = rawParts.some((p) => p.hasColAttr);

  // Tier 2 helper: find dominant bright neutral vertex color when COLOR_0 is used
  let bodyColorRGB = [0.89, 0.89, 0.89];
  if (!hasAnyNamedBody && hasAnyColAttr) {
    const colorCounts = new Map();
    for (const part of rawParts) {
      if (part.isGlass || part.texImage) continue;
      for (let i = 0; i < part.vertCount; i++) {
        const r = part.colors[i * 3];
        const g = part.colors[i * 3 + 1];
        const b = part.colors[i * 3 + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        if (maxC > 0.65 && maxC - minC < 0.15) {
          const key = `${r.toFixed(2)},${g.toFixed(2)},${b.toFixed(2)}`;
          colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
        }
      }
    }
    let bestCount = 0;
    for (const [key, cnt] of colorCounts.entries()) {
      if (cnt > bestCount) {
        bestCount = cnt;
        bodyColorRGB = key.split(",").map(Number);
      }
    }
  }

  // Tier 3 helper: for generic material names (e.g. Default_OBJ.040 / Material.006), find the upper-body shell texture/material
  let shellTexIndex = null;
  let shellMatIndex = null;
  if (!hasAnyNamedBody && !hasAnyColAttr) {
    let bestShellScore = 0;
    for (const part of rawParts) {
      if (part.isGlass) continue;
      const bc = part.baseColor;
      const isBlackMat = !part.texImage && bc[0] < 0.08 && bc[1] < 0.08 && bc[2] < 0.08;
      if (isBlackMat) continue;

      let pMinX = Infinity, pMaxX = -Infinity, pMaxY = -Infinity;
      for (let i = 0; i < part.vertCount; i++) {
        const px = part.positions[i * 3];
        const py = part.positions[i * 3 + 1];
        if (px < pMinX) pMinX = px;
        if (px > pMaxX) pMaxX = px;
        if (py > pMaxY) pMaxY = py;
      }
      const reachesRoof = pMaxY > minY + 0.85 * sizeY;
      const spansLength = pMaxX - pMinX > 0.45 * sizeX;
      if (reachesRoof && spansLength && part.vertCount > bestShellScore) {
        bestShellScore = part.vertCount;
        shellTexIndex = part.texIndex;
        shellMatIndex = part.matIndex;
      }
    }
  }

  for (const part of rawParts) {
    const bodyMask = new Float32Array(part.vertCount);
    const normCoords = new Float32Array(part.vertCount * 3);

    const isTier3Body =
      !hasAnyNamedBody &&
      !hasAnyColAttr &&
      !part.isGlass &&
      ((shellTexIndex !== null && part.texIndex === shellTexIndex) ||
        (shellTexIndex === null && shellMatIndex !== null && part.matIndex === shellMatIndex));

    for (let i = 0; i < part.vertCount; i++) {
      const wx = part.positions[i * 3];
      const wy = part.positions[i * 3 + 1];
      const wz = part.positions[i * 3 + 2];

      const nx = (wx - minX) / sizeX;
      const ny = (wy - minY) / sizeY;
      const nz = (wz - minZ) / sizeZ;

      normCoords[i * 3] = nx;
      normCoords[i * 3 + 1] = ny;
      normCoords[i * 3 + 2] = nz;

      part.positions[i * 3] = (wx - cx) * scale;
      part.positions[i * 3 + 1] = (wy - cy) * scale;
      part.positions[i * 3 + 2] = (wz - cz) * scale;

      if (hasAnyNamedBody) {
        if (part.isNamedBody) {
          bodyMask[i] = 1.0;
        }
      } else if (hasAnyColAttr) {
        if (!part.isGlass && !part.texImage) {
          const r = part.colors[i * 3];
          const g = part.colors[i * 3 + 1];
          const b = part.colors[i * 3 + 2];
          const distToBody = Math.hypot(
            r - bodyColorRGB[0],
            g - bodyColorRGB[1],
            b - bodyColorRGB[2]
          );
          const isRoofPanel =
            ny > 0.82 &&
            part.normals[i * 3 + 1] > 0.35 &&
            r > 0.72 &&
            Math.abs(r - g) < 0.03 &&
            Math.abs(g - b) < 0.03;

          if (distToBody < 0.022 || isRoofPanel) {
            bodyMask[i] = 1.0;
          }
        }
      } else if (isTier3Body) {
        bodyMask[i] = 1.0;
      }
    }
    part.bodyMask = bodyMask;
    part.normCoords = normCoords;
  }

  return {
    parts: rawParts,
    floorY: (minY - cy) * scale,
    halfX: (sizeX * scale) * 0.5,
    halfZ: (sizeZ * scale) * 0.5,
  };
}

const CAR_VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec3 a_color;
layout(location = 3) in vec2 a_uv;
layout(location = 4) in float a_bodyMask;
layout(location = 5) in vec3 a_normCoord;

uniform mat4 u_mvp;
uniform mat4 u_model;

out vec3 v_worldPos;
out vec3 v_normal;
out vec3 v_color;
out vec2 v_uv;
out float v_bodyMask;
out vec3 v_normCoord;

void main() {
  vec4 worldPos = u_model * vec4(a_position, 1.0);
  v_worldPos = worldPos.xyz;
  v_normal = normalize(mat3(u_model) * a_normal);
  v_color = a_color;
  v_uv = a_uv;
  v_bodyMask = a_bodyMask;
  v_normCoord = a_normCoord;
  gl_Position = u_mvp * worldPos;
}
`;

const CAR_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec3 v_worldPos;
in vec3 v_normal;
in vec3 v_color;
in vec2 v_uv;
in float v_bodyMask;
in vec3 v_normCoord;

uniform vec3 u_cameraPos;
uniform bool u_hasPartTex;
uniform sampler2D u_partTex;
uniform bool u_hasWrapTex;
uniform sampler2D u_wrapTex;
uniform int u_wrapMode;
uniform bool u_isGlass;
uniform float u_baseAlpha;
uniform float u_floorY;

out vec4 outColor;

void main() {
  vec3 N = normalize(gl_FrontFacing ? v_normal : -v_normal);
  vec3 V = normalize(u_cameraPos - v_worldPos);
  vec3 R = reflect(-V, N);

  vec3 baseCol = v_color;
  if (u_hasPartTex) {
    baseCol = texture(u_partTex, v_uv).rgb;
  }
  if (v_bodyMask > 0.5 && !u_hasWrapTex) {
    // Refined pearl-white automotive factory finish across all models
    vec3 pearlWhite = vec3(0.955, 0.96, 0.97);
    if (u_hasPartTex) {
      float texLuma = dot(baseCol, vec3(0.299, 0.587, 0.114));
      baseCol = pearlWhite * mix(0.88, 1.02, clamp(texLuma, 0.0, 1.0));
    } else {
      baseCol = pearlWhite;
    }
  }

  bool isWrapped = u_hasWrapTex && (v_bodyMask > 0.5);
  if (isWrapped) {
    vec3 blendW = pow(abs(N), vec3(4.0));
    blendW /= (blendW.x + blendW.y + blendW.z + 0.0001);

    vec3 colSide;
    vec3 colFront;
    vec3 colTop;

    if (u_wrapMode == 1) {
      // Multi-View 5-Panel Atlas (Driver Side, Passenger Side, Front, Rear, Roof)
      vec2 localSide = clamp(
        vec2(N.z >= 0.0 ? 1.0 - v_normCoord.x : v_normCoord.x, 1.0 - v_normCoord.y),
        0.015,
        0.985
      );
      vec2 uvSideAtlas = N.z >= 0.0
        ? vec2(localSide.x * 0.5, localSide.y * 0.5)
        : vec2(0.5 + localSide.x * 0.5, localSide.y * 0.5);

      vec2 localFrontRear = clamp(
        vec2(N.x >= 0.0 ? v_normCoord.z : 1.0 - v_normCoord.z, 1.0 - v_normCoord.y),
        0.015,
        0.985
      );
      vec2 uvFrontRearAtlas = N.x >= 0.0
        ? vec2(localFrontRear.x * 0.333333, 0.5 + localFrontRear.y * 0.5)
        : vec2(0.333333 + localFrontRear.x * 0.333333, 0.5 + localFrontRear.y * 0.5);

      vec2 localTop = clamp(vec2(v_normCoord.x, v_normCoord.z), 0.015, 0.985);
      vec2 uvTopAtlas = vec2(0.666667 + localTop.x * 0.333333, 0.5 + localTop.y * 0.5);

      colSide = texture(u_wrapTex, uvSideAtlas).rgb;
      colFront = texture(u_wrapTex, uvFrontRearAtlas).rgb;
      colTop = texture(u_wrapTex, uvTopAtlas).rgb;
    } else {
      // Single Image Triplanar Projection
      vec2 uvSide = vec2(
        N.z >= 0.0 ? 1.0 - v_normCoord.x : v_normCoord.x,
        1.0 - v_normCoord.y
      );
      vec2 uvFront = vec2(v_normCoord.z, 1.0 - v_normCoord.y);
      vec2 uvTop = vec2(v_normCoord.x, v_normCoord.z);

      colSide = texture(u_wrapTex, clamp(uvSide, 0.01, 0.99)).rgb;
      colFront = texture(u_wrapTex, clamp(uvFront, 0.01, 0.99)).rgb;
      colTop = texture(u_wrapTex, clamp(uvTop, 0.01, 0.99)).rgb;
    }

    vec3 wrappedCol = colSide * blendW.z + colFront * blendW.x + colTop * blendW.y;
    if (u_hasPartTex) {
      float texLuma = dot(baseCol, vec3(0.299, 0.587, 0.114));
      wrappedCol *= mix(0.90, 1.03, clamp(texLuma, 0.0, 1.0));
    }
    baseCol = wrappedCol;
  }

  // Architectural studio lighting rig
  vec3 L_key = normalize(vec3(0.42, 0.88, 0.52));
  vec3 L_fill = normalize(vec3(-0.68, 0.52, -0.44));
  vec3 L_rim = normalize(vec3(-0.15, 0.75, 0.65));

  float diffKey = max(dot(N, L_key), 0.0);
  float diffFill = max(dot(N, L_fill), 0.0);
  float hemi = 0.5 + 0.5 * N.y;

  // Ground bounce occlusion near the studio floor
  float heightAboveFloor = clamp((v_worldPos.y - u_floorY) / 0.65, 0.0, 1.0);
  float groundAO = mix(0.72, 1.0, smoothstep(0.0, 1.0, heightAboveFloor));

  // Studio environment reflection (cyclorama dome)
  vec3 envZenith = vec3(0.99, 0.995, 1.0);
  vec3 envHorizon = vec3(0.91, 0.925, 0.945);
  vec3 envGround = vec3(0.76, 0.78, 0.81);
  vec3 envColor = R.y > 0.0
    ? mix(envHorizon, envZenith, pow(R.y, 0.55))
    : mix(envHorizon, envGround, clamp(-R.y * 1.8, 0.0, 1.0));

  // Overhead studio softbox reflections
  float softboxMain = smoothstep(0.74, 0.94, R.y) * smoothstep(0.62, 0.18, abs(R.z));
  float softboxSide = smoothstep(0.45, 0.75, dot(R, L_key));
  envColor += vec3(0.28) * softboxMain + vec3(0.12) * softboxSide;

  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 4.2);

  if (u_isGlass) {
    vec3 glassTint = vec3(0.11, 0.14, 0.18);
    vec3 glassCol = mix(glassTint, envColor, 0.38 + 0.56 * fresnel);
    float alpha = clamp(u_baseAlpha + 0.28 * fresnel, 0.52, 0.90);
    outColor = vec4(glassCol, alpha);
    return;
  }

  float ambient = mix(0.46, 0.80, hemi) * groundAO;
  float direct = (0.46 * diffKey + 0.24 * diffFill) * groundAO;
  vec3 litColor = baseCol * (ambient + direct);

  if (v_bodyMask > 0.5) {
    vec3 H_key = normalize(L_key + V);
    vec3 H_rim = normalize(L_rim + V);
    float specKey = pow(max(dot(N, H_key), 0.0), 64.0);
    float specRim = pow(max(dot(N, H_rim), 0.0), 36.0);
    float clearcoat = 0.04 + 0.24 * fresnel;
    litColor = mix(litColor, envColor, clearcoat) + vec3(0.20) * specKey + vec3(0.10) * specRim;
  } else {
    vec3 H_key = normalize(L_key + V);
    float specTrim = pow(max(dot(N, H_key), 0.0), 22.0);
    litColor += vec3(0.05) * specTrim;
  }

  outColor = vec4(clamp(litColor, 0.0, 1.0), 1.0);
}
`;

// True 3D Floor Shader: renders contact shadow under chassis + 3D architectural turntable ring
const FLOOR_VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_gridPos;

uniform mat4 u_mvp;
uniform float u_floorY;

out vec2 v_xz;

void main() {
  v_xz = a_gridPos;
  vec3 worldPos = vec3(a_gridPos.x, u_floorY - 0.003, a_gridPos.y);
  gl_Position = u_mvp * vec4(worldPos, 1.0);
}
`;

const FLOOR_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_xz;
uniform vec2 u_carHalfSize;

out vec4 outColor;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  // 1. Soft multi-layered ambient occlusion shadow directly under the vehicle footprint
  vec2 halfBox = u_carHalfSize * vec2(0.92, 0.88);
  float distBox = sdRoundBox(v_xz, halfBox, 0.18);

  float coreShadow = 1.0 - smoothstep(-0.18, 0.18, distBox);
  float penumbra = 1.0 - smoothstep(-0.08, 0.58, distBox);
  float wideAmbient = 1.0 - smoothstep(0.0, 1.35, distBox);

  float shadowAlpha = 0.36 * coreShadow + 0.18 * penumbra + 0.06 * wideAmbient;

  // 2. Subtle 3D studio podium turntable ring around the vehicle
  float r = length(v_xz);
  float ringRadius = max(u_carHalfSize.x, u_carHalfSize.y) * 1.32;
  float ringWidth = fwidth(r) * 1.35;
  float mainRing = 1.0 - smoothstep(ringWidth * 0.5, ringWidth * 1.6, abs(r - ringRadius));

  float outerRadius = ringRadius * 1.06;
  float outerRing = 1.0 - smoothstep(ringWidth * 0.5, ringWidth * 1.6, abs(r - outerRadius));

  // Subtle degree tick marks along the 3D ring
  float angle = atan(v_xz.y, v_xz.x);
  float ticks = smoothstep(0.92, 0.98, cos(angle * 36.0)) *
                (1.0 - smoothstep(0.018, 0.032, abs(r - (ringRadius + outerRadius) * 0.5)));

  float ringIntensity = 0.13 * mainRing + 0.06 * outerRing + 0.08 * ticks;

  vec3 shadowCol = vec3(0.07, 0.09, 0.13);
  vec3 ringCol = vec3(0.38, 0.43, 0.50);

  float totalAlpha = clamp(shadowAlpha + ringIntensity, 0.0, 0.65);
  vec3 finalRgb = mix(shadowCol, ringCol, clamp(ringIntensity / (totalAlpha + 0.0001), 0.0, 1.0));

  outColor = vec4(finalRgb, totalAlpha);
}
`;

export default function WrapStudioClient({ initialModels, initialWraps }) {
  const [models, setModels] = useState(initialModels || []);
  const [wraps, setWraps] = useState(initialWraps || []);
  const [activeModelId, setActiveModelId] = useState(initialModels?.[0]?.id || "");
  const [activeWrapId, setActiveWrapId] = useState(initialWraps?.[0]?.id || "none");
  const [activePreset, setActivePreset] = useState("hero");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Add Custom GLB Vehicle Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pendingGlbFile, setPendingGlbFile] = useState(null);
  const [pendingModelName, setPendingModelName] = useState("");
  const [pendingModelIcon, setPendingModelIcon] = useState("cargo-van");
  const [isSavingModel, setIsSavingModel] = useState(false);
  const [modalError, setModalError] = useState("");

  // Import Custom Wrap Modal State
  const [isWrapModalOpen, setIsWrapModalOpen] = useState(false);
  const [wrapImportTab, setWrapImportTab] = useState("single"); // "single" | "multi" | "uv"
  const [pendingWrapName, setPendingWrapName] = useState("");
  const [pendingSingleWrap, setPendingSingleWrap] = useState(null); // { file, previewUrl }
  const [pendingMultiViews, setPendingMultiViews] = useState({}); // { [slotId]: { file, previewUrl } }
  const [isSavingWrap, setIsSavingWrap] = useState(false);
  const [wrapModalError, setWrapModalError] = useState("");

  // 3D Model Credits (CC BY) Modal State
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [creditsViewMode, setCreditsViewMode] = useState("active"); // "active" | "all"
  const [copiedCreditId, setCopiedCreditId] = useState("");

  // Mobile Collapsible Wrap Bottom Sheet State
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const canvasRef = useRef(null);
  const pickerRef = useRef(null);
  const glStateRef = useRef(null);
  const pointersRef = useRef(new Map());
  const pinchDistRef = useRef(0);
  const cameraRef = useRef({
    yaw: -0.64,
    pitch: 0.19,
    distance: 5.4,
    targetYaw: -0.64,
    targetPitch: 0.19,
    targetDistance: 5.4,
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  const activeModel = models.find((m) => m.id === activeModelId) || models[0];
  const activeWrap = wraps.find((w) => w.id === activeWrapId);

  // Restore user's locally saved .glb vehicles and custom wraps from IndexedDB on mount
  useEffect(() => {
    let cancelled = false;
    async function restoreLocalLibrary() {
      try {
        const [savedModels, savedWraps] = await Promise.all([
          getSavedCustomModelsFromDB(),
          getSavedCustomWrapsFromDB(),
        ]);
        if (cancelled) return;

        if (savedModels.length > 0) {
          setModels((prev) => {
            const builtIn = prev.filter((m) => !m.isCustom);
            return [...builtIn, ...savedModels];
          });
        }
        if (savedWraps.length > 0) {
          setWraps((prev) => {
            const builtIn = prev.filter((w) => !w.isCustom);
            return [...builtIn, ...savedWraps];
          });
        }

        const lastModelId = window.localStorage.getItem("vws_active_model_id");
        if (lastModelId) {
          setActiveModelId((prev) => {
            const allIds = new Set([
              ...(initialModels || []).map((m) => m.id),
              ...savedModels.map((m) => m.id),
            ]);
            return allIds.has(lastModelId) ? lastModelId : prev;
          });
        }
        const lastWrapId = window.localStorage.getItem("vws_active_wrap_id");
        if (lastWrapId) {
          setActiveWrapId((prev) => {
            if (lastWrapId === "none") return "none";
            const allWrapIds = new Set([
              ...(initialWraps || []).map((w) => w.id),
              ...savedWraps.map((w) => w.id),
            ]);
            return allWrapIds.has(lastWrapId) ? lastWrapId : prev;
          });
        }
      } catch (err) {
        console.error("Failed to restore local library:", err);
      }
    }
    restoreLocalLibrary();
    return () => {
      cancelled = true;
    };
  }, [initialModels, initialWraps]);

  // Persist active selections to localStorage
  useEffect(() => {
    if (activeModelId && typeof window !== "undefined") {
      window.localStorage.setItem("vws_active_model_id", activeModelId);
    }
  }, [activeModelId]);

  useEffect(() => {
    if (activeWrapId && typeof window !== "undefined") {
      window.localStorage.setItem("vws_active_wrap_id", activeWrapId);
    }
  }, [activeWrapId]);

  // Close custom vehicle picker on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsPickerOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  const refreshAssets = useCallback(async () => {
    try {
      const res = await fetch("/api/assets", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.models?.length) {
        setModels((prev) => {
          const customOnes = prev.filter((m) => m.isCustom);
          const merged = [...data.models, ...customOnes];
          setActiveModelId((currId) =>
            merged.some((m) => m.id === currId) ? currId : merged[0].id
          );
          return merged;
        });
      }
      if (data.wraps) {
        setWraps((prev) => {
          const customOnes = prev.filter((w) => w.isCustom);
          return [...data.wraps, ...customOnes];
        });
      }
    } catch {
      // Ignore network errors
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) {
      setLoadError("WebGL2 is required to view the 3D studio.");
      return undefined;
    }

    function compileShader(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    }

    function createProg(vsSrc, fsSrc) {
      const p = gl.createProgram();
      gl.attachShader(p, compileShader(gl.VERTEX_SHADER, vsSrc));
      gl.attachShader(p, compileShader(gl.FRAGMENT_SHADER, fsSrc));
      gl.linkProgram(p);
      return p;
    }

    const carProg = createProg(CAR_VERTEX_SHADER, CAR_FRAGMENT_SHADER);
    const carUniforms = {
      u_mvp: gl.getUniformLocation(carProg, "u_mvp"),
      u_model: gl.getUniformLocation(carProg, "u_model"),
      u_cameraPos: gl.getUniformLocation(carProg, "u_cameraPos"),
      u_hasPartTex: gl.getUniformLocation(carProg, "u_hasPartTex"),
      u_partTex: gl.getUniformLocation(carProg, "u_partTex"),
      u_hasWrapTex: gl.getUniformLocation(carProg, "u_hasWrapTex"),
      u_wrapTex: gl.getUniformLocation(carProg, "u_wrapTex"),
      u_wrapMode: gl.getUniformLocation(carProg, "u_wrapMode"),
      u_isGlass: gl.getUniformLocation(carProg, "u_isGlass"),
      u_baseAlpha: gl.getUniformLocation(carProg, "u_baseAlpha"),
      u_floorY: gl.getUniformLocation(carProg, "u_floorY"),
    };

    const floorProg = createProg(FLOOR_VERTEX_SHADER, FLOOR_FRAGMENT_SHADER);
    const floorUniforms = {
      u_mvp: gl.getUniformLocation(floorProg, "u_mvp"),
      u_floorY: gl.getUniformLocation(floorProg, "u_floorY"),
      u_carHalfSize: gl.getUniformLocation(floorProg, "u_carHalfSize"),
    };

    // Create 3D floor quad VAO
    const floorVao = gl.createVertexArray();
    gl.bindVertexArray(floorVao);
    const floorBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, floorBuf);
    const S = 5.0;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-S, -S, S, -S, -S, S, -S, S, S, -S, S, S]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    glStateRef.current = {
      gl,
      carProg,
      carUniforms,
      floorProg,
      floorUniforms,
      floorVao,
      gpuParts: [],
      floorY: -0.35,
      carHalfSize: [1.05, 0.46],
      wrapTexture: null,
      wrapMode: 0,
      hasWrap: false,
    };

    let animId = 0;
    function render() {
      animId = window.requestAnimationFrame(render);
      const state = glStateRef.current;
      if (!state) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      const cam = cameraRef.current;
      cam.yaw += (cam.targetYaw - cam.yaw) * 0.12;
      cam.pitch += (cam.targetPitch - cam.pitch) * 0.12;
      cam.distance += (cam.targetDistance - cam.distance) * 0.12;

      const aspect = w / h;
      const isDesktop = canvas.clientWidth > 960;

      // Adapt effective distance on narrow/portrait viewports so the full vehicle fits comfortably without feeling overly zoomed-in
      const aspectScale =
        aspect < 1.25 ? Math.min(2.35, 1.22 / Math.max(aspect, 0.42)) : 1.0;
      const effectiveDistance = cam.distance * aspectScale;

      const cosP = Math.cos(cam.pitch);
      const sinP = Math.sin(cam.pitch);
      const eye = [
        effectiveDistance * cosP * Math.cos(cam.yaw),
        effectiveDistance * sinP + 0.04,
        effectiveDistance * cosP * Math.sin(cam.yaw),
      ];

      // Optically shift the frustum slightly left on desktop, or slightly vertically on mobile between header and bottom dock
      const frustumOffsetX = isDesktop ? 320 / canvas.clientWidth : 0;
      const frustumOffsetY = isDesktop ? 0 : 0.03;

      // 25-degree telephoto studio lens for zero wide-angle distortion
      const proj = mat4PerspectiveOffset(
        (25 * Math.PI) / 180,
        aspect,
        0.1,
        80.0,
        frustumOffsetX,
        frustumOffsetY
      );
      const viewMat = mat4LookAt(eye, [0, -0.02, 0], [0, 1, 0]);
      const modelMat = mat4Identity();
      const mvp = mat4Multiply(proj, mat4Multiply(viewMat, modelMat));

      // 1. Render opaque car meshes
      gl.useProgram(state.carProg);
      gl.uniformMatrix4fv(carUniforms.u_mvp, false, mvp);
      gl.uniformMatrix4fv(carUniforms.u_model, false, modelMat);
      gl.uniform3fv(carUniforms.u_cameraPos, eye);
      gl.uniform1f(carUniforms.u_floorY, state.floorY);

      if (state.hasWrap && state.wrapTexture) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, state.wrapTexture);
        gl.uniform1i(carUniforms.u_wrapTex, 1);
        gl.uniform1i(carUniforms.u_wrapMode, state.wrapMode || 0);
        gl.uniform1i(carUniforms.u_hasWrapTex, 1);
      } else {
        gl.uniform1i(carUniforms.u_hasWrapTex, 0);
      }

      gl.disable(gl.BLEND);
      gl.depthMask(true);
      for (const part of state.gpuParts) {
        if (part.isGlass) continue;
        gl.bindVertexArray(part.vao);
        gl.uniform1i(carUniforms.u_isGlass, 0);
        gl.uniform1f(carUniforms.u_baseAlpha, 1.0);
        if (part.texture) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, part.texture);
          gl.uniform1i(carUniforms.u_partTex, 0);
          gl.uniform1i(carUniforms.u_hasPartTex, 1);
        } else {
          gl.uniform1i(carUniforms.u_hasPartTex, 0);
        }
        gl.drawArrays(gl.TRIANGLES, 0, part.vertCount);
      }

      // 2. Render 3D studio floor contact shadow & architectural turntable ring
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);

      if (state.gpuParts.length > 0) {
        gl.useProgram(state.floorProg);
        gl.uniformMatrix4fv(floorUniforms.u_mvp, false, mvp);
        gl.uniform1f(floorUniforms.u_floorY, state.floorY);
        gl.uniform2fv(floorUniforms.u_carHalfSize, state.carHalfSize);
        gl.bindVertexArray(state.floorVao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // 3. Render transparent glass windows
      gl.useProgram(state.carProg);
      for (const part of state.gpuParts) {
        if (!part.isGlass) continue;
        gl.bindVertexArray(part.vao);
        gl.uniform1i(carUniforms.u_isGlass, 1);
        gl.uniform1f(carUniforms.u_baseAlpha, part.baseAlpha);
        gl.uniform1i(carUniforms.u_hasPartTex, 0);
        gl.drawArrays(gl.TRIANGLES, 0, part.vertCount);
      }

      gl.depthMask(true);
      gl.bindVertexArray(null);
    }

    render();
    return () => {
      window.cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    if (!activeModel?.url || !glStateRef.current) return undefined;
    let cancelled = false;
    setIsLoadingModel(true);
    setLoadError("");

    async function loadVehicle() {
      try {
        const res = await fetch(activeModel.url);
        if (!res.ok) throw new Error(`Failed to fetch ${activeModel.filename}`);
        const arrayBuffer = await res.arrayBuffer();
        if (cancelled) return;

        const parsed = await parseGLB(arrayBuffer);
        if (cancelled) return;

        const state = glStateRef.current;
        const { gl } = state;

        for (const old of state.gpuParts) {
          gl.deleteVertexArray(old.vao);
          old.buffers.forEach((b) => gl.deleteBuffer(b));
          if (old.texture) gl.deleteTexture(old.texture);
        }

        const gpuParts = parsed.parts.map((part) => {
          const vao = gl.createVertexArray();
          gl.bindVertexArray(vao);

          function makeBuf(loc, data, size) {
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
            return buf;
          }

          const buffers = [
            makeBuf(0, part.positions, 3),
            makeBuf(1, part.normals, 3),
            makeBuf(2, part.colors, 3),
            makeBuf(3, part.uvs, 2),
            makeBuf(4, part.bodyMask, 1),
            makeBuf(5, part.normCoords, 3),
          ];

          let texture = null;
          if (part.texImage) {
            gl.activeTexture(gl.TEXTURE0);
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, part.texImage);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          }

          gl.bindVertexArray(null);
          return {
            vao,
            buffers,
            texture,
            vertCount: part.vertCount,
            isGlass: part.isGlass,
            baseAlpha: part.baseAlpha,
          };
        });

        state.gpuParts = gpuParts;
        state.floorY = parsed.floorY;
        state.carHalfSize = [parsed.halfX, parsed.halfZ];
        setIsLoadingModel(false);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setLoadError("Unable to load 3D vehicle file.");
          setIsLoadingModel(false);
        }
      }
    }

    loadVehicle();
    return () => {
      cancelled = true;
    };
  }, [activeModel]);

  useEffect(() => {
    const state = glStateRef.current;
    if (!state) return undefined;
    const { gl } = state;

    if (!activeWrapId || activeWrapId === "none") {
      state.hasWrap = false;
      return undefined;
    }

    const wrapObj = wraps.find((w) => w.id === activeWrapId);
    if (!wrapObj) {
      state.hasWrap = false;
      return undefined;
    }

    let cancelled = false;
    const isMulti = wrapObj.mode === "multi";
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const texCanvas = document.createElement("canvas");
      texCanvas.width = 2048;
      texCanvas.height = isMulti ? 2048 : 1024;
      const ctx = texCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, texCanvas.width, texCanvas.height);

      if (state.wrapTexture) {
        gl.deleteTexture(state.wrapTexture);
      }
      gl.activeTexture(gl.TEXTURE1);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      state.wrapTexture = tex;
      state.wrapMode = isMulti ? 1 : 0;
      state.hasWrap = true;
    };
    img.src = wrapObj.url;

    return () => {
      cancelled = true;
    };
  }, [activeWrapId, wraps]);

  function handlePointerDown(e) {
    const cam = cameraRef.current;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture?.(e.pointerId);

    if (pointersRef.current.size === 1) {
      cam.isDragging = true;
      cam.lastX = e.clientX;
      cam.lastY = e.clientY;
      setActivePreset("");
    } else if (pointersRef.current.size === 2) {
      cam.isDragging = false;
      const pts = [...pointersRef.current.values()];
      pinchDistRef.current = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
    }
  }

  function handlePointerMove(e) {
    const cam = cameraRef.current;
    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      if (pinchDistRef.current > 0) {
        const delta = pinchDistRef.current - dist;
        cam.targetDistance = Math.max(
          2.8,
          Math.min(10.5, cam.targetDistance + delta * 0.018)
        );
      }
      pinchDistRef.current = dist;
      return;
    }

    if (!cam.isDragging || pointersRef.current.size > 1) return;
    const dx = e.clientX - cam.lastX;
    const dy = e.clientY - cam.lastY;
    cam.lastX = e.clientX;
    cam.lastY = e.clientY;

    cam.targetYaw += dx * 0.0075;
    cam.targetPitch = Math.max(0.02, Math.min(1.1, cam.targetPitch + dy * 0.0055));
  }

  function handlePointerUp(e) {
    pointersRef.current.delete(e.pointerId);
    pinchDistRef.current = 0;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    const cam = cameraRef.current;
    if (pointersRef.current.size === 1) {
      const remaining = [...pointersRef.current.values()][0];
      cam.lastX = remaining.x;
      cam.lastY = remaining.y;
      cam.isDragging = true;
    } else if (pointersRef.current.size === 0) {
      cam.isDragging = false;
    }
  }

  function handleWheel(e) {
    const cam = cameraRef.current;
    cam.targetDistance = Math.max(2.8, Math.min(10.5, cam.targetDistance + e.deltaY * 0.0028));
  }

  function adjustZoom(delta) {
    const cam = cameraRef.current;
    cam.targetDistance = Math.max(2.8, Math.min(10.5, cam.targetDistance + delta));
  }

  function selectPreset(preset) {
    setActivePreset(preset.id);
    const cam = cameraRef.current;
    cam.targetYaw = preset.yaw;
    cam.targetPitch = preset.pitch;
    cam.targetDistance = preset.distance;
  }

  function openWrapImportModal() {
    setWrapImportTab("single");
    setPendingWrapName("");
    setPendingSingleWrap(null);
    setPendingMultiViews({});
    setWrapModalError("");
    setIsWrapModalOpen(true);
  }

  function handleSingleWrapFilePicked(file) {
    if (!file) return;
    if (!file.type.startsWith("image/") && !/\.(png|jpe?g|svg|webp)$/i.test(file.name)) {
      setWrapModalError("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    setWrapModalError("");
    if (pendingSingleWrap?.previewUrl) {
      URL.revokeObjectURL(pendingSingleWrap.previewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setPendingSingleWrap({ file, previewUrl });
    if (!pendingWrapName.trim()) {
      setPendingWrapName(humanizeFilenameClient(file.name) || "Custom Wrap");
    }
  }

  function handleMultiViewFilePicked(slotId, file) {
    if (!file) return;
    if (!file.type.startsWith("image/") && !/\.(png|jpe?g|svg|webp)$/i.test(file.name)) {
      setWrapModalError("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    setWrapModalError("");
    const previewUrl = URL.createObjectURL(file);
    setPendingMultiViews((prev) => {
      if (prev[slotId]?.previewUrl) {
        URL.revokeObjectURL(prev[slotId].previewUrl);
      }
      return {
        ...prev,
        [slotId]: { file, previewUrl },
      };
    });
    if (!pendingWrapName.trim()) {
      setPendingWrapName(humanizeFilenameClient(file.name) || "Multi-View Fleet Wrap");
    }
  }

  function clearMultiViewSlot(e, slotId) {
    e.preventDefault();
    e.stopPropagation();
    setPendingMultiViews((prev) => {
      const next = { ...prev };
      if (next[slotId]?.previewUrl) {
        URL.revokeObjectURL(next[slotId].previewUrl);
      }
      delete next[slotId];
      return next;
    });
  }

  const uploadedMultiViewCount = Object.keys(pendingMultiViews).length;

  async function handleSaveCustomWrapModal(e) {
    e.preventDefault();
    if (wrapImportTab === "uv") return;

    setIsSavingWrap(true);
    setWrapModalError("");

    try {
      const id = `custom-wrap-${Date.now()}`;

      if (wrapImportTab === "single") {
        if (!pendingSingleWrap?.file) {
          setWrapModalError("Please choose an image file first.");
          setIsSavingWrap(false);
          return;
        }
        const file = pendingSingleWrap.file;
        const finalName =
          pendingWrapName.trim() || humanizeFilenameClient(file.name) || "Custom Artwork";
        const buffer = await file.arrayBuffer();
        const blob = new Blob([buffer], { type: file.type || "image/png" });
        const url = URL.createObjectURL(blob);

        await saveCustomWrapToDB({
          id,
          name: finalName,
          mode: "single",
          mimeType: file.type || "image/png",
          buffer,
          createdAt: Date.now(),
        });

        const newWrap = {
          id,
          name: finalName,
          url,
          thumbUrl: url,
          mode: "single",
          isCustom: true,
        };
        setWraps((prev) => [...prev, newWrap]);
        setActiveWrapId(id);
        setIsWrapModalOpen(false);
      } else if (wrapImportTab === "multi") {
        if (uploadedMultiViewCount === 0) {
          setWrapModalError("Please upload at least one vehicle view image.");
          setIsSavingWrap(false);
          return;
        }
        const finalName = pendingWrapName.trim() || "Multi-View Fleet Wrap";
        const { atlasBuffer, thumbBuffer } = await buildMultiViewAtlasBuffers(pendingMultiViews);

        await saveCustomWrapToDB({
          id,
          name: finalName,
          mode: "multi",
          mimeType: "image/png",
          buffer: atlasBuffer,
          thumbBuffer,
          createdAt: Date.now(),
        });

        const url = URL.createObjectURL(new Blob([atlasBuffer], { type: "image/png" }));
        const thumbUrl = URL.createObjectURL(new Blob([thumbBuffer], { type: "image/png" }));

        const newWrap = {
          id,
          name: finalName,
          url,
          thumbUrl,
          mode: "multi",
          isCustom: true,
        };
        setWraps((prev) => [...prev, newWrap]);
        setActiveWrapId(id);
        setIsWrapModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to save custom wrap:", err);
      setWrapModalError("Could not process and save wrap artwork locally.");
    } finally {
      setIsSavingWrap(false);
    }
  }

  function openAddVehicleModal() {
    setIsPickerOpen(false);
    setPendingGlbFile(null);
    setPendingModelName("");
    setPendingModelIcon("cargo-van");
    setModalError("");
    setIsAddModalOpen(true);
  }

  function handleGlbFilePicked(file) {
    if (!file) return;
    if (!/\.(glb|gltf)$/i.test(file.name)) {
      setModalError("Please select a valid .glb or .gltf 3D vehicle file.");
      return;
    }
    setModalError("");
    setPendingGlbFile(file);
    const suggestedName = humanizeFilenameClient(file.name);
    if (!pendingModelName.trim()) {
      setPendingModelName(suggestedName || "Custom Vehicle");
    }
    setPendingModelIcon(inferDefaultIconId(file.name));
  }

  async function handleSaveCustomVehicle(e) {
    e.preventDefault();
    if (!pendingGlbFile) {
      setModalError("Please choose a .glb file from your computer first.");
      return;
    }
    const finalName = pendingModelName.trim() || humanizeFilenameClient(pendingGlbFile.name) || "Custom Vehicle";
    setIsSavingModel(true);
    setModalError("");

    try {
      const buffer = await pendingGlbFile.arrayBuffer();
      const id = `local-glb-${Date.now()}`;
      const record = {
        id,
        name: finalName,
        filename: pendingGlbFile.name,
        iconId: pendingModelIcon || "cargo-van",
        buffer,
        createdAt: Date.now(),
      };

      await saveCustomModelToDB(record);

      const blob = new Blob([buffer], { type: "model/gltf-binary" });
      const url = URL.createObjectURL(blob);
      const newModelItem = {
        id,
        name: finalName,
        filename: pendingGlbFile.name,
        iconId: pendingModelIcon || "cargo-van",
        url,
        isCustom: true,
      };

      setModels((prev) => [...prev, newModelItem]);
      setActiveModelId(id);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      setModalError("Could not save the 3D file in local browser storage.");
    } finally {
      setIsSavingModel(false);
    }
  }

  async function handleDeleteCustomVehicle(e, modelToRemove) {
    e.stopPropagation();
    await deleteCustomModelFromDB(modelToRemove.id);
    if (modelToRemove.url?.startsWith("blob:")) {
      URL.revokeObjectURL(modelToRemove.url);
    }
    setModels((prev) => {
      const remaining = prev.filter((m) => m.id !== modelToRemove.id);
      if (activeModelId === modelToRemove.id && remaining.length > 0) {
        setActiveModelId(remaining[0].id);
      }
      return remaining;
    });
  }

  async function handleDeleteCustomWrap(e, wrapToRemove) {
    e.stopPropagation();
    await deleteCustomWrapFromDB(wrapToRemove.id);
    if (wrapToRemove.url?.startsWith("blob:")) {
      URL.revokeObjectURL(wrapToRemove.url);
    }
    if (
      wrapToRemove.thumbUrl?.startsWith("blob:") &&
      wrapToRemove.thumbUrl !== wrapToRemove.url
    ) {
      URL.revokeObjectURL(wrapToRemove.thumbUrl);
    }
    setWraps((prev) => prev.filter((w) => w.id !== wrapToRemove.id));
    if (activeWrapId === wrapToRemove.id) {
      setActiveWrapId("none");
    }
  }

  return (
    <main className="atelier-shell">
      {/* Full-Viewport 3D Infinity Cyclorama Stage */}
      <div
        className="atelier-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="atelier-canvas" />

        {isLoadingModel && (
          <div className="atelier-loader">
            <div className="atelier-spinner" />
            <span>Preparing {activeModel?.name || "Vehicle"}...</span>
          </div>
        )}

        {loadError && !isLoadingModel && (
          <div className="atelier-loader is-error">
            <span>{loadError}</span>
          </div>
        )}
      </div>

      {/* Top-Left Floating Architectural Bar: Minimal Brand + Apple-style Custom Vehicle Picker */}
      <header className="floating-header" ref={pickerRef}>
        <div className="header-brand-row">
          <div className="brand-badge">
            <span className="brand-emblem" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22V12M12 12L21 7M12 12L3 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
              </svg>
            </span>
            <span className="brand-title">Vehicle Wrap Studio</span>
          </div>

          <button
            type="button"
            className="header-cc-btn is-mobile-only"
            onClick={() => {
              setIsPickerOpen(false);
              setCreditsViewMode(activeModel?.credit ? "active" : "all");
              setIsCreditsModalOpen(true);
            }}
            title="View 3D Model Credits & CC BY Licenses"
            aria-label="View 3D model license and creator credits"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M10.2 9.7a2.4 2.4 0 1 0 0 4.6" strokeLinecap="round" />
              <path d="M15.8 9.7a2.4 2.4 0 1 0 0 4.6" strokeLinecap="round" />
            </svg>
            <span>{activeModel?.credit ? "CC BY" : "Credits"}</span>
          </button>
        </div>

        <div className="header-divider" />

        {/* Custom Apple-Style Popover Vehicle Selector */}
        <div className="vehicle-picker">
          <button
            type="button"
            className={`vehicle-trigger${isPickerOpen ? " is-open" : ""}`}
            onClick={() => setIsPickerOpen((open) => !open)}
            aria-expanded={isPickerOpen}
            aria-haspopup="listbox"
          >
            <span className="trigger-vehicle-icon" aria-hidden="true">
              <VehicleIcon
                iconId={activeModel?.iconId || inferDefaultIconId(activeModel?.name)}
                size={16}
              />
            </span>
            <span className="trigger-meta">
              <span className="trigger-eyebrow">Model</span>
              <span className="trigger-name">{activeModel?.name || "Select Vehicle"}</span>
            </span>
            <span className="trigger-chevron" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>

          {isPickerOpen && (
            <div className="vehicle-dropdown" role="listbox" aria-label="Available vehicles">
              <div className="dropdown-top">
                <span>Available Vehicles ({models.length})</span>
                <button
                  type="button"
                  className="dropdown-refresh"
                  onClick={refreshAssets}
                  title="Rescan public/models folder"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                    <polyline points="21 3 21 9 15 9" />
                  </svg>
                  <span>Sync</span>
                </button>
              </div>

              <div className="dropdown-options">
                {models.map((model) => {
                  const isSelected = model.id === activeModelId;
                  const resolvedIcon = model.iconId || inferDefaultIconId(model.name);
                  return (
                    <div
                      key={model.id}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                      className={`dropdown-item${isSelected ? " is-selected" : ""}`}
                      onClick={() => {
                        setActiveModelId(model.id);
                        setIsPickerOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveModelId(model.id);
                          setIsPickerOpen(false);
                        }
                      }}
                    >
                      <span className="dropdown-item-icon" aria-hidden="true">
                        <VehicleIcon iconId={resolvedIcon} size={17} />
                      </span>
                      <span className="dropdown-item-text">
                        <span className="dropdown-item-title">{model.name}</span>
                        {model.isCustom && model.filename && (
                          <span className="dropdown-item-file">{model.filename}</span>
                        )}
                      </span>
                      {model.isCustom && (
                        <button
                          type="button"
                          className="dropdown-item-delete"
                          title="Remove from local studio"
                          aria-label={`Remove ${model.name}`}
                          onClick={(e) => handleDeleteCustomVehicle(e, model)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      {isSelected && (
                        <span className="dropdown-item-check" aria-hidden="true">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="dropdown-footer">
                <button
                  type="button"
                  className="add-vehicle-btn"
                  onClick={openAddVehicleModal}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span>Add Custom Vehicle (.glb)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CC BY Attribution Badge next to the selected vehicle (Desktop) */}
        {activeModel?.credit && (
          <>
            <div className="header-divider" />
            <button
              type="button"
              className="header-cc-btn is-desktop-only"
              onClick={() => {
                setIsPickerOpen(false);
                setCreditsViewMode("active");
                setIsCreditsModalOpen(true);
              }}
              title={`View ${activeModel.credit.license || "CC BY 4.0"} attribution for ${activeModel.name}`}
              aria-label="View 3D model license and creator credits"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9.5" />
                <path d="M10.2 9.7a2.4 2.4 0 1 0 0 4.6" strokeLinecap="round" />
                <path d="M15.8 9.7a2.4 2.4 0 1 0 0 4.6" strokeLinecap="round" />
              </svg>
              <span>CC BY</span>
            </button>
          </>
        )}
      </header>

      {/* Apple-Style Local 3D Vehicle (.glb) Import Modal */}
      {isAddModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => !isSavingModel && setIsAddModalOpen(false)}
        >
          <div
            className="vehicle-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-vehicle-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Local Browser Library</span>
                <h2 id="add-vehicle-modal-title">Add 3D Vehicle (.glb)</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSaveCustomVehicle}>
              {/* Step 1: Choose .glb file */}
              <label
                className={`glb-dropzone${pendingGlbFile ? " has-file" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer?.files?.[0];
                  if (f) handleGlbFilePicked(f);
                }}
              >
                <input
                  type="file"
                  accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                  onChange={(e) => handleGlbFilePicked(e.target.files?.[0])}
                  hidden
                />
                <span className="dropzone-icon" aria-hidden="true">
                  <VehicleIcon iconId={pendingModelIcon} size={22} />
                </span>
                {pendingGlbFile ? (
                  <span className="dropzone-meta">
                    <span className="dropzone-filename">{pendingGlbFile.name}</span>
                    <span className="dropzone-hint">
                      {(pendingGlbFile.size / (1024 * 1024)).toFixed(1)} MB · Stored locally in your browser
                    </span>
                  </span>
                ) : (
                  <span className="dropzone-meta">
                    <span className="dropzone-title">Select or Drop a .glb File</span>
                    <span className="dropzone-hint">Saved directly on your device (never uploaded)</span>
                  </span>
                )}
              </label>

              {/* Step 2: Vehicle Display Name */}
              <div className="modal-field">
                <label htmlFor="vehicle-name-input" className="modal-label">
                  Vehicle Display Name
                </label>
                <input
                  id="vehicle-name-input"
                  type="text"
                  className="modal-input"
                  placeholder="e.g. 2024 Ford Transit Custom"
                  value={pendingModelName}
                  onChange={(e) => setPendingModelName(e.target.value)}
                  required
                />
              </div>

              {/* Step 3: Choose Vehicle Icon */}
              <div className="modal-field">
                <span className="modal-label">Choose Vehicle Icon</span>
                <div className="icon-picker-grid">
                  {VEHICLE_ICON_OPTIONS.map((opt) => {
                    const active = pendingModelIcon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`icon-choice-btn${active ? " is-active" : ""}`}
                        onClick={() => setPendingModelIcon(opt.id)}
                      >
                        <VehicleIcon iconId={opt.id} size={20} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {modalError && <p className="modal-error">{modalError}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn-primary"
                  disabled={!pendingGlbFile || isSavingModel}
                >
                  {isSavingModel ? "Saving Locally..." : "Add to Studio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom-Center Floating VisionOS Camera & Zoom Dock */}
      <nav className="floating-dock" aria-label="Camera angles and zoom">
        <div className="dock-angles">
          {CAMERA_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`dock-pill${activePreset === preset.id ? " is-active" : ""}`}
              onClick={() => selectPreset(preset)}
              title={preset.label}
            >
              <span className="dock-pill-icon" aria-hidden="true">
                <CameraAngleIcon presetId={preset.id} />
              </span>
              <span className="dock-label-full">{preset.label}</span>
              <span className="dock-label-short">{preset.shortLabel}</span>
            </button>
          ))}
        </div>

        <div className="dock-divider" />

        <div className="dock-zoom">
          <button
            type="button"
            className="dock-icon-btn"
            onClick={() => adjustZoom(0.55)}
            title="Zoom out"
            aria-label="Zoom out"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            type="button"
            className="dock-icon-btn"
            onClick={() => adjustZoom(-0.55)}
            title="Zoom in"
            aria-label="Zoom in"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Floating Right Glass Inspector Panel (Collapsible Bottom Sheet on Mobile) */}
      <aside
        className={`floating-inspector${isMobileSheetOpen ? " is-sheet-open" : ""}`}
        aria-label="Wrap selection"
      >
        {/* Mobile Collapsible Bottom Sheet Handle & Quick Bar */}
        <div className="mobile-sheet-bar">
          <button
            type="button"
            className="mobile-sheet-grabber-btn"
            onClick={() => setIsMobileSheetOpen((open) => !open)}
            aria-expanded={isMobileSheetOpen}
          >
            <span className="sheet-grabber-pill" />
          </button>

          <div className="mobile-sheet-summary">
            <button
              type="button"
              className="mobile-sheet-active-wrap"
              onClick={() => setIsMobileSheetOpen((open) => !open)}
            >
              <span
                className={`mobile-sheet-swatch${!activeWrap ? " swatch-factory" : ""}`}
                style={
                  activeWrap
                    ? { backgroundImage: `url("${activeWrap.thumbUrl || activeWrap.url}")` }
                    : undefined
                }
              />
              <span className="mobile-sheet-text">
                <span className="mobile-sheet-eyebrow">
                  Wrap Collection ({wraps.length + 1})
                </span>
                <span className="mobile-sheet-title">
                  {activeWrap ? activeWrap.name : "Factory Pearl White"}
                </span>
              </span>
            </button>

            <div className="mobile-sheet-actions">
              <button
                type="button"
                className="mobile-import-quick-btn"
                onClick={openWrapImportModal}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Import</span>
              </button>

              <button
                type="button"
                className="mobile-sheet-toggle-btn"
                onClick={() => setIsMobileSheetOpen((open) => !open)}
                aria-label={isMobileSheetOpen ? "Minimize wrap panel" : "Expand wrap panel"}
              >
                <span>{isMobileSheetOpen ? "Hide" : "Wraps"}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  className={isMobileSheetOpen ? "is-rotated" : ""}
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="inspector-header">
          <span className="inspector-eyebrow">Exterior Finish</span>
          <div className="inspector-title-row">
            <h1>Wrap Collection</h1>
            <span className="inspector-count">{wraps.length + 1}</span>
          </div>
          <p className="inspector-subtitle">
            {activeWrap ? activeWrap.name : "Factory Pearl White"}
          </p>
        </div>

        <div className="inspector-list">
          {/* Option 0: Original Paint */}
          <button
            type="button"
            className={`swatch-card${activeWrapId === "none" ? " is-selected" : ""}`}
            onClick={() => setActiveWrapId("none")}
          >
            <span className="swatch-Sample swatch-factory">
              <span className="swatch-sheen" />
            </span>
            <span className="swatch-body">
              <span className="swatch-name">Factory Pearl White</span>
              <span className="swatch-tag">OEM Clearcoat</span>
            </span>
            <span className="swatch-radio" aria-hidden="true" />
          </button>

          {/* Wrap Designs */}
          {wraps.map((wrap) => {
            const isSelected = activeWrapId === wrap.id;
            return (
              <div
                key={wrap.id}
                role="button"
                tabIndex={0}
                className={`swatch-card${isSelected ? " is-selected" : ""}`}
                onClick={() => setActiveWrapId(wrap.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveWrapId(wrap.id);
                  }
                }}
              >
                <span
                  className="swatch-Sample"
                  style={{ backgroundImage: `url("${wrap.thumbUrl || wrap.url}")` }}
                >
                  <span className="swatch-sheen" />
                </span>
                <span className="swatch-body">
                  <span className="swatch-name">{wrap.name}</span>
                  <span className="swatch-tag">
                    {wrap.isCustom
                      ? wrap.mode === "multi"
                        ? "Multi-View Wrap"
                        : "Single Image Wrap"
                      : "Full Body Vinyl"}
                  </span>
                </span>
                {wrap.isCustom && (
                  <button
                    type="button"
                    className="swatch-delete-btn"
                    title="Delete custom wrap"
                    aria-label={`Delete ${wrap.name}`}
                    onClick={(e) => handleDeleteCustomWrap(e, wrap)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <span className="swatch-radio" aria-hidden="true" />
              </div>
            );
          })}
        </div>

        <div className="inspector-footer">
          <button
            type="button"
            className="import-artwork-btn"
            onClick={openWrapImportModal}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Import Custom Wrap</span>
          </button>
        </div>
      </aside>

      {/* Apple-Style Import Custom Wrap Modal (Single Image / Multi-View / Template UV) */}
      {isWrapModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => !isSavingWrap && setIsWrapModalOpen(false)}
        >
          <div
            className="vehicle-modal wrap-import-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-wrap-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Exterior Artwork Studio</span>
                <h2 id="import-wrap-modal-title">Import Custom Wrap</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsWrapModalOpen(false)}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 3-Mode Segmented Control */}
            <div className="wrap-mode-tabs" role="tablist" aria-label="Wrap projection method">
              <button
                type="button"
                role="tab"
                aria-selected={wrapImportTab === "single"}
                className={`wrap-mode-tab${wrapImportTab === "single" ? " is-active" : ""}`}
                onClick={() => {
                  setWrapImportTab("single");
                  setWrapModalError("");
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2.5" />
                  <circle cx="8.5" cy="9.5" r="1.5" />
                  <path d="m21 15-5-5L5 20" />
                </svg>
                <span>Single Image</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={wrapImportTab === "multi"}
                className={`wrap-mode-tab${wrapImportTab === "multi" ? " is-active" : ""}`}
                onClick={() => {
                  setWrapImportTab("multi");
                  setWrapModalError("");
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="8" height="8" rx="1.5" />
                  <rect x="13" y="3" width="8" height="8" rx="1.5" />
                  <rect x="3" y="13" width="8" height="8" rx="1.5" />
                  <rect x="13" y="13" width="8" height="8" rx="1.5" />
                </svg>
                <span>Multi-View</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={wrapImportTab === "uv"}
                className={`wrap-mode-tab${wrapImportTab === "uv" ? " is-active" : ""}`}
                onClick={() => {
                  setWrapImportTab("uv");
                  setWrapModalError("");
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span>Template / UV</span>
                <span className="tab-dev-pill">Soon</span>
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSaveCustomWrapModal}>
              {/* Option 1: Single Image Full-Body Triplanar Wrap */}
              {wrapImportTab === "single" && (
                <>
                  <div className="modal-field">
                    <label htmlFor="wrap-name-single" className="modal-label">
                      Wrap Design Name
                    </label>
                    <input
                      id="wrap-name-single"
                      type="text"
                      className="modal-input"
                      placeholder="e.g. Martini Racing Livery"
                      value={pendingWrapName}
                      onChange={(e) => setPendingWrapName(e.target.value)}
                      required
                    />
                  </div>

                  <label
                    className={`wrap-single-dropzone${pendingSingleWrap ? " has-file" : ""}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer?.files?.[0];
                      if (f) handleSingleWrapFilePicked(f);
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleWrapFilePicked(e.target.files?.[0])}
                      hidden
                    />
                    {pendingSingleWrap ? (
                      <div className="single-wrap-preview-box">
                        <div
                          className="single-wrap-thumb"
                          style={{ backgroundImage: `url("${pendingSingleWrap.previewUrl}")` }}
                        />
                        <div className="single-wrap-info">
                          <span className="dropzone-filename">{pendingSingleWrap.file.name}</span>
                          <span className="dropzone-hint">
                            {(pendingSingleWrap.file.size / 1024).toFixed(0)} KB · Seamless 3D Triplanar Projection
                          </span>
                          <span className="single-wrap-change">Click or drop to replace image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="single-wrap-empty">
                        <span className="dropzone-icon" aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="4" width="18" height="16" rx="2.5" />
                            <circle cx="8.5" cy="9.5" r="1.5" />
                            <path d="m21 15-5-5L5 20" />
                          </svg>
                        </span>
                        <span className="dropzone-title">Upload Single Wrap Graphic</span>
                        <span className="dropzone-hint">
                          PNG, JPG, SVG, or WebP · Automatically projected across the 3D body
                        </span>
                      </div>
                    )}
                  </label>
                </>
              )}

              {/* Option 2: Multi-View Separate Vehicle Panels */}
              {wrapImportTab === "multi" && (
                <>
                  <div className="modal-field">
                    <label htmlFor="wrap-name-multi" className="modal-label">
                      Wrap Design Name
                    </label>
                    <input
                      id="wrap-name-multi"
                      type="text"
                      className="modal-input"
                      placeholder="e.g. Corporate Fleet Multi-Side"
                      value={pendingWrapName}
                      onChange={(e) => setPendingWrapName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-field">
                    <div className="multi-view-header-row">
                      <span className="modal-label">Assign Views ({uploadedMultiViewCount}/5 uploaded)</span>
                      <span className="multi-view-caption">Unassigned views stay Pearl White</span>
                    </div>

                    <div className="multi-view-grid">
                      {MULTI_VIEW_SLOTS.map((slot) => {
                        const slotData = pendingMultiViews[slot.id];
                        return (
                          <label
                            key={slot.id}
                            className={`multi-slot-card${slot.wide ? " is-wide" : ""}${
                              slotData ? " has-image" : ""
                            }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const f = e.dataTransfer?.files?.[0];
                              if (f) handleMultiViewFilePicked(slot.id, f);
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleMultiViewFilePicked(slot.id, e.target.files?.[0])
                              }
                              hidden
                            />
                            {slotData ? (
                              <>
                                <span
                                  className="multi-slot-preview"
                                  style={{ backgroundImage: `url("${slotData.previewUrl}")` }}
                                />
                                <span className="multi-slot-overlay">
                                  <span className="multi-slot-title">{slot.label}</span>
                                  <button
                                    type="button"
                                    className="multi-slot-clear"
                                    title={`Clear ${slot.label}`}
                                    onClick={(e) => clearMultiViewSlot(e, slot.id)}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                  </button>
                                </span>
                              </>
                            ) : (
                              <span className="multi-slot-empty">
                                <span className="multi-slot-plus">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M12 5v14M5 12h14" />
                                  </svg>
                                </span>
                                <span className="multi-slot-title">{slot.label}</span>
                                <span className="multi-slot-sub">{slot.sub}</span>
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Option 3: Template / UV (In Development) */}
              {wrapImportTab === "uv" && (
                <div className="uv-dev-card">
                  <div className="uv-dev-blueprint" aria-hidden="true">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="3" width="20" height="18" rx="2.5" strokeDasharray="3 2" />
                      <path d="M6 9h12M6 15h8" />
                      <circle cx="8" cy="12" r="1.5" />
                      <circle cx="16" cy="12" r="1.5" />
                    </svg>
                    <span className="uv-dev-badge">In Development</span>
                  </div>
                  <h3>2D UV Die-Line & Print Template</h3>
                  <p>
                    Precision 1:20 print-ready UV layout mapping and vehicle die-line alignment is currently under development and will be unlocked in an upcoming studio update.
                  </p>
                  <div className="uv-dev-features">
                    <span>1:20 Print Scale</span>
                    <span>Bleed & Cut Guides</span>
                    <span>Exact Panel Seams</span>
                  </div>
                </div>
              )}

              {wrapModalError && <p className="modal-error">{wrapModalError}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-secondary"
                  onClick={() => setIsWrapModalOpen(false)}
                >
                  Cancel
                </button>
                {wrapImportTab === "uv" ? (
                  <button type="button" className="modal-btn-primary" disabled>
                    In Development
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="modal-btn-primary"
                    disabled={
                      isSavingWrap ||
                      (wrapImportTab === "single" && !pendingSingleWrap) ||
                      (wrapImportTab === "multi" && uploadedMultiViewCount === 0)
                    }
                  >
                    {isSavingWrap
                      ? "Applying Wrap..."
                      : wrapImportTab === "multi"
                      ? "Apply Multi-View Wrap"
                      : "Apply Wrap to Studio"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Persistent Bottom-Left 3D Model Credits (CC BY) Link */}
      <button
        type="button"
        className="floating-credits-link"
        onClick={() => {
          setCreditsViewMode(activeModel?.credit ? "active" : "all");
          setIsCreditsModalOpen(true);
        }}
        title="View 3D Model Credits & CC BY Licenses"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M10.2 9.7a2.4 2.4 0 1 0 0 4.6" strokeLinecap="round" />
          <path d="M15.8 9.7a2.4 2.4 0 1 0 0 4.6" strokeLinecap="round" />
        </svg>
        <span>3D Model Credits</span>
      </button>

      {/* Apple-Style 3D Model Credits & CC BY Attribution Modal */}
      {isCreditsModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsCreditsModalOpen(false)}
        >
          <div
            className="vehicle-modal credits-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credits-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Creative Commons Attribution</span>
                <h2 id="credits-modal-title">3D Model Credits</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCreditsModalOpen(false)}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="credits-tabs" role="tablist">
              {activeModel?.credit && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={creditsViewMode === "active"}
                  className={`wrap-mode-tab${creditsViewMode === "active" ? " is-active" : ""}`}
                  onClick={() => setCreditsViewMode("active")}
                >
                  <span>Selected Vehicle</span>
                </button>
              )}
              <button
                type="button"
                role="tab"
                aria-selected={creditsViewMode === "all" || !activeModel?.credit}
                className={`wrap-mode-tab${
                  creditsViewMode === "all" || !activeModel?.credit ? " is-active" : ""
                }`}
                onClick={() => setCreditsViewMode("all")}
              >
                <span>All Studio Models ({models.filter((m) => m.credit).length})</span>
              </button>
            </div>

            <div className="credits-list">
              {(creditsViewMode === "active" && activeModel?.credit
                ? [activeModel]
                : models.filter((m) => m.credit)
              ).map((model) => {
                const c = model.credit;
                if (!c) return null;
                const attributionText = `"${c.title}" (${c.sourceUrl || "Sketchfab"}) by ${
                  c.author
                } (${c.authorUrl || "Sketchfab"}) is licensed under ${c.license} (${
                  c.licenseUrl
                }). Modifications: ${c.modifications}`;
                const isCopied = copiedCreditId === model.id;

                return (
                  <div key={model.id} className="credit-card">
                    <div className="credit-card-top">
                      <div className="credit-title-group">
                        <span className="credit-model-name">{model.name}</span>
                        <span className="credit-original-title">Original: “{c.title}”</span>
                      </div>
                      <a
                        href={c.licenseUrl || "https://creativecommons.org/licenses/by/4.0/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="credit-license-pill"
                        title={c.licenseFull || "Creative Commons Attribution 4.0 International"}
                      >
                        {c.license || "CC BY 4.0"} ↗
                      </a>
                    </div>

                    <div className="credit-meta-grid">
                      <div className="credit-meta-row">
                        <span className="credit-meta-label">Creator</span>
                        {c.authorUrl ? (
                          <a
                            href={c.authorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="credit-meta-link"
                          >
                            {c.author} ↗
                          </a>
                        ) : (
                          <span className="credit-meta-val">{c.author}</span>
                        )}
                      </div>

                      {c.sourceUrl && (
                        <div className="credit-meta-row">
                          <span className="credit-meta-label">Sketchfab Source</span>
                          <a
                            href={c.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="credit-meta-link"
                          >
                            View Original 3D Model on Sketchfab ↗
                          </a>
                        </div>
                      )}

                      <div className="credit-meta-row">
                        <span className="credit-meta-label">License</span>
                        <a
                          href={c.licenseUrl || "https://creativecommons.org/licenses/by/4.0/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="credit-meta-link"
                        >
                          {c.licenseFull || "Creative Commons Attribution 4.0 International"} ({c.license}) ↗
                        </a>
                      </div>

                      <div className="credit-meta-row is-changes">
                        <span className="credit-meta-label">Modifications</span>
                        <span className="credit-meta-val">{c.modifications}</span>
                      </div>
                    </div>

                    <div className="credit-card-footer">
                      <button
                        type="button"
                        className="credit-copy-btn"
                        onClick={() => {
                          navigator.clipboard?.writeText(attributionText);
                          setCopiedCreditId(model.id);
                          setTimeout(() => setCopiedCreditId(""), 2000);
                        }}
                      >
                        {isCopied ? "✓ Attribution Copied" : "Copy Attribution Text"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn-primary"
                onClick={() => setIsCreditsModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
