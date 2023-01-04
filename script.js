compareDates = document.getElementById("compareDates");
timeColumn = document.getElementById("timeColumn");
liraColumn = document.getElementById("liraColumn");
dollarColumn = document.getElementById("dollarColumn");
goldColumn = document.getElementById("goldColumn");
euroColumn = document.getElementById("euroColumn");
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

  const eurPrice1 = NumberWithCommas(
    parseFloat(await CalculateEuro(date1)).toFixed(2)
  );
  const eurPrice2 = NumberWithCommas(
    parseFloat(await CalculateEuro(date2)).toFixed(2)
  );

  const eurAmount1 = parseFloat(await ConvertEuro(liraPrice, date1)).toFixed(1);
  const eurAmount2 = parseFloat(await ConvertEuro(liraPrice2, date2)).toFixed(
    1
  );

  const eurAmountChange = parseFloat(
    ((eurAmount1 - eurAmount2) / eurAmount1) * 100
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
  <th scope="row">Zaman dilimi</th>
  <td>${date1}</td>
  <td>${date2}</td>
  <td>${timeDif}</td>
  `;

  liraColumn.innerHTML = `

  <th scope="row">Lira</th>
  <td>${NumberWithCommas(liraPrice)} ₺</td>
  <td>${NumberWithCommas(liraPrice2)} ₺</td>
  <td>${liraAmountChange} %</td>  
  `;

  dollarColumn.innerHTML = `
  <tr id="dollarColumn">
  <th scope="row">Dolar</th>
  <td>${NumberWithCommas(
    usdAmount1
  )} $<br /><strong>$</strong>➡${usdPrice1}</td>
  <td>${NumberWithCommas(
    usdAmount2
  )} $<br /><strong>$</strong>➡${usdPrice2}</td>
  <td>${usdAmountChange} %</td>
  `;

  euroColumn.innerHTML = `
  <tr id="euroColumn">
  <th scope="row">Euro</th>
  <td>${NumberWithCommas(
    eurAmount1
  )} $<br /><strong>€</strong>➡${eurPrice1}</td>
  <td>${NumberWithCommas(
    eurAmount2
  )} $<br /><strong>€</strong>➡${eurPrice2}</td>
  <td>${eurAmountChange} %</td>
  `;

  goldColumn.innerHTML = `
  <th scope="row">Altın</th>
  <td>${NumberWithCommas(goldAmount1)}gr <br />🪙➡${goldPrice1}</td>
  <td>${NumberWithCommas(goldAmount2)}gr <br />🪙➡${goldAmount2}</td>
  <td>${goldAmountChange} %</td>
  `;

  wageColumn.innerHTML = `
  <th scope="row">Asgari Ücret</th>
  <td>${NumberWithCommas(minWageAmount1)}× <br />👷🏻➡${minWagePrice1}</td>
  <td>${NumberWithCommas(minWageAmount2)}× <br />👷🏻➡${minWagePrice2}</td>
  <td>${minWageAmountChange} %</td>
  `;
});

TimeDifference = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  const dif = Math.abs(date01.FullDate - date02.FullDate);
  let dif2;

  if (dif > 730) {
    dif2 = Math.floor(dif / 365);
    return dif2.toString() + " yıl";
  } else if (dif >= 365) {
    dif2 = Math.floor(dif / 365);
    return "1 yıl";
  } else if (dif > 58) {
    dif2 = Math.floor(dif / 28);
    return dif2.toString() + " ay";
  } else if (dif > 0) return "1 ay";
  else return "-";
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
  const price = money / date01.EURTRY;
  return price;
};

CalculateEuro = async function (date1) {
  const date01 = await FetchDataByDate(date1);
  return date01.EURTRY;
};

EuroDifference = async function (check, date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  const dif = 100 * (date01.EURTRY / date02.EURTRY);
  return dif * check;
};

ConvertEuro = async function (money, date) {
  const date01 = await FetchDataByDate(date);
  const price = money / date01.EURTRY;
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
