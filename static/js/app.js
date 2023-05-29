// Get url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Function to update chart
function updateChart(data, selectedSample) {
  // Filter the sample data for the selected sample
  let selectedData = data.samples.find(sample => sample.id === selectedSample)
  
  // Get the top 10 sample values, otu_ids, and otu_labels
  var top10Values = selectedData.sample_values.slice(0, 10).reverse();
  var top10Ids = selectedData.otu_ids.slice(0, 10).reverse();
  var top10Labels = selectedData.otu_labels.slice(0, 10).reverse();
  
  //Create bar chart
  let trace1 = {
    x: top10Values,
    y: top10Ids.map(otu_ids => `OTU ${otu_ids}`),
    text: top10Labels,
    type: "bar",
    orientation: 'h'
  };
  
    let traceData1 = [trace1]
    
    let layout1 = {
      title: ""
    };
    
    Plotly.newPlot("bar", traceData1, layout1)
    
    // Create bubble chart
    
    // Create the trace
    let trace2 = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      text: selectedData.otu_labels,
      mode: 'markers',
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: 'Earth'
      }
    };
    
    // Create the data array
  let traceData2 = [trace2];
  
  // Create the layout
  let layout2 = {
    title: '',
    xaxis: {
      title: 'OTU IDs'
    },
    yaxis: {
      title: 'Sample Values'
    }
  };
  
  // Update the chart
  Plotly.newPlot('bubble', traceData2, layout2);
}

// Function to display metadata
function displayMetadata(data, selectedSample) {
  // Get the metadata for the selected sample
  let metadata = data.metadata.find(item => item.id === parseInt(selectedSample));
  
  // Check for metadata
  if (metadata) {
    // Get the container element
    let container = d3.select("#sample-metadata");
    // Clear previous content
    container.html("");
    
    // Iterate over each key-value pair in the metadata object
    Object.entries(metadata).forEach(([key, value]) => {
      // Create a paragraph element for each key-value pair
      let p = container.append("p");
      // Set the text content of the paragraph
      p.text(`${key}: ${value}`);
    });
  }
}


// Function to change sample
function optionChanged(subjectId) {
  d3.json(url).then(function(data) {
    updateChart(data, subjectId);
    displayMetadata(data, subjectId);
  });
}

// Initalize system
d3.json(url).then(function(data) {
  

  // Populate Drop 
  let dropdownMenu = d3.select("#selDataset");
  
  let subjectList = data.names;
  let firstSubjectId = subjectList[0];

  function addOption(subjectId) {
   dropdownMenu.append("option").attr("value", subjectId).text(subjectId);
  }

  subjectList.forEach(addOption);

  optionChanged(firstSubjectId)
})