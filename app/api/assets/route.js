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

function parseNameAndUrl(raw = "") {
  const match = raw.match(/^(.*?)\s*\((https?:\/\/[^)]+)\)\s*$/);
  if (match) {
    return { label: match[1].trim(), url: match[2].trim() };
  }
  return { label: raw.trim(), url: "" };
}

function extractGlbEmbeddedExtras(filePath) {
  let fd = null;
  try {
    fd = fs.openSync(filePath, "r");
    const header = Buffer.alloc(20);
    const bytesRead = fs.readSync(fd, header, 0, 20, 0);
    if (bytesRead < 20) return null;

    const magic = header.readUInt32LE(0);
    if (magic !== 0x46546c67) return null; // "glTF"
    const jsonLen = header.readUInt32LE(12);
    if (jsonLen <= 0 || jsonLen > 5 * 1024 * 1024) return null;

    const jsonBuf = Buffer.alloc(jsonLen);
    fs.readSync(fd, jsonBuf, 0, jsonLen, 20);
    const gltf = JSON.parse(jsonBuf.toString("utf8"));
    const extras = gltf?.asset?.extras;
    if (!extras || typeof extras !== "object") return null;

    const authorParsed = parseNameAndUrl(extras.author || "");
    const licenseParsed = parseNameAndUrl(extras.license || "");

    return {
      title: extras.title ? String(extras.title).replace(/_/g, " ") : "",
      author: authorParsed.label,
      authorUrl: authorParsed.url,
      sourceUrl: extras.source || "",
      license: (licenseParsed.label || "CC BY 4.0").replace(/^CC-BY-(\d)/i, "CC BY $1"),
      licenseUrl:
        licenseParsed.url.replace(/^http:\/\//i, "https://") ||
        "https://creativecommons.org/licenses/by/4.0/",
    };
  } catch {
    return null;
  } finally {
    if (fd !== null) {
      try {
        fs.closeSync(fd);
      } catch {
        // Ignore close error
      }
    }
  }
}

export function discoverAssets() {
  const modelsDir = path.join(process.cwd(), "public", "models");
  const wrapsDir = path.join(process.cwd(), "public", "wraps");
  const creditsPath = path.join(modelsDir, "credits.json");

  let creditsManifest = { defaults: {}, models: {} };
  if (fs.existsSync(creditsPath)) {
    try {
      creditsManifest = JSON.parse(fs.readFileSync(creditsPath, "utf8"));
    } catch {
      // Ignore malformed JSON
    }
  }

  const defaultCredit = {
    license: "CC BY 4.0",
    licenseFull: "Creative Commons Attribution 4.0 International",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    modifications:
      "Normalized 3D scale and axis orientation; applied real-time studio lighting and dynamic vinyl wrap projection on exterior body panels.",
    ...(creditsManifest.defaults || {}),
  };

  let models = [];
  if (fs.existsSync(modelsDir)) {
    models = fs
      .readdirSync(modelsDir)
      .filter((file) => /\.(glb|gltf)$/i.test(file))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => {
        const displayName = humanizeFilename(file);
        const fullPath = path.join(modelsDir, file);
        const embedded = /\.glb$/i.test(file) ? extractGlbEmbeddedExtras(fullPath) : null;
        const manifestEntry = creditsManifest.models?.[file] || null;

        let credit = null;
        if (manifestEntry || embedded) {
          credit = {
            title: manifestEntry?.title || embedded?.title || displayName,
            author: manifestEntry?.author || embedded?.author || "Sketchfab Creator",
            authorUrl: manifestEntry?.authorUrl || embedded?.authorUrl || "",
            sourceUrl: manifestEntry?.sourceUrl || embedded?.sourceUrl || "",
            license: manifestEntry?.license || embedded?.license || defaultCredit.license,
            licenseFull: manifestEntry?.licenseFull || defaultCredit.licenseFull,
            licenseUrl:
              manifestEntry?.licenseUrl || embedded?.licenseUrl || defaultCredit.licenseUrl,
            modifications: manifestEntry?.modifications || defaultCredit.modifications,
          };
        }

        return {
          id: file,
          name: displayName,
          url: `/models/${encodeURIComponent(file)}`,
          filename: file,
          credit,
        };
      });
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
