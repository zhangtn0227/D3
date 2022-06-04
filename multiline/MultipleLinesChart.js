
function lineChart(data) {

    //DataSource: eMarketer, March 2018
    var data = [
        { year: 2016, media: "Digital", spending: 72.2 },
        { year: 2017, media: "Digital", spending: 90.39 },
        { year: 2018, media: "Digital", spending: 107.3 },
        { year: 2019, media: "Digital", spending: 125.75 },
        { year: 2020, media: "Digital", spending: 142.23 },
        { year: 2021, media: "Digital", spending: 156.43 },
        { year: 2022, media: "Digital", spending: 170.48 },
        { year: 2016, media: "TV", spending: 71.29 },
        { year: 2017, media: "TV", spending: 70.22 },
        { year: 2018, media: "TV", spending: 69.87 },
        { year: 2019, media: "TV", spending: 69.17 },
        { year: 2020, media: "TV", spending: 69.52 },
        { year: 2021, media: "TV", spending: 68.82 },
        { year: 2022, media: "TV", spending: 68.13 },
        { year: 2016, media: "Print", spending: 25.49 },
        { year: 2017, media: "Print", spending: 22.81 },
        { year: 2018, media: "Print", spending: 20.05 },
        { year: 2019, media: "Print", spending: 17.29 },
        { year: 2020, media: "Print", spending: 15.19 },
        { year: 2021, media: "Print", spending: 13.56 },
        { year: 2022, media: "Print", spending: 12.38 },
        { year: 2016, media: "Radio", spending: 14.33 },
        { year: 2017, media: "Radio", spending: 14.33 },
        { year: 2018, media: "Radio", spending: 14.41 },
        { year: 2019, media: "Radio", spending: 14.43 },
        { year: 2020, media: "Radio", spending: 14.46 },
        { year: 2021, media: "Radio", spending: 14.49 },
        { year: 2022, media: "Radio", spending: 14.52 },
        { year: 2016, media: "Out-of-home", spending: 7.6 },
        { year: 2017, media: "Out-of-home", spending: 7.75 },
        { year: 2018, media: "Out-of-home", spending: 7.87 },
        { year: 2019, media: "Out-of-home", spending: 7.95 },
        { year: 2020, media: "Out-of-home", spending: 8.03 },
        { year: 2021, media: "Out-of-home", spending: 8.11 },
        { year: 2022, media: "Out-of-home", spending: 8.19 },
        { year: 2016, media: "Directories", spending: 2.35 },
        { year: 2017, media: "Directories", spending: 1.83 },
        { year: 2018, media: "Directories", spending: 1.47 },
        { year: 2019, media: "Directories", spending: 1.19 },
        { year: 2020, media: "Directories", spending: 0.99 },
        { year: 2021, media: "Directories", spending: 0.84 },
        { year: 2022, media: "Directories", spending: 0.74 }
    ];
    
    //set canvas margins
    leftMargin=70
    topMargin=30
    
    //format the year 
    var parseTime = d3.timeParse("%Y");
    
    data.forEach(function (d) {
        d.year = parseTime(d.year);
    });
    
    //scale xAxis 
    var xExtent = d3.extent(data, d => d.year);
    xScale = d3.scaleTime().domain(xExtent).range([leftMargin, 900])
    
    //scale yAxis
    var yMax=d3.max(data,d=>d.spending)
    yScale = d3.scaleLinear().domain([0, yMax+topMargin]).range([600, 0])
    
    //we will draw xAxis and yAxis next

    //draw xAxis and xAxis label
    xAxis = d3.axisBottom()
        .scale(xScale)

    d3.select("svg")
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,620)")
        .call(xAxis)
        .append("text")
        .attr("x", (900+70)/2) //middle of the xAxis
        .attr("y", "50") // a little bit below xAxis
        .text("Year")

    //yAxis and yAxis label
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10)

    d3.select('svg')
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${leftMargin},20)`) //use variable in translate
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", "-150")
        .attr("y", "-50")
        .attr("text-anchor", "end")
        .text("US Media Ad Spending (Billions)")

    //use .nest()function to group data so the line can be computed for each group
    var sumstat = d3.nest() 
        .key(d => d.media)
        .entries(data);

        //.key(d => d.media)
        //.entries(data);
    //console.log(sumstat)

    //set color pallete for different vairables
    var mediaName = sumstat.map(d => d.key) 
    var color = d3.scaleOrdinal().domain(mediaName).range(colorbrewer.Set2[6])

    //select path - three types: curveBasis,curveStep, curveCardinal
    d3.select("svg")
        .selectAll(".line")
        .append("g")
        .attr("class", "line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("d", function (d) {
            return d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.spending)).curve(d3.curveCardinal)
                (d.values)
        })
        .attr("fill", "none")
        .attr("stroke", d => color(d.key))
        .attr("stroke-width", 2)


    //append circle 
    d3.select("svg")
        .selectAll("circle")
        .append("g")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 6)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.spending))
        .style("fill", d => color(d.media))



    //append legends
    var legend = d3.select("svg")
        .selectAll('g.legend')
        .data(sumstat)
        .enter()
        .append("g")
        .attr("class", "legend");

    legend.append("circle")
        .attr("cx", 1000)
        .attr('cy', (d, i) => i * 30 + 350)
        .attr("r", 6)
        .style("fill", d => color(d.key))

    legend.append("text")
        .attr("x", 1020)
        .attr("y", (d, i) => i * 30 + 355)
        .text(d => d.key)

    //append title
    d3.select("svg")
        .append("text")
        .attr("x", 485)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text("US Total Media Ad Spending, by Media, 2016-2022")
        .style("fill", "black")
        .style("font-size", 28)
        .style("font-family", "Arial Black")

    //apend source
    d3.select("svg")
        .append("text")
        .attr("x", 70)
        .attr("y", 700)
        .text("Source: eMarketer, March 2018")
        .style("fill", "black")
        .style("font-size", 14)
        .style("font-family", "Arial Black")

}