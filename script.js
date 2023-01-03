//const bootstrap = require("bootstrap");

compareDates = document.getElementById("compareDates");
timeColumn = document.getElementById("timeColumn");
liraColumn = document.getElementById("liraColumn");
dollarColumn = document.getElementById("dollarColumn");
wageColumn = document.getElementById("wageColumn");
firstYear = document.getElementById("firstYear");
secondYear = document.getElementById("secondYear");
liraPrice = document.getElementById("amount").value;

compareDates.addEventListener("click", async function (e) {
  e.preventDefault();
  liraPrice = document.getElementById("amount").value;
  date1 = firstYear.value;
  date2 = secondYear.value;
  const checkTurningPoint = await TurningPointCheck(date1, date2);
  const timeDif = await TimeDifference(date1, date2);
  const priceDif = parseFloat(
    -100 * (await LiraDifference(date1, date2)) - 100
  ).toFixed(2);

  const liraPrice2 = parseFloat(await ConvertLira(date1, date2)).toFixed(1);

  const liraAmountChange = parseFloat(
    ((liraPrice2 - liraPrice) / liraPrice) * 100
  ).toFixed(2);

  const usdPrice1 = NumberWithCommas(
    parseFloat(await CalculateDollar(date1)).toFixed(2)
  );
  const usdPrice2 = NumberWithCommas(
    parseFloat(await CalculateDollar(date2)).toFixed(2)
  );

  const usdAmount1 = parseFloat(await ConvertDollar(liraPrice, date1)).toFixed(
    1
  );
  const usdAmount2 = parseFloat(await ConvertDollar(liraPrice2, date2)).toFixed(
    1
  );

  const usdAmountChange = parseFloat(
    ((usdAmount1 - usdAmount2) / usdAmount1) * 100
  ).toFixed(2);

  const usdDif = parseFloat(
    (await DollarDifference(checkTurningPoint, date1, date2)) - 100
  ).toFixed(2);

  const goldAmount1 = parseFloat(await ConvertGold(liraPrice, date1)).toFixed(
    2
  );
  const goldAmount2 = parseFloat(await ConvertGold(liraPrice2, date2)).toFixed(
    2
  );

  const goldAmountChange = parseFloat(
    ((goldAmount1 - goldAmount2) / goldAmount1) * 100
  ).toFixed(2);

  const goldPrice1 = NumberWithCommas(
    parseFloat(await CalculateGold(date1)).toFixed(2)
  );
  const goldPrice2 = NumberWithCommas(
    parseFloat(await CalculateGold(date2)).toFixed(2)
  );

  const goldDif = parseFloat(
    (await GoldDifference(date1, date2)) - 100
  ).toFixed(2);

  const minWageAmount1 = parseFloat(
    await ConvertMinWage(liraPrice, date1)
  ).toFixed(2);

  const minWageAmount2 = parseFloat(
    await ConvertMinWage(liraPrice2, date2)
  ).toFixed(2);

  const minWageAmountFull1 = await ConvertMinWage(liraPrice, date1);

  const minWageAmountFull2 = await ConvertMinWage(liraPrice2, date2);

  const minWagePrice1 = NumberWithCommas(
    parseFloat(await CalculateMinWage(date1)).toFixed(2)
  );
  const minWagePrice2 = NumberWithCommas(
    parseFloat(await CalculateMinWage(date2)).toFixed(2)
  );

  const minWageAmountChange = parseFloat(
    ((minWageAmountFull2 - minWageAmountFull1) / minWageAmountFull1) * 100
  ).toFixed(2);

  const minWageDif = parseFloat(
    (await MinWageDifference(date1, date2)) - 100
  ).toFixed(1);

  timeColumn.innerHTML = `
  <th scope="row">⌚</th>
  <td>${date1}</td>
  <td>${date2}</td>
  <td>${timeDif}</td>
  `;

  liraColumn.innerHTML = `

  <th scope="row">&nbsp;₺</th>
  <td>${NumberWithCommas(liraPrice)} ₺</td>
  <td>${NumberWithCommas(liraPrice2)} ₺</td>
  <td>${liraAmountChange} %</td>  
  `;

  dollarColumn.innerHTML = `
  <th scope="row">&nbsp;$</th>
  <td>${NumberWithCommas(usdAmount1)} $<br />$: ${usdPrice1}</td>
  <td>${NumberWithCommas(usdAmount2)} $<br />$: ${usdPrice2}</td>
  <td>${usdAmountChange} %</td>
  `;

  goldColumn.innerHTML = `
  <th scope="row">🥇</th>
  <td>${NumberWithCommas(goldAmount1)} gr<br />🥇: ${goldPrice1}</td>
  <td>${NumberWithCommas(goldAmount2)} gr<br />🥇: ${goldPrice2}</td>

  <td>${goldAmountChange} %</td>
  `;

  wageColumn.innerHTML = `
  <th scope="row">👷🏻</th>
  <td>${NumberWithCommas(minWageAmount1)} x<br />👷🏻: ${minWagePrice1}</td>
  <td>${NumberWithCommas(minWageAmount2)} x<br />👷🏻: ${minWagePrice2}</td>
  <td>${minWageAmountChange} %</td>
  `;
});

TimeDifference = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  const dif = date01.FullDate - date02.FullDate;
  let dif2;
  let txt;
  if (dif > 730) {
    dif2 = Math.floor(dif / 365);
    txt = dif2.toString() + " yıl";
  } else if (dif >= 365) {
    dif2 = Math.floor(dif / 365);
    txt = "1 yıl";
  } else if (dif > 60) {
    dif2 = Math.floor(dif / 30);
    txt = dif2.toString() + " ay";
  } else {
    dif2 = dif / 30;
    txt = Math.floor(dif2).toString() + " ay";
  }
  return txt;
};

LiraDifference = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  const dif = date01.InflationIndex / date02.InflationIndex;

  return dif;
};

ConvertLira = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  let price;
  price = (liraPrice / date01.InflationIndex) * date02.InflationIndex;

  if (date01.FullDate > 38322 && date02.FullDate <= 38322) {
    price *= 1000000;
    console.log("many zeros");
  }
  return price;
};

TurningPointCheck = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  if (date01.FullDate > 38322 && date02.FullDate <= 38322) {
    return 1000000;
  }
  return 1;
};

CalculateDollar = async function (date1) {
  const date01 = await FetchDataByDate(date1);
  return date01.USDTRY;
};

DollarDifference = async function (check, date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  const dif = 100 * (date01.USDTRY / date02.USDTRY);
  return dif * check;
};

ConvertDollar = async function (money, date) {
  const date01 = await FetchDataByDate(date);
  const price = money / date01.USDTRY;
  return price;
};

ConvertMinWage = async function (money, date) {
  const date01 = await FetchDataByDate(date);
  const price = parseFloat(money / date01.minWageNetTRY).toFixed(5);
  return price;
};

CalculateMinWage = async function (date1) {
  const date01 = await FetchDataByDate(date1);
  return date01.minWageNetTRY;
};

MinWageDifference = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  const dif = (date01.minWageNetTRY / date02.minWageNetTRY) * 100;
  return dif;
};

ConvertGold = async function (money, date) {
  const date01 = await FetchDataByDate(date);
  const price = parseFloat(money / date01.GoldPerGramTRY).toFixed(5);
  return price;
};

CalculateGold = async function (date1) {
  const date01 = await FetchDataByDate(date1);
  return date01.GoldPerGramTRY;
};

GoldDifference = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  const dif = (date01.GoldPerGramTRY / date02.GoldPerGramTRY) * 100;
  return dif;
};

FetchData = async function () {
  const data0 = await fetch("./data/data.json");
  const data1 = await data0.json();
  return data1;
};

FetchDataByDate = async function (date) {
  const data2 = await FetchData();
  const obj = data2.find((d) => d.Date == date);
  return obj;
};

function NumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
