"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const vehicles = [
  {
    id: "sprinter2016",
    make: "Mercedes-Benz",
    name: "Sprinter 2500",
    year: "2016",
    detail: '144" wheelbase · Standard roof',
    dimensions: "5,910 × 1,993 × 2,435 mm",
    initials: "MB",
  },
  {
    id: "connect2016",
    make: "Ford",
    name: "Transit Connect",
    year: "2016",
    detail: "Long wheelbase · Compact cargo",
    dimensions: "4,818 × 1,835 × 1,828 mm",
    initials: "FD",
  },
  {
    id: "transit2019",
    make: "Ford",
    name: "Transit 250",
    year: "2019",
    detail: '130" wheelbase · Low roof',
    dimensions: "5,585 × 2,065 × 2,090 mm",
    initials: "FD",
  },
];

const views = [
  { id: "hero", label: "Front three-quarter" },
  { id: "front", label: "Front" },
  { id: "left", label: "Driver side" },
  { id: "right", label: "Passenger side", mirror: true },
  { id: "rear34", label: "Rear three-quarter" },
  { id: "rear", label: "Rear" },
  { id: "roof", label: "Roof" },
];

const finishes = [
  { id: "white", name: "Arctic white", color: "#f4f5f2", filter: "none" },
  {
    id: "silver",
    name: "Silver metallic",
    color: "#bdc3c6",
    filter: "grayscale(.45) brightness(.98) contrast(1.04)",
  },
  {
    id: "graphite",
    name: "Graphite",
    color: "#596169",
    filter: "grayscale(.8) brightness(.77) contrast(1.08)",
  },
  {
    id: "black",
    name: "Obsidian black",
    color: "#20242a",
    filter: "grayscale(.8) brightness(.62) contrast(1.08)",
  },
  {
    id: "blue",
    name: "Fleet blue",
    color: "#345e91",
    filter: "sepia(.14) hue-rotate(178deg) saturate(1.8) brightness(.98)",
  },
];

function Mark({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
    );
  }
  if (name === "download") {
    return (
      <svg {...common}>
        <path d="M12 3v12m-5-5 5 5 5-5" />
        <path d="M5 17v3h14v-3" />
      </svg>
    );
  }
  if (name === "play") {
    return (
      <svg {...common}>
        <path d="m9 6 10 6-10 6V6Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "pause") {
    return (
      <svg {...common}>
        <path d="M8 6h3v12H8zM15 6h3v12h-3z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "chevron") {
    return (
      <svg {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    );
  }
  if (name === "vehicle") {
    return (
      <svg {...common}>
        <path d="M3 13V9.5L5.5 6h11l3.5 3.5V13" />
        <path d="M2.5 13h19v4h-3v-2h-13v2h-3v-4Z" />
        <circle cx="7" cy="17" r="1.5" />
        <circle cx="17" cy="17" r="1.5" />
      </svg>
    );
  }
  return null;
}

function imagePath(vehicleId, viewId) {
  return `/vehicles/${vehicleId}-${viewId}.jpg`;
}

export default function Home() {
  const [activeVehicleId, setActiveVehicleId] = useState(vehicles[0].id);
  const [activeViewId, setActiveViewId] = useState("hero");
  const [activeFinishId, setActiveFinishId] = useState(finishes[0].id);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [notice, setNotice] = useState("");

  const activeVehicle =
    vehicles.find((vehicle) => vehicle.id === activeVehicleId) ?? vehicles[0];
  const activeView =
    views.find((view) => view.id === activeViewId) ?? views[0];
  const activeFinish =
    finishes.find((finish) => finish.id === activeFinishId) ?? finishes[0];

  useEffect(() => {
    if (!isAutoRotating) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveViewId((currentViewId) => {
        const currentIndex = views.findIndex((view) => view.id === currentViewId);
        return views[(currentIndex + 1) % views.length].id;
      });
    }, 2400);

    return () => window.clearInterval(intervalId);
  }, [isAutoRotating]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeoutId = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  function chooseVehicle(vehicleId) {
    setActiveVehicleId(vehicleId);
    setNotice("Vehicle updated");
  }

  function moveView(direction) {
    const currentIndex = views.findIndex((view) => view.id === activeViewId);
    setActiveViewId((currentIndex + direction + views.length) % views.length);
  }

  async function savePreview() {
    const image = new window.Image();
    image.src = imagePath(activeVehicleId, activeViewId);

    try {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Could not load the vehicle image."));
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not create an image preview.");

      context.filter = activeFinish.filter;
      if (activeView.mirror) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }
      context.drawImage(image, 0, 0);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("Could not export the image."));
        }, "image/png");
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${activeVehicle.id}-${activeView.id}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setNotice("Preview saved");
    } catch (error) {
      console.error("Unable to save vehicle preview:", error);
      setNotice("Sorry, the preview could not be saved.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Wrap Studio home">
          <span className="brand-mark">
            <Mark name="vehicle" size={21} />
          </span>
          <span className="brand-name">
            wrap<span>studio</span>
          </span>
        </a>
        <div className="topbar-right">
          <span className="project-label">Fleet preview</span>
          <button className="save-button" type="button" onClick={savePreview}>
            <Mark name="download" size={16} />
            <span>Save preview</span>
          </button>
        </div>
      </header>

      <div className="page-content">
        <section className="page-heading" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">YOUR VEHICLE, REIMAGINED</p>
            <h1 id="page-title">Make it unmistakably yours.</h1>
            <p className="page-description">
              Choose a van, explore every angle, and find your finish.
            </p>
          </div>
          <div className="step-indicator">
            <span className="step-dot" />
            Ready to customize
          </div>
        </section>

        <section className="vehicle-section" aria-labelledby="vehicle-heading">
          <div className="section-heading">
            <div className="section-title-wrap">
              <span className="step-number">01</span>
              <div>
                <h2 id="vehicle-heading">Choose your vehicle</h2>
                <p>Start with the model you want to wrap.</p>
              </div>
            </div>
            <span className="selection-note">3 vehicles</span>
          </div>

          <div className="vehicle-list">
            {vehicles.map((vehicle) => {
              const isSelected = vehicle.id === activeVehicleId;
              return (
                <button
                  className={`vehicle-option${isSelected ? " is-selected" : ""}`}
                  type="button"
                  key={vehicle.id}
                  onClick={() => chooseVehicle(vehicle.id)}
                  aria-pressed={isSelected}
                >
                  <span className="vehicle-avatar">{vehicle.initials}</span>
                  <span className="vehicle-copy">
                    <span className="vehicle-make">
                      {vehicle.year} {vehicle.make}
                    </span>
                    <span className="vehicle-model">{vehicle.name}</span>
                    <span className="vehicle-detail">{vehicle.detail}</span>
                  </span>
                  <span className="selected-indicator" aria-hidden="true">
                    <span />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="preview-section" aria-label="Vehicle preview">
          <div className="preview-heading">
            <div className="preview-vehicle-name">
              <span className="preview-status-dot" />
              <span>{activeVehicle.year} {activeVehicle.make} {activeVehicle.name}</span>
              <span className="preview-divider" />
              <span className="dimension-label">{activeVehicle.dimensions}</span>
            </div>
            <span className="preview-caption">LIVE PREVIEW</span>
          </div>

          <div className="preview-stage">
            <Image
              key={`${activeVehicleId}-${activeViewId}`}
              className="vehicle-image"
              src={imagePath(activeVehicleId, activeViewId)}
              alt={`${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.name}, ${activeView.label.toLowerCase()} view`}
              fill
              loading="eager"
              sizes="(max-width: 760px) 100vw, 1180px"
              unoptimized
              draggable={false}
              style={{
                filter: activeFinish.filter,
                transform: activeView.mirror ? "scaleX(-1)" : undefined,
              }}
            />
            <button
              className="stage-arrow stage-arrow-left"
              type="button"
              aria-label="Previous vehicle angle"
              onClick={() => moveView(-1)}
            >
              <Mark name="chevron" size={19} />
            </button>
            <button
              className="stage-arrow stage-arrow-right"
              type="button"
              aria-label="Next vehicle angle"
              onClick={() => moveView(1)}
            >
              <Mark name="chevron" size={19} />
            </button>
            <div className="stage-view-label">
              <span className="view-label-dot" />
              {activeView.label}
            </div>
          </div>

          <div className="preview-controls">
            <div className="control-heading">
              <div className="section-title-wrap">
                <span className="step-number">02</span>
                <div>
                  <h2>Explore the details</h2>
                  <p>Select a view to see your vehicle from every side.</p>
                </div>
              </div>
              <button
                className={`rotate-button${isAutoRotating ? " is-playing" : ""}`}
                type="button"
                onClick={() => setIsAutoRotating((isPlaying) => !isPlaying)}
                aria-pressed={isAutoRotating}
              >
                <Mark name={isAutoRotating ? "pause" : "play"} size={15} />
                {isAutoRotating ? "Pause tour" : "Auto tour"}
              </button>
            </div>

            <div className="view-list" aria-label="Vehicle angle">
              {views.map((view) => {
                const isSelected = view.id === activeViewId;
                return (
                  <button
                    className={`view-option${isSelected ? " is-selected" : ""}`}
                    type="button"
                    key={view.id}
                    onClick={() => setActiveViewId(view.id)}
                    aria-pressed={isSelected}
                  >
                    <span className={`view-thumb${view.mirror ? " is-mirrored" : ""}`}>
                      <Image
                        src={imagePath(activeVehicleId, view.id)}
                        alt=""
                        fill
                        sizes="96px"
                        unoptimized
                        draggable={false}
                      />
                    </span>
                    <span className="view-name">{view.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="finish-section" aria-labelledby="finish-heading">
          <div className="finish-copy">
            <span className="step-number">03</span>
            <div>
              <h2 id="finish-heading">Choose a finish</h2>
              <p>Just the beginning. Your design comes next.</p>
            </div>
          </div>
          <div className="finish-picker" aria-label="Vehicle finish">
            {finishes.map((finish) => {
              const isSelected = finish.id === activeFinishId;
              return (
                <button
                  className={`finish-option${isSelected ? " is-selected" : ""}`}
                  type="button"
                  key={finish.id}
                  onClick={() => {
                    setActiveFinishId(finish.id);
                    setNotice(`${finish.name} selected`);
                  }}
                  aria-label={finish.name}
                  aria-pressed={isSelected}
                  title={finish.name}
                >
                  <span
                    className="finish-swatch"
                    style={{ backgroundColor: finish.color }}
                  >
                    {isSelected && <span className="swatch-check">✓</span>}
                  </span>
                  <span className="finish-name">{finish.name}</span>
                </button>
              );
            })}
          </div>
          <div className="selected-finish">
            <span className="selected-finish-label">CURRENT FINISH</span>
            <span>{activeFinish.name}</span>
          </div>
        </section>

        <footer className="page-footer">
          <span>
            Colors are a preview and may vary from the finished wrap.
          </span>
          <span>Designed for your next big idea.</span>
        </footer>
      </div>

      <div className={`notice${notice ? " is-visible" : ""}`} role="status" aria-live="polite">
        {notice}
      </div>
    </main>
  );
}
