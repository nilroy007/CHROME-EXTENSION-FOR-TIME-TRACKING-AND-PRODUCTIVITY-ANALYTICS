const productiveSites = ['leetcode', 'github', 'stackoverflow', 'geeksforgeeks','linkedin','chatgpt'];
const unproductiveSites = ['youtube', 'instagram', 'facebook', 'twitter'];

chrome.storage.local.get(null, (data) => {
  const labels = [], times = [], summary = [];
  let total = 0, prod = 0, unprod = 0;

  for (const [site, time] of Object.entries(data)) {
    if (!site.includes('.')) continue;
    labels.push(site);
    times.push((time / 60).toFixed(2));
    total += time;
    if (productiveSites.some(s => site.includes(s))) prod += time;
    else if (unproductiveSites.some(s => site.includes(s))) unprod += time;
    summary.push({ site, time });
  }

  if (labels.length === 0) {
    document.getElementById("ai-insights").innerHTML = "No data yet. Start browsing!";
    return;
  }

  const top = summary.sort((a, b) => b.time - a.time)[0];
  const score = ((prod / total) * 100).toFixed(1);

  new Chart(document.getElementById("barChart"), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: "Time Spent (min)",
        data: times,
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }]
    },
    options: {
      plugins: { title: { display: true, text: 'Time Spent Per Website' } },
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });

  new Chart(document.getElementById("pieChart"), {
    type: 'pie',
    data: {
      labels: ['Productive', 'Unproductive'],
      datasets: [{
        data: [prod, unprod],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    },
    options: {
      plugins: { title: { display: true, text: 'Productivity Split' } }
    }
  });

  document.getElementById("ai-insights").innerHTML = `
    <h3>💡 AI Insight</h3>
    <p><strong>Total Time:</strong> ${(total / 60).toFixed(2)} mins</p>
    <p><strong>Top Site:</strong> ${top.site} - ${(top.time / 60).toFixed(2)} mins</p>
    <p><strong>Productive:</strong> ${(prod / 60).toFixed(2)} mins</p>
    <p><strong>Unproductive:</strong> ${(unprod / 60).toFixed(2)} mins</p>
    <p><strong>Score:</strong> ${score}%</p>
    <p><strong>Analysis:</strong> ${
      score > 75 ? "Excellent job staying focused! 🚀" :
      score > 50 ? "Good, but there’s room to improve. 💪" :
      "Try to limit distractions and stay on track! 🔥"
    }</p>
  `;
});