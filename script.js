const chartDiv = document.getElementById("chart");
const padding = 40;
let chartWidth = 0;
let chartHeight = 0;
let rightSpace = 0;
let dataset = [];

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    dataset = data.data;
    reDraw();
    window.addEventListener("resize", reDraw);
  });

function reDraw() {
  chartDiv.textContent = "";
  chartWidth = chartDiv.offsetWidth - padding;
  chartHeight = chartDiv.offsetHeight - padding;
  rightSpace = 15;
  if (chartWidth <= 500) rightSpace = 10;
  drawData();
}

function drawData() {
  const div = d3
    .select("#chart")
    .append("h1")
    .attr("id", "title")
    .text("United States Gross Domestic Product");

  div.append("div").attr("id", "tooltip");
  const toolTip = d3.select("#tooltip");
  toolTip.style("opacity", 0);

  const svg = d3.select("#chart").append("svg");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", padding)
    .attr("x", - chartHeight / 2)
    .attr("dy", "15px")
    .style("text-anchor", "middle")
    .style("font-size", "0.8rem")
    .text("Gross Domestic Product");
  svg
    .append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight - padding / 4)
    .style("text-anchor", "middle")
    .style("font-size", "0.8rem")
    .text("Year");

  //every year
  //const dates = dataset.map(el => new Date(el[0].match(/[0-9]{4}/g)));
  const dates = dataset.map((el) => new Date(el[0]));

  const xScale = d3
    .scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, chartWidth - rightSpace]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([chartHeight - padding, 0 + padding]);

  const xAxis = d3.axisBottom().scale(xScale);
  // ticks every other year ////.ticks(d3.time.month.utc, 1);
  if (chartWidth <= 500) xAxis.tickFormat((el, i) => i % 2 !== 0 ? "" : el.getFullYear());
    
  svg
    .append("g")
    .attr("transform", "translate(0," + (chartHeight - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");

  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis)
    .attr("id", "y-axis");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d, i) => dataset[i][0])
    .attr("data-gdp", (d, i) => dataset[i][1])
    .attr("x", (d, i) => xScale(dates[i]))
    .style("height", (d) => chartHeight - padding - yScale(d[1]))
    .attr("y", (d) => yScale(d[1]))
    //.append("title")
    //.text((d, i) => d)
    .on("mouseover", (event, d) => {
      let i = dataset.indexOf(d);
   
      toolTip
        .html(
          toQuarter(dataset[i][0]) + "<br>" + "$" + dataset[i][1] + " Billion"
        );
      let tooltipWidth = document.getElementById("tooltip").offsetWidth;
      let tooltipHeight = document.getElementById("tooltip").offsetHeight;
      toolTip
        .style("opacity", 1)
        .style("left", xScale(dates[i]) + padding /2 - tooltipWidth + "px")
        .style("top", yScale(d[1]) - tooltipHeight + "px")
        .attr("data-date", dataset[i][0]);
    })
    .on("mouseout", (event, d) => toolTip.style("opacity", 0));
}
function toQuarter(date) {
  if (date.includes("-01-01")) return date.replace("-01-01", " Q1");
  else if (date.includes("-04-01")) return date.replace("-04-01", " Q2");
  else if (date.includes("-07-01")) return date.replace("-07-01", " Q3");
  else if (date.includes("-10-01")) return date.replace("-10-01", " Q4");
  else return date;
}
