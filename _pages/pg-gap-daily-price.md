---
layout: page
title: Public Gold&#174; (GAP) Daily Price
permalink: /pgdp/
---
<style>
  #chart {
    width: 100%;
    height: 400px; /* Or use 60vh for vertical responsiveness */
  }

  @media (max-width: 768px) {
    #chart {
      height: 300px;
    }

    .chart-buttons {
      flex-wrap: wrap;
      gap: 6px;
    }

    .chart-buttons button {
      flex: 1 0 48%;
      font-size: 14px;
    }
  }

  .chart-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
    justify-content: center;
  }

  .chart-buttons button {
    padding: 6px 12px;
    font-size: 16px;
    cursor: pointer;
  }
</style>
<script src="https://unpkg.com/lightweight-charts@4.1.1/dist/lightweight-charts.standalone.production.js"></script>
<div id="chart"></div>
<div id="tooltip" style="
  position: absolute;
  display: none;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  border-radius: 4px;
  pointer-events: none;
  z-index: 10;
"></div>

<div id="controls">
  <button id="toggle-theme">Toggle Theme</button>
  <button id="export-btn">Export Image</button>
  <button id="toggle-sma">Toggle SMA</button>
  <button id="toggle-bb">Toggle Bollinger Bands</button>
  <button data-range="7">1W</button>
  <button data-range="30">1M</button>
  <button data-range="90">3M</button>
  <button data-range="180">6M</button>
  <button data-range="all">All</button>
</div>

> The price of gold is per 1 gram. The gold prices were obtained from [Public Gold&#174;](https://publicgold.com.my/) and updated everyday (midnight-1 a.m.).

<p style="font-size:11px;text-align:justify">
    Disclaimer: 
    We do not guarantee the accuracy of the prices. Our gold price charts come with no guarantee or assurance of reliability. The site visitor accepts it on the condition that inaccuracies or omissions are not used as the basis for any claim, demand, or cause of action. It is the reader's obligation to conduct sufficient due diligence before acting on any of the information supplied. Before making any investing decisions, we urge that you consult with a licensed, certified investment advisor.
</p>
<script src="{{ base.url | prepend: site.url }}/assets/js/pgdp.js"></script>