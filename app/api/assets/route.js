import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function humanizeFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function discoverAssets() {
  const modelsDir = path.join(process.cwd(), "public", "models");
  const wrapsDir = path.join(process.cwd(), "public", "wraps");

  let models = [];
  if (fs.existsSync(modelsDir)) {
    models = fs
      .readdirSync(modelsDir)
      .filter((file) => /\.(glb|gltf)$/i.test(file))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => ({
        id: file,
        name: humanizeFilename(file),
        url: `/models/${encodeURIComponent(file)}`,
        filename: file,
      }));
  }

  let wraps = [];
  if (fs.existsSync(wrapsDir)) {
    wraps = fs
      .readdirSync(wrapsDir)
      .filter((file) => /\.(svg|png|jpe?g|webp)$/i.test(file))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => ({
        id: file,
        name: humanizeFilename(file),
        url: `/wraps/${encodeURIComponent(file)}`,
        filename: file,
      }));
  }

  return { models, wraps };
}

export async function GET() {
  const data = discoverAssets();
  return NextResponse.json(data);
}
