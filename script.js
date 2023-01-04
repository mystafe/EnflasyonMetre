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

let norm1, norm2, norm3, norm4;
compareDates.addEventListener("click", async function (e) {
  e.preventDefault();

  date1 = firstYear.value;
  date2 = secondYear.value;
  liraPrice1 = document.getElementById("amount").value;

  time1 = await FetchDataByDate(date1);
  time2 = await FetchDataByDate(date2);

  const timeDif = await TimeDifference(date1, date2);
  let newLiraCheck;
  let euroCheck;

  try {
    if (time1.FullDate > 38352 && time2.FullDate > 38352) newLiraCheck = 1;
    else if (time1.FullDate > 38352 && time2.FullDate < 38352) newLiraCheck = 2;
    else if (time1.FullDate < 38352 && time2.FullDate > 38352) newLiraCheck = 3;
    else newLiraCheck = 0;

    if (time1.FullDate > 36160 && time2.FullDate > 36160) euroCheck = 1;
    else if (time1.FullDate > 36160 && time2.FullDate < 36160) euroCheck = 2;
    else if (time1.FullDate < 36160 && time2.FullDate > 36160) euroCheck = 3;
    else euroCheck = 0;
  } catch (error) {
    console.log(error);
  }

  norm1 = newLiraCheck > 0 && newLiraCheck < 3;
  norm2 = newLiraCheck % 2 == 1;
  norm3 = euroCheck > 0 && euroCheck < 3;
  norm4 = euroCheck % 2 == 1;

  const checkTurningPoint = await TurningPointCheck(norm1, norm2);

  let liraPrice2 = parseFloat(await ConvertLira(time1, time2)).toFixed(1);
  const normalLira1 = norm1 ? liraPrice1 : liraPrice1 / 1000000;
  const normalLira2 = norm2 ? liraPrice2 : liraPrice2 / 1000000;

  const liraAmountChange =
    checkTurningPoint > 1
      ? parseFloat(((normalLira2 - normalLira1) / normalLira1) * 100).toFixed(4)
      : parseFloat(
          (1 / checkTurningPoint) *
            (((normalLira2 - normalLira1) / normalLira1) * 100)
        ).toFixed(2);

  //euro calculate problem 2000

  const usdPrice1 = NumberWithCommas(parseFloat(time1.USDTRY).toFixed(2));
  const usdPrice2 = NumberWithCommas(parseFloat(time2.USDTRY).toFixed(2));

  const usdAmount1 = parseFloat(liraPrice1 / time1.USDTRY).toFixed(1);
  const usdAmount2 = parseFloat(liraPrice2 / time2.USDTRY).toFixed(1);

  const usdAmountChange = parseFloat(
    ((usdAmount1 - usdAmount2) / usdAmount1) * 100
  ).toFixed(2);

  const eurPrice1 = norm3
    ? NumberWithCommas(parseFloat(time1.EURTRY).toFixed(2))
    : "";
  const eurPrice2 = norm4
    ? NumberWithCommas(parseFloat(time2.EURTRY).toFixed(2))
    : "";

  const eurAmount1 = norm3
    ? parseFloat(liraPrice1 / time1.EURTRY).toFixed(1)
    : 0;
  const eurAmount2 = norm4
    ? parseFloat(liraPrice2 / time2.EURTRY).toFixed(1)
    : 0;

  const eurAmountChange =
    norm3 || norm4
      ? parseFloat(((eurAmount1 - eurAmount2) / eurAmount1) * 100).toFixed(2)
      : 0;

  const eurAmountChange1 = parseFloat(
    ((eurAmount1 - eurAmount2) / eurAmount1) * 100
  ).toFixed(2);

  const goldAmount1 = parseFloat(await ConvertGold(liraPrice1, date1)).toFixed(
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
    await ConvertMinWage(liraPrice1, date1)
  ).toFixed(2);

  const minWageAmount2 = parseFloat(
    await ConvertMinWage(liraPrice2, date2)
  ).toFixed(2);

  const minWageAmountFull1 = await ConvertMinWage(liraPrice1, date1);

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
  <td>${NumberWithCommas(liraPrice1)} ${norm1 ? "₺" : "TL"}</td>
  <td>${NumberWithCommas(liraPrice2)} ${norm2 ? "₺" : "TL"}</td>
  <td>${liraAmountChange} %</td>  
  `;

  dollarColumn.innerHTML = `
  <tr id="dollarColumn">
  <th scope="row">Dolar</th>
  <td>${NumberWithCommas(usdAmount1)} $<br /><strong>$</strong>➡${usdPrice1} ${
    norm1 ? "₺" : "TL"
  }</td>
  <td>${NumberWithCommas(usdAmount2)} $<br /><strong>$</strong>➡${usdPrice2} ${
    norm2 ? "₺" : "TL"
  }</td>
  <td>${usdAmountChange} %</td>
  `;

  euroColumn.innerHTML = `
  <tr id="euroColumn">
  <th scope="row">Euro</th>
  <td>${
    norm3 ? NumberWithCommas(eurAmount1) + " € <br /><strong>€</strong>➡" : ""
  }${norm3 ? eurPrice1 : ""} ${norm3 && norm1 ? "₺" : ""}${
    norm3 && !norm1 ? "TL" : ""
  }</td>
  <td>${
    norm4 ? NumberWithCommas(eurAmount2) + " € <br /><strong>€</strong>➡" : ""
  }${norm4 ? eurPrice2 : ""} ${norm4 && norm1 ? "₺" : ""}${
    norm4 && !norm1 ? "TL" : ""
  }</td>
  <td>${eurAmountChange} %</td>
  `;

  goldColumn.innerHTML = `
  <th scope="row">Altın</th>
  <td>${NumberWithCommas(goldAmount1)}gr <br />🪙➡${goldPrice1} ${
    norm1 ? "₺" : "TL"
  }</td>
  <td>${NumberWithCommas(goldAmount2)}gr <br />🪙➡${goldPrice2} ${
    norm2 ? "₺" : "TL"
  }</td>
  <td>${goldAmountChange} %</td>
  `;

  wageColumn.innerHTML = `
  <th scope="row">Asgari Ücret</th>
  <td>${NumberWithCommas(minWageAmount1)}× <br />👷🏻➡${minWagePrice1} ${
    norm1 ? "₺" : "TL"
  }</td>
  <td>${NumberWithCommas(minWageAmount2)}× <br />👷🏻➡${minWagePrice2} ${
    norm2 ? "₺" : "TL"
  }</td>
  <td>${minWageAmountChange} %</td>
  `;
});

TimeDifference = async function (date1, date2) {
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);

  let dif;
  try {
    dif = Math.abs(date01.FullDate - date02.FullDate);
  } catch (error) {
    console.log(error);
  }

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
//error handling
ConvertLira = async function (date1, date2) {
  const price = (liraPrice1 / date1.InflationIndex) * date2.InflationIndex;
  if (norm1 && norm2) return price;
  else if (norm1) return price * 1000000;
  else if (norm2) return price / 1000000;
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
