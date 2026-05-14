import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const today = new Date("2026-05-14T12:00:00+02:00");

const leaders = [
  { country: "Norway", flag: "🇳🇴", aliases: ["Norway"], capital: "Oslo", coords: [10.7522, 59.9139], labelCoords: [11.2, 64.7], leader: "Jonas Gahr Støre", title: "Statsminister", since: "2021-10-14" },
  { country: "Sweden", flag: "🇸🇪", aliases: ["Sweden"], capital: "Stockholm", coords: [18.0686, 59.3293], labelCoords: [16.3, 62.2], leader: "Ulf Kristersson", title: "Statsminister", since: "2022-10-18" },
  { country: "Denmark", flag: "🇩🇰", aliases: ["Denmark"], capital: "København", coords: [12.5683, 55.6761], labelCoords: [9.7, 56.1], leader: "Mette Frederiksen", title: "Statsminister", since: "2019-06-27" },
  { country: "Finland", flag: "🇫🇮", aliases: ["Finland"], capital: "Helsinki", coords: [24.9384, 60.1699], labelCoords: [26.2, 64.4], leader: "Petteri Orpo", title: "Statsminister", since: "2023-06-20" },
  { country: "Iceland", flag: "🇮🇸", aliases: ["Iceland"], capital: "Reykjavík", coords: [-21.8277, 64.1265], labelCoords: [-18.3, 65.2], leader: "Kristrún Frostadóttir", title: "Statsminister", since: "2024-12-21" },
  { country: "United Kingdom", flag: "🇬🇧", aliases: ["United Kingdom", "England", "Scotland", "Wales", "Northern Ireland"], capital: "London", coords: [-0.1276, 51.5072], labelCoords: [-2.8, 54.8], leader: "Keir Starmer", title: "Statsminister", since: "2024-07-05" },
  { country: "Ireland", flag: "🇮🇪", aliases: ["Ireland"], capital: "Dublin", coords: [-6.2603, 53.3498], labelCoords: [-8.1, 53.8], leader: "Micheál Martin", title: "Taoiseach", since: "2025-01-23" },
  { country: "France", flag: "🇫🇷", aliases: ["France"], capital: "Paris", coords: [2.3522, 48.8566], labelCoords: [2.1, 46.5], leader: "Emmanuel Macron", title: "President / politisk toppleder", since: "2017-05-14" },
  { country: "Germany", flag: "🇩🇪", aliases: ["Germany"], capital: "Berlin", coords: [13.405, 52.52], labelCoords: [10.7, 51.1], leader: "Friedrich Merz", title: "Forbundskansler", since: "2025-05-06" },
  { country: "Netherlands", flag: "🇳🇱", aliases: ["Netherlands"], capital: "Amsterdam", coords: [4.9041, 52.3676], labelCoords: [5.5, 52.7], leader: "Rob Jetten", title: "Statsminister", since: "2026-02-23" },
  { country: "Belgium", flag: "🇧🇪", aliases: ["Belgium"], capital: "Brussel", coords: [4.3517, 50.8503], labelCoords: [4.5, 50.8], leader: "Bart De Wever", title: "Statsminister", since: "2025-02-03" },
  { country: "Luxembourg", flag: "🇱🇺", aliases: ["Luxembourg"], capital: "Luxembourg", coords: [6.1296, 49.8153], labelCoords: [6.1, 49.8], leader: "Luc Frieden", title: "Statsminister", since: "2023-11-17" },
  { country: "Austria", flag: "🇦🇹", aliases: ["Austria"], capital: "Wien", coords: [16.3738, 48.2082], labelCoords: [14.2, 47.6], leader: "Christian Stocker", title: "Forbundskansler", since: "2025-03-03" },
  { country: "Switzerland", flag: "🇨🇭", aliases: ["Switzerland"], capital: "Bern", coords: [7.4474, 46.948], labelCoords: [8.1, 46.8], leader: "Karin Keller-Sutter", title: "Forbundspresident", since: "2025-01-01", note: "Sveits har kollegial regjering og roterende president." },
  { country: "Spain", flag: "🇪🇸", aliases: ["Spain"], capital: "Madrid", coords: [-3.7038, 40.4168], labelCoords: [-3.5, 40.3], leader: "Pedro Sánchez", title: "Statsminister", since: "2018-06-02" },
  { country: "Portugal", flag: "🇵🇹", aliases: ["Portugal"], capital: "Lisboa", coords: [-9.1393, 38.7223], labelCoords: [-8.2, 39.7], leader: "Luís Montenegro", title: "Statsminister", since: "2024-04-02" },
  { country: "Italy", flag: "🇮🇹", aliases: ["Italy"], capital: "Roma", coords: [12.4964, 41.9028], labelCoords: [12.7, 42.8], leader: "Giorgia Meloni", title: "Statsminister", since: "2022-10-22" },
  { country: "Malta", flag: "🇲🇹", aliases: ["Malta"], capital: "Valletta", coords: [14.5146, 35.8989], labelCoords: [14.4, 35.9], leader: "Robert Abela", title: "Statsminister", since: "2020-01-13" },
  { country: "Greece", flag: "🇬🇷", aliases: ["Greece"], capital: "Athen", coords: [23.7275, 37.9838], labelCoords: [22.4, 39.1], leader: "Kyriakos Mitsotakis", title: "Statsminister", since: "2023-06-26", note: "Andre sammenhengende regjeringsperiode; først tiltrådt i 2019." },
  { country: "Cyprus", flag: "🇨🇾", aliases: ["Cyprus"], capital: "Nikosia", coords: [33.3823, 35.1856], labelCoords: [33.0, 35.2], leader: "Nikos Christodoulides", title: "President / regjeringsleder", since: "2023-02-28" },
  { country: "Poland", flag: "🇵🇱", aliases: ["Poland"], capital: "Warszawa", coords: [21.0122, 52.2297], labelCoords: [19.2, 52.0], leader: "Donald Tusk", title: "Statsminister", since: "2023-12-13" },
  { country: "Czechia", flag: "🇨🇿", aliases: ["Czechia", "Czech Republic", "Czech Rep."], capital: "Praha", coords: [14.4378, 50.0755], labelCoords: [15.0, 49.8], leader: "Andrej Babiš", title: "Statsminister", since: "2025-12-17" },
  { country: "Slovakia", flag: "🇸🇰", aliases: ["Slovakia"], capital: "Bratislava", coords: [17.1077, 48.1486], labelCoords: [19.2, 48.8], leader: "Robert Fico", title: "Statsminister", since: "2023-10-25" },
  { country: "Hungary", flag: "🇭🇺", aliases: ["Hungary"], capital: "Budapest", coords: [19.0402, 47.4979], labelCoords: [19.5, 47.2], leader: "Péter Magyar", title: "Statsminister", since: "2026-05-09" },
  { country: "Slovenia", flag: "🇸🇮", aliases: ["Slovenia"], capital: "Ljubljana", coords: [14.5058, 46.0569], labelCoords: [14.9, 46.2], leader: "Robert Golob", title: "Statsminister", since: "2022-06-01" },
  { country: "Croatia", flag: "🇭🇷", aliases: ["Croatia"], capital: "Zagreb", coords: [15.9819, 45.815], labelCoords: [16.8, 45.3], leader: "Andrej Plenković", title: "Statsminister", since: "2016-10-19" },
  { country: "Bosnia and Herzegovina", flag: "🇧🇦", aliases: ["Bosnia and Herz.", "Bosnia and Herzegovina"], capital: "Sarajevo", coords: [18.4131, 43.8563], labelCoords: [17.8, 44.1], leader: "Borjana Krišto", title: "Leder for ministerrådet", since: "2023-01-25" },
  { country: "Serbia", flag: "🇷🇸", aliases: ["Serbia"], capital: "Beograd", coords: [20.4489, 44.7866], labelCoords: [20.8, 44.2], leader: "Đuro Macut", title: "Statsminister", since: "2025-04-16" },
  { country: "Montenegro", flag: "🇲🇪", aliases: ["Montenegro"], capital: "Podgorica", coords: [19.2594, 42.4304], labelCoords: [19.2, 42.8], leader: "Milojko Spajić", title: "Statsminister", since: "2023-10-31" },
  { country: "Kosovo", flag: "🇽🇰", aliases: ["Kosovo"], capital: "Pristina", coords: [21.1655, 42.6629], labelCoords: [20.9, 42.7], leader: "Albin Kurti", title: "Statsminister", since: "2021-03-22" },
  { country: "Albania", flag: "🇦🇱", aliases: ["Albania"], capital: "Tirana", coords: [19.8189, 41.3275], labelCoords: [20.0, 41.0], leader: "Edi Rama", title: "Statsminister", since: "2013-09-13" },
  { country: "North Macedonia", flag: "🇲🇰", aliases: ["Macedonia", "North Macedonia"], capital: "Skopje", coords: [21.4314, 41.9981], labelCoords: [21.7, 41.7], leader: "Hristijan Mickoski", title: "Statsminister", since: "2024-06-23" },
  { country: "Bulgaria", flag: "🇧🇬", aliases: ["Bulgaria"], capital: "Sofia", coords: [23.3219, 42.6977], labelCoords: [25.1, 42.7], leader: "Rumen Radev", title: "Statsminister", since: "2026-05-08" },
  { country: "Romania", flag: "🇷🇴", aliases: ["Romania"], capital: "București", coords: [26.1025, 44.4268], labelCoords: [24.9, 45.7], leader: "Nicușor Dan", title: "President / politisk toppleder", since: "2025-05-26" },
  { country: "Moldova", flag: "🇲🇩", aliases: ["Moldova"], capital: "Chișinău", coords: [28.8353, 47.0105], labelCoords: [28.6, 47.2], leader: "Dorin Recean", title: "Statsminister", since: "2023-02-16" },
  { country: "Ukraine", flag: "🇺🇦", aliases: ["Ukraine"], capital: "Kyiv", coords: [30.5234, 50.4501], labelCoords: [31.4, 49.0], leader: "Volodymyr Zelenskyj", title: "President / politisk toppleder", since: "2019-05-20" },
  { country: "Belarus", flag: "🇧🇾", aliases: ["Belarus"], capital: "Minsk", coords: [27.5615, 53.9045], labelCoords: [28.1, 53.6], leader: "Aleksandr Lukasjenko", title: "President / de facto toppleder", since: "1994-07-20" },
  { country: "Lithuania", flag: "🇱🇹", aliases: ["Lithuania"], capital: "Vilnius", coords: [25.2797, 54.6872], labelCoords: [24.2, 55.2], leader: "Gitanas Nausėda", title: "President / politisk toppleder", since: "2019-07-12" },
  { country: "Latvia", flag: "🇱🇻", aliases: ["Latvia"], capital: "Riga", coords: [24.1052, 56.9496], labelCoords: [24.7, 56.8], leader: "Evika Siliņa", title: "Statsminister", since: "2023-09-15" },
  { country: "Estonia", flag: "🇪🇪", aliases: ["Estonia"], capital: "Tallinn", coords: [24.7536, 59.437], labelCoords: [25.5, 58.8], leader: "Kristen Michal", title: "Statsminister", since: "2024-07-23" },
  { country: "Russia", flag: "🇷🇺", aliases: ["Russia"], capital: "Moskva", coords: [37.6173, 55.7558], labelCoords: [39.8, 57.6], leader: "Vladimir Putin", title: "President / politisk toppleder", since: "2012-05-07", note: "Har også hatt tidligere presidentperiode 2000–2008." },
  { country: "Turkey", flag: "🇹🇷", aliases: ["Turkey", "Türkiye"], capital: "Ankara", coords: [32.8597, 39.9334], labelCoords: [33.8, 39.1], leader: "Recep Tayyip Erdoğan", title: "President / regjeringsleder", since: "2014-08-28" },
  { country: "Georgia", flag: "🇬🇪", aliases: ["Georgia"], capital: "Tbilisi", coords: [44.8271, 41.7151], labelCoords: [43.8, 42.2], leader: "Irakli Kobakhidze", title: "Statsminister", since: "2024-02-08" },
  { country: "Armenia", flag: "🇦🇲", aliases: ["Armenia"], capital: "Jerevan", coords: [44.5152, 40.1872], labelCoords: [44.6, 40.2], leader: "Nikol Pashinyan", title: "Statsminister", since: "2018-05-08" },
  { country: "Azerbaijan", flag: "🇦🇿", aliases: ["Azerbaijan"], capital: "Baku", coords: [49.8671, 40.4093], labelCoords: [47.7, 40.8], leader: "Ilham Aliyev", title: "President / politisk toppleder", since: "2003-10-31" },
  { country: "Andorra", flag: "🇦🇩", aliases: ["Andorra"], capital: "Andorra la Vella", coords: [1.5218, 42.5063], labelCoords: [1.6, 42.5], leader: "Xavier Espot", title: "Statsminister", since: "2019-05-16" },
  { country: "Monaco", flag: "🇲🇨", aliases: ["Monaco"], capital: "Monaco", coords: [7.4246, 43.7384], labelCoords: [7.42, 43.74], leader: "Didier Guillaume", title: "Statsminister", since: "2024-09-02" },
  { country: "Liechtenstein", flag: "🇱🇮", aliases: ["Liechtenstein"], capital: "Vaduz", coords: [9.5209, 47.141], labelCoords: [9.55, 47.15], leader: "Brigitte Haas", title: "Regjeringssjef", since: "2025-04-10" },
  { country: "San Marino", flag: "🇸🇲", aliases: ["San Marino"], capital: "San Marino", coords: [12.4578, 43.9424], labelCoords: [12.45, 43.94], leader: "Dalibor Riccardi og Denise Bronzetti", title: "Kapteinsregenter", since: "2025-10-01", note: "San Marino har to statsledere som velges for seks måneder." },
  { country: "Vatican City", flag: "🇻🇦", aliases: ["Vatican", "Vatican City"], capital: "Vatikanstaten", coords: [12.4534, 41.9029], labelCoords: [12.45, 41.9], leader: "Leo XIV", title: "Pave / statsoverhode", since: "2026-05-08" }
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

const tooltip = document.createElement("div");
tooltip.className = "tooltip";
mapRoot.appendChild(tooltip);

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

  if (days < 0) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  if (years === 0 && months === 0) {
    return `${totalDays} dager`;
  }
  if (years === 0) {
    return `${months} mnd.`;
  }
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

function showTooltip(leader, x, y) {
  tooltip.innerHTML = `
    <div class="tooltip-country">${leader.flag} ${leader.country}</div>
    <div class="tooltip-line">${leader.capital}</div>
    <div class="tooltip-line">${leader.leader}</div>
    <div class="tooltip-line">Sittetid: ${yearsAndMonths(leader.since)}</div>
  `;
  tooltip.style.left = `${x + 18}px`;
  tooltip.style.top = `${y + 18}px`;
  tooltip.classList.add("visible");
}

function moveTooltip(x, y) {
  tooltip.style.left = `${x + 18}px`;
  tooltip.style.top = `${y + 18}px`;
}

function hideTooltip() {
  tooltip.classList.remove("visible");
}

function renderDetail() {
  const active = getActiveLeader();
  activeCountryTitle.textContent = active.country;
  detailPanel.innerHTML = `
    <div class="detail-topline">
      <span>${active.flag}</span>
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
  if (!query) {
    return leaders;
  }
  return leaders.filter((leader) => {
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

function updateMapHighlights() {
  const active = getActiveLeader();

  if (countryPaths) {
    countryPaths
      .attr("fill", (d) => {
        const leader = byAlias.get(d.properties.name);
        if (!leader) {
          return "#132132";
        }
        return leader.country === active.country ? "#4ec7ff" : "#314761";
      })
      .attr("stroke", (d) => (byAlias.get(d.properties.name)?.country === active.country ? "#eaf7ff" : "#7a90ae"))
      .attr("stroke-width", (d) => (byAlias.get(d.properties.name)?.country === active.country ? 1.2 : 0.6));
  }

  if (capitalDots) {
    capitalDots
      .attr("r", (d) => (d.country === active.country ? 6.8 : 4.8))
      .attr("fill", (d) => (d.country === active.country ? "#ffd36b" : "#f6fbff"));
  }

  if (capitalFlags) {
    capitalFlags
      .attr("font-size", (d) => (d.country === active.country ? 24 : 18))
      .attr("opacity", (d) => (d.country === active.country ? 1 : 0.92));
  }
}

async function drawMap() {
  try {
    const world = await d3.json(geoUrl);
    const countries = feature(world, world.objects.countries).features;
    const europeFeatures = countries.filter((country) => byAlias.has(country.properties.name));

    const width = 980;
    const height = 760;
    const projection = d3.geoMercator().fitExtent([[36, 24], [width - 36, height - 30]], {
      type: "FeatureCollection",
      features: europeFeatures
    });
    const path = d3.geoPath(projection);

    const svg = d3
      .select(mapRoot)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Interaktivt Europakart med politiske ledere");

    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "transparent");

    svg
      .append("path")
      .datum({ type: "Sphere" })
      .attr("d", path)
      .attr("fill", "#0c1d31");

    const backdrop = svg.append("g");
    backdrop
      .selectAll("path")
      .data(countries)
      .join("path")
      .attr("d", path)
      .attr("fill", "#0a1320")
      .attr("stroke", "#30445d")
      .attr("stroke-width", 0.35)
      .attr("opacity", 0.28);

    const countryLayer = svg.append("g");
    countryPaths = countryLayer
      .selectAll("path")
      .data(europeFeatures)
      .join("path")
      .attr("class", "map-country")
      .attr("d", path)
      .style("cursor", (d) => (byAlias.get(d.properties.name) ? "pointer" : "default"))
      .on("mouseenter", (event, datum) => {
        const leader = byAlias.get(datum.properties.name);
        if (!leader) {
          return;
        }
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
      .on("click", (_, datum) => {
        const leader = byAlias.get(datum.properties.name);
        if (leader) {
          setSelected(leader);
        }
      });

    svg
      .append("g")
      .selectAll("text")
      .data(leaders.filter((leader) => labelCountries.has(leader.country)))
      .join("text")
      .attr("class", "country-label")
      .attr("x", (d) => projection(d.labelCoords)[0])
      .attr("y", (d) => projection(d.labelCoords)[1])
      .attr("text-anchor", "middle")
      .text((d) => d.country);

    const capitalLayer = svg.append("g");
    capitalFlags = capitalLayer
      .selectAll("text.flag")
      .data(leaders)
      .join("text")
      .attr("class", "flag-label")
      .attr("x", (d) => projection(d.coords)[0])
      .attr("y", (d) => projection(d.coords)[1] - 11)
      .attr("text-anchor", "middle")
      .style("cursor", "pointer")
      .text((d) => d.flag)
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

    capitalDots = capitalLayer
      .selectAll("circle")
      .data(leaders)
      .join("circle")
      .attr("cx", (d) => projection(d.coords)[0])
      .attr("cy", (d) => projection(d.coords)[1] + 2)
      .attr("stroke", "#0c1522")
      .attr("stroke-width", 2.5)
      .style("cursor", "pointer")
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

    capitalLayer
      .selectAll("text.capital")
      .data(leaders)
      .join("text")
      .attr("class", "capital-label")
      .attr("x", (d) => projection(d.coords)[0])
      .attr("y", (d) => projection(d.coords)[1] + 18)
      .attr("text-anchor", "middle")
      .text((d) => d.capital);

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
