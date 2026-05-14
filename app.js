import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { feature, neighbors } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const today = new Date("2026-05-14T12:00:00+02:00");
const checkedDate = "14. mai 2026";
const countryPalette = ["#f6c87f", "#a8d8b9", "#f2a7c0", "#9fd0e4", "#d6c4f2", "#f3e77c"];

const leaders = [
  { country: "Norway", flag: "🇳🇴", aliases: ["Norway"], capital: "Oslo", coords: [10.7522, 59.9139], capitalCoords: [10.7522, 59.15], labelCoords: [10.8, 64.1], leader: "Jonas Gahr Støre", title: "Statsminister", since: "2021-10-14" },
  { country: "Sweden", flag: "🇸🇪", aliases: ["Sweden"], capital: "Stockholm", coords: [18.0686, 59.3293], capitalCoords: [18.0686, 58.7], labelCoords: [16.3, 62.0], leader: "Ulf Kristersson", title: "Statsminister", since: "2022-10-18" },
  { country: "Denmark", flag: "🇩🇰", aliases: ["Denmark"], capital: "København", coords: [12.5683, 55.6761], capitalCoords: [12.5683, 55.15], labelCoords: [10.0, 56.1], leader: "Mette Frederiksen", title: "Statsminister", since: "2019-06-27" },
  { country: "Finland", flag: "🇫🇮", aliases: ["Finland"], capital: "Helsinki", coords: [24.9384, 60.1699], capitalCoords: [24.9384, 59.55], labelCoords: [26.0, 64.0], leader: "Petteri Orpo", title: "Statsminister", since: "2023-06-20" },
  { country: "Iceland", flag: "🇮🇸", aliases: ["Iceland"], capital: "Reykjavík", coords: [-21.8277, 64.1265], capitalCoords: [-21.2, 63.35], labelCoords: [-18.0, 65.1], leader: "Kristrún Frostadóttir", title: "Statsminister", since: "2024-12-21" },
  { country: "United Kingdom", flag: "🇬🇧", aliases: ["United Kingdom", "England", "Scotland", "Wales", "Northern Ireland"], capital: "London", coords: [-0.1276, 51.5072], capitalCoords: [-0.1276, 50.75], labelCoords: [-2.8, 54.7], leader: "Keir Starmer", title: "Statsminister", since: "2024-07-05" },
  { country: "Ireland", flag: "🇮🇪", aliases: ["Ireland"], capital: "Dublin", coords: [-6.2603, 53.3498], capitalCoords: [-6.2603, 52.75], labelCoords: [-8.0, 53.8], leader: "Micheál Martin", title: "Taoiseach", since: "2025-01-23" },
  { country: "France", flag: "🇫🇷", aliases: ["France"], capital: "Paris", coords: [2.3522, 48.8566], capitalCoords: [2.3522, 48.2], labelCoords: [2.2, 46.6], leader: "Emmanuel Macron", title: "President / politisk toppleder", since: "2017-05-14" },
  { country: "Germany", flag: "🇩🇪", aliases: ["Germany"], capital: "Berlin", coords: [13.405, 52.52], capitalCoords: [13.405, 51.9], labelCoords: [10.7, 51.1], leader: "Friedrich Merz", title: "Forbundskansler", since: "2025-05-06" },
  { country: "Netherlands", flag: "🇳🇱", aliases: ["Netherlands"], capital: "Amsterdam", coords: [4.9041, 52.3676], capitalCoords: [5.6, 53.05], labelCoords: [5.4, 52.5], leader: "Rob Jetten", title: "Statsminister", since: "2026-02-23", note: "Verifisert som sittende statsminister per 14. mai 2026." },
  { country: "Belgium", flag: "🇧🇪", aliases: ["Belgium"], capital: "Brussel", coords: [4.3517, 50.8503], capitalCoords: [4.9, 50.2], labelCoords: [4.5, 50.8], leader: "Bart De Wever", title: "Statsminister", since: "2025-02-03" },
  { country: "Luxembourg", flag: "🇱🇺", aliases: ["Luxembourg"], capital: "Luxembourg", coords: [6.1296, 49.8153], capitalCoords: [6.9, 49.2], labelCoords: [6.15, 49.8], leader: "Luc Frieden", title: "Statsminister", since: "2023-11-17" },
  { country: "Austria", flag: "🇦🇹", aliases: ["Austria"], capital: "Wien", coords: [16.3738, 48.2082], capitalCoords: [16.3738, 47.55], labelCoords: [14.2, 47.6], leader: "Christian Stocker", title: "Forbundskansler", since: "2025-03-03" },
  { country: "Switzerland", flag: "🇨🇭", aliases: ["Switzerland"], capital: "Bern", coords: [7.4474, 46.948], capitalCoords: [8.2, 46.35], labelCoords: [8.15, 46.75], leader: "Karin Keller-Sutter", title: "Forbundspresident", since: "2025-01-01", note: "Sveits har kollegial regjering og roterende president." },
  { country: "Spain", flag: "🇪🇸", aliases: ["Spain"], capital: "Madrid", coords: [-3.7038, 40.4168], capitalCoords: [-3.7038, 39.75], labelCoords: [-3.5, 40.25], leader: "Pedro Sánchez", title: "Statsminister", since: "2018-06-02" },
  { country: "Portugal", flag: "🇵🇹", aliases: ["Portugal"], capital: "Lisboa", coords: [-9.1393, 38.7223], capitalCoords: [-8.75, 38.0], labelCoords: [-8.25, 39.7], leader: "Luís Montenegro", title: "Statsminister", since: "2024-04-02" },
  { country: "Italy", flag: "🇮🇹", aliases: ["Italy"], capital: "Roma", coords: [12.4964, 41.9028], capitalCoords: [12.4964, 41.15], labelCoords: [12.5, 42.9], leader: "Giorgia Meloni", title: "Statsminister", since: "2022-10-22" },
  { country: "Malta", flag: "🇲🇹", aliases: ["Malta"], capital: "Valletta", coords: [14.5146, 35.8989], capitalCoords: [14.5146, 35.3], labelCoords: [14.52, 35.9], leader: "Robert Abela", title: "Statsminister", since: "2020-01-13" },
  { country: "Greece", flag: "🇬🇷", aliases: ["Greece"], capital: "Athen", coords: [23.7275, 37.9838], capitalCoords: [23.7275, 37.3], labelCoords: [22.4, 39.0], leader: "Kyriakos Mitsotakis", title: "Statsminister", since: "2023-06-26", note: "Andre sammenhengende regjeringsperiode; først tiltrådt i 2019." },
  { country: "Cyprus", flag: "🇨🇾", aliases: ["Cyprus"], capital: "Nikosia", coords: [33.3823, 35.1856], capitalCoords: [33.7, 34.55], labelCoords: [33.15, 35.2], leader: "Nikos Christodoulides", title: "President / regjeringsleder", since: "2023-02-28" },
  { country: "Poland", flag: "🇵🇱", aliases: ["Poland"], capital: "Warszawa", coords: [21.0122, 52.2297], capitalCoords: [21.0122, 51.55], labelCoords: [19.2, 52.05], leader: "Donald Tusk", title: "Statsminister", since: "2023-12-13" },
  { country: "Czechia", flag: "🇨🇿", aliases: ["Czechia", "Czech Republic", "Czech Rep."], capital: "Praha", coords: [14.4378, 50.0755], capitalCoords: [14.9, 49.45], labelCoords: [15.0, 49.8], leader: "Andrej Babiš", title: "Statsminister", since: "2025-12-09", note: "Tiltrådte 9. desember 2025." },
  { country: "Slovakia", flag: "🇸🇰", aliases: ["Slovakia"], capital: "Bratislava", coords: [17.1077, 48.1486], capitalCoords: [18.0, 47.55], labelCoords: [19.2, 48.75], leader: "Robert Fico", title: "Statsminister", since: "2023-10-25" },
  { country: "Hungary", flag: "🇭🇺", aliases: ["Hungary"], capital: "Budapest", coords: [19.0402, 47.4979], capitalCoords: [19.0402, 46.85], labelCoords: [19.5, 47.25], leader: "Péter Magyar", title: "Statsminister", since: "2026-05-09" },
  { country: "Slovenia", flag: "🇸🇮", aliases: ["Slovenia"], capital: "Ljubljana", coords: [14.5058, 46.0569], capitalCoords: [15.4, 45.45], labelCoords: [14.9, 46.15], leader: "Robert Golob", title: "Statsminister", since: "2022-06-01" },
  { country: "Croatia", flag: "🇭🇷", aliases: ["Croatia"], capital: "Zagreb", coords: [15.9819, 45.815], capitalCoords: [16.9, 45.15], labelCoords: [16.8, 45.35], leader: "Andrej Plenković", title: "Statsminister", since: "2016-10-19" },
  { country: "Bosnia and Herzegovina", flag: "🇧🇦", aliases: ["Bosnia and Herz.", "Bosnia and Herzegovina"], capital: "Sarajevo", coords: [18.4131, 43.8563], capitalCoords: [19.15, 43.3], labelCoords: [17.85, 44.05], leader: "Borjana Krišto", title: "Leder for ministerrådet", since: "2023-01-25" },
  { country: "Serbia", flag: "🇷🇸", aliases: ["Serbia"], capital: "Beograd", coords: [20.4489, 44.7866], capitalCoords: [21.2, 44.15], labelCoords: [20.8, 44.25], leader: "Đuro Macut", title: "Statsminister", since: "2025-04-16" },
  { country: "Montenegro", flag: "🇲🇪", aliases: ["Montenegro"], capital: "Podgorica", coords: [19.2594, 42.4304], capitalCoords: [20.05, 41.85], labelCoords: [19.35, 42.65], leader: "Milojko Spajić", title: "Statsminister", since: "2023-10-31" },
  { country: "Kosovo", flag: "🇽🇰", aliases: ["Kosovo"], capital: "Pristina", coords: [21.1655, 42.6629], capitalCoords: [22.0, 42.05], labelCoords: [20.95, 42.75], leader: "Albin Kurti", title: "Statsminister", since: "2021-03-22" },
  { country: "Albania", flag: "🇦🇱", aliases: ["Albania"], capital: "Tirana", coords: [19.8189, 41.3275], capitalCoords: [20.65, 40.7], labelCoords: [20.05, 41.05], leader: "Edi Rama", title: "Statsminister", since: "2013-09-13" },
  { country: "North Macedonia", flag: "🇲🇰", aliases: ["Macedonia", "North Macedonia"], capital: "Skopje", coords: [21.4314, 41.9981], capitalCoords: [22.25, 41.35], labelCoords: [21.75, 41.75], leader: "Hristijan Mickoski", title: "Statsminister", since: "2024-06-23" },
  { country: "Bulgaria", flag: "🇧🇬", aliases: ["Bulgaria"], capital: "Sofia", coords: [23.3219, 42.6977], capitalCoords: [24.15, 42.0], labelCoords: [25.0, 42.7], leader: "Rumen Radev", title: "Statsminister", since: "2026-05-08" },
  { country: "Romania", flag: "🇷🇴", aliases: ["Romania"], capital: "București", coords: [26.1025, 44.4268], capitalCoords: [26.1025, 43.75], labelCoords: [24.95, 45.75], leader: "Nicușor Dan", title: "President / politisk toppleder", since: "2025-05-26" },
  { country: "Moldova", flag: "🇲🇩", aliases: ["Moldova"], capital: "Chișinău", coords: [28.8353, 47.0105], capitalCoords: [29.55, 46.35], labelCoords: [28.65, 47.25], leader: "Dorin Recean", title: "Statsminister", since: "2023-02-16" },
  { country: "Ukraine", flag: "🇺🇦", aliases: ["Ukraine"], capital: "Kyiv", coords: [30.5234, 50.4501], capitalCoords: [30.5234, 49.8], labelCoords: [31.4, 49.2], leader: "Volodymyr Zelenskyj", title: "President / politisk toppleder", since: "2019-05-20" },
  { country: "Belarus", flag: "🇧🇾", aliases: ["Belarus"], capital: "Minsk", coords: [27.5615, 53.9045], capitalCoords: [27.5615, 53.2], labelCoords: [28.0, 53.6], leader: "Aleksandr Lukasjenko", title: "President / de facto toppleder", since: "1994-07-20" },
  { country: "Lithuania", flag: "🇱🇹", aliases: ["Lithuania"], capital: "Vilnius", coords: [25.2797, 54.6872], capitalCoords: [26.05, 54.05], labelCoords: [24.25, 55.2], leader: "Gitanas Nausėda", title: "President / politisk toppleder", since: "2019-07-12" },
  { country: "Latvia", flag: "🇱🇻", aliases: ["Latvia"], capital: "Riga", coords: [24.1052, 56.9496], capitalCoords: [24.95, 56.3], labelCoords: [24.7, 56.85], leader: "Evika Siliņa", title: "Statsminister", since: "2023-09-15" },
  { country: "Estonia", flag: "🇪🇪", aliases: ["Estonia"], capital: "Tallinn", coords: [24.7536, 59.437], capitalCoords: [25.45, 58.7], labelCoords: [25.35, 58.9], leader: "Kristen Michal", title: "Statsminister", since: "2024-07-23" },
  { country: "Russia", flag: "🇷🇺", aliases: ["Russia"], capital: "Moskva", coords: [37.6173, 55.7558], capitalCoords: [37.6173, 55.0], labelCoords: [39.7, 57.5], leader: "Vladimir Putin", title: "President / politisk toppleder", since: "2012-05-07", note: "Har også hatt tidligere presidentperiode 2000–2008." },
  { country: "Turkey", flag: "🇹🇷", aliases: ["Turkey", "Türkiye"], capital: "Ankara", coords: [32.8597, 39.9334], capitalCoords: [32.8597, 39.2], labelCoords: [33.7, 39.15], leader: "Recep Tayyip Erdoğan", title: "President / regjeringsleder", since: "2014-08-28" },
  { country: "Georgia", flag: "🇬🇪", aliases: ["Georgia"], capital: "Tbilisi", coords: [44.8271, 41.7151], capitalCoords: [45.65, 41.05], labelCoords: [43.8, 42.2], leader: "Irakli Kobakhidze", title: "Statsminister", since: "2024-02-08" },
  { country: "Armenia", flag: "🇦🇲", aliases: ["Armenia"], capital: "Jerevan", coords: [44.5152, 40.1872], capitalCoords: [45.35, 39.55], labelCoords: [44.7, 40.2], leader: "Nikol Pashinyan", title: "Statsminister", since: "2018-05-08" },
  { country: "Azerbaijan", flag: "🇦🇿", aliases: ["Azerbaijan"], capital: "Baku", coords: [49.8671, 40.4093], capitalCoords: [49.1, 39.7], labelCoords: [47.65, 40.8], leader: "Ilham Aliyev", title: "President / politisk toppleder", since: "2003-10-31" },
  { country: "Andorra", flag: "🇦🇩", aliases: ["Andorra"], capital: "Andorra la Vella", coords: [1.5218, 42.5063], capitalCoords: [2.65, 43.0], labelCoords: [1.9, 42.6], leader: "Xavier Espot", title: "Statsminister", since: "2019-05-16" },
  { country: "Monaco", flag: "🇲🇨", aliases: ["Monaco"], capital: "Monaco", coords: [7.4246, 43.7384], capitalCoords: [8.35, 44.15], labelCoords: [7.85, 43.6], leader: "Christophe Mirmand", title: "Minister of State / regjeringssjef", since: "2025-07-21", note: "Oppdatert fra første versjon: Didier Guillaume døde i januar 2025." },
  { country: "Liechtenstein", flag: "🇱🇮", aliases: ["Liechtenstein"], capital: "Vaduz", coords: [9.5209, 47.141], capitalCoords: [10.3, 47.55], labelCoords: [10.15, 47.05], leader: "Brigitte Haas", title: "Regjeringssjef", since: "2025-04-10" },
  { country: "San Marino", flag: "🇸🇲", aliases: ["San Marino"], capital: "San Marino", coords: [12.4578, 43.9424], capitalCoords: [13.35, 44.35], labelCoords: [12.9, 43.95], leader: "Alice Mina og Vladimiro Selva", title: "Kapteinsregenter", since: "2026-04-01", note: "San Marino har to statsledere som velges for seks måneder." },
  { country: "Vatican City", flag: "🇻🇦", aliases: ["Vatican", "Vatican City"], capital: "Vatikanstaten", coords: [12.4534, 41.9029], capitalCoords: [13.2, 41.2], labelCoords: [13.0, 41.7], leader: "Leo XIV", title: "Pave / statsoverhode", since: "2025-05-08", note: "Oppdatert fra første versjon: Leo XIV ble valgt 8. mai 2025." }
];

const labelCountries = new Set([
  "Norway",
  "Sweden",
  "Finland",
  "United Kingdom",
  "Ireland",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Poland",
  "Ukraine",
  "Romania",
  "Turkey"
]);

const leadersSorted = [...leaders].sort((a, b) => a.country.localeCompare(b.country, "nb"));
const byAlias = new Map();
leaders.forEach((leader) => {
  leader.aliases.forEach((alias) => byAlias.set(alias, leader));
});

const state = {
  selected: leaders.find((item) => item.country === "Norway"),
  hovered: null,
  search: ""
};

const mapRoot = document.querySelector("#map-root");
const detailPanel = document.querySelector("#detail-panel");
const activeCountryTitle = document.querySelector("#active-country-title");
const countryList = document.querySelector("#country-list");
const searchInput = document.querySelector("#search-input");
const zoomInButton = document.querySelector("[data-zoom='in']");
const zoomOutButton = document.querySelector("[data-zoom='out']");
const zoomResetButton = document.querySelector("[data-zoom='reset']");
const totalCount = document.querySelector("#total-count");
const checkedCount = document.querySelector("#checked-count");
const checkedDateLabel = document.querySelector("#checked-date");
const sourceDateLabel = document.querySelector("#source-date");

const tooltip = document.createElement("div");
tooltip.className = "tooltip";
mapRoot.appendChild(tooltip);

if (totalCount) totalCount.textContent = `${leaders.length} land og mikrostater`;
if (checkedCount) checkedCount.textContent = "Kritiske endringer dobbeltsjekket";
if (checkedDateLabel) checkedDateLabel.textContent = checkedDate;
if (sourceDateLabel) sourceDateLabel.textContent = checkedDate;

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function yearsAndMonths(since) {
  const start = new Date(`${since}T00:00:00+02:00`);
  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  const days = today.getDate() - start.getDate();

  if (days < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  if (years === 0 && months === 0) return `${totalDays} dager`;
  if (years === 0) return `${months} mnd.`;
  return `${years} år og ${months} mnd.`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("nb-NO", { dateStyle: "long" }).format(new Date(`${value}T00:00:00+02:00`));
}

function getActiveLeader() {
  return state.hovered || state.selected;
}

function setHovered(leader) {
  state.hovered = leader;
  renderDetail();
  updateList();
  updateMapHighlights();
}

function setSelected(leader) {
  state.selected = leader;
  renderDetail();
  updateList();
  updateMapHighlights();
}

function clampTooltipPosition(x, y) {
  const width = tooltip.offsetWidth || 240;
  const height = tooltip.offsetHeight || 120;
  const bounds = mapRoot.getBoundingClientRect();
  const left = Math.max(12, Math.min(x + 18, bounds.width - width - 12));
  const top = Math.max(12, Math.min(y + 18, bounds.height - height - 12));
  return { left, top };
}

function showTooltip(leader, x, y) {
  tooltip.innerHTML = `
    <div class="tooltip-country">${leader.flag} ${leader.country}</div>
    <div class="tooltip-line">${leader.capital}</div>
    <div class="tooltip-line">${leader.leader}</div>
    <div class="tooltip-line">Sittetid: ${yearsAndMonths(leader.since)}</div>
  `;
  tooltip.classList.add("visible");
  moveTooltip(x, y);
}

function moveTooltip(x, y) {
  const pos = clampTooltipPosition(x, y);
  tooltip.style.left = `${pos.left}px`;
  tooltip.style.top = `${pos.top}px`;
}

function hideTooltip() {
  tooltip.classList.remove("visible");
}

function renderDetail() {
  const active = getActiveLeader();
  activeCountryTitle.textContent = active.country;
  detailPanel.innerHTML = `
    <div class="detail-topline">
      <span class="detail-flag">${active.flag}</span>
      <strong>${active.country}</strong>
    </div>
    <div class="detail-capital">Hovedstad: ${active.capital}</div>
    <div class="leader-box">
      <p class="leader-title">${active.title}</p>
      <p class="leader-name">${active.leader}</p>
    </div>
    <div class="tenure-box">
      Har sittet siden <strong>${formatDate(active.since)}</strong><br />
      Omtrent <strong>${yearsAndMonths(active.since)}</strong>
    </div>
    ${active.note ? `<div class="note-box">${active.note}</div>` : ""}
  `;
}

function getFilteredLeaders() {
  const query = normalize(state.search.trim());
  if (!query) return leadersSorted;

  return leadersSorted.filter((leader) => {
    const haystack = normalize(`${leader.country} ${leader.capital} ${leader.leader} ${leader.title}`);
    return haystack.includes(query);
  });
}

function updateList() {
  const active = getActiveLeader();
  const items = getFilteredLeaders();

  if (!items.length) {
    countryList.innerHTML = '<div class="empty-state">Ingen treff. Prøv et annet søk.</div>';
    return;
  }

  countryList.innerHTML = "";
  items.forEach((leader) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `country-item${active.country === leader.country ? " active" : ""}`;
    button.innerHTML = `
      <div class="country-item-top">
        <span class="country-item-country">${leader.flag} ${leader.country}</span>
        <span>${yearsAndMonths(leader.since)}</span>
      </div>
      <div class="country-item-capital">${leader.capital}</div>
      <div class="country-item-meta">${leader.leader} · ${leader.title}</div>
    `;
    button.addEventListener("mouseenter", () => setHovered(leader));
    button.addEventListener("mouseleave", () => setHovered(null));
    button.addEventListener("click", () => setSelected(leader));
    countryList.appendChild(button);
  });
}

let countryPaths = null;
let capitalDots = null;
let capitalFlags = null;
let capitalLabels = null;
let countryLabels = null;
let zoomBehavior = null;
let zoomGroup = null;
let svgElement = null;
let countryColorByName = new Map();

function buildCountryColorMap(features, topologyGeometries) {
  const featureIndexes = new Map(features.map((featureItem, index) => [featureItem.properties.name, index]));
  const geometryNameByIndex = topologyGeometries.map((geometry) => geometry.properties?.name);
  const fullNeighbors = neighbors(topologyGeometries);
  const europeNeighborIndexes = features.map((featureItem) => {
    const sourceIndex = geometryNameByIndex.findIndex((name) => name === featureItem.properties.name);
    if (sourceIndex === -1) return [];
    return fullNeighbors[sourceIndex]
      .map((neighborIndex) => geometryNameByIndex[neighborIndex])
      .filter((name) => featureIndexes.has(name))
      .map((name) => featureIndexes.get(name));
  });

  const colors = new Map();
  features.forEach((featureItem, index) => {
    const used = new Set(
      europeNeighborIndexes[index]
        .map((neighborIndex) => colors.get(features[neighborIndex].properties.name))
        .filter(Boolean)
    );
    const color = countryPalette.find((candidate) => !used.has(candidate)) || countryPalette[index % countryPalette.length];
    colors.set(featureItem.properties.name, color);
  });
  return colors;
}

function updateMapHighlights() {
  const active = getActiveLeader();

  if (countryPaths) {
    countryPaths
      .attr("fill", (d) => {
        const leader = byAlias.get(d.properties.name);
        if (!leader) return "#132132";
        return leader.country === active.country ? "#4ec7ff" : countryColorByName.get(d.properties.name) || "#9fd0e4";
      })
      .attr("stroke", (d) => (byAlias.get(d.properties.name)?.country === active.country ? "#eef7ff" : "#54708e"))
      .attr("stroke-width", (d) => (byAlias.get(d.properties.name)?.country === active.country ? 1.4 : 0.65));
  }

  if (capitalDots) {
    capitalDots
      .attr("r", (d) => (d.country === active.country ? 7.2 : 4.8))
      .attr("fill", (d) => (d.country === active.country ? "#ffd36b" : "#f6fbff"));
  }

  if (capitalFlags) {
    capitalFlags
      .attr("font-size", (d) => (d.country === active.country ? 25 : 19))
      .attr("opacity", (d) => (d.country === active.country ? 1 : 0.94));
  }

  if (capitalLabels) {
    capitalLabels
      .attr("font-size", (d) => (d.country === active.country ? 12.5 : 11))
      .attr("font-weight", (d) => (d.country === active.country ? 800 : 700));
  }

  if (countryLabels) {
    countryLabels.attr("opacity", (d) => (d.country === active.country ? 1 : 0.78));
  }
}

function wireMarkerEvents(selection) {
  selection
    .on("mouseenter", (event, leader) => {
      setHovered(leader);
      showTooltip(leader, event.offsetX, event.offsetY);
    })
    .on("mousemove", (event) => {
      moveTooltip(event.offsetX, event.offsetY);
    })
    .on("mouseleave", () => {
      setHovered(null);
      hideTooltip();
    })
    .on("click", (_, leader) => setSelected(leader));
}

async function drawMap() {
  try {
    const world = await d3.json(geoUrl);
    const countries = feature(world, world.objects.countries).features;
    const europeFeatures = countries.filter((country) => byAlias.has(country.properties.name));
    countryColorByName = buildCountryColorMap(europeFeatures, world.objects.countries.geometries);

    const width = 980;
    const height = 760;
    const projection = d3.geoMercator().fitExtent(
      [[34, 24], [width - 34, height - 28]],
      { type: "FeatureCollection", features: europeFeatures }
    );
    const path = d3.geoPath(projection);

    svgElement = d3
      .select(mapRoot)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Interaktivt Europakart med politiske ledere");

    svgElement.append("rect").attr("width", width).attr("height", height).attr("fill", "transparent");

    zoomGroup = svgElement.append("g");

    zoomGroup
      .append("path")
      .datum({ type: "Sphere" })
      .attr("d", path)
      .attr("fill", "#bedef0");

    const countryLayer = zoomGroup.append("g");
    countryPaths = countryLayer
      .selectAll("path")
      .data(europeFeatures)
      .join("path")
      .attr("class", "map-country")
      .attr("d", path)
      .style("cursor", (d) => (byAlias.get(d.properties.name) ? "pointer" : "default"))
      .on("mouseenter", (event, datum) => {
        const leader = byAlias.get(datum.properties.name);
        if (!leader) return;
        setHovered(leader);
        showTooltip(leader, event.offsetX, event.offsetY);
      })
      .on("mousemove", (event) => moveTooltip(event.offsetX, event.offsetY))
      .on("mouseleave", () => {
        setHovered(null);
        hideTooltip();
      })
      .on("click", (_, datum) => {
        const leader = byAlias.get(datum.properties.name);
        if (leader) setSelected(leader);
      });

    countryLabels = zoomGroup
      .append("g")
      .selectAll("text")
      .data(leaders.filter((leader) => labelCountries.has(leader.country)))
      .join("text")
      .attr("class", "country-label")
      .attr("x", (d) => projection(d.labelCoords)[0])
      .attr("y", (d) => projection(d.labelCoords)[1])
      .attr("text-anchor", "middle")
      .text((d) => d.country);

    const capitalLayer = zoomGroup.append("g");

    capitalFlags = capitalLayer
      .selectAll("text.flag")
      .data(leaders)
      .join("text")
      .attr("class", "flag-label")
      .attr("x", (d) => projection(d.coords)[0])
      .attr("y", (d) => projection(d.coords)[1] - 11)
      .attr("text-anchor", "middle")
      .style("cursor", "pointer")
      .text((d) => d.flag);

    capitalDots = capitalLayer
      .selectAll("circle")
      .data(leaders)
      .join("circle")
      .attr("cx", (d) => projection(d.coords)[0])
      .attr("cy", (d) => projection(d.coords)[1] + 2)
      .attr("stroke", "#0c1522")
      .attr("stroke-width", 2.5)
      .style("cursor", "pointer");

    capitalLabels = capitalLayer
      .selectAll("text.capital")
      .data(leaders)
      .join("text")
      .attr("class", "capital-label")
      .attr("x", (d) => projection(d.capitalCoords)[0])
      .attr("y", (d) => projection(d.capitalCoords)[1])
      .attr("text-anchor", "middle")
      .text((d) => d.capital);

    wireMarkerEvents(capitalFlags);
    wireMarkerEvents(capitalDots);
    wireMarkerEvents(capitalLabels);

    zoomBehavior = d3.zoom()
      .scaleExtent([1, 5])
      .translateExtent([[0, 0], [width, height]])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      });

    svgElement.call(zoomBehavior);
    svgElement.call(zoomBehavior.transform, d3.zoomIdentity.translate(0, 0).scale(1));

    zoomInButton?.addEventListener("click", () => {
      svgElement.transition().duration(220).call(zoomBehavior.scaleBy, 1.25);
    });

    zoomOutButton?.addEventListener("click", () => {
      svgElement.transition().duration(220).call(zoomBehavior.scaleBy, 0.8);
    });

    zoomResetButton?.addEventListener("click", () => {
      svgElement.transition().duration(260).call(zoomBehavior.transform, d3.zoomIdentity);
    });

    updateMapHighlights();
  } catch (error) {
    mapRoot.innerHTML = `
      <div class="empty-state" style="margin: 18px;">
        Kartet kunne ikke lastes. Kontroller nettforbindelsen og prøv igjen.
      </div>
    `;
    console.error(error);
  }
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  updateList();
});

renderDetail();
updateList();
drawMap();
