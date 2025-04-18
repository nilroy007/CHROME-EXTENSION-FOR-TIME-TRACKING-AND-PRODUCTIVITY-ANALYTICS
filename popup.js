chrome.storage.local.get(null, (data) => {
    let total = 0, prod = 0, unprod = 0;
    const productiveSites = ['leetcode', 'github', 'stackoverflow', 'geeksforgeeks'];
    const unproductiveSites = ['youtube', 'instagram', 'facebook', 'twitter'];
  
    for (const [site, time] of Object.entries(data)) {
      if (!site.includes('.')) continue;
      total += time;
      if (productiveSites.some(s => site.includes(s))) prod += time;
      else if (unproductiveSites.some(s => site.includes(s))) unprod += time;
    }
  
    const percent = total ? ((prod / total) * 100).toFixed(1) : 0;
    document.getElementById("summary").innerHTML = `
      <b>Total Time:</b> ${(total / 60).toFixed(1)} mins<br/>
      <b>Productive:</b> ${(prod / 60).toFixed(1)} mins<br/>
      <b>Unproductive:</b> ${(unprod / 60).toFixed(1)} mins<br/>
      <b>Productivity Score:</b> ${percent}%
    `;
  });
  