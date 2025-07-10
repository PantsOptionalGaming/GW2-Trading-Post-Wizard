async function loadCraftingProfits() {
  try {
    const res = await fetch(SHEET_URL + "?sheet=CraftingProfits");
    const data = await res.json();

    const loading = document.getElementById("loading");
    const body = document.getElementById("crafting-body");
    if (!body) throw new Error("crafting-body element not found.");

    // Hide loading spinner
    if (loading) loading.style.display = "none";

    body.innerHTML = "";

    if (!data || data.length === 0) {
      body.innerHTML = `<tr><td colspan="4" class="text-center text-gray-400 p-4">No data available.</td></tr>`;
      return;
    }

    data.sort((a, b) => b.Profit - a.Profit);
    const topItems = data.slice(0, 10);

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
      timestamp.innerText = "Last updated: " + new Date().toLocaleString();
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}
