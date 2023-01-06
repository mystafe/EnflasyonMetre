compareDates = document.getElementById("compareDates");
resetValues = document.getElementById("resetValues");
timeColumn = document.getElementById("timeColumn");
liraColumn = document.getElementById("liraColumn");
dollarColumn = document.getElementById("dollarColumn");
goldColumn = document.getElementById("goldColumn");
euroColumn = document.getElementById("euroColumn");
wageColumn = document.getElementById("wageColumn");
firstYear = document.getElementById("firstYear");
secondYear = document.getElementById("secondYear");
amount1 = document.getElementById("amount1");
amount2 = document.getElementById("amount2");

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

resetValues.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("amount1").value = 1000;
  document.getElementById("firstYear").value = "2021-12";
  document.getElementById("secondYear").value = "2023-01";
  CompareFunction(1000, true);
});

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
  let moneyValid1 = timeSlot1 > 1 && timeSlot1 < 5;
  let moneyValid2 = timeSlot2 > 1 && timeSlot2 < 5;
  let euroValid1 = timeSlot1 > 2 && timeSlot1 < 5;
  let euroValid2 = timeSlot2 > 2 && timeSlot2 < 5;

  let usdPrice1, usdAmount1, usdPrice2, usdAmount2, eurPrice1;
  let eurAmount1, eurPrice2, usdAmountChange, eurAmountChange, goldPrice1;
  let goldAmount1, goldPrice2, goldAmount2, goldAmountChange, minWagePrice1;
  let minWageAmount1, minWagePrice2, minWageAmount2, minWageAmountChange;

  let time1, time2;

  if (moneyValid1) {
    date1 = firstYear.value;
    time1 = await FetchDataByDate(date1);
  }
  if (moneyValid2) {
    date2 = secondYear.value;
    time2 = await FetchDataByDate(date2);
  }

  if (isFirst) {
    liraPrice1 = lira;
    liraPrice2 = parseFloat(await ConvertLira(lira, time1, time2)).toFixed(1);
  } else {
    liraPrice2 = lira;
    liraPrice1 = parseFloat(await ConvertLira(lira, time2, time1)).toFixed(1);
  }

  //lira
  let timeDifText = "";
  let liraDifText = "";
  let minWageDifText = "";
  let goldDifText = "";
  let eurDifText = "";
  let usdDifText = "";

  if (moneyValid1 && moneyValid2) {
    timeDif = await TimeDifference(date1, date2);
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

    timeDifText = `&nbsp;📅<br/><strong><i class="text-primary">${timeDif}</i></strong>`;

    const positiveLiraCheck = normalLira1 > normalLira2;

    if (positiveLiraCheck) {
      liraDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
        liraAmountChange
      )}</i></strong>`;
    } else
      liraDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
        liraAmountChange
      )}</i></strong>`;
  }

  if (moneyValid1) {
    usdPrice1 = NumberWithCommas(parseFloat(time1.USDTRY).toFixed(2));
    usdAmount1 = parseFloat(liraPrice1 / time1.USDTRY).toFixed(1);
    goldPrice1 = NumberWithCommas(parseFloat(time1.GoldPerGramTRY).toFixed(2));
    goldAmount1 = parseFloat(liraPrice1 / time1.GoldPerGramTRY).toFixed(2);
    minWagePrice1 = NumberWithCommas(
      parseFloat(time1.minWageNetTRY).toFixed(2)
    );
    minWageAmount1 = parseFloat(liraPrice1 / time1.minWageNetTRY).toFixed(2);
  } else if (!moneyValid1) {
    liraPrice1 = usdPrice1 = eurPrice1 = goldPrice1 = minWagePrice1 = "0";
    date1 = "2021-12";
  }

  if (moneyValid2) {
    usdPrice2 = NumberWithCommas(parseFloat(time2.USDTRY).toFixed(2));
    usdAmount2 = parseFloat(liraPrice2 / time2.USDTRY).toFixed(1);
    goldPrice2 = NumberWithCommas(parseFloat(time2.GoldPerGramTRY).toFixed(2));
    goldAmount2 = parseFloat(liraPrice2 / time2.GoldPerGramTRY).toFixed(2);
    minWagePrice2 = NumberWithCommas(
      parseFloat(time2.minWageNetTRY).toFixed(2)
    );
    minWageAmount2 = parseFloat(liraPrice2 / time2.minWageNetTRY).toFixed(2);
  } else if (!moneyValid2) {
    liraPrice2 = usdPrice2 = eurPrice2 = goldPrice2 = minWagePrice2 = 0;
    date2 = "2023-01";
  }

  if (moneyValid1 && moneyValid2) {
    usdAmountChange = parseFloat(
      ((usdAmount1 - usdAmount2) / usdAmount1) * 100
    ).toFixed(2);

    goldAmountChange = parseFloat(
      ((goldAmount1 - goldAmount2) / goldAmount1) * 100
    ).toFixed(2);

    minWageAmountChange = parseFloat(
      ((minWageAmount1 - minWageAmount2) / minWageAmount1) * 100
    ).toFixed(2);

    const positiveUsdCheck = usdAmount2 > usdAmount1;

    if (positiveUsdCheck && moneyValid1 && moneyValid2) {
      usdDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
        usdAmountChange
      )}</i></strong>`;
    } else if (!positiveUsdCheck && moneyValid1 && moneyValid2)
      usdDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
        usdAmountChange
      )}</i></strong>`;

    if (euroValid1) {
      eurPrice1 = NumberWithCommas(parseFloat(time1.EURTRY).toFixed(2));
      eurAmount1 = parseFloat(liraPrice1 / time1.EURTRY).toFixed(1);
    }
    if (euroValid2) {
      eurPrice2 = NumberWithCommas(parseFloat(time2.EURTRY).toFixed(2));
      eurAmount2 = parseFloat(liraPrice2 / time2.EURTRY).toFixed(1);
    }
    if (!euroValid1) {
      eurPrice1 = 0;
      eurAmount1 = 0;
    }
    if (!euroValid2) {
      eurPrice2 = 0;
      eurAmount2 = 0;
    }
    if (euroValid1 && euroValid2) {
      eurAmountChange = parseFloat(
        ((eurAmount1 - eurAmount2) / eurAmount1) * 100
      ).toFixed(2);

      const positiveEurCheck = eurPrice2 > eurPrice1;

      if (positiveEurCheck && euroValid1 && euroValid2) {
        eurDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
          eurAmountChange
        )}</i></strong>`;
      } else if (!positiveEurCheck && euroValid1 && euroValid2)
        eurDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
          eurAmountChange
        )}</i></strong>`;
    } else {
      eurDifText = "";
    }

    const positiveGolddCheck = goldAmount2 > goldAmount1;
    if (positiveGolddCheck && moneyValid1 && moneyValid2) {
      goldDifText = `&nbsp;📈<br/><strong><i class="text-success">%${Math.abs(
        goldAmountChange
      )}</i></strong>`;
    } else if (!positiveGolddCheck && moneyValid1 && moneyValid2)
      goldDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
        goldAmountChange
      )}</i></strong>`;

    const positiveMinWageCheck = minWageAmount2 > minWageAmount1;

    if (positiveMinWageCheck && moneyValid1 && moneyValid2) {
      minWageDifText = `&nbsp;📉<br/><strong><i class="text-danger">%${Math.abs(
        minWageAmountChange
      )}</i></strong>`;
    } else if (!positiveMinWageCheck && moneyValid1 && moneyValid2)
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
  }
};

compareDates.addEventListener("click", async function (e) {
  e.preventDefault();
  CompareFunction(document.getElementById("amount1").value, true);
});

TimeDifference = async function (date1, date2) {
  let date01, date02;
  try {
    date01 = await FetchDataByDate(date1);
    date02 = await FetchDataByDate(date2);

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
  } catch (error) {
    console.log(error);
  }
  return "&nbsp;&nbsp;&nbsp;-";
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
  let price = "0";

  try {
    price = (lira / date1.InflationIndex) * date2.InflationIndex;
    if (timeSlot1 > 3 && timeSlot2 > 3) return price;
    else if (timeSlot1 > 3) return price * 1000000;
    else if (timeSlot2 > 3) return price / 1000000;
  } catch (error) {
    console.warn(error);
  }

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
  let ret = x;
  try {
    ret = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (error) {
    console.warn(error);
  }
  return ret;
}

//ilk ve 2. kolon değiştirilebilir..
