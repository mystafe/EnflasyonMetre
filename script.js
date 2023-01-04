compareDates = document.getElementById("compareDates");
timeColumn = document.getElementById("timeColumn");
liraColumn = document.getElementById("liraColumn");
dollarColumn = document.getElementById("dollarColumn");
goldColumn = document.getElementById("goldColumn");
euroColumn = document.getElementById("euroColumn");
wageColumn = document.getElementById("wageColumn");
firstYear = document.getElementById("firstYear");
secondYear = document.getElementById("secondYear");
amount1 = document.getElementById("amount1");
amount2 = document.getElementById("amount1");

liraPrice1 = document.getElementById("amount1").value;
liraPrice2 = document.getElementById("amount2").value;

let timeCheck1 = false;
let timeCheck2 = false;
let timeDif = 0; //not impl.

TimeDetection = (date) => {
  if (date < "1980-01") return 1;
  else if (date < "1999-01") return 2;
  else if (date < "2005-01") return 3;
  else if (date <= "2023-01") return 4;
  else return 5;
};

document.getElementById("amount1").addEventListener("change", async (e) => {
  e.preventDefault();
  CompareFunction(document.getElementById("amount1").value, true);
});

document.getElementById("amount2").addEventListener("change", async (e) => {
  e.preventDefault();
  CompareFunction(document.getElementById("amount2").value, false);
});

document
  .getElementById("reverseButtonAmount")
  .addEventListener("click", (e) => {
    e.preventDefault();
    liraPrice1 = document.getElementById("amount2").value;
    liraPrice2 = document.getElementById("amount1").value;

    document.getElementById("amount1").value = liraPrice1;
    document.getElementById("amount2").value = liraPrice2;
    CompareFunction(liraPrice1, true);
  });

document.getElementById("reverseButtonDate").addEventListener("click", (e) => {
  e.preventDefault();
  liraPrice1 = document.getElementById("amount1").value;

  year1 = document.getElementById("secondYear").value;
  year2 = document.getElementById("firstYear").value;

  document.getElementById("firstYear").value = year1;
  document.getElementById("secondYear").value = year2;

  CompareFunction(liraPrice1, true);
});

CompareFunction = async function (lira, isFirst) {
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

  if (isFirst) {
    liraPrice1 = lira;
    liraPrice2 = parseFloat(await ConvertLira(lira, time1, time2)).toFixed(1);
  } else {
    liraPrice2 = lira;
    liraPrice1 = parseFloat(await ConvertLira(lira, time2, time1)).toFixed(1);
  }

  if (timeCheck1 && timeCheck2) {
    timeDif = await TimeDifference(date1, date2);
  }

  const normalLira1 = timeSlot1 > 3 ? 1 * liraPrice1 : liraPrice1 / 1000000;
  const normalLira2 = timeSlot2 > 3 ? 1 * liraPrice2 : liraPrice2 / 1000000;

  const liraDif = normalLira2 - normalLira1;

  let liraAmountChange;
  if (timeSlot1 > 3 && timeSlot2 > 3) {
    liraAmountChange = parseFloat((liraDif / normalLira1) * 100).toFixed(1);
  } else if (timeSlot1 < 4 && timeSlot2 < 4) {
    liraAmountChange = parseFloat((liraDif / normalLira1) * 100).toFixed(2);
  } else
    liraAmountChange = parseFloat((liraDif / normalLira1) * 100).toFixed(4);

  const timeDifText = `&nbsp;📅<br/><strong><i class="text-primary">${await TimeDifference(
    date1,
    date2
  )}</i></strong>`;

  const positiveLiraCheck = normalLira1 > normalLira2;
  let liraDifText;
  if (positiveLiraCheck) {
    liraDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
      liraAmountChange
    )}</i></strong>`;
  } else
    liraDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
      liraAmountChange
    )}</i></strong>`;

  //euro calculate problem 2000

  let usdPrice1, usdAmount1, usdPrice2, usdAmount2, eurPrice1, eurAmount1;
  let eurPrice2 = 0;
  let usdAmountChange, eurAmountChange, goldPrice1, goldAmount1;
  let goldPrice2 = 0;
  let goldAmount2, goldAmountChange, minWagePrice1, minWageAmount1;
  let minWagePrice2 = 0;
  let minWageAmount2, minWageAmountChange;

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
    const usdCheck = isNaN(
      parseFloat(((usdAmount1 - usdAmount2) / usdAmount1) * 100).toFixed(2)
    )
      ? 0
      : parseFloat(((usdAmount1 - usdAmount2) / usdAmount1) * 100).toFixed(2);
    usdAmountChange = usdCheck;

    const goldCheck = isNaN(
      parseFloat(((goldAmount1 - goldAmount2) / goldAmount1) * 100).toFixed(2)
    )
      ? 0
      : parseFloat(((goldAmount1 - goldAmount2) / goldAmount1) * 100).toFixed(
          2
        );
    goldAmountChange = goldCheck;

    const minWageCheck = isNaN(
      parseFloat(
        ((minWageAmount1 - minWageAmount2) / minWageAmount1) * 100
      ).toFixed(2)
    )
      ? 0
      : parseFloat(
          ((minWageAmount1 - minWageAmount2) / minWageAmount1) * 100
        ).toFixed(2);
    minWageAmountChange = minWageCheck;
  }
  const positiveUsdCheck = usdAmount2 > usdAmount1;
  let usdDifText;
  if (positiveUsdCheck) {
    usdDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
      usdAmountChange
    )}</i></strong>`;
  } else
    usdDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
      usdAmountChange
    )}</i></strong>`;

  if (timeSlot1 > 2 && timeSlot1 < 5) {
    eurPrice1 = NumberWithCommas(parseFloat(time1.EURTRY).toFixed(2));
    eurAmount1 = parseFloat(liraPrice1 / time1.EURTRY).toFixed(1);
  }
  if (timeSlot2 > 2 && timeSlot2 < 5) {
    eurPrice2 = NumberWithCommas(parseFloat(time2.EURTRY).toFixed(2));
    eurAmount2 = parseFloat(liraPrice2 / time2.EURTRY).toFixed(1);
  }
  if (timeSlot1 > 2 && timeSlot1 < 5 && timeSlot2 > 2 && timeSlot2 < 5) {
    const eurCheck = isNaN(
      parseFloat(((eurAmount1 - eurAmount2) / eurAmount1) * 100).toFixed(2)
    )
      ? 0
      : parseFloat(((eurAmount1 - eurAmount2) / eurAmount1) * 100).toFixed(2);
    eurAmountChange = eurCheck;
  }

  const positiveEurCheck = eurPrice2 > eurPrice1;
  let eurDifText;
  if (positiveEurCheck) {
    eurDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
      eurAmountChange
    )}</i></strong>`;
  } else
    eurDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
      eurAmountChange
    )}</i></strong>`;

  const positiveGolddCheck = goldAmount2 > goldAmount1;
  let goldDifText;
  if (positiveGolddCheck) {
    goldDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
      goldAmountChange
    )}</i></strong>`;
  } else
    goldDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
      goldAmountChange
    )}</i></strong>`;

  const positiveMinWageCheck = minWageAmount2 > minWageAmount1;
  let minWageDifText;
  if (positiveMinWageCheck) {
    minWageDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
      minWageAmountChange
    )}</i></strong>`;
  } else
    minWageDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
      minWageAmountChange
    )}</i></strong>`;

  document.getElementById("amount1").value = parseFloat(liraPrice1).toFixed();
  document.getElementById("amount2").value = parseFloat(liraPrice2).toFixed();

  timeColumn.innerHTML = `
  <th scope="row">⌚</th>
  <td>${date1}</td>
  <td>${date2}</td>
  <td>${timeDifText}</td>
  `;

  liraColumn.innerHTML = `

  <th scope="row"><strong>₺</strong></th>
  <td>${NumberWithCommas(liraPrice1)} ${timeSlot1 > 3 ? "₺" : "TL"}</td>
  <td>${NumberWithCommas(liraPrice2)} ${timeSlot2 > 3 ? "₺" : "TL"}</td>
  <td>${liraDifText}</td>  
  `;

  dollarColumn.innerHTML = `
  <tr id="dollarColumn">
  <th scope="row">💵</th>
  <td>${NumberWithCommas(
    usdAmount1
  )} $<br /><strong><i class="text-muted">${usdPrice1} ${
    timeSlot1 > 3 ? "₺" : "TL"
  }</i></strong></td>

  <td>${NumberWithCommas(
    usdAmount2
  )} $<br /><strong><i class="text-muted">${usdPrice2} ${
    timeSlot2 > 3 ? "₺" : "TL"
  }</i></strong></td>
  <td>${usdDifText}</td>
  `;

  euroColumn.innerHTML = `
  <tr id="euroColumn">
  <th>💶</th>
  <td>${NumberWithCommas(
    eurAmount1
  )} €<br /><strong><i class="text-muted">${eurPrice1} ${
    timeSlot2 > 3 ? "₺" : "TL"
  }</i></strong></td>
  <td>${NumberWithCommas(
    eurAmount2
  )} €<br /><strong><i class="text-muted">${eurPrice2} ${
    timeSlot2 > 3 ? "₺" : "TL"
  }</i></strong></td>
  <td>${eurDifText}</td>
  `;

  goldColumn.innerHTML = `
  <th>🪙</th>
  <td>${NumberWithCommas(
    goldAmount1
  )} gr <br /><strong><i class="text-muted">${goldPrice1} ${
    timeSlot1 > 3 ? "₺" : "TL"
  }</i></strong></td>
  <td>${NumberWithCommas(
    goldAmount2
  )} gr <br /><strong><i class="text-muted">${goldPrice2} ${
    timeSlot2 > 3 ? "₺" : "TL"
  }</i></strong></td>
  <td>${goldDifText}</td>
  `;

  wageColumn.innerHTML = `
  <th>👷🏻</th>
  <td>${NumberWithCommas(
    minWageAmount1
  )}× <br /><strong><i class="text-muted">${minWagePrice1} ${
    timeSlot1 > 3 ? "₺" : "TL"
  }</i></strong></td>
  <td>${NumberWithCommas(
    minWageAmount2
  )}× <br /><strong><i class="text-muted">${minWagePrice2} ${
    timeSlot2 > 3 ? "₺" : "TL"
  }</i></strong></td>
  <td>${minWageDifText}</td>
  `;
};

compareDates.addEventListener("click", async function (e) {
  e.preventDefault();
  CompareFunction(document.getElementById("amount1").value, true);
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
  else return "&nbsp;&nbsp;&nbsp;-";
};

LiraDifference = async function (date1, date2) {
  //timeCheck1
  const date01 = await FetchDataByDate(date1);
  const date02 = await FetchDataByDate(date2);
  const dif = date01.InflationIndex / date02.InflationIndex;

  return dif;
};
//error handling
ConvertLira = async function (lira, date1, date2) {
  const price = (lira / date1.InflationIndex) * date2.InflationIndex;
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
