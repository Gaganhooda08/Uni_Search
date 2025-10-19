const url = "http://universities.hipolabs.com/search?name=";
const btn = document.querySelector("#searchBtn");
const input = document.querySelector("#countryInput");
const list = document.querySelector("#list");
const toggleBtn = document.querySelector("#toggleMode");
const micBtn = document.querySelector("#micBtn");
const suggestionsBox = document.querySelector("#suggestions");

const countries = ["India", "United States", "Canada", "Germany", "Australia", "France", "Japan", "Brazil", "South Africa", "United Kingdom"];

btn.addEventListener("click", searchUniversities);
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchUniversities();
});

micBtn.addEventListener("click", () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    searchUniversities();
  };
});

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (value.length > 0) {
    const matches = countries.filter(c => c.toLowerCase().startsWith(value));
    matches.forEach(match => {
      const div = document.createElement("div");
      div.innerText = match;
      div.classList.add("suggestion-item");
      div.addEventListener("click", () => {
        input.value = match;
        suggestionsBox.innerHTML = "";
        searchUniversities();
      });
      suggestionsBox.appendChild(div);
    });
  }
});

async function searchUniversities() {
  const country = input.value.trim();
  list.innerHTML = "";
  suggestionsBox.innerHTML = "";

  if (!country) {
    alert("Please enter a country name.");
    return;
  }

  showSpinner();

  try {
    const colleges = await getColleges(country);
    input.value = "";

    if (colleges.length === 0) {
      list.innerHTML = "<li>No universities found.</li>";
    } else {
      show(colleges);
    }
  } catch (e) {
    list.innerHTML = "<li>Oops! Something went wrong.</li>";
    console.error("Error:", e);
  }
}

function showSpinner() {
  const spinner = document.createElement("div");
  spinner.className = "spinner";
  list.appendChild(spinner);
}

function show(colleges) {
  list.innerHTML = "";
  colleges.forEach((col) => {
    const li = document.createElement("li");
    const countryCode = col.alpha_two_code?.toLowerCase() || "xx";
    li.innerHTML = `
      <img src="https://flagcdn.com/24x18/${countryCode}.png" alt="${countryCode}" />
      <a href="${col.web_pages[0]}" target="_blank">${col.name}</a>
    `;
    list.appendChild(li);
  });

  gsap.from("#list li", {
    duration: 0.6,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: "power2.out"
  });
}

async function getColleges(country) {
  const res = await axios.get(url + country);
  return res.data;
}







// let url = "http://universities.hipolabs.com/search?name=";
// let btn = document.querySelector("#searchBtn");
// let input = document.querySelector("#countryInput");
// let list = document.querySelector("#list");

// btn.addEventListener("click", async () => {
//     let country = input.value.trim();
//     list.innerHTML = "";

//     if (!country) {
//         alert("Please enter a country name.");
//         return;
//     }

//     let loading = document.createElement("li");
//     loading.innerText = "Loading results...";
//     list.appendChild(loading);

//     try {
//         let colleges = await getColleges(country);
//         list.innerHTML = ""; // Clear loading message
//         if (colleges.length === 0) {
//             list.innerHTML = "<li>No universities found.</li>";
//             return;
//         }
//         show(colleges);
//     } catch (e) {
//         list.innerHTML = "<li>Oops! Something went wrong.</li>";
//     }
// });

// function show(colleges) {
//     colleges.forEach(col => {
//         let li = document.createElement("li");
//         li.innerHTML = `<a href="${col.web_pages[0]}" target="_blank">${col.name}</a>`;
//         li.style.opacity = "0";
//         list.appendChild(li);

//         // Simple fade-in animation
//         setTimeout(() => {
//             li.style.transition = "opacity 0.5s ease-in";
//             li.style.opacity = "1";
//         }, 100);
//     });
// }

// async function getColleges(country) {
//     let res = await axios.get(url + country);
//     return res.data;
// }








// let url ="http://universities.hipolabs.com/search?name=";
// let btn = document.querySelector("button");
// btn.addEventListener("click", async() =>{
//     let country = document.querySelector("input").value;
   
//     console.log(country);

//     let colArr = await  getColleges(country);
// console.log(colArr);
// show(colArr);
// });

// function show(colArr){
// let list = document.querySelector("#list");
//         list.innerText = "";

//     for(col of colArr){
        
//         console.log(col.name);
//         let li = document.createElement("li");
//         li.innerText = col.name;
//         list.appendChild(li);
//     }
// }

// async function getColleges(country){
//     try{
//         let res = await axios.get(url + country);
// return res.data;
//     }
//     catch(e) {
//         console.log("error",e);
// return [];
//     }
// }