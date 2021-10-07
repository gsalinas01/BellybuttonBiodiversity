function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

function optionChanged(newSample) {
  console.log(newSample);
}





// Next, print information to the Demographic Infopanel: 
//once a user selects an ID number, the associated volunteer's 
//demographic information needs to be filtered

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

//optionChanged is called from the HTML doc and in turn calls buildMetadata() and buildCharts().
// the argument newSample is the volunteer ID # that is passed to both functions.
// now we declare buildMetadata()

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("Location: " + result.location);
    PANEL.append("h6").text("Ethnicity: " + result.ethnicity);
    PANEL.append("h6").text("Gender: " + result.gender);
    PANEL.append("h6").text("Age: " + result.age);
    PANEL.append("h6").text("BBType: " + result.bbtype);
    PANEL.append("h6").text("Wfreq: " + result.wfreq);

    // better solution was using object.entries and .forEach, but I didn't think of that in the moment:
    // Object.entries(result).forEach(([key, value]) => {
      //PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
}

// 1. Create the buildCharts function
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesarray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
     
    //  5. Create a variable that holds the first sample in the array.
    var samplesresult = samplesarray.filter(sampleObj => sampleObj.id == sample)[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var resultotuids = samplesresult.otu_ids
    var resultotulabels = samplesresult.otu_labels
    var resultsamplevalues = samplesresult.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var resulttop10otuids = resultotuids.map((x,i) => ["OTU " + x, resultsamplevalues[i]]).slice(0,10).reverse()
    var xvalues = resulttop10otuids.map((x,y) => x[1])
    var yvalues = resulttop10otuids.map((x,y) => x[0])
    var yticks = resulttop10otuids.map((x,y) => x[0])

    // 8. Create the trace for the bar chart. 
    var barData = {x:xvalues,
    y:yvalues,
    type: "bar",
    orientation: "h"
    }; 
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found!</b>",
      xaxis:{title:"Amount of Bacteria"},
      yaxis:{title: "OTU IDs", ticktext: yticks}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout)
  


//_____________________________________________________________________
//Bubble Chart/D2

// Bar and Bubble charts
// Create the buildCharts function. (this was done above in D1)
    // 1. Create the trace for the bubble chart.
    var bubbleopacity= [resultotuids.map(x => "0.5" )]
    var bubblecolor= resultotuids
    var hovertext= resultotuids.map((x,i)=> String(["(OTU "+ x +", " + resultsamplevalues[i] + ")" + "<br>" + resultotulabels[i]]))

    var bubbleData = [{resultotuids, y:resultsamplevalues,text: hovertext, mode: "markers", marker: {
      size: resultsamplevalues, color:bubblecolor, colorscale: "Earth"}
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title:"OTU ID"},
      yaxis:{title: "Amount of Bacteria",
      showlegend: false}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

//_____________________________________________________________________
//Gauge Chart/D2
  // 3. Create a variable that holds the washing frequency.
    // 4. Create the trace for the gauge chart.
    //  create a variable that converts the washing frequency to a floating point number. 
    var wfrequency = parseFloat(data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {domain: { x: [0, 1], y: [0, 1] },
      value: wfrequency,
      title: { text: "<b>Belly Button Wash Frequency</b> <br> Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10]},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },
        ],
        threshold: {
          line: { color: "black", width: 4 },
          thickness: 0.75,
          value: wfrequency
        }
      }
    }

    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}