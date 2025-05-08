  let darkTheme = false;
  const chart = LightweightCharts.createChart(document.getElementById('chart'), {
    layout: { background: { color: '#ffffff' }, textColor: '#000' },
    grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
    crosshair: { mode: 1 },
    rightPriceScale: { borderColor: '#ccc' },
    timeScale: { borderColor: '#ccc' }
  });

  let areaSeries = chart.addAreaSeries({ lineColor: '#089981', topColor: 'rgba(0, 255, 0, 0.2)', bottomColor: 'rgba(0, 255, 0, 0)' });
  let smaSeries, bbUpperSeries, bbLowerSeries;

  fetch('https://script.googleusercontent.com/macros/echo?user_content_key=ZwOr8qofT4aAYa6f7TeDUeLjNvFcuzPACltux9Iy8AvR7wpRUxnQq5-Cw3z2Jwz2UyI1bv7SOm2lL3ZO9vCsUo0rKPoTIB0dm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLHDApemIiB2a_37c7hbCbCx-b8Z4CUHJcUCcrgB2_QrKUBUri76Z9u3TSGOwok9dwaNoPudF0pyKw-TJfNk7YlmjNUCkaHD8tz9Jw9Md8uu&lib=MpHdPCXARMoJ5cZXAvXbX423cimkYJru9')
    .then(res => res.json())
    .then(data => {
      const rows = data.content.slice(1);
			const rawData = rows.map(row => {
  		const time = row[0].split('T')[0];
  		const value = parseFloat(row[1]);
  		return (time && !isNaN(value)) ? { time, value } : null;
		}).filter(Boolean);

		// Remove duplicates based on time
		const seen = new Set();
		const chartData = rawData.filter(item => {
  		if (seen.has(item.time)) return false;
  		seen.add(item.time);
  		return true;
		});

      areaSeries.setData(chartData);

      // SMA (Simple Moving Average)
      const smaPeriod = 20;
      const smaData = chartData.map((d, i, arr) => {
        if (i < smaPeriod - 1) return null;
        const sum = arr.slice(i - smaPeriod + 1, i + 1).reduce((a, b) => a + b.value, 0);
        return { time: d.time, value: sum / smaPeriod };
      }).filter(Boolean);
      smaSeries = chart.addLineSeries({ color: 'blue', visible: false });
      smaSeries.setData(smaData);

      // Bollinger Bands
      const bbDataUpper = [], bbDataLower = [];
      for (let i = smaPeriod - 1; i < chartData.length; i++) {
        const slice = chartData.slice(i - smaPeriod + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b.value, 0) / smaPeriod;
        const stdDev = Math.sqrt(slice.reduce((a, b) => a + Math.pow(b.value - mean, 2), 0) / smaPeriod);
        bbDataUpper.push({ time: chartData[i].time, value: mean + 2 * stdDev });
        bbDataLower.push({ time: chartData[i].time, value: mean - 2 * stdDev });
      }
      bbUpperSeries = chart.addLineSeries({ color: 'purple', visible: false });
      bbLowerSeries = chart.addLineSeries({ color: 'purple', visible: false });
      bbUpperSeries.setData(bbDataUpper);
      bbLowerSeries.setData(bbDataLower);

      // Handle Range Buttons
      document.querySelectorAll('[data-range]').forEach(btn => {
        btn.addEventListener('click', () => {
          const range = btn.getAttribute('data-range');
          if (range === 'all') {
            chart.timeScale().fitContent();
          } else {
            const endIndex = chartData.length - 1;
            const startIndex = Math.max(0, endIndex - parseInt(range));
            chart.timeScale().setVisibleRange({
              from: chartData[startIndex].time,
              to: chartData[endIndex].time
            });
          }
        });
      });
    });

  // Theme Toggle
  document.getElementById('toggle-theme').addEventListener('click', () => {
    darkTheme = !darkTheme;
    chart.applyOptions({
      layout: {
        background: { color: darkTheme ? '#1e1e1e' : '#ffffff' },
        textColor: darkTheme ? '#d1d4dc' : '#000000'
      },
      grid: {
        vertLines: { color: darkTheme ? '#444' : '#eee' },
        horzLines: { color: darkTheme ? '#444' : '#eee' }
      },
    });
  });

  // Export Image
  document.getElementById('export').addEventListener('click', () => {
    chart.takeScreenshot().then(uri => {
      const link = document.createElement('a');
      link.href = uri;
      link.download = 'chart.png';
      link.click();
    });
  });

  // Toggle SMA
  document.getElementById('toggle-sma').addEventListener('click', () => {
    if (smaSeries) {
      const current = smaSeries.options().visible;
      smaSeries.applyOptions({ visible: !current });
    }
  });

  // Toggle Bollinger Bands
  document.getElementById('toggle-bb').addEventListener('click', () => {
    if (bbUpperSeries && bbLowerSeries) {
      const current = bbUpperSeries.options().visible;
      bbUpperSeries.applyOptions({ visible: !current });
      bbLowerSeries.applyOptions({ visible: !current });
    }
  });

  // Crosshair Tooltip
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.padding = '6px 10px';
  tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
  tooltip.style.color = 'white';
  tooltip.style.borderRadius = '4px';
  tooltip.style.fontSize = '14px';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  chart.subscribeClick(param => {
    if (param.time && param.seriesData) {
      const price = param.seriesData.get(areaSeries)?.value;
      if (price !== undefined) {
        const chartRect = document.getElementById('chart').getBoundingClientRect();
        tooltip.innerHTML = `Time: ${param.time}<br>Price: ${price.toFixed(2)}`;
        tooltip.style.left = `${param.point.x + chartRect.left + 10}px`;
        tooltip.style.top = `${param.point.y + chartRect.top + 10}px`;
        tooltip.style.display = 'block';
      }
    } else {
      tooltip.style.display = 'none';
    }
  });
  
  window.addEventListener('resize', () => {
  chart.resize(document.getElementById('chart').clientWidth, document.getElementById('chart').clientHeight);
	});