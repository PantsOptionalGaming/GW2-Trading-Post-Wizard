const SHEET_URL = "https://script.google.com/macros/s/AKfycbxU4ks-i_jhldboVik3ruG9spBfOzlcOEbKEFuRGwjapJS4I7wvG-Ng0ugv5FHK9sg/exec";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-crafting").addEventListener("click", showCrafting);
  document.getElementById("btn-flipping").addEventListener("click", showFlipping);
  document.getElementById("btn-watchlist").addEventListener("click", showWatchlist);

  // Load default view
  showCrafting();
});

function formatCopper(value) {
  if (isNaN(value)) return "—";
  const gold = Math.floor(value / 10000);
  const silver = Math.floor((value % 10000) / 100);
  const copper = value % 100;
  return `${gold}g ${silver}s ${copper}c`;
}

function showLoading() {
  const body = document.getElementById("crafting-body");
  body.innerHTML = `
    <tr><td colspan="4" class="text-center p-4 animate-pulse text-yellow-200">Loading...</td></tr>
  `;
}

// --------------------- CRAFTING ---------------------
async function showCrafting() {
  setActive("btn-crafting");
  toggleChart(false);
  showLoading();

  try {
    const res = await fetch(SHEET_URL + "?sheet=CraftingProfits");
    const data = await res.json();
    const body = document.getElementById("crafting-body");
    body.innerHTML = "";

    const topItems = data
      .filter((x) => x.RecipeName && !isNaN(x.Profit))
      .sort((a, b) => b.Profit - a.Profit)
      .slice(0, 20);

    topItems.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="p-2">${row.RecipeName}</td>
        <td class="p-2">${row["IngredientNames(Qty)"]}</td>
        <td class="p-2">${formatCopper(row.IngredientCost)}</td>
        <td class="p-2 text-green-400 font-semibold">${formatCopper(row.Profit)}</td>
      `;
      body.appendChild(tr);
    });

    updateTimestamp();
  } catch (err) {
    console.error("Error loading crafting data:", err);
    console.log("Fetching CraftingProfits from", SHEET_URL + "?sheet=CraftingProfits");    //Log for Testing
    console.log("Received data:", data);      //Log for Testing

  }
}

// --------------------- FLIPPING ---------------------
async function showFlipping() {
  setActive("btn-flipping");
  toggleChart(false);
  showLoading();

  try {
    const res = await fetch(SHEET_URL + "?sheet=MostProfitable");
    const data = await res.json();
    const body = document.getElementById("crafting-body");
    body.innerHTML = "";

    const flips = data
      .filter((x) => x.Method === "Flip")
      .sort((a, b) => b.Profit - a.Profit)
      .slice(0, 20);

    flips.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="p-2">${row.ItemName}</td>
        <td class="p-2">${row.Type}</td>
        <td class="p-2">—</td>
        <td class="p-2 text-green-400 font-semibold">${formatCopper(row.Profit)}</td>
      `;
      body.appendChild(tr);
    });

    updateTimestamp();
  } catch (err) {
    console.error("Error loading flips:", err);
  }
}

// --------------------- WATCHLIST ---------------------
async function showWatchlist() {
  setActive("btn-watchlist");
  toggleChart(true);
  showLoading();

  try {
    const res = await fetch(SHEET_URL + "?sheet=History");
    const data = await res.json();
    const body = document.getElementById("crafting-body");
    body.innerHTML = "";

    const watchlist = data.filter((x) => x["+10%"] || x["-10%"]);

    watchlist.slice(0, 10).forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="p-2">${row.ItemName}</td>
        <td class="p-2">—</td>
        <td class="p-2">—</td>
        <td class="p-2 text-${row["+10%"] ? "green" : "red"}-400 font-semibold">
          ${row["+10%"] ? "+10%" : "-10%"}
        </td>
      `;
      body.appendChild(tr);

      // Show chart for the first item
      renderChart(row);
    });

    updateTimestamp();
  } catch (err) {
    console.error("Error loading watchlist:", err);
  }
}

// --------------------- UI HELPERS ---------------------
function setActive(id) {
  ["btn-crafting", "btn-flipping", "btn-watchlist"].forEach((btn) => {
    document.getElementById(btn).classList.remove("bg-blue-500");
  });
  document.getElementById(id).classList.add("bg-blue-500");
}

function toggleChart(show) {
  const chartContainer = document.getElementById("chart-container");
  if (!chartContainer) return;
  chartContainer.style.display = show ? "block" : "none";
}

function updateTimestamp() {
  const el = document.getElementById("last-updated");
  if (el) el.innerText = "Last updated: " + new Date().toLocaleString();
}

// --------------------- CHART ---------------------
let chartInstance = null;
function renderChart(itemRow) {
  const labels = [];
  const prices = [];

  for (let i = 1; i <= 30; i++) {
    const col = itemRow[i.toString()];
    if (col) {
      labels.push(i); // ideally use actual dates
      prices.push(parseInt(col));
    }
  }

  const ctx = document.getElementById("priceChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: itemRow.ItemName + " (30-Day History)",
          data: prices,
          backgroundColor: "rgba(255, 215, 0, 0.2)",
          borderColor: "rgba(255, 215, 0, 1)",
          borderWidth: 2,
          tension: 0.2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            callback: (val) => formatCopper(val),
          },
        },
      },
    },
  });
}
