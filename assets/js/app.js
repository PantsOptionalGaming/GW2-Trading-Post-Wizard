
window.addEventListener('DOMContentLoaded', () => {
  Tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/12FbHA7VrjAowGPzaBi2s0Adwn08BBeCPL0lQHIekUKY/edit?usp=sharing',
    simpleSheet: false,
    wanted: ['MostProfitable'],
    callback: function(data) {
      const sheet = data['MostProfitable'].elements;
      const table = document.getElementById('mostProfitableTable');

      sheet.slice(0, 20).forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-700';

        tr.innerHTML = `
          <td class="px-2 py-1">${row.Type}</td>
          <td class="px-2 py-1">${row.ItemID}</td>
          <td class="px-2 py-1">${row.ItemName}</td>
          <td class="px-2 py-1">${row.Profit}</td>
          <td class="px-2 py-1">${row.Method}</td>
          <td class="px-2 py-1">${row.Updated}</td>
        `;
        table.appendChild(tr);
      });
    }
  });
});
