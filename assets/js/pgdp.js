document.body.style.position = 'relative';

var container = document.createElement('div');
document.body.appendChild(container);
 // Function to fetch and process JSON data
 async function fetchDataAndCreateChart() {
  try {
      const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=ZwOr8qofT4aAYa6f7TeDUeLjNvFcuzPACltux9Iy8AvR7wpRUxnQq5-Cw3z2Jwz2UyI1bv7SOm2lL3ZO9vCsUo0rKPoTIB0dm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLHDApemIiB2a_37c7hbCbCx-b8Z4CUHJcUCcrgB2_QrKUBUri76Z9u3TSGOwok9dwaNoPudF0pyKw-TJfNk7YlmjNUCkaHD8tz9Jw9Md8uu&lib=MpHdPCXARMoJ5cZXAvXbX423cimkYJru9");
      const data = await response.json();
      const content = data.content.slice(1); // Remove the header row

      // Convert the data into the format expected by TradingView Lightweight Chart
      const jsonData = content.map(row => ({
          time: new Date(row[0]).toISOString(), // Convert date string to ISO format
          value: parseFloat(row[1]) // Parse price as a float
      }));

      // Create a new lightweight chart
      const chart = LightweightCharts.createChart(document.getElementById('chart-container'), {
          width: 800, // Set the chart width
          height: 400, // Set the chart height
          layout: {
            background: {
              type: 'solid',
              color: '#FFFFFF',
            },
            lineColor: '#2B2B43',
            textColor: '#191919',
          },
          watermark: {
            visible: true,
            fontSize: 24,
            horzAlign: 'center',
            vertAlign: 'center',
            color: 'rgba(220, 220, 220, 1)',
            text: 'PGGAP/1gram @ syareez.github.io',
          },
          grid: {
            vertLines: {
              visible: false,
            },
            horzLines: {
              color: '#f0f3fa',
            },
          },
      });

      // Create a price area series
      var series = chart.addAreaSeries({
        topColor: 'rgba(19, 68, 193, 0.4)',
        bottomColor: 'rgba(0, 120, 255, 0.0)',
        lineColor: 'rgba(19, 40, 153, 1.0)',
        lineWidth: 3
      });

      // Load JSON data into the chart
      series.setData(jsonData);
      chart.timeScale().fitContent();
  } catch (error) {
      console.error("Error fetching or processing data:", error);
  }
}
// Call the function to fetch and create the chart
fetchDataAndCreateChart();
