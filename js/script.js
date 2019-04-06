// - Tree map -

d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json", function(error, a) {
  if (error) throw error;
  
  // Data
  
  var sectionName = a.children.map(b => b.name);
  var itemName = a.children[0].children.map(b => b.name);
  var itemValue = a.children[0].children.map(b => b.value);

  // Chartsize
  
  const w = 1100,
        h = 700,
        padding = 60,
        margin = 20,
        tileHeight = 20;
  
  // Chart colors
 
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  // SVG

  const svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
  
  // Tooltip

  var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip")
                  .attr("id", "tooltip")
                  .style("opacity",0)

  function MouseIn(d) {
    let name = d.data.name,
        category = d.data.category,
        value = d.data.value; 
        tooltip.attr('data-value', d.data.value)
        tooltip.transition().style("opacity",0.9)
        tooltip.html(category + "<br>" + name + "<br><br>Pledges: " + value + "<br><br>")
               .style("top", (d3.event.pageY / 2 - 50) + "px")
               .style("left", (d3.event.pageX / 2) + "px")
  }

  function mouseOut() {
    tooltip.style("opacity",0)
  }
  
  // Create a tree map
  
  var treemap = d3.treemap().size([w, h])
                            .paddingInner(1)                
  
  var root = d3.hierarchy(a).eachBefore((d) => {
                 d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
               })
               .sum((d) => {
                 return d.value;
               })
               .sort((c, d) => {
                 return d.value - c.value; });
 
  treemap(root);
  
  // Add cells
  
  var cell = svg.selectAll("g")
                .data(root.leaves())
                .enter()
                .append("g")
                .attr("transform", (d) => {
                  return "translate(" + d.x0 + "," + d.y0 + ")";
                });
          
  // Create boxes for cells
    
  cell.append("rect")
      .attr("id", d => d.data.id) 
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0) 
      .attr("class","tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("fill", (d,i) => color(d.data.category))
      .on("mouseover", MouseIn)
      .on("mouseout", mouseOut); 
  
  // Add text in boxes
  
  cell.append("text")
    .attr("class","tile-text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .style("font-size", "12px")
    .attr("x", 3)
    .attr("y", (d, i) => i * 10 + 12)
    .text(d => d)

  // Legend
  
  let legend = d3.select("#legend")
                 .append("svg")
                 .attr("height", padding + margin)
                 .attr("width", w)
                 .attr("id", "legend")
                 .attr("transform", "translate(40, -15)");
                 
  legend.selectAll("rect")
        .data(a.children.map(b => b.name))
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 100 + 25)
        .attr("y", 25)
        .attr("width", 25)
        .attr("height", tileHeight)
        .attr("fill", (d) => color(d))
        .attr("class","legend-item");
  
  legend.selectAll("text")
        .data(a.children.map(b => b.name))
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => i * 100 + 40)
        .attr("y", 65)
        .attr("width", 25)
        .attr("height", tileHeight)
        .attr("class","legend-text")
        .attr("font-size", "12")
        .text( d => d);
})