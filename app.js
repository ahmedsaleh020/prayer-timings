let container = document.querySelector(".prayers");
let cities = document.querySelector("#cities");
let header = document.querySelector("h2");
let city = cities.value;

// get the Today's data to use it in requests
let day =
  Date(Date).slice(8, 10) < 10
    ? Date(Date).slice(8, 10).slice(1)
    : Date(Date).slice(8, 10);

let month = Date(Date).slice(4, 7);
const monthOrder = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};
month = monthOrder[month];
let year = Date(Date).slice(11, 15);

// cities name  to pass it to request and to display it too on the dom
let citiesNames = {
  Cairo: "القاهرة",
  Alexandria: "الاسكندرية",
  "Port Said": "بورسعيد",
  Suez: "السويس",
  Damietta: "دمياط",
  Dakahlia: "الدقهلية",
  Sharqia: "الشرقية",
  Qalyubia: "القليوبية",
  "Kafr El-Sheikh": "كفر الشيخ",
  Gharbia: "الغربية",
  Menoufia: "المنوفية",
  Beheira: "البحيرة",
  Ismailia: "الاسماعيلية",
  Giza: "الجيزة",
  "Bani Sweif": "بنى سويف",
  Fayoum: "الفيوم",
  Minya: "المنيا",
  Asyut: "اسيوط",
  Sohag: "سوهاج",
  Qena: "قنا",
  Aswan: "اسوان",
  Luxor: "الاقصر",
  "Red Sea": "البحر الاحمر",
  "El Wadi El Gedid": "الوادى الجديد",
  Matrouh: "مطروح",
  "North Sinai": "شمال سيناء",
  "South Sinai": "جنوب سيناء",
};

// 24h system to 12h system
timesManager = {
  "00": "12 ص",
  "01": "1 ص",
  "02": "2 ص",
  "03": "3 ص",
  "04": "4 ص",
  "05": "5 ص",
  "06": "6 ص",
  "07": "7 ص",
  "08": "8 ص",
  "09": "9 ص",
  10: "10 ص",
  11: "11 ص",
  12: "12 م",
  13: "1 م",
  14: "2 م",
  15: "3 م",
  16: "4 م",
  17: "5 م",
  18: "6 م",
  19: "7 م",
  20: "8 م",
  21: "9 م",
  22: "10 م",
  23: "11 م",
};
// create cities options in and insert it to the dropdown
for (let [key, value] of Object.entries(citiesNames)) {
  const option = `<option value="${key}">${value}</option>`;
  cities.insertAdjacentHTML("beforeend", option);
}

fetch(
  `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=Egypt&method=5`
)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    // extract timing data from the returned object
    let timings = data.data[`${--day}`]["timings"];
    for (let [key, value] of Object.entries(timings)) {
      value = value.slice(0, -5);
      // edit the format of time
      value =
        "  " +
        value.slice(3, 5) +
        "  " +
        " : " +
        timesManager[`${value.slice(0, 2)}`].slice(0, 2) +
        " " +
        timesManager[`${value.slice(0, 2)}`].slice(-1);
      // skip some timings that unnecessary for my application right now
      if (
        [
          "Sunset",
          "Imsak",
          "Midnight",
          "Firstthird",
          "Lastthird",
          "Sunrise",
        ].includes(key)
      ) {
        continue;
      }
      // translate prayer names to arabic
      else {
        const keyTranslations = {
          Fajr: "صلاة الفجر",
          Dhuhr: "صلاة الظهر",
          Asr: "صلاة العصر",
          Maghrib: "صلاة المغرب",
          Isha: "صلاة العشاء",
        };

        key = keyTranslations[key];
        // display the prayers on dom
        const prayer = `<div class="prayer">
        <h3 class="prayer-name">${key}</h3>
        <span class="prayer-time">${value}</span>
        </div>`;
        container.insertAdjacentHTML("beforeend", prayer);
      }
    }
  });

cities.addEventListener("change", function () {
  container.innerHTML = "";
  city = cities.value;
  header.textContent = ` مواقيت الصلاة لمحافظة ` + `${citiesNames[`${city}`]}`;

  fetch(
    `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=Egypt&method=5`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let timings = data.data[`${--day}`]["timings"];
      for (let [key, value] of Object.entries(timings)) {
        value = value.slice(0, -5);
        // edit the format of time
        value =
          "  " +
          value.slice(3, 5) +
          "  " +
          " : " +
          timesManager[`${value.slice(0, 2)}`].slice(0, 2) +
          " " +
          timesManager[`${value.slice(0, 2)}`].slice(-1);
        if (
          [
            "Sunset",
            "Imsak",
            "Midnight",
            "Firstthird",
            "Lastthird",
            "Sunrise",
          ].includes(key)
        ) {
          continue;
        } else {
          const keyTranslations = {
            Fajr: "صلاة الفجر",
            Dhuhr: "صلاة الظهر",
            Asr: "صلاة العصر",
            Maghrib: "صلاة المغرب",
            Isha: "صلاة العشاء",
          };

          key = keyTranslations[key];

          const prayer = `<div class="prayer">
          <h3 class="prayer-name">${key}</h3>
          <span class="prayer-time">${value}</span>
          </div>`;
          container.insertAdjacentHTML("beforeend", prayer);
        }
      }
    });
});
