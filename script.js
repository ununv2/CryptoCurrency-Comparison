// define variable
let chart = undefined;
let percentChart = undefined;
let Data = undefined;

// define canvas from index.html
const canvas = document.getElementById("myChart");
const percentCanvas = document.getElementById("percentCanvas");

// fetch data from api
async function fetchData() {
  const apiUrl = "https://unchasachen-api.unchasa.in.th/"; //api get by domain cloudflare host by publish server
  // const apiUrl = "http://localhost:3000/"
  const response = await fetch(apiUrl);
  const data = await response.json();
  data.data.sort((b, a) => a.quote.USD.price - b.quote.USD.price); //descending
  Data = data.data;
  const filteredData = data.data;
  console.log(Data);
  let slicedData = sortedData(filteredData);
  
  return slicedData;
}

// generate default chart

async function generateChart() {
  try {
    const data = await fetchData();
    if (chart) {
      chart.destroy();
    }
    chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: data.slice(0,20).map((c) => c.symbol),
        datasets: [
          {
            label: "Price",
            data: data.slice(0,20).map((c) => c.quote.USD.price),
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: '#786060',
            borderColor: '#685454',
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error generating chart:", error);
  }
}

// button from index.html --> toggle
let toggle = false;
function toggleButton() {
  toggle = !toggle;
  generateChart(); // generate new chart [not recommend for optimization too many request if spamming toggle, better keep cookie to install (npm i cookie-parser) in api server]
  // console.log(toggle);
  return toggle;
}

// sorting data from fetch data
async function sortedData(data) {
  const sortedData = data
  if (toggle == true) {
    return await sortedData.sort((a, b) => a.quote.USD.price - b.quote.USD.price);
  } else {
    const slicedData = sortedData.slice(1);
    await slicedData.sort((b, a) => a.quote.USD.price - b.quote.USD.price);
    console.log(slicedData);
    return slicedData;
  }
}

// create function to get percentchange
async function getPercentChange(data) {
  if (data != null) {
    const percentData = data; //create and set variable 
    let percentChange = []; //create an array
    percentChange.push(percentData.quote.USD.percent_change_1h); 
    percentChange.push(percentData.quote.USD.percent_change_24h); 
    percentChange.push(percentData.quote.USD.percent_change_7d); 
    percentChange.push(percentData.quote.USD.percent_change_30d); 
    percentChange.push(percentData.quote.USD.percent_change_60d); 
    percentChange.push(percentData.quote.USD.percent_change_90d); 
    console.log(percentData.quote.USD.percent_change_1h);
    // console.log(percentChange);
    return percentChange;
  } else {
    alert('Data not found!') //refuse invalid data
  }
}

async function generatePercentChart(percentChange, percentChange2, name1, name2) {
  // console.log(percentChange)
  try {
    const data = await fetchData();
    if (percentChart) {
      percentChart.destroy();
    }
    percentChart = new Chart(percentCanvas, {
      type: "line",
      data: {
        labels: ["1H", "24H", "7D", "30D", "60D", "90D"],
        datasets: [
          {
            label: name1+" percentage change",
            data: percentChange,
            fill: false,
            borderColor: "#b08080",
          },
          {
            label: name2+" percentage change",
            data: percentChange2,
            fill: false,
            borderColor: "#786060",
          },
        ],
        
      },
    });
  } catch (error) {
    console.error("Error generating chart:", error);
  }
}

const searched = document.getElementById("getCoin"); // input data from index.html
const compared = document.getElementById("compareCoin"); // input data from index.getElementById("compareCoin"); 
const myName = document.getElementById("myName");
const mySymbol = document.getElementById("mySymbol");
const myPrice = document.getElementById("myPrice");
const mySupply = document.getElementById("mySupply");
const myMarket = document.getElementById("myMarket");
const myName2 = document.getElementById("myName2");
const mySymbol2 = document.getElementById("mySymbol2");
const myPrice2 = document.getElementById("myPrice2");
const mySupply2 = document.getElementById("mySupply2");
const myMarket2 = document.getElementById("myMarket2");
async function getInput() {
  const data = Data.filter((a) => a.symbol === searched.value || a.name === searched.value || a.symbol.toLowerCase() === searched.value || a.name.toLowerCase() === searched.value)[0]; // filter data 
  const data2 = Data.filter((a) => a.symbol === compared.value || a.name === compared.value || a.symbol.toLowerCase() === compared.value || a.name.toLowerCase() === compared.value)[0];
  const PercentChange = await getPercentChange(data); // await for fetching data
  const PercentChange2 = await getPercentChange(data2);

  if (data != null) { generatePercentChart(PercentChange,PercentChange2,data.symbol,data2.symbol); } // prevent chart generate
  //coin 1
  myName.innerHTML = `Name = ${data.name}`
  mySymbol.innerHTML = `Symbol = ${data.symbol}`
  myPrice.innerHTML = `Price = $${data.quote.USD.price}`
  mySupply.innerHTML = `Circulating Supply = ${data.circulating_supply} ${data.symbol}`
  myMarket.innerHTML = `Market Cap = $${data.quote.USD.market_cap}`
  //coin for comparison
  myName2.innerHTML = `Name = ${data2.name}`
  mySymbol2.innerHTML = `Symbol = ${data2.symbol}`
  myPrice2.innerHTML = `Price = $${data2.quote.USD.price}`
  mySupply2.innerHTML = `Circulating Supply = ${data2.circulating_supply} ${data2.symbol}`
  myMarket2.innerHTML = `Market Cap = $${data2.quote.USD.market_cap}`
}
 

generateChart();
