import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { feature, neighbors } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const today = new Date("2026-05-14T12:00:00+02:00");
const checkedDate = "14. mai 2026";
const countryPalette = ["#f6c87f", "#a8d8b9", "#f2a7c0", "#9fd0e4", "#d6c4f2", "#f3e77c"];
const flagCodeByCountry = {
  Norway: "no",
  Sweden: "se",
  Denmark: "dk",
  Finland: "fi",
  Iceland: "is",
  "United Kingdom": "gb",
  Ireland: "ie",
  France: "fr",
  Germany: "de",
  Netherlands: "nl",
  Belgium: "be",
  Luxembourg: "lu",
  Austria: "at",
  Switzerland: "ch",
  Spain: "es",
  Portugal: "pt",
  Italy: "it",
  Malta: "mt",
  Greece: "gr",
  Cyprus: "cy",
  Poland: "pl",
  Czechia: "cz",
  Slovakia: "sk",
  Hungary: "hu",
  Slovenia: "si",
  Croatia: "hr",
  "Bosnia and Herzegovina": "ba",
  Serbia: "rs",
  Montenegro: "me",
  Kosovo: "xk",
  Albania: "al",
  "North Macedonia": "mk",
  Bulgaria: "bg",
  Romania: "ro",
  Moldova: "md",
  Ukraine: "ua",
  Belarus: "by",
  Lithuania: "lt",
  Latvia: "lv",
  Estonia: "ee",
  Russia: "ru",
  Turkey: "tr",
  Georgia: "ge",
  Armenia: "am",
  Azerbaijan: "az",
  Andorra: "ad",
  Monaco: "mc",
  Liechtenstein: "li",
  "San Marino": "sm",
  "Vatican City": "va"
};

const leaders = [
  { country: "Norway", nameNo: "Norge", flag: "🇳🇴", aliases: ["Norway"], capital: "Oslo", labelCoords: [10.8, 64.1], leader: "Jonas Gahr Støre", title: "Statsminister", since: "2021-10-14" },
  { country: "Sweden", nameNo: "Sverige", flag: "🇸🇪", aliases: ["Sweden"], capital: "Stockholm", labelCoords: [16.3, 62.0], leader: "Ulf Kristersson", title: "Statsminister", since: "2022-10-18" },
  { country: "Denmark", nameNo: "Danmark", flag: "🇩🇰", aliases: ["Denmark"], capital: "København", labelCoords: [10.0, 56.1], leader: "Mette Frederiksen", title: "Statsminister", since: "2019-06-27" },
  { country: "Finland", nameNo: "Finland", flag: "🇫🇮", aliases: ["Finland"], capital: "Helsinki", labelCoords: [26.0, 64.0], leader: "Petteri Orpo", title: "Statsminister", since: "2023-06-20" },
  { country: "Iceland", nameNo: "Island", flag: "🇮🇸", aliases: ["Iceland"], capital: "Reykjavík", labelCoords: [-18.0, 65.1], leader: "Kristrún Frostadóttir", title: "Statsminister", since: "2024-12-21" },
  { country: "United Kingdom", nameNo: "Storbritannia", flag: "🇬🇧", aliases: ["United Kingdom", "England", "Scotland", "Wales", "Northern Ireland"], capital: "London", labelCoords: [-2.8, 54.7], leader: "Keir Starmer", title: "Statsminister", since: "2024-07-05" },
  { country: "Ireland", nameNo: "Irland", flag: "🇮🇪", aliases: ["Ireland"], capital: "Dublin", labelCoords: [-8.0, 53.8], leader: "Micheál Martin", title: "Taoiseach", since: "2025-01-23" },
  { country: "France", nameNo: "Frankrike", flag: "🇫🇷", aliases: ["France"], capital: "Paris", labelCoords: [2.2, 46.6], leader: "Emmanuel Macron", title: "President / politisk toppleder", since: "2017-05-14" },
  { country: "Germany", nameNo: "Tyskland", flag: "🇩🇪", aliases: ["Germany"], capital: "Berlin", labelCoords: [10.7, 51.1], leader: "Friedrich Merz", title: "Forbundskansler", since: "2025-05-06" },
  { country: "Netherlands", nameNo: "Nederland", flag: "🇳🇱", aliases: ["Netherlands"], capital: "Amsterdam", labelCoords: [5.4, 52.5], leader: "Rob Jetten", title: "Statsminister", since: "2026-02-23", note: "Verifisert som sittende statsminister per 14. mai 2026." },
  { country: "Belgium", nameNo: "Belgia", flag: "🇧🇪", aliases: ["Belgium"], capital: "Brussel", labelCoords: [4.5, 50.8], leader: "Bart De Wever", title: "Statsminister", since: "2025-02-03" },
  { country: "Luxembourg", nameNo: "Luxembourg", flag: "🇱🇺", aliases: ["Luxembourg"], capital: "Luxembourg", labelCoords: [6.15, 49.8], leader: "Luc Frieden", title: "Statsminister", since: "2023-11-17" },
  { country: "Austria", nameNo: "Østerrike", flag: "🇦🇹", aliases: ["Austria"], capital: "Wien", labelCoords: [14.2, 47.6], leader: "Christian Stocker", title: "Forbundskansler", since: "2025-03-03" },
  { country: "Switzerland", nameNo: "Sveits", flag: "🇨🇭", aliases: ["Switzerland"], capital: "Bern", labelCoords: [8.15, 46.75], leader: "Karin Keller-Sutter", title: "Forbundspresident", since: "2025-01-01", note: "Sveits har kollegial regjering og roterende president." },
  { country: "Spain", nameNo: "Spania", flag: "🇪🇸", aliases: ["Spain"], capital: "Madrid", labelCoords: [-3.5, 40.25], leader: "Pedro Sánchez", title: "Statsminister", since: "2018-06-02" },
  { country: "Portugal", nameNo: "Portugal", flag: "🇵🇹", aliases: ["Portugal"], capital: "Lisboa", labelCoords: [-8.25, 39.7], leader: "Luís Montenegro", title: "Statsminister", since: "2024-04-02" },
  { country: "Italy", nameNo: "Italia", flag: "🇮🇹", aliases: ["Italy"], capital: "Roma", labelCoords: [12.5, 42.9], leader: "Giorgia Meloni", title: "Statsminister", since: "2022-10-22" },
  { country: "Malta", nameNo: "Malta", flag: "🇲🇹", aliases: ["Malta"], capital: "Valletta", labelCoords: [14.52, 35.9], leader: "Robert Abela", title: "Statsminister", since: "2020-01-13" },
  { country: "Greece", nameNo: "Hellas", flag: "🇬🇷", aliases: ["Greece"], capital: "Athen", labelCoords: [22.4, 39.0], leader: "Kyriakos Mitsotakis", title: "Statsminister", since: "2023-06-26", note: "Andre sammenhengende regjeringsperiode; først tiltrådt i 2019." },
  { country: "Cyprus", nameNo: "Kypros", flag: "🇨🇾", aliases: ["Cyprus"], capital: "Nikosia", labelCoords: [33.15, 35.2], leader: "Nikos Christodoulides", title: "President / regjeringsleder", since: "2023-02-28" },
  { country: "Poland", nameNo: "Polen", flag: "🇵🇱", aliases: ["Poland"], capital: "Warszawa", labelCoords: [19.2, 52.05], leader: "Donald Tusk", title: "Statsminister", since: "2023-12-13" },
  { country: "Czechia", nameNo: "Tsjekkia", flag: "🇨🇿", aliases: ["Czechia", "Czech Republic", "Czech Rep."], capital: "Praha", labelCoords: [15.0, 49.8], leader: "Andrej Babiš", title: "Statsminister", since: "2025-12-09", note: "Tiltrådte 9. desember 2025." },
  { country: "Slovakia", nameNo: "Slovakia", flag: "🇸🇰", aliases: ["Slovakia"], capital: "Bratislava", labelCoords: [19.2, 48.75], leader: "Robert Fico", title: "Statsminister", since: "2023-10-25" },
  { country: "Hungary", nameNo: "Ungarn", flag: "🇭🇺", aliases: ["Hungary"], capital: "Budapest", labelCoords: [19.5, 47.25], leader: "Péter Magyar", title: "Statsminister", since: "2026-05-09" },
  { country: "Slovenia", nameNo: "Slovenia", flag: "🇸🇮", aliases: ["Slovenia"], capital: "Ljubljana", labelCoords: [14.9, 46.15], leader: "Robert Golob", title: "Statsminister", since: "2022-06-01" },
  { country: "Croatia", nameNo: "Kroatia", flag: "🇭🇷", aliases: ["Croatia"], capital: "Zagreb", labelCoords: [16.8, 45.35], leader: "Andrej Plenković", title: "Statsminister", since: "2016-10-19" },
  { country: "Bosnia and Herzegovina", nameNo: "Bosnia-Hercegovina", flag: "🇧🇦", aliases: ["Bosnia and Herz.", "Bosnia and Herzegovina"], capital: "Sarajevo", labelCoords: [17.85, 44.05], leader: "Borjana Krišto", title: "Leder for ministerrådet", since: "2023-01-25" },
  { country: "Serbia", nameNo: "Serbia", flag: "🇷🇸", aliases: ["Serbia"], capital: "Beograd", labelCoords: [20.8, 44.25], leader: "Đuro Macut", title: "Statsminister", since: "2025-04-16" },
  { country: "Montenegro", nameNo: "Montenegro", flag: "🇲🇪", aliases: ["Montenegro"], capital: "Podgorica", labelCoords: [19.35, 42.65], leader: "Milojko Spajić", title: "Statsminister", since: "2023-10-31" },
  { country: "Kosovo", nameNo: "Kosovo", flag: "🇽🇰", aliases: ["Kosovo"], capital: "Pristina", labelCoords: [20.95, 42.75], leader: "Albin Kurti", title: "Statsminister", since: "2021-03-22" },
  { country: "Albania", nameNo: "Albania", flag: "🇦🇱", aliases: ["Albania"], capital: "Tirana", labelCoords: [20.05, 41.05], leader: "Edi Rama", title: "Statsminister", since: "2013-09-13" },
  { country: "North Macedonia", nameNo: "Nord-Makedonia", flag: "🇲🇰", aliases: ["Macedonia", "North Macedonia"], capital: "Skopje", labelCoords: [21.75, 41.75], leader: "Hristijan Mickoski", title: "Statsminister", since: "2024-06-23" },
  { country: "Bulgaria", nameNo: "Bulgaria", flag: "🇧🇬", aliases: ["Bulgaria"], capital: "Sofia", labelCoords: [25.0, 42.7], leader: "Rumen Radev", title: "Statsminister", since: "2026-05-08" },
  { country: "Romania", nameNo: "Romania", flag: "🇷🇴", aliases: ["Romania"], capital: "București", labelCoords: [24.95, 45.75], leader: "Nicușor Dan", title: "President / politisk toppleder", since: "2025-05-26" },
  { country: "Moldova", nameNo: "Moldova", flag: "🇲🇩", aliases: ["Moldova"], capital: "Chișinău", labelCoords: [28.65, 47.25], leader: "Dorin Recean", title: "Statsminister", since: "2023-02-16" },
  { country: "Ukraine", nameNo: "Ukraina", flag: "🇺🇦", aliases: ["Ukraine"], capital: "Kyiv", labelCoords: [31.4, 49.2], leader: "Volodymyr Zelenskyj", title: "President / politisk toppleder", since: "2019-05-20" },
  { country: "Belarus", nameNo: "Belarus", flag: "🇧🇾", aliases: ["Belarus"], capital: "Minsk", labelCoords: [28.0, 53.6], leader: "Aleksandr Lukasjenko", title: "President / de facto toppleder", since: "1994-07-20" },
  { country: "Lithuania", nameNo: "Litauen", flag: "🇱🇹", aliases: ["Lithuania"], capital: "Vilnius", labelCoords: [24.25, 55.2], leader: "Gitanas Nausėda", title: "President / politisk toppleder", since: "2019-07-12" },
  { country: "Latvia", nameNo: "Latvia", flag: "🇱🇻", aliases: ["Latvia"], capital: "Riga", labelCoords: [24.7, 56.85], leader: "Evika Siliņa", title: "Statsminister", since: "2023-09-15" },
  { country: "Estonia", nameNo: "Estland", flag: "🇪🇪", aliases: ["Estonia"], capital: "Tallinn", labelCoords: [25.35, 58.9], leader: "Kristen Michal", title: "Statsminister", since: "2024-07-23" },
  { country: "Russia", nameNo: "Russland", flag: "🇷🇺", aliases: ["Russia"], capital: "Moskva", labelCoords: [39.7, 57.5], leader: "Vladimir Putin", title: "President / politisk toppleder", since: "2012-05-07", note: "Har også hatt tidligere presidentperiode 2000–2008." },
  { country: "Turkey", nameNo: "Tyrkia", flag: "🇹🇷", aliases: ["Turkey", "Türkiye"], capital: "Ankara", labelCoords: [33.7, 39.15], leader: "Recep Tayyip Erdoğan", title: "President / regjeringsleder", since: "2014-08-28" },
  { country: "Georgia", nameNo: "Georgia", flag: "🇬🇪", aliases: ["Georgia"], capital: "Tbilisi", labelCoords: [43.8, 42.2], leader: "Irakli Kobakhidze", title: "Statsminister", since: "2024-02-08" },
  { country: "Armenia", nameNo: "Armenia", flag: "🇦🇲", aliases: ["Armenia"], capital: "Jerevan", labelCoords: [44.7, 40.2], leader: "Nikol Pashinyan", title: "Statsminister", since: "2018-05-08" },
  { country: "Azerbaijan", nameNo: "Aserbajdsjan", flag: "🇦🇿", aliases: ["Azerbaijan"], capital: "Baku", labelCoords: [47.65, 40.8], leader: "Ilham Aliyev", title: "President / politisk toppleder", since: "2003-10-31" },
  { country: "Andorra", nameNo: "Andorra", flag: "🇦🇩", aliases: ["Andorra"], capital: "Andorra la Vella", labelCoords: [1.9, 42.6], leader: "Xavier Espot", title: "Statsminister", since: "2019-05-16" },
  { country: "Monaco", nameNo: "Monaco", flag: "🇲🇨", aliases: ["Monaco"], capital: "Monaco", labelCoords: [7.85, 43.6], leader: "Christophe Mirmand", title: "Minister of State / regjeringssjef", since: "2025-07-21", note: "Oppdatert fra første versjon: Didier Guillaume døde i januar 2025." },
  { country: "Liechtenstein", nameNo: "Liechtenstein", flag: "🇱🇮", aliases: ["Liechtenstein"], capital: "Vaduz", labelCoords: [10.15, 47.05], leader: "Brigitte Haas", title: "Regjeringssjef", since: "2025-04-10" },
  { country: "San Marino", nameNo: "San Marino", flag: "🇸🇲", aliases: ["San Marino"], capital: "San Marino", labelCoords: [12.9, 43.95], leader: "Alice Mina og Vladimiro Selva", title: "Kapteinsregenter", since: "2026-04-01", note: "San Marino har to statsledere som velges for seks måneder." },
  { country: "Vatican City", nameNo: "Vatikanstaten", flag: "🇻🇦", aliases: ["Vatican", "Vatican City"], capital: "Vatikanstaten", labelCoords: [13.0, 41.7], leader: "Leo XIV", title: "Pave / statsoverhode", since: "2025-05-08", note: "Oppdatert fra første versjon: Leo XIV ble valgt 8. mai 2025." }
];

const labelCountries = new Set([
  "Norway", "Sweden", "Finland", "United Kingdom", "Ireland", "France", "Germany",
  "Spain", "Italy", "Poland", "Ukraine", "Romania", "Turkey", "Greece"
]);

const byAlias = new Map();
leaders.forEach((leader) => leader.aliases.forEach((alias) => byAlias.set(alias, leader)));

const state = {
  selected: leaders.find((item) => item.country === "Norway"),
  hovered: null
};

const mapRoot = document.querySelector("#map-root");
const detailPanel = document.querySelector("#detail-panel");
const activeCountryTitle = document.querySelector("#active-country-title");
const zoomInButton = document.querySelector("[data-zoom='in']");
const zoomOutButton = document.querySelector("[data-zoom='out']");
const zoomResetButton = document.querySelector("[data-zoom='reset']");
const totalCount = document.querySelector("#total-count");
const checkedCount = document.querySelector("#checked-count");
const checkedDateLabel = document.querySelector("#checked-date");
const sourceDateLabel = document.querySelector("#source-date");
const portraitCache = new Map();
let portraitRequestId = 0;

if (totalCount) totalCount.textContent = `${leaders.length} land og mikrostater`;
if (checkedCount) checkedCount.textContent = "Kritiske endringer dobbeltsjekket";
if (checkedDateLabel) checkedDateLabel.textContent = checkedDate;
if (sourceDateLabel) sourceDateLabel.textContent = checkedDate;

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

function renderDetail() {
  const active = getActiveLeader();
  const flagCode = flagCodeByCountry[active.country];
  activeCountryTitle.textContent = active.nameNo;
  detailPanel.innerHTML = `
    <div class="detail-hero">
      <div></div>
      <div class="leader-portrait leader-portrait--hero" data-portrait-slot aria-hidden="true">
        <span>${getInitials(active.leader)}</span>
      </div>
    </div>
    <div class="detail-capital">Hovedstad: ${active.capital}</div>
    <div class="leader-box">
      <div class="leader-copy">
        <p class="leader-title">${active.title}</p>
        <div class="leader-name-row">
          ${flagCode ? `<img class="leader-flag" src="https://flagcdn.com/w80/${flagCode}.png" alt="Flagget til ${active.nameNo}" loading="lazy" />` : ""}
          <p class="leader-name">${active.leader}</p>
        </div>
      </div>
    </div>
    <div class="tenure-box">
      Har sittet siden <strong>${formatDate(active.since)}</strong><br />
      Omtrent <strong>${yearsAndMonths(active.since)}</strong>
    </div>
    ${active.note ? `<div class="note-box">${active.note}</div>` : ""}
  `;
  updateLeaderPortrait(active);
}

function getInitials(name) {
  const parts = name.split(/[\s-]+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function getPortraitQuery(leader) {
  if (leader.country === "Vatican City") return "Pope Leo XIV";
  if (leader.country === "San Marino") return null;
  return leader.leader;
}

async function fetchLeaderPortrait(leader) {
  const query = getPortraitQuery(leader);
  if (!query) return null;
  if (portraitCache.has(query)) return portraitCache.get(query);

  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("portrait fetch failed");
    const data = await response.json();
    const imageUrl = data.thumbnail?.source || data.originalimage?.source || null;
    portraitCache.set(query, imageUrl);
    return imageUrl;
  } catch {
    portraitCache.set(query, null);
    return null;
  }
}

async function updateLeaderPortrait(leader) {
  const slot = detailPanel.querySelector("[data-portrait-slot]");
  if (!slot) return;

  const requestId = ++portraitRequestId;
  const imageUrl = await fetchLeaderPortrait(leader);
  if (requestId !== portraitRequestId) return;

  if (imageUrl) {
    slot.innerHTML = `<img src="${imageUrl}" alt="Portrett av ${leader.leader}" loading="lazy" referrerpolicy="no-referrer" />`;
  } else {
    slot.innerHTML = `<span>${getInitials(leader.leader)}</span>`;
  }
}

let countryPaths = null;
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
      .attr("stroke", (d) => (byAlias.get(d.properties.name)?.country === active.country ? "#f8fcff" : "#5f7695"))
      .attr("stroke-width", (d) => (byAlias.get(d.properties.name)?.country === active.country ? 1.6 : 0.8));
  }

  if (countryLabels) {
    countryLabels
      .attr("font-size", (d) => (d.country === active.country ? 12 : 10.5))
      .attr("font-weight", (d) => (d.country === active.country ? 800 : 700))
      .attr("opacity", (d) => (d.country === active.country ? 1 : 0.82));
  }
}

async function drawMap() {
  try {
    const world = await d3.json(geoUrl);
    const countries = feature(world, world.objects.countries).features;
    const europeFeatures = countries.filter((country) => byAlias.has(country.properties.name));
    countryColorByName = buildCountryColorMap(europeFeatures, world.objects.countries.geometries);

    const width = 1380;
    const height = 840;
    const projection = d3.geoMercator()
      .center([18, 54])
      .translate([width / 2, height / 2])
      .scale(780);
    const path = d3.geoPath(projection);

    svgElement = d3
      .select(mapRoot)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Interaktivt Europakart med politiske ledere");

    zoomGroup = svgElement.append("g");

    zoomGroup
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#bedef0");

    countryPaths = zoomGroup
      .append("g")
      .selectAll("path")
      .data(europeFeatures)
      .join("path")
      .attr("class", "map-country")
      .attr("d", path)
      .style("cursor", (d) => (byAlias.get(d.properties.name) ? "pointer" : "default"))
      .on("mouseenter", (_, datum) => {
        const leader = byAlias.get(datum.properties.name);
        if (!leader) return;
        state.hovered = leader;
        renderDetail();
        updateMapHighlights();
      })
      .on("mouseleave", () => {
        state.hovered = null;
        renderDetail();
        updateMapHighlights();
      })
      .on("click", (_, datum) => {
        const leader = byAlias.get(datum.properties.name);
        if (!leader) return;
        state.selected = leader;
        renderDetail();
        updateMapHighlights();
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
      .text((d) => d.nameNo);

    zoomBehavior = d3.zoom()
      .scaleExtent([1, 4.5])
      .translateExtent([[0, 0], [width, height]])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      });

    svgElement.call(zoomBehavior);

    zoomInButton?.addEventListener("click", () => {
      svgElement.transition().duration(220).call(zoomBehavior.scaleBy, 1.2);
    });

    zoomOutButton?.addEventListener("click", () => {
      svgElement.transition().duration(220).call(zoomBehavior.scaleBy, 0.84);
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

renderDetail();
drawMap();
