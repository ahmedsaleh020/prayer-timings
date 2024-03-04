let container = document.querySelector(".prayers");
let cities = document.querySelector("#cities");
let header = document.querySelector("h1");
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

for (let [key, value] of Object.entries(citiesNames)) {
  const opt = `<option value="${key}">${value}</option>`;
  cities.insertAdjacentHTML("beforeend", opt);
}

fetch(
  `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=Egypt&method=5`
)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);

    let timings = data.data[`${--day}`]["timings"];
    for (let [key, value] of Object.entries(timings)) {
      value = value.slice(0, -5);
      if (
        ["Sunset", "Imsak", "Midnight", "Firstthird", "Lastthird"].includes(key)
      ) {
        continue;
      } else {
        const keyTranslations = {
          Fajr: "صلاة الفجر",
          Sunrise: "الشروق",
          Dhuhr: "صلاة الظهر",
          Asr: "صلاة العصر",
          Maghrib: "صلاة المغرب",
          Isha: "صلاة العشاء",
        };

        key = keyTranslations[key];

        const html = `<div class="prayer">${`موعد ${key} الساعة ${value}`}</div>`;
        container.insertAdjacentHTML("beforeend", html);
      }
    }
  });

cities.addEventListener("change", function () {
  container.innerHTML = "";
  city = cities.value;
  header.textContent = ` مواقيت الصلاة لمحافظة ` + `${citiesNames[`${city}`]}`;

  fetch(
    `http://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=Egypt&method=5`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let timings = data.data[`${--day}`]["timings"];
      for (let [key, value] of Object.entries(timings)) {
        timesManager = {};

        value = value.slice(0, -5);

        if (
          ["Sunset", "Imsak", "Midnight", "Firstthird", "Lastthird"].includes(
            key
          )
        ) {
          continue;
        } else {
          const keyTranslations = {
            Fajr: "صلاة الفجر",
            Sunrise: "الشروق",
            Dhuhr: "صلاة الظهر",
            Asr: "صلاة العصر",
            Maghrib: "صلاة المغرب",
            Isha: "صلاة العشاء",
          };

          key = keyTranslations[key];

          const html = `<div class="prayer">${`موعد ${key} الساعة ${value}`}</div>`;
          container.insertAdjacentHTML("beforeend", html);
        }
      }
    });
});
