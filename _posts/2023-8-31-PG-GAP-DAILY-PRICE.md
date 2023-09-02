---
layout: post
title: PG GAP DAILY PRICE
---

Next you can update your site name, avatar and other options using the _config.yml file in the root of your repository (shown below).

![_config.yml]({{ site.baseurl }}/images/config.png)

The easiest way to make your first post is to edit this one. Go into /_posts/ and update the Hello World markdown file. For more instructions head over to the [Jekyll Now repository](https://github.com/barryclark/jekyll-now) on GitHub.

<script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
<!-- Create a container for the chart -->
    <div id="chart-container" style="height: 400px;"></div>
    <script>
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
                });

                // Create a price line series
                const series = chart.addLineSeries();

                // Load JSON data into the chart
                series.setData(jsonData);
            } catch (error) {
                console.error("Error fetching or processing data:", error);
            }
        }
        // Call the function to fetch and create the chart
        fetchDataAndCreateChart();
    </script>