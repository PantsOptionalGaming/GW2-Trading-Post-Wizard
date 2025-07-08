document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("profits-body");
  const status = document.getElementById("status");

  const API_URL = "https://script.google.com/macros/s/AKfycbxU4ks-i_jhldboVik3ruG9spBfOzlcOEbKEFuRGwjapJS4I7wvG-Ng0ugv5FHK9sg/exec";

  async function loadCraftingProfits() {
    try {
      status.innerText = "Loading data...";
      const res = await fetch(`${API_URL}?sheet=CraftingProfits`);
      const data = await res.json();

      if (!data || !Array.isArray(data) || data.length === 0) {
        status.innerText = "⚠️ No data found.";
        return;
      }

      // Remove header row
      const rows = data.slice(1);

      rows.forEach(row => {
        const [recipeID, recipeName, recipeIngredients, ingredientNamesQty, ingredientCost, profit] = row;

        const tr = document.createElement("tr");
        tr.classList.add("hover:bg-gray-800");

        tr.innerHTML = `
          <td class="border border-gray-600 px-2 py-1 text-sm text-white">${recipeID}</td>
          <td class="border border-gray-600 px-2 py-1 text-sm text-yellow-400">${recipeName}</td>
          <td class="border border-gray-600 px-2 py-1 text-sm text-gray-300">${recipeIngredients}</td>
          <td class="border border-gray-600 px-2 py-1 text-sm text-gray-300">${ingredientNamesQty}</td>
          <td class="border border-gray-600 px-2 py-1 text-sm text-blue-300">${formatCopper(ingredientCost)}</td>
          <td class="border border-gray-600 px-2 py-1 text-sm font-bold text-green-400">${formatCopper(profit)}</td>
        `;

        tableBody.appendChild(tr);
      });

      status.innerText = `✅ Loaded ${rows.length} crafting profits.`;
    } catch (err) {
      console.error("Error fetching data:", err);
      status.innerText = "❌ Failed to load data.";
    }
  }

  function formatCopper(copper) {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const remainingCopper = copper % 100;

    return `${gold}g ${silver}s ${remainingCopper}c`;
  }

  loadCraftingProfits();
});
