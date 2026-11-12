"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

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
        let views = null;
        if (row.viewBuffers && typeof row.viewBuffers === "object") {
          views = {};
          for (const [k, buf] of Object.entries(row.viewBuffers)) {
            if (buf) {
              views[k] = URL.createObjectURL(new Blob([buf], { type: "image/png" }));
            }
          }
        }
        return {
          id: row.id,
          name: row.name,
          url,
          thumbUrl,
          views,
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

  // First pass: detect painted body vertices (bodyMask = 1.0) and find the exact painted-metal bounding box
  // (excluding rubber tires below the sill, antennas above the roof, and plastic side mirrors sticking out laterally)
  let bMinX = Infinity, bMaxX = -Infinity;
  let bMinY = Infinity, bMaxY = -Infinity;
  let bMinZ = Infinity, bMaxZ = -Infinity;

  for (const part of rawParts) {
    const bodyMask = new Float32Array(part.vertCount);

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
      const ny = (wy - minY) / sizeY;

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

      if (bodyMask[i] > 0.5) {
        if (wx < bMinX) bMinX = wx;
        if (wx > bMaxX) bMaxX = wx;
        if (wy < bMinY) bMinY = wy;
        if (wy > bMaxY) bMaxY = wy;
        if (wz < bMinZ) bMinZ = wz;
        if (wz > bMaxZ) bMaxZ = wz;
      }
    }
    part.bodyMask = bodyMask;
  }

  // Fallback to full model bounds if no painted body bounds were isolated
  if (!Number.isFinite(bMinX) || bMaxX - bMinX < 0.01) {
    bMinX = minX;
    bMaxX = maxX;
    bMinY = minY;
    bMaxY = maxY;
    bMinZ = minZ;
    bMaxZ = maxZ;
  }
  const bSizeX = bMaxX - bMinX || 1;
  const bSizeY = bMaxY - bMinY || 1;
  const bSizeZ = bMaxZ - bMinZ || 1;

  // Second pass: normalize normCoords strictly to the painted metal body shell (0.0 = exact metal sill/edge, 1.0 = exact metal roof/edge)
  for (const part of rawParts) {
    const normCoords = new Float32Array(part.vertCount * 3);
    for (let i = 0; i < part.vertCount; i++) {
      const wx = part.positions[i * 3];
      const wy = part.positions[i * 3 + 1];
      const wz = part.positions[i * 3 + 2];

      normCoords[i * 3] = Math.max(0, Math.min(1, (wx - bMinX) / bSizeX));
      normCoords[i * 3 + 1] = Math.max(0, Math.min(1, (wy - bMinY) / bSizeY));
      normCoords[i * 3 + 2] = Math.max(0, Math.min(1, (wz - bMinZ) / bSizeZ));

      part.positions[i * 3] = (wx - cx) * scale;
      part.positions[i * 3 + 1] = (wy - cy) * scale;
      part.positions[i * 3 + 2] = (wz - cz) * scale;
    }
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
uniform vec4 u_calA;
uniform vec4 u_calB;
uniform vec4 u_calC;
uniform bool u_isGlass;
uniform float u_baseAlpha;
uniform float u_floorY;

out vec4 outColor;

// Engine 1 (1x Single-Sheet): 100% Parameterized Continuous 1-Piece Sheet Unfolding (Zero hardcoded numbers)
vec3 sampleSingleSheetWrap(vec3 normCoord, vec4 calA, vec4 calB, vec4 calC) {
  float uStart        = calA.x; // 1. Rear Start X on 2D image
  float uEnd          = calA.y; // 2. Front End X on 2D image
  float vCenter       = calA.z; // 3. Roof Centerline Y on 2D image
  float roofSpanV     = calA.w; // 4. Roof Half-Width on 2D image

  float sideSpanV     = calB.x; // 5. Side Flap Height Span on 2D image
  float bodyTopY      = calB.y; // 6. 3D Vehicle Top Roof Start Y
  float bodyBottomY   = calB.z; // 7. 3D Vehicle Bottom Sill End Y
  float roofTaper     = calB.w; // 8. 3D Roof-to-Body Width Ratio

  float frontHoodPull = calC.x; // 9. Front Hood Pull Distance (+U)
  float rearDoorPull  = calC.y; // 10. Rear Door Pull Distance (-U)

  // Vertical progress from bodyTopY (0.0 at roof) down to bodyBottomY (1.0 at lower door sill)
  // Unclamped on the upper/lower margin so adjusting bodyTopY or bodyBottomY freely shifts/pads the wrap from the vehicle edges
  float drop = (bodyTopY - normCoord.y) / max(0.08, bodyTopY - bodyBottomY);
  float dropClamped = clamp(drop, -0.35, 1.35);

  // Signed lateral coordinate (-1.0 Driver wall -> 0.0 Center -> +1.0 Passenger wall)
  float zSigned = (normCoord.z - 0.50) * 2.0;

  // Continuous transverse unfolding (V) from Roof center outward over Roof rails and down both Side walls
  float roofLateral = clamp(zSigned / max(0.15, roofTaper), -1.0, 1.0);
  float sideSign = tanh(zSigned * 5.0);
  float vRaw = vCenter + roofLateral * roofSpanV + sideSign * max(0.0, dropClamped) * sideSpanV;

  // Continuous longitudinal unfolding (U) from uStart (Rear) to uEnd (Front),
  // with smooth continuous sheet pull down the Front Hood (+U) and Rear Doors (-U) along the center corridor
  float centerCorridor = 1.0 - smoothstep(roofTaper * 0.60, roofTaper * 1.15, abs(zSigned));
  float uBase = mix(uStart, uEnd, normCoord.x);
  float dropPos = clamp(dropClamped, 0.0, 1.25);
  float uFront = centerCorridor * smoothstep(uEnd * 0.75, 1.0, normCoord.x) * frontHoodPull * (0.68 + 0.32 * dropPos);
  float uRear  = centerCorridor * (1.0 - smoothstep(0.0, max(0.05, uStart * 0.80), normCoord.x)) * rearDoorPull * dropPos;
  float uRaw = uBase + uFront - uRear;

  // Full-bleed edge-to-edge clamping (zero outer margins)
  return texture(u_wrapTex, clamp(vec2(uRaw, vRaw), 0.001, 0.999)).rgb;
}

// Engine 2 (5x Multi-View): 100% Parameterized 5-Panel Projection with Independent Scale, Shift & Zero-Margin Default
vec3 sampleMultiPanelWrap(vec3 normCoord, vec3 N, vec4 calA, vec4 calB, vec4 calC) {
  float sideScaleX    = calA.x; // 1. Side Width Scale
  float sideScaleY    = calA.y; // 2. Side Height Scale
  float sideOffsetX   = calA.z; // 3. Side Horizontal Shift
  float sideOffsetY   = calA.w; // 4. Side Vertical Shift

  float endScaleX     = calB.x; // 5. Front/Rear Width Scale
  float endScaleY     = calB.y; // 6. Front/Rear Height Scale
  float roofScale     = calB.z; // 7. Roof Panel Scale
  float edgeMargin    = calB.w; // 8. Edge Margin / Padding from Panel Borders

  float endOffsetY    = calC.x; // 9. Front/Rear Vertical Shift
  float seamSharpness = calC.y; // 10. 5-Panel Seam Crispness

  float sharpExp = mix(1.5, 14.0, clamp(seamSharpness, 0.0, 1.0));
  vec3 blendW = pow(abs(N), vec3(sharpExp));
  blendW /= (blendW.x + blendW.y + blendW.z + 0.0001);

  // Half-texel safety floor (0.0005 on 2048px atlas) so edgeMargin = 0.000 is true 100% edge-to-edge full-bleed
  float minUV = clamp(edgeMargin, 0.0005, 0.45);
  float maxUV = 1.0 - minUV;

  float sideRawX = (N.z >= 0.0 ? 1.0 - normCoord.x : normCoord.x) - sideOffsetX;
  float sideRawY = (1.0 - normCoord.y) - sideOffsetY;
  vec2 localSide = clamp(
    vec2((sideRawX - 0.5) / max(0.15, sideScaleX) + 0.5, (sideRawY - 0.5) / max(0.15, sideScaleY) + 0.5),
    minUV,
    maxUV
  );
  vec2 uvSideAtlas = N.z >= 0.0
    ? vec2(localSide.x * 0.5, localSide.y * 0.5)
    : vec2(0.5 + localSide.x * 0.5, localSide.y * 0.5);

  float endRawX = N.x >= 0.0 ? normCoord.z : 1.0 - normCoord.z;
  float endRawY = (1.0 - normCoord.y) - endOffsetY;
  vec2 localFrontRear = clamp(
    vec2((endRawX - 0.5) / max(0.15, endScaleX) + 0.5, (endRawY - 0.5) / max(0.15, endScaleY) + 0.5),
    minUV,
    maxUV
  );
  vec2 uvFrontRearAtlas = N.x >= 0.0
    ? vec2(localFrontRear.x * 0.333333, 0.5 + localFrontRear.y * 0.5)
    : vec2(0.333333 + localFrontRear.x * 0.333333, 0.5 + localFrontRear.y * 0.5);

  vec2 localTop = clamp(
    vec2((normCoord.x - 0.5) / max(0.15, roofScale) + 0.5, (normCoord.z - 0.5) / max(0.15, roofScale) + 0.5),
    minUV,
    maxUV
  );
  vec2 uvTopAtlas = vec2(0.666667 + localTop.x * 0.333333, 0.5 + localTop.y * 0.5);

  vec3 colSide = texture(u_wrapTex, uvSideAtlas).rgb;
  vec3 colFront = texture(u_wrapTex, uvFrontRearAtlas).rgb;
  vec3 colTop = texture(u_wrapTex, uvTopAtlas).rgb;

  return colSide * blendW.z + colFront * blendW.x + colTop * blendW.y;
}

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
    vec3 wrappedCol = (u_wrapMode == 1)
      ? sampleMultiPanelWrap(v_normCoord, N, u_calA, u_calB, u_calC)
      : sampleSingleSheetWrap(v_normCoord, u_calA, u_calB, u_calC);

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

const WRAP_CAL_STORAGE_KEY = "vws_wrap_calibration_store_v2";

// ============================================================================
// SYSTEM 1: SINGLE-SHEET CONTINUOUS WRAP CALIBRATION (1x Mode — Full-Bleed Edge-to-Edge)
// ============================================================================
const DEFAULT_SINGLE_WRAP_CALIBRATION = {
  uStart: 0.210,
  uEnd: 0.715,
  vCenter: 0.500,
  roofSpanV: 0.165,
  sideSpanV: 0.335,
  bodyTopY: 1.000,
  bodyBottomY: 0.000,
  roofTaper: 0.720,
  frontHoodPull: 0.285,
  rearDoorPull: 0.210,
};

const SINGLE_WRAP_CALIBRATION_CONTROLS = [
  { key: "uStart", label: "Rear Start X", min: 0.00, max: 0.45, step: 0.005 },
  { key: "uEnd", label: "Front End X", min: 0.45, max: 1.00, step: 0.005 },
  { key: "vCenter", label: "Roof Center Y", min: 0.25, max: 0.75, step: 0.005 },
  { key: "roofSpanV", label: "Roof Half-Width", min: 0.00, max: 0.35, step: 0.005 },
  { key: "sideSpanV", label: "Side Flap Height", min: 0.05, max: 0.55, step: 0.005 },
  { key: "bodyTopY", label: "Top Roof Edge", min: 0.55, max: 1.25, step: 0.005 },
  { key: "bodyBottomY", label: "Bottom Sill Edge", min: -0.25, max: 0.45, step: 0.005 },
  { key: "roofTaper", label: "Roof Width Ratio", min: 0.25, max: 1.00, step: 0.005 },
  { key: "frontHoodPull", label: "Front Hood Pull", min: 0.00, max: 0.45, step: 0.005 },
  { key: "rearDoorPull", label: "Rear Door Pull", min: 0.00, max: 0.40, step: 0.005 },
];

// ============================================================================
// SYSTEM 2: 5-PANEL MULTI-VIEW WRAP CALIBRATION (5x Mode — Full-Bleed Edge-to-Edge)
// ============================================================================
const DEFAULT_MULTI_WRAP_CALIBRATION = {
  sideScaleX: 1.00,
  sideScaleY: 1.00,
  sideOffsetX: 0.00,
  sideOffsetY: 0.00,
  endScaleX: 1.00,
  endScaleY: 1.00,
  roofScale: 1.00,
  edgeMargin: 0.000,
  endOffsetY: 0.00,
  seamSharpness: 0.65,
};

const MULTI_WRAP_CALIBRATION_CONTROLS = [
  { key: "sideScaleX", label: "Side Width Scale", min: 0.25, max: 1.75, step: 0.01 },
  { key: "sideScaleY", label: "Side Height Scale", min: 0.25, max: 1.75, step: 0.01 },
  { key: "sideOffsetX", label: "Side Shift X", min: -0.50, max: 0.50, step: 0.005 },
  { key: "sideOffsetY", label: "Side Shift Y", min: -0.50, max: 0.50, step: 0.005 },
  { key: "endScaleX", label: "Front/Rear Scale X", min: 0.25, max: 1.75, step: 0.01 },
  { key: "endScaleY", label: "Front/Rear Scale Y", min: 0.25, max: 1.75, step: 0.01 },
  { key: "roofScale", label: "Roof Panel Scale", min: 0.25, max: 1.75, step: 0.01 },
  { key: "edgeMargin", label: "Edge Margin", min: 0.00, max: 0.25, step: 0.005 },
  { key: "endOffsetY", label: "Front/Rear Shift Y", min: -0.50, max: 0.50, step: 0.005 },
  { key: "seamSharpness", label: "Seam Sharpness", min: 0.05, max: 0.98, step: 0.01 },
];

const EXTERNAL_MODEL_PROVIDERS = [
  { name: "Sketchfab", url: "https://sketchfab.com" },
  { name: "CGTrader", url: "https://www.cgtrader.com" },
  { name: "Fab", url: "https://www.fab.com" },
  { name: "TurboSquid", url: "https://www.turbosquid.com" },
  { name: "3D Warehouse", url: "https://3dwarehouse.sketchup.com" },
  { name: "Free3D", url: "https://free3d.com" },
  { name: "Blend Swap", url: "https://blendswap.com" },
  { name: "Poly Pizza", url: "https://poly.pizza" },
];

export default function WrapStudioClient({ initialModels, initialWraps }) {
  const [models, setModels] = useState(initialModels || []);
  const [wraps, setWraps] = useState(initialWraps || []);
  const [activeModelId, setActiveModelId] = useState(
    () =>
      initialModels?.find((m) => m.id === "ford-transit-connect-cargo-2014.glb")?.id ||
      initialModels?.[0]?.id ||
      ""
  );
  const [activeWrapId, setActiveWrapId] = useState(initialWraps?.[0]?.id || "none");
  const [activePreset, setActivePreset] = useState("hero");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Add Custom GLB Vehicle Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addVehicleTab, setAddVehicleTab] = useState("upload"); // "upload" | "discover"
  const [pendingGlbFile, setPendingGlbFile] = useState(null);
  const [pendingModelName, setPendingModelName] = useState("");
  const [pendingModelIcon, setPendingModelIcon] = useState("cargo-van");
  const [isSavingModel, setIsSavingModel] = useState(false);
  const [modalError, setModalError] = useState("");

  // Import Custom Wrap Modal State
  const [isWrapModalOpen, setIsWrapModalOpen] = useState(false);
  const [wrapImportTab, setWrapImportTab] = useState("single"); // "single" | "multi"
  const [pendingWrapName, setPendingWrapName] = useState("");
  const [pendingSingleWrap, setPendingSingleWrap] = useState(null); // { file, previewUrl }
  const [pendingMultiViews, setPendingMultiViews] = useState({}); // { [slotId]: { file, previewUrl } }
  const [isSavingWrap, setIsSavingWrap] = useState(false);
  const [wrapModalError, setWrapModalError] = useState("");
  const [isAiPromptCopied, setIsAiPromptCopied] = useState(false);
  const [isMultiAiPromptCopied, setIsMultiAiPromptCopied] = useState(false);
  const [isRefLightboxOpen, setIsRefLightboxOpen] = useState(false);
  const [previewWrap, setPreviewWrap] = useState(null);
  const [previewMultiViewSlot, setPreviewMultiViewSlot] = useState("atlas"); // "atlas" | "left" | "right" | "front" | "rear" | "top"
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const [isLightboxPanning, setIsLightboxPanning] = useState(false);
  const [isLightboxMax, setIsLightboxMax] = useState(false);
  const lightboxDragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  // Live 6-Parameter Wrap Calibration State (Persisted per Vehicle + Wrap in localStorage)
  const [isTuneOpen, setIsTuneOpen] = useState(false);
  const [wrapCalMap, setWrapCalMap] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(WRAP_CAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const wrapCalRef = useRef(DEFAULT_SINGLE_WRAP_CALIBRATION);

  // 3D Model Credits (CC BY) Modal State
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [creditsViewMode, setCreditsViewMode] = useState("active"); // "active" | "all"
  const [copiedCreditId, setCopiedCreditId] = useState("");

  // Mobile Collapsible Wrap Bottom Sheet State
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Live GitHub Repo Metrics (Stars & Forks)
  const [ghStats, setGhStats] = useState({ stars: null, forks: null });

  useEffect(() => {
    let active = true;
    fetch("https://api.github.com/repos/amastaneh/vehicle-wrap-studio")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setGhStats({
          stars: typeof data.stargazers_count === "number" ? data.stargazers_count : null,
          forks: typeof data.forks_count === "number" ? data.forks_count : null,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
  const isActiveWrapMulti = activeWrap?.mode === "multi";
  const activeDefaultCal = isActiveWrapMulti
    ? DEFAULT_MULTI_WRAP_CALIBRATION
    : DEFAULT_SINGLE_WRAP_CALIBRATION;
  const activeCalControls = isActiveWrapMulti
    ? MULTI_WRAP_CALIBRATION_CONTROLS
    : SINGLE_WRAP_CALIBRATION_CONTROLS;
  const activeCalPairKey = `${activeModelId || "default"}::${activeWrapId || "none"}`;
  const wrapCal = useMemo(
    () => ({ ...activeDefaultCal, ...(wrapCalMap[activeCalPairKey] || {}) }),
    [wrapCalMap, activeCalPairKey, activeDefaultCal]
  );

  // Sync 6-parameter wrap calibration ref with active vehicle + wrap pair for the 60fps WebGL loop
  useEffect(() => {
    wrapCalRef.current = wrapCal;
  }, [wrapCal]);

  function updateWrapCalParam(key, numValue) {
    const numericVal = Number(numValue);
    setWrapCalMap((prevMap) => {
      const currentPairCal = { ...activeDefaultCal, ...(prevMap[activeCalPairKey] || {}) };
      const nextPairCal = { ...currentPairCal, [key]: numericVal };
      wrapCalRef.current = nextPairCal;
      const nextMap = { ...prevMap, [activeCalPairKey]: nextPairCal };
      try {
        window.localStorage.setItem(WRAP_CAL_STORAGE_KEY, JSON.stringify(nextMap));
      } catch {
        // Ignore storage quota errors
      }
      return nextMap;
    });
  }

  function resetLightboxTransform() {
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
    setIsLightboxPanning(false);
  }

  function openReferenceLightbox() {
    resetLightboxTransform();
    setIsRefLightboxOpen(true);
  }

  function openWrapArtworkPreview(wrap) {
    resetLightboxTransform();
    const hasSeparateViews =
      wrap?.mode === "multi" && wrap?.views && Object.keys(wrap.views).length > 0;
    const defaultSlot =
      hasSeparateViews && !wrap.isCustom
        ? wrap.views.left
          ? "left"
          : wrap.views.right
          ? "right"
          : wrap.views.front
          ? "front"
          : wrap.views.rear
          ? "rear"
          : "top"
        : "atlas";
    setPreviewMultiViewSlot(defaultSlot);
    setPreviewWrap(wrap);
  }

  function adjustLightboxZoom(nextVal) {
    const clamped = Math.max(1, Math.min(5, Number(nextVal.toFixed(2))));
    setLightboxZoom(clamped);
    if (clamped <= 1.01) {
      setLightboxPan({ x: 0, y: 0 });
    }
  }

  function handleLightboxWheel(e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.22 : -0.22;
    adjustLightboxZoom(lightboxZoom + delta);
  }

  function handleLightboxPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    lightboxDragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: lightboxPan.x,
      origY: lightboxPan.y,
    };
    if (lightboxZoom > 1) {
      setIsLightboxPanning(true);
    }
  }

  function handleLightboxPointerMove(e) {
    const drag = lightboxDragRef.current;
    if (!drag.active) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      drag.moved = true;
    }
    if (lightboxZoom > 1) {
      setLightboxPan({ x: drag.origX + dx, y: drag.origY + dy });
    }
  }

  function handleLightboxPointerUp(e) {
    const drag = lightboxDragRef.current;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (drag.active && !drag.moved) {
      // Single click with magnifier: toggle zoom 1x -> 2x -> 3x -> 1x
      if (lightboxZoom < 1.8) {
        adjustLightboxZoom(2);
      } else if (lightboxZoom < 2.8) {
        adjustLightboxZoom(3);
      } else {
        resetLightboxTransform();
      }
    }
    drag.active = false;
    setIsLightboxPanning(false);
  }

  function resetWrapCalibration() {
    wrapCalRef.current = activeDefaultCal;
    setWrapCalMap((prevMap) => {
      const nextMap = { ...prevMap };
      delete nextMap[activeCalPairKey];
      try {
        window.localStorage.setItem(WRAP_CAL_STORAGE_KEY, JSON.stringify(nextMap));
      } catch {
        // Ignore storage errors
      }
      return nextMap;
    });
  }

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
      u_calA: gl.getUniformLocation(carProg, "u_calA"),
      u_calB: gl.getUniformLocation(carProg, "u_calB"),
      u_calC: gl.getUniformLocation(carProg, "u_calC"),
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
      const cal =
        wrapCalRef.current ||
        (state.wrapMode === 1
          ? DEFAULT_MULTI_WRAP_CALIBRATION
          : DEFAULT_SINGLE_WRAP_CALIBRATION);
      if (state.wrapMode === 1) {
        gl.uniform4f(
          carUniforms.u_calA,
          cal.sideScaleX ?? DEFAULT_MULTI_WRAP_CALIBRATION.sideScaleX,
          cal.sideScaleY ?? DEFAULT_MULTI_WRAP_CALIBRATION.sideScaleY,
          cal.sideOffsetX ?? DEFAULT_MULTI_WRAP_CALIBRATION.sideOffsetX,
          cal.sideOffsetY ?? DEFAULT_MULTI_WRAP_CALIBRATION.sideOffsetY
        );
        gl.uniform4f(
          carUniforms.u_calB,
          cal.endScaleX ?? DEFAULT_MULTI_WRAP_CALIBRATION.endScaleX,
          cal.endScaleY ?? DEFAULT_MULTI_WRAP_CALIBRATION.endScaleY,
          cal.roofScale ?? DEFAULT_MULTI_WRAP_CALIBRATION.roofScale,
          cal.edgeMargin ?? DEFAULT_MULTI_WRAP_CALIBRATION.edgeMargin
        );
        gl.uniform4f(
          carUniforms.u_calC,
          cal.endOffsetY ?? DEFAULT_MULTI_WRAP_CALIBRATION.endOffsetY,
          cal.seamSharpness ?? DEFAULT_MULTI_WRAP_CALIBRATION.seamSharpness,
          0.0,
          0.0
        );
      } else {
        gl.uniform4f(
          carUniforms.u_calA,
          cal.uStart ?? DEFAULT_SINGLE_WRAP_CALIBRATION.uStart,
          cal.uEnd ?? DEFAULT_SINGLE_WRAP_CALIBRATION.uEnd,
          cal.vCenter ?? DEFAULT_SINGLE_WRAP_CALIBRATION.vCenter,
          cal.roofSpanV ?? DEFAULT_SINGLE_WRAP_CALIBRATION.roofSpanV
        );
        gl.uniform4f(
          carUniforms.u_calB,
          cal.sideSpanV ?? DEFAULT_SINGLE_WRAP_CALIBRATION.sideSpanV,
          cal.bodyTopY ?? DEFAULT_SINGLE_WRAP_CALIBRATION.bodyTopY,
          cal.bodyBottomY ?? DEFAULT_SINGLE_WRAP_CALIBRATION.bodyBottomY,
          cal.roofTaper ?? DEFAULT_SINGLE_WRAP_CALIBRATION.roofTaper
        );
        gl.uniform4f(
          carUniforms.u_calC,
          cal.frontHoodPull ?? DEFAULT_SINGLE_WRAP_CALIBRATION.frontHoodPull,
          cal.rearDoorPull ?? DEFAULT_SINGLE_WRAP_CALIBRATION.rearDoorPull,
          0.0,
          0.0
        );
      }

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

    // ========================================================================
    // SYSTEM 1 TEXTURE PIPELINE: Single-Sheet Continuous Unfolded Vinyl (1x)
    // ========================================================================
    async function buildSingleSheetTextureCanvas(singleWrap) {
      const img = await loadImageElement(singleWrap.url);
      const texCanvas = document.createElement("canvas");
      texCanvas.width = 2048;
      texCanvas.height = 1024;
      const ctx = texCanvas.getContext("2d");
      ctx.fillStyle = "#F4F5F7";
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);
      ctx.drawImage(img, 0, 0, texCanvas.width, texCanvas.height);

      // Automatically bleed interior wrap colors over outer white/transparent margins, wheel-arch cutouts, and V-notches
      const gw = 256;
      const gh = 128;
      const gridCanvas = document.createElement("canvas");
      gridCanvas.width = gw;
      gridCanvas.height = gh;
      const gctx = gridCanvas.getContext("2d");
      gctx.drawImage(img, 0, 0, gw, gh);
      const imgData = gctx.getImageData(0, 0, gw, gh);
      const data = imgData.data;

      const isCornerBg = (x, y) => {
        const idx = (y * gw + x) * 4;
        return data[idx + 3] < 180 || (data[idx] > 228 && data[idx + 1] > 228 && data[idx + 2] > 228);
      };
      const cornerCount =
        (isCornerBg(2, 2) ? 1 : 0) +
        (isCornerBg(gw - 3, 2) ? 1 : 0) +
        (isCornerBg(2, gh - 3) ? 1 : 0) +
        (isCornerBg(gw - 3, gh - 3) ? 1 : 0);

      if (cornerCount >= 3) {
        const total = gw * gh;
        const bgMask = new Uint8Array(total);
        const queue = new Int32Array(total);
        let qHead = 0;
        let qTail = 0;

        const isProtectedCore = (x, y) => {
          const u = x / gw;
          const v = y / gh;
          if (u >= 0.25 && u <= 0.64 && v >= 0.38 && v <= 0.64) return true; // Roof core
          if (u >= 0.25 && u <= 0.56 && v >= 0.11 && v <= 0.33) return true; // Driver core
          if (u >= 0.25 && u <= 0.56 && v >= 0.68 && v <= 0.89) return true; // Passenger core
          if (u >= 0.69 && u <= 0.91 && v >= 0.43 && v <= 0.57) return true; // Front core
          if (u >= 0.06 && u <= 0.21 && v >= 0.39 && v <= 0.61) return true; // Rear core
          return false;
        };

        const isBgPixel = (idx) => {
          const p = idx * 4;
          return data[p + 3] < 180 || (data[p] > 224 && data[p + 1] > 224 && data[p + 2] > 224);
        };

        for (let x = 0; x < gw; x++) {
          const topIdx = x;
          const botIdx = (gh - 1) * gw + x;
          if (isBgPixel(topIdx)) {
            bgMask[topIdx] = 1;
            queue[qTail++] = topIdx;
          }
          if (isBgPixel(botIdx)) {
            bgMask[botIdx] = 1;
            queue[qTail++] = botIdx;
          }
        }
        for (let y = 1; y < gh - 1; y++) {
          const leftIdx = y * gw;
          const rightIdx = y * gw + (gw - 1);
          if (isBgPixel(leftIdx)) {
            bgMask[leftIdx] = 1;
            queue[qTail++] = leftIdx;
          }
          if (isBgPixel(rightIdx)) {
            bgMask[rightIdx] = 1;
            queue[qTail++] = rightIdx;
          }
        }

        const dirs = [-1, 1, -gw, gw];
        while (qHead < qTail) {
          const cur = queue[qHead++];
          const cx = cur % gw;
          const cy = (cur / gw) | 0;
          for (let d = 0; d < 4; d++) {
            const ni = cur + dirs[d];
            if (ni < 0 || ni >= total || bgMask[ni]) continue;
            const nx = ni % gw;
            const ny = (ni / gw) | 0;
            if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue;
            if (isProtectedCore(nx, ny)) continue;
            if (isBgPixel(ni)) {
              bgMask[ni] = 1;
              queue[qTail++] = ni;
            }
          }
        }

        for (let step = 0; step < 3; step++) {
          const nextMask = new Uint8Array(bgMask);
          for (let y = 1; y < gh - 1; y++) {
            for (let x = 1; x < gw - 1; x++) {
              const idx = y * gw + x;
              if (bgMask[idx] || isProtectedCore(x, y)) continue;
              if (
                bgMask[idx - 1] ||
                bgMask[idx + 1] ||
                bgMask[idx - gw] ||
                bgMask[idx + gw]
              ) {
                nextMask[idx] = 1;
              }
            }
          }
          bgMask.set(nextMask);
        }

        const exteriorMask = new Uint8Array(bgMask);

        qHead = 0;
        qTail = 0;
        for (let i = 0; i < total; i++) {
          if (!bgMask[i]) {
            queue[qTail++] = i;
          }
        }
        while (qHead < qTail) {
          const cur = queue[qHead++];
          const cx = cur % gw;
          const cy = (cur / gw) | 0;
          const cp = cur * 4;
          for (let d = 0; d < 4; d++) {
            const ni = cur + dirs[d];
            if (ni < 0 || ni >= total || !bgMask[ni]) continue;
            const nx = ni % gw;
            const ny = (ni / gw) | 0;
            if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue;
            bgMask[ni] = 0;
            const np = ni * 4;
            data[np] = data[cp];
            data[np + 1] = data[cp + 1];
            data[np + 2] = data[cp + 2];
            data[np + 3] = 255;
            queue[qTail++] = ni;
          }
        }

        for (let i = 0; i < total; i++) {
          data[i * 4 + 3] = exteriorMask[i] ? 255 : 0;
        }
        gctx.putImageData(imgData, 0, 0);
        ctx.drawImage(gridCanvas, 0, 0, texCanvas.width, texCanvas.height);
      }

      return texCanvas;
    }

    // ========================================================================
    // SYSTEM 2 TEXTURE PIPELINE: 5-Panel Multi-View Atlas Composer (5x)
    // ========================================================================
    async function buildMultiPanelTextureCanvas(multiWrap) {
      const texCanvas = document.createElement("canvas");
      texCanvas.width = 2048;
      texCanvas.height = 2048;
      const ctx = texCanvas.getContext("2d");
      ctx.fillStyle = "#F4F5F7";
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

      // If wrap has 5 separate view URLs (from built-in 5-panel folder) and no pre-built atlas blob:
      if (multiWrap.views && !multiWrap.isCustom) {
        const regions = {
          left: { x: 0, y: 0, w: 1024, h: 1024 },
          right: { x: 1024, y: 0, w: 1024, h: 1024 },
          front: { x: 0, y: 1024, w: 682, h: 1024 },
          rear: { x: 682, y: 1024, w: 683, h: 1024 },
          top: { x: 1365, y: 1024, w: 683, h: 1024 },
        };
        const viewKeyMap = {
          left: multiWrap.views.left,
          right: multiWrap.views.right,
          front: multiWrap.views.front,
          rear: multiWrap.views.rear,
          top: multiWrap.views.top || multiWrap.views.roof,
        };
        for (const [slotKey, srcUrl] of Object.entries(viewKeyMap)) {
          if (!srcUrl) continue;
          try {
            const slotImg = await loadImageElement(srcUrl);
            const r = regions[slotKey];
            ctx.drawImage(slotImg, r.x, r.y, r.w, r.h);
          } catch {
            // Leave unassigned or failed slot as Pearl White
          }
        }
        return texCanvas;
      }

      // Otherwise load pre-composed 5-panel atlas image directly
      const img = await loadImageElement(multiWrap.url);
      ctx.drawImage(img, 0, 0, texCanvas.width, texCanvas.height);
      return texCanvas;
    }

    async function loadActiveWrapTexture() {
      try {
        const isMulti = wrapObj.mode === "multi";
        const texCanvas = isMulti
          ? await buildMultiPanelTextureCanvas(wrapObj)
          : await buildSingleSheetTextureCanvas(wrapObj);
        if (cancelled) return;

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
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load wrap texture:", err);
        }
      }
    }

    loadActiveWrapTexture();

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

  const targetVehicleLabel =
    activeModel?.credit?.title || activeModel?.name || "2016 Ford Transit Cargo Van";

  const generatedAiPrompt = `Create a continuous, unfolded 2D vehicle wrap artwork skin (Connected 5-Panel Surface Net) for a ${targetVehicleLabel} matching the attached reference layout: place the ROOF horizontally in the center with the front of the vehicle pointing RIGHT, attach the DRIVER SIDE along the top roof edge unfolded upward (front pointing RIGHT), attach the PASSENGER SIDE along the bottom roof edge unfolded downward (front pointing RIGHT), attach the FRONT HOOD & BUMPER to the right roof edge, and attach the REAR DOORS to the left roof edge. Generate ONLY the flat 2D wrap skin in a 2:1 horizontal aspect ratio strictly EDGE-TO-EDGE and FULL-BLEED with ZERO borders or margins (0px padding — the unfolded vehicle template and wrap artwork must touch all 4 outer edges of the canvas from X=0% to 100% and Y=0% to 100%, with wrap colors extending completely through panel boundaries, no white/empty background margins, no wheel-arch cutouts, no 3D vehicle mockup, and no wireframe lines drawn over the artwork).\n\nWrap Design Description:\n`;

  const generatedMultiViewAiPrompt = `Create flat 2D orthographic vehicle wrap panel artwork for a ${targetVehicleLabel} (5-Panel Multi-View Wrap System: Driver Side, Passenger Side, Front Hood/Fascia, Rear Doors, and Roof). Generate each panel view strictly EDGE-TO-EDGE and FULL-BLEED with ZERO borders, ZERO padding, and ZERO empty margins (0px margin — the artwork must fill 100% of the image frame from edge to edge up to all 4 canvas boundaries, with no white or transparent background frame, no studio floor/environment, no wheel-arch cutouts, and no perspective distortion).\n\nWrap Design Description:\n`;

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

        const viewBuffers = {};
        const views = {};
        for (const slot of MULTI_VIEW_SLOTS) {
          const entry = pendingMultiViews[slot.id];
          if (entry?.file) {
            const buf = await entry.file.arrayBuffer();
            viewBuffers[slot.id] = buf;
            views[slot.id] = URL.createObjectURL(
              new Blob([buf], { type: entry.file.type || "image/png" })
            );
          }
        }

        await saveCustomWrapToDB({
          id,
          name: finalName,
          mode: "multi",
          mimeType: "image/png",
          buffer: atlasBuffer,
          thumbBuffer,
          viewBuffers,
          createdAt: Date.now(),
        });

        const url = URL.createObjectURL(new Blob([atlasBuffer], { type: "image/png" }));
        const thumbUrl = URL.createObjectURL(new Blob([thumbBuffer], { type: "image/png" }));

        const newWrap = {
          id,
          name: finalName,
          url,
          thumbUrl,
          views,
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
    setAddVehicleTab("upload");
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

          <div className="header-mobile-actions is-mobile-only">
            <a
              href="https://github.com/amastaneh/vehicle-wrap-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="header-gh-mobile-btn"
              title="Support Us with a Star on GitHub"
              aria-label="Support Us with a Star on GitHub"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
              <span className="gh-star-glyph" aria-hidden="true">★</span>
              <span>Support</span>
              {ghStats.stars > 0 && <span className="gh-count-pill">{ghStats.stars}</span>}
            </a>

            <a
              href="https://github.com/amastaneh/vehicle-wrap-studio/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="header-gh-mobile-btn is-feature"
              title="Request a Feature on GitHub"
              aria-label="Request a Feature on GitHub"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>Feature</span>
            </a>

            <button
              type="button"
              className="header-cc-btn"
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

        {/* Open-Source GitHub Support Us (Star) & Request Feature Split Pill (Desktop) */}
        <div className="header-divider is-desktop-only" />
        <div className="header-gh-group is-desktop-only" role="group" aria-label="Support and feature requests on GitHub">
          <a
            href="https://github.com/amastaneh/vehicle-wrap-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="header-gh-btn is-star"
            title="Support Us — Give Vehicle Wrap Studio a Star on GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
            </svg>
            <span className="gh-star-glyph" aria-hidden="true">★</span>
            <span>Support Us</span>
            {ghStats.stars > 0 && <span className="gh-count-pill">{ghStats.stars}</span>}
          </a>
          <span className="header-gh-sep" aria-hidden="true" />
          <a
            href="https://github.com/amastaneh/vehicle-wrap-studio/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="header-gh-btn is-feature"
            title="Request a Feature or Suggest a Vehicle on GitHub"
          >
            <svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.75c.6.45 1 1.15 1 1.9V17h6v-.35c0-.75.4-1.45 1-1.9A7 7 0 0 0 12 2Z" />
            </svg>
            <span>Request Feature</span>
          </a>
        </div>
      </header>

      {/* Apple-Style Local 3D Vehicle (.glb) Import & Model Directory Modal */}
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
                <h2 id="add-vehicle-modal-title">
                  {addVehicleTab === "discover" ? "Find 3D Vehicle Models" : "Add 3D Vehicle (.glb)"}
                </h2>
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

            {/* 2-Tab Segmented Control: Upload .glb File vs Find 3D Vehicle Models */}
            <div className="wrap-mode-tabs" role="tablist" aria-label="3D vehicle source">
              <button
                type="button"
                role="tab"
                aria-selected={addVehicleTab === "upload"}
                className={`wrap-mode-tab${addVehicleTab === "upload" ? " is-active" : ""}`}
                onClick={() => {
                  setAddVehicleTab("upload");
                  setModalError("");
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Upload .glb File</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={addVehicleTab === "discover"}
                className={`wrap-mode-tab${addVehicleTab === "discover" ? " is-active" : ""}`}
                onClick={() => {
                  setAddVehicleTab("discover");
                  setModalError("");
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M2.5 12h19" />
                  <path d="M12 2.5a14.5 14.5 0 0 1 0 19 14.5 14.5 0 0 1 0-19" />
                </svg>
                <span>Find 3D Models</span>
              </button>
            </div>

            {addVehicleTab === "upload" ? (
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

                {/* Subtle Prompt Bar to Open 3D Model Websites Directory */}
                <div className="model-sources-callout">
                  <div className="model-sources-callout-text">
                    <span className="model-sources-callout-title">Find 3D Vehicle Models</span>
                    <span className="model-sources-callout-sub">
                      Explore 3D vehicle models from independent third-party websites.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="ai-copy-single-btn"
                    onClick={() => setAddVehicleTab("discover")}
                  >
                    <span>Browse Websites</span>
                  </button>
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
            ) : (
              <div className="model-directory-view">
                <p className="model-directory-desc">
                  Explore 3D vehicle models from independent third-party websites.
                </p>

                <div className="model-directory-table" role="table" aria-label="3D Vehicle Model Providers">
                  <div className="model-directory-head" role="row">
                    <span role="columnheader">Provider</span>
                    <span role="columnheader">Website</span>
                  </div>
                  <div className="model-directory-body" role="rowgroup">
                    {EXTERNAL_MODEL_PROVIDERS.map((item) => (
                      <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="model-directory-row"
                        role="row"
                      >
                        <span className="model-provider-name" role="cell">
                          {item.name}
                        </span>
                        <span className="model-provider-url" role="cell">
                          <span>{item.url}</span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            aria-hidden="true"
                          >
                            <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn-secondary"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="modal-btn-primary"
                    onClick={() => setAddVehicleTab("upload")}
                  >
                    Upload .glb File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Live 10-Parameter Wrap Calibration Popover (Independent 1x Single & 5x Multi Engines) */}
      {isTuneOpen && activeWrapId !== "none" && (
        <section className="wrap-tune-popover" aria-label="Adjust wrap alignment">
          <div className="tune-header">
            <div className="tune-title-wrap">
              <div className="tune-title-row">
                <span className="tune-title">
                  {isActiveWrapMulti ? "Adjust 5-Panel Wrap" : "Adjust Single-Sheet Wrap"}
                </span>
                <span className={`tune-mode-pill${isActiveWrapMulti ? " is-multi" : " is-single"}`}>
                  {isActiveWrapMulti ? "5× Multi" : "1× Single"}
                </span>
              </div>
              <span className="tune-subtitle">
                Saved automatically for {activeModel?.name} · {activeWrap?.name}
              </span>
            </div>
            <div className="tune-header-actions">
              <button
                type="button"
                className="tune-reset-btn"
                onClick={resetWrapCalibration}
                title="Reset all 10 wrap parameters to default"
              >
                Reset
              </button>
              <button
                type="button"
                className="tune-close-btn"
                onClick={() => setIsTuneOpen(false)}
                aria-label="Close wrap adjustment panel"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="tune-grid">
            {activeCalControls.map((ctrl) => {
              const val = Number(wrapCal[ctrl.key] ?? activeDefaultCal[ctrl.key]);
              return (
                <label key={ctrl.key} className="tune-slider-item">
                  <span className="tune-slider-top">
                    <span className="tune-slider-label">{ctrl.label}</span>
                    <span className="tune-slider-val">{Number((val * 100).toFixed(1))}%</span>
                  </span>
                  <input
                    type="range"
                    className="tune-range-input"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={val}
                    onChange={(e) => updateWrapCalParam(ctrl.key, e.target.value)}
                  />
                </label>
              );
            })}
          </div>
        </section>
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

        {activeWrapId !== "none" && (
          <>
            <div className="dock-divider" />
            <button
              type="button"
              className={`dock-tune-btn${isTuneOpen ? " is-active" : ""}`}
              onClick={() => setIsTuneOpen((open) => !open)}
              title="Adjust wrap alignment on vehicle"
              aria-expanded={isTuneOpen}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="17" x2="20" y2="17" />
                <circle cx="9" cy="7" r="2.3" fill="currentColor" />
                <circle cx="15" cy="17" r="2.3" fill="currentColor" />
              </svg>
              <span>Adjust</span>
            </button>
          </>
        )}
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
            const isMultiWrap = wrap.mode === "multi";
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
                  <span className="swatch-name-row">
                    <span className="swatch-name">{wrap.name}</span>
                    <span
                      className={`swatch-mode-badge${isMultiWrap ? " is-multi" : " is-single"}`}
                      title={
                        isMultiWrap
                          ? "5-Panel Multi-View Wrap System (5×)"
                          : "Single-Sheet Continuous Wrap System (1×)"
                      }
                    >
                      {isMultiWrap ? "5×" : "1×"}
                    </span>
                  </span>
                  <span className="swatch-tag">
                    {isMultiWrap ? "5-Panel Multi-View" : "Single-Sheet Vinyl"}
                  </span>
                </span>
                <button
                  type="button"
                  className="swatch-preview-btn"
                  title={`View 2D flat artwork for ${wrap.name}`}
                  aria-label={`View 2D flat artwork for ${wrap.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openWrapArtworkPreview(wrap);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
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

          <div className="inspector-meta-row">
            <a
              href="https://github.com/amastaneh/vehicle-wrap-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inspector-gh-link"
              title="Support Us with a Star on GitHub"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
              <span className="gh-star-glyph" aria-hidden="true">★</span>
              <span>Support Us</span>
            </a>

            <a
              href="https://github.com/amastaneh/vehicle-wrap-studio/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inspector-gh-link"
              title="Request a Feature or Suggest a Vehicle on GitHub"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.75c.6.45 1 1.15 1 1.9V17h6v-.35c0-.75.4-1.45 1-1.9A7 7 0 0 0 12 2Z" />
              </svg>
              <span>Request Feature</span>
            </a>
          </div>

          <button
            type="button"
            className="inspector-credits-sublink"
            onClick={() => {
              setCreditsViewMode(activeModel?.credit ? "active" : "all");
              setIsCreditsModalOpen(true);
            }}
            title="View 3D Model Credits & CC BY Licenses"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M10.2 9.7a2.4 2.4 0 1 0 0 4.6" strokeLinecap="round" />
              <path d="M15.8 9.7a2.4 2.4 0 1 0 0 4.6" strokeLinecap="round" />
            </svg>
            <span>3D Model Credits · CC BY 4.0</span>
          </button>
        </div>
      </aside>

      {/* Apple-Style Import Custom Wrap Modal (Single Image / Multi-View) */}
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

            {/* 2-Mode Segmented Control */}
            <div className="wrap-mode-tabs is-two-tabs" role="tablist" aria-label="Wrap projection method">
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
            </div>

            <form className="modal-form" onSubmit={handleSaveCustomWrapModal}>
              {/* Option 1: Single Image Continuous Unfolded Skin Wrap */}
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
                      placeholder="e.g. Canadian Fleet Livery"
                      value={pendingWrapName}
                      onChange={(e) => setPendingWrapName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Primary Upload Dropzone directly under Wrap Design Name */}
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
                            {(pendingSingleWrap.file.size / 1024).toFixed(0)} KB · Ready to apply
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
                        <span className="dropzone-title">Upload Unfolded Single Wrap Image</span>
                        <span className="dropzone-hint">
                          PNG, JPG, SVG, or WebP · 2:1 Full-Bleed Unfolded Layout
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Optional Minimal AI Reference & One-Click Prompt Card Below Dropzone */}
                  <div className="ai-template-card">
                    <div className="ai-ref-thumb-wrap">
                      <button
                        type="button"
                        className="ai-ref-thumb-btn"
                        onClick={openReferenceLightbox}
                        title="Preview reference layout"
                      >
                        <span
                          className="ai-ref-thumb-img"
                          role="img"
                          aria-label="Unfolded Vehicle Wrap Reference"
                        />
                      </button>
                      <div className="ai-ref-mini-badges">
                        <button
                          type="button"
                          className="ai-ref-mini-btn"
                          onClick={openReferenceLightbox}
                          title="Zoom reference image"
                        >
                          Zoom
                        </button>
                        <a
                          href="/templates/unfolded-wrap-reference.png"
                          download="Unfolded-Vehicle-Wrap-Reference.png"
                          className="ai-ref-mini-btn"
                          title="Download Reference PNG"
                        >
                          ↓ PNG
                        </a>
                      </div>
                    </div>

                    <div className="ai-template-meta">
                      <span className="ai-template-title">Designing with AI? (Optional)</span>
                      <p className="ai-template-desc">
                        Download the reference image and copy the ready-to-use prompt for ChatGPT, Gemini, or Midjourney.
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`ai-copy-single-btn${isAiPromptCopied ? " is-copied" : ""}`}
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedAiPrompt);
                        setIsAiPromptCopied(true);
                        setTimeout(() => setIsAiPromptCopied(false), 2000);
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>{isAiPromptCopied ? "✓ Prompt Copied" : "Copy AI Prompt"}</span>
                    </button>
                  </div>
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
                      <span className="multi-view-caption">Edge-to-edge full-bleed (0px margin) · Unassigned stay Pearl White</span>
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

                  {/* Optional Minimal AI Prompt Card for 5x Multi-View Panel Generation */}
                  <div className="ai-template-card">
                    <div className="ai-template-meta">
                      <span className="ai-template-title">Designing 5× Views with AI? (Optional)</span>
                      <p className="ai-template-desc">
                        Copy the ready-to-use prompt to generate full-bleed, zero-margin panel views in ChatGPT, Gemini, or Midjourney.
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`ai-copy-single-btn${isMultiAiPromptCopied ? " is-copied" : ""}`}
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedMultiViewAiPrompt);
                        setIsMultiAiPromptCopied(true);
                        setTimeout(() => setIsMultiAiPromptCopied(false), 2000);
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>{isMultiAiPromptCopied ? "✓ Prompt Copied" : "Copy 5× AI Prompt"}</span>
                    </button>
                  </div>
                </>
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resizable, Zoomable Full-Resolution 2D Artwork & Reference Lightbox */}
      {(isRefLightboxOpen || previewWrap) && (
        <div
          className="modal-backdrop ref-lightbox-backdrop"
          onClick={() => {
            setIsRefLightboxOpen(false);
            setPreviewWrap(null);
          }}
        >
          <div
            className={`vehicle-modal ref-lightbox-modal${isLightboxMax ? " is-maximized" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={
              previewWrap
                ? `2D Unfolded Wrap Artwork: ${previewWrap.name}`
                : "Unfolded Vehicle Skin Reference Preview"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header ref-lightbox-header">
              <div>
                <span className="modal-eyebrow">
                  {previewWrap
                    ? previewWrap.mode === "multi"
                      ? "5× Multi-View Wrap Artwork · Interactive Magnifier"
                      : "1× Single-Sheet Unfolded Wrap Artwork · Interactive Magnifier"
                    : "Reference Template · 2:1 Aspect Ratio"}
                </span>
                <h2>{previewWrap ? previewWrap.name : "Unfolded Vehicle Skin Reference"}</h2>
              </div>

              <div className="ref-lightbox-toolbar">
                {previewWrap?.mode === "multi" && previewWrap?.views && (
                  <div className="lightbox-view-pills" role="tablist" aria-label="Select 5-Panel View">
                    {[
                      ...(previewWrap.isCustom
                        ? [{ id: "atlas", label: "5× Sheet", src: previewWrap.url }]
                        : []),
                      { id: "left", label: "Driver", src: previewWrap.views.left },
                      { id: "right", label: "Passenger", src: previewWrap.views.right },
                      { id: "front", label: "Front", src: previewWrap.views.front },
                      { id: "rear", label: "Rear", src: previewWrap.views.rear },
                      {
                        id: "top",
                        label: "Roof",
                        src: previewWrap.views.top || previewWrap.views.roof,
                      },
                    ]
                      .filter((v) => Boolean(v.src))
                      .map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          role="tab"
                          aria-selected={previewMultiViewSlot === v.id}
                          className={`lightbox-view-pill${
                            previewMultiViewSlot === v.id ? " is-active" : ""
                          }`}
                          onClick={() => {
                            resetLightboxTransform();
                            setPreviewMultiViewSlot(v.id);
                          }}
                        >
                          {v.label}
                        </button>
                      ))}
                  </div>
                )}

                {/* Interactive Magnifier & Zoom Controls */}
                <div className="lightbox-zoom-bar" role="group" aria-label="Zoom controls">
                  <button
                    type="button"
                    className="lightbox-zoom-btn"
                    onClick={() => adjustLightboxZoom(lightboxZoom - 0.5)}
                    disabled={lightboxZoom <= 1}
                    title="Zoom Out"
                    aria-label="Zoom out"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5M8 11h6" strokeLinecap="round" />
                    </svg>
                  </button>

                  <input
                    type="range"
                    className="lightbox-zoom-slider"
                    min="1"
                    max="5"
                    step="0.1"
                    value={lightboxZoom}
                    onChange={(e) => adjustLightboxZoom(Number(e.target.value))}
                    aria-label="Zoom level"
                  />

                  <span className="lightbox-zoom-pct">{Math.round(lightboxZoom * 100)}%</span>

                  <button
                    type="button"
                    className="lightbox-zoom-btn"
                    onClick={() => adjustLightboxZoom(lightboxZoom + 0.5)}
                    disabled={lightboxZoom >= 5}
                    title="Zoom In"
                    aria-label="Zoom in"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5M11 8v6M8 11h6" strokeLinecap="round" />
                    </svg>
                  </button>

                  {lightboxZoom > 1 && (
                    <button
                      type="button"
                      className="lightbox-zoom-reset"
                      onClick={resetLightboxTransform}
                      title="Reset zoom to 100%"
                    >
                      1:1
                    </button>
                  )}
                </div>

                {/* Maximize / Restore Window Size Button */}
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsLightboxMax((v) => !v)}
                  title={isLightboxMax ? "Restore window size" : "Maximize window"}
                  aria-label={isLightboxMax ? "Restore window size" : "Maximize window"}
                >
                  {isLightboxMax ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => {
                    setIsRefLightboxOpen(false);
                    setPreviewWrap(null);
                  }}
                  aria-label="Close preview"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="ref-lightbox-stage">
              <div
                className={`ref-lightbox-viewport${
                  lightboxZoom > 1 ? (isLightboxPanning ? " is-panning" : " is-zoomed") : ""
                }`}
                onWheel={handleLightboxWheel}
                onPointerDown={handleLightboxPointerDown}
                onPointerMove={handleLightboxPointerMove}
                onPointerUp={handleLightboxPointerUp}
                onPointerCancel={handleLightboxPointerUp}
              >
                <div
                  className="ref-lightbox-img"
                  style={{
                    backgroundImage: `url("${
                      previewWrap
                        ? (previewWrap.mode === "multi" &&
                            previewWrap.views &&
                            previewMultiViewSlot !== "atlas" &&
                            (previewWrap.views[previewMultiViewSlot] ||
                              (previewMultiViewSlot === "top" ? previewWrap.views.roof : ""))) ||
                          previewWrap.url
                        : "/templates/unfolded-wrap-reference.png"
                    }")`,
                    transform: `translate3d(${lightboxPan.x}px, ${lightboxPan.y}px, 0) scale(${lightboxZoom})`,
                  }}
                  role="img"
                  aria-label={previewWrap ? previewWrap.name : "Unfolded Vehicle Skin Reference Net"}
                />
              </div>
            </div>

            <div className="modal-actions">
              <a
                href={previewWrap ? previewWrap.url : "/templates/unfolded-wrap-reference.png"}
                download={
                  previewWrap
                    ? previewWrap.filename || `${previewWrap.name}.png`
                    : "Unfolded-Vehicle-Wrap-Reference.png"
                }
                className="modal-btn-secondary ref-download-link"
              >
                {previewWrap ? "Download Wrap Image" : "Download Reference PNG"}
              </a>
              <button
                type="button"
                className="modal-btn-primary"
                onClick={() => {
                  setIsRefLightboxOpen(false);
                  setPreviewWrap(null);
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
