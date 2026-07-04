const imageInput = document.getElementById("imageInput");
const results = document.getElementById("results");
const dimensions = document.getElementById("dimensions");
const aspectRatio = document.getElementById("aspectRatio");
const printSize = document.getElementById("printSize");
const compatibility = document.getElementById("compatibility");

const posterSizes = [
  { name: "A4", width: 21, height: 29.7 },
  { name: "A3", width: 29.7, height: 42 },
  { name: "A2", width: 42, height: 59.4 },
  { name: "A1", width: 59.4, height: 84.1 },
  { name: "30 × 40 cm", width: 30, height: 40 },
  { name: "40 × 50 cm", width: 40, height: 50 },
  { name: "50 × 70 cm", width: 50, height: 70 },
  { name: "60 × 90 cm", width: 60, height: 90 },
  { name: "18 × 24 in", width: 18 * 2.54, height: 24 * 2.54 },
  { name: "24 × 36 in", width: 24 * 2.54, height: 36 * 2.54 }
];

function gcd(a, b) {
  a = Math.round(a);
  b = Math.round(b);

  while (b) {
    [a, b] = [b, a % b];
  }

  return a;
}

function getRatioLabel(width, height) {
  const divisor = gcd(width, height);
  const ratioW = width / divisor;
  const ratioH = height / divisor;

  if (ratioW <= 100 && ratioH <= 100) {
    return `${ratioW}:${ratioH}`;
  }

  return (width / height).toFixed(3);
}

function getCompatibility(imageRatio, sizeRatio) {
  const difference = Math.abs(imageRatio - sizeRatio) / sizeRatio;

  if (difference <= 0.002) {
    return { label: "Exact fit", className: "exact" };
  }

  if (difference <= 0.03) {
    return { label: "Good fit", className: "good" };
  }

  return { label: "Crop needed", className: "crop" };
}

function renderCompatibility(width, height) {
  const imageRatio = width / height;
  compatibility.innerHTML = "";

  posterSizes.forEach((size) => {
    const sizeRatio = size.width / size.height;
    const status = getCompatibility(imageRatio, sizeRatio);

    const row = document.createElement("div");
    row.className = "size-row";

    const name = document.createElement("span");
    name.className = "size-name";
    name.textContent = size.name;

    const state = document.createElement("span");
    state.className = `status ${status.className}`;
    state.textContent = status.label;

    row.append(name, state);
    compatibility.appendChild(row);
  });
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];

  if (!file || !file.type.startsWith("image/")) {
    results.classList.add("hidden");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const widthCm = (width / 300) * 2.54;
    const heightCm = (height / 300) * 2.54;

    dimensions.textContent = `${width} × ${height} px`;
    aspectRatio.textContent = getRatioLabel(width, height);
    printSize.textContent = `${widthCm.toFixed(1)} × ${heightCm.toFixed(1)} cm`;

    renderCompatibility(width, height);
    results.classList.remove("hidden");
    URL.revokeObjectURL(objectUrl);
  };

  image.onerror = () => {
    results.classList.add("hidden");
    URL.revokeObjectURL(objectUrl);
  };

  image.src = objectUrl;
});
