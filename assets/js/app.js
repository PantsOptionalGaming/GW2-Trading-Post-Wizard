const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxU4ks-i_jhldboVik3ruG9spBfOzlcOEbKEFuRGwjapJS4I7wvG-Ng0ugv5FHK9sg/exec";

async function loadCraftingProfits() {
  try {
    const res = await fetch(SHEET_URL + "?sheet=CraftingProfits");
    const data = await res.json();

    const body = document.getElementById("crafting-body");
    if (!body) throw new Error("crafting-body element not found.");

    // Clear any existing rows
    body.innerHTML = "";

    // Sort by profit descending
    data.sort((a, b) => b.Profit - a.Profit);

    const topItems = data.slice(0, 10); // show top 10

    topItems.forEach((row) => {
      const tr = document.createElement("tr");
      tr.classList.add("hover:bg-gray-700");

      tr.innerHTML = `
        <td class="p-2">${row.RecipeName || "N/A"}</td>
        <td class="p-2">${row["IngredientNames(Qty)"] || "N/A"}</td>
        <td class="p-2">${formatCopper(row.IngredientCost)}</td>
        <td class="p-2 text-green-400 font-semibold">${formatCopper(row.Profit)}</td>
      `;

      body.appendChild(tr);
    });

    const timestamp = document.getElementById("last-updated");
    if (timestamp) {
      timestamp.innerText =
        "Last updated: " + new Date().toLocaleString();
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function formatCopper(value) {
  if (isNaN(value)) return "—";
  const gold = Math.floor(value / 10000);
  const silver = Math.floor((value % 10000) / 100);
  const copper = value % 100;
  return `${gold}g ${silver}s ${copper}c`;
}

document.addEventListener("DOMContentLoaded", loadCraftingProfits);
