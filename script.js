compareDates = document.getElementById("compareDates");
timeColumn = document.getElementById("timeColumn");
liraColumn = document.getElementById("liraColumn");
dollarColumn = document.getElementById("dollarColumn");
goldColumn = document.getElementById("goldColumn");
euroColumn = document.getElementById("euroColumn");
wageColumn = document.getElementById("wageColumn");
firstYear = document.getElementById("firstYear");
secondYear = document.getElementById("secondYear");
liraPrice1 = document.getElementById("amount").value;

let liraSlot1, liraSlot2;
1 / 5;

let usdSlot1, usdSlot2;
let eurSlot1, eurSlot2;
let goldSlot1, goldSlot2;
let wageSlot1, wageSlot2;
let timeSlot1, timeSlot2;
let timeCheck1 = false;
let timeCheck2 = false;
let timeDif = 0;

TimeDetection = (date) => {
  if (date < "1980-01") return 1;
  else if (date < "1999-01") return 2;
  else if (date < "2005-01") return 3;
  else if (date <= "2023-01") return 4;
  else return 5;
};

let norm1, norm2, norm3, norm4;

compareDates.addEventListener("click", async function (e) {
  e.preventDefault();

  timeSlot1 = TimeDetection(firstYear.value);
  timeSlot2 = TimeDetection(secondYear.value);

  let time1, time2;
  if (timeSlot1 > 1 && timeSlot1 < 5) {
    date1 = firstYear.value;
    timeCheck1 = true;
    time1 = await FetchDataByDate(date1);
  }
  if (timeSlot2 > 1 && timeSlot2 < 5) {
    date2 = secondYear.value;
    timeCheck2 = true;
    time2 = await FetchDataByDate(date2);
  }

  liraPrice1 = document.getElementById("amount").value;

  if (timeCheck1 && timeCheck2) {
    timeDif = await TimeDifference(date1, date2);
  }
  let newLiraCheck;
  let euroCheck;

  norm1 = newLiraCheck > 0 && newLiraCheck < 3;
  norm2 = newLiraCheck % 2 == 1;
  norm3 = euroCheck > 0 && euroCheck < 3;
  norm4 = euroCheck % 2 == 1;

  let liraPrice2 = parseFloat(await ConvertLira(time1, time2)).toFixed(1);

  const normalLira1 = timeSlot1 > 3 ? 1 * liraPrice1 : liraPrice1 / 1000000;
  const normalLira2 = timeSlot2 > 3 ? 1 * liraPrice2 : liraPrice2 / 1000000;

  const liraDif = normalLira1 - normalLira2;

  let liraAmountChange;
  if (timeSlot1 > 3 && timeSlot2 > 3) {
    liraAmountChange = parseFloat((liraDif / normalLira1) * 100).toFixed(1);
  } else if (timeSlot1 < 4 && timeSlot2 < 4) {
    liraAmountChange = parseFloat((liraDif / normalLira1) * 100).toFixed(2);
  } else
    liraAmountChange = parseFloat((liraDif / normalLira1) * 100).toFixed(4);

  const timeDifText = `&nbsp;📅<br/>${await TimeDifference(date1, date2)}`;

  const positiveLiraCheck = normalLira1 > normalLira2;
  let liraDifText;
  if (positiveLiraCheck) {
    liraDifText = `&nbsp;📈<br/>${Math.abs(liraAmountChange)}`;
  } else liraDifText = `&nbsp;📉<br/>${Math.abs(liraAmountChange)}`;

  //euro calculate problem 2000

  let usdPrice1, usdAmount1, usdPrice2, usdAmount2, usdAmountChange;
  let eurPrice1, eurAmount1, eurPrice2, eurAmount2, eurAmountChange;
  let goldPrice1, goldAmount1, goldPrice2, goldAmount2, goldAmountChange;
  let minWagePrice1,
    minWageAmount1,
    minWagePrice2,
    minWageAmount2,
    minWageAmountChange;

  if (timeSlot1 > 1 && timeSlot1 < 5) {
    usdPrice1 = NumberWithCommas(parseFloat(time1.USDTRY).toFixed(2));
    usdAmount1 = parseFloat(liraPrice1 / time1.USDTRY).toFixed(1);
    goldPrice1 = NumberWithCommas(parseFloat(time1.GoldPerGramTRY).toFixed(2));
    goldAmount1 = parseFloat(liraPrice1 / time1.GoldPerGramTRY).toFixed(2);
    minWagePrice1 = NumberWithCommas(
      parseFloat(time1.minWageNetTRY).toFixed(2)
    );
    minWageAmount1 = parseFloat(liraPrice1 / time1.minWageNetTRY).toFixed(2);
  }
  if (timeSlot2 > 1 && timeSlot2 < 5) {
    usdPrice2 = NumberWithCommas(parseFloat(time2.USDTRY).toFixed(2));
    usdAmount2 = parseFloat(liraPrice2 / time2.USDTRY).toFixed(1);
    goldPrice2 = NumberWithCommas(parseFloat(time2.GoldPerGramTRY).toFixed(2));
    goldAmount2 = parseFloat(liraPrice2 / time2.GoldPerGramTRY).toFixed(2);
    minWagePrice2 = NumberWithCommas(
      parseFloat(time2.minWageNetTRY).toFixed(2)
    );
    minWageAmount2 = parseFloat(liraPrice2 / time2.minWageNetTRY).toFixed(2);
  }
  if (timeSlot1 > 1 && timeSlot1 < 5 && timeSlot2 > 1 && timeSlot2 < 5) {
    usdAmountChange = parseFloat(
      ((usdAmount1 - usdAmount2) / usdAmount1) * 100
    ).toFixed(2);
    goldAmountChange = parseFloat(
      ((goldAmount1 - goldAmount2) / goldAmount1) * 100
    ).toFixed(2);

    minWageAmountChange = parseFloat(
      ((minWageAmount1 - minWageAmount2) / minWageAmount1) * 100
    ).toFixed(2);
  }

  const positiveUsdCheck = usdAmount1 > usdAmount1;
  let usdDifText;
  if (positiveUsdCheck) {
    usdDifText = `&nbsp;📈<br/>${Math.abs(usdAmountChange)}`;
  } else usdDifText = `&nbsp;📉<br/>${Math.abs(usdAmountChange)}`;

  if (timeSlot1 > 2 && timeSlot1 < 5) {
    eurPrice1 = NumberWithCommas(parseFloat(time1.EURTRY).toFixed(2));
    eurAmount1 = parseFloat(liraPrice1 / time1.EURTRY).toFixed(1);
  }
  if (timeSlot2 > 2 && timeSlot2 < 5) {
    eurPrice2 = NumberWithCommas(parseFloat(time2.EURTRY).toFixed(2));
    eurAmount2 = parseFloat(liraPrice2 / time2.EURTRY).toFixed(1);
  }
  if (timeSlot1 > 2 && timeSlot1 < 5 && timeSlot2 > 2 && timeSlot2 < 5) {
    eurAmountChange = parseFloat(
      ((eurAmount1 - eurAmount2) / eurAmount1) * 100
    ).toFixed(2);
  }

  const positiveEurCheck = eurPrice1 > eurPrice2;
  let eurDifText;
  if (positiveEurCheck) {
    eurDifText = `&nbsp;📈<br/>${Math.abs(eurAmountChange)}`;
  } else eurDifText = `&nbsp;📉<br/>${Math.abs(eurAmountChange)}`;

  const positiveGolddCheck = usdAmount1 > usdAmount1;
  let goldDifText;
  if (positiveGolddCheck) {
    goldDifText = `&nbsp;📈<br/>${Math.abs(goldAmountChange)}`;
  } else goldDifText = `&nbsp;📉<br/>${Math.abs(goldAmountChange)}`;

  const positiveMinWageCheck = usdAmount1 > usdAmount1;
  let minWageDifText;
  if (positiveMinWageCheck) {
    minWageDifText = `&nbsp;📉<br/>${Math.abs(minWageAmountChange)}`;
  } else minWageDifText = `&nbsp;📈<br/>${Math.abs(minWageAmountChange)}`;

  timeColumn.innerHTML = `
  <th scope="row">Zaman</th>
  <td>${date1}</td>
  <td>${date2}</td>
  <td>${timeDifText}</td>
  `;

  liraColumn.innerHTML = `

  <th scope="row">Lira</th>
  <td>${NumberWithCommas(liraPrice1)} ${norm1 ? "₺" : "TL"}</td>
  <td>${NumberWithCommas(liraPrice2)} ${norm2 ? "₺" : "TL"}</td>
  <td>${liraDifText}%</td>  
  `;

  dollarColumn.innerHTML = `
  <tr id="dollarColumn">
  <th scope="row">Dolar</th>
  <td>${NumberWithCommas(usdAmount1)} $<br /><strong>$</strong>➡${usdPrice1} ${
    timeSlot1 > 3 ? "₺" : "TL"
  }</td>
  <td>${NumberWithCommas(usdAmount2)} $<br /><strong>$</strong>➡${usdPrice2} ${
    timeSlot2 > 3 ? "₺" : "TL"
  }</td>
  <td>${usdDifText}%</td>
  `;

  euroColumn.innerHTML = `
  <tr id="euroColumn">
  <th>Euro</th>
  <td>${NumberWithCommas(eurAmount1)} €<br /><strong>€</strong>➡${eurPrice1} ${
    timeSlot2 > 3 ? "₺" : "TL"
  }</td>
  <td>${NumberWithCommas(eurAmount2)} €<br /><strong>€</strong>➡${eurPrice2} ${
    timeSlot2 > 3 ? "₺" : "TL"
  }</td>
  <td>${eurDifText} %</td>
  `;

  goldColumn.innerHTML = `
  <th>Altın</th>
  <td>${NumberWithCommas(goldAmount1)}gr <br />🪙➡${goldPrice1} ${
    norm1 ? "₺" : "TL"
  }</td>
  <td>${NumberWithCommas(goldAmount2)}gr <br />🪙➡${goldPrice2} ${
    norm2 ? "₺" : "TL"
  }</td>
  <td>${goldDifText} %</td>
  `;

  wageColumn.innerHTML = `
  <th>Asg. Ücret</th>
  <td>${NumberWithCommas(minWageAmount1)}× <br />👷🏻➡${minWagePrice1} ${
    norm1 ? "₺" : "TL"
  }</td>
  <td>${NumberWithCommas(minWageAmount2)}× <br />👷🏻➡${minWagePrice2} ${
    norm2 ? "₺" : "TL"
  }</td>
  <td>${minWageDifText} %</td>
  `;
});

TimeDifference = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);

  let dif = Math.abs(date01.FullDate - date02.FullDate);

  let dif2;

  if (dif > 730) {
    dif2 = Math.floor(dif / 365);
    return dif2.toString() + " yıl";
  } else if (dif >= 365) {
    dif2 = Math.floor(dif / 365);
    return "1 yıl";
  } else if (dif > 58) {
    dif2 = Math.floor(dif / 29);
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
//error handling
ConvertLira = async function (date1, date2) {
  const price = (liraPrice1 / date1.InflationIndex) * date2.InflationIndex;
  if (timeSlot1 > 3 && timeSlot2 > 3) return price;
  else if (timeSlot1 > 3) return price * 1000000;
  else if (timeSlot2 > 3) return price / 1000000;
  return price;
};

TurningPointCheck = function (val1, val2) {
  if (val1 && val2) return 1;

  return 1000000;
};

CalculateDollar = async function (date1) {
  const date01 = await FetchDataByDate(date1);
  return date01.USDTRY;
};

ConvertDollar = async function (money, date) {
  const date01 = await FetchDataByDate(date);
  const price = money / date01.USDTRY;
  return price;
};

CalculateEuro = async function (date1) {
  const date01 = await FetchDataByDate(date1);
  if (date01.FullDate < 36161) {
    return 0;
  }
  return date01.EURTRY;
};

ConvertEuro = async function (money, date) {
  const date01 = await FetchDataByDate(date);
  if (date01.FullDate < 36161) {
    return 0;
  }
  return money / date01.EURTRY;
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

//ilk ve 2. kolon değiştirilebilir..
