let zip = rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))

let startCarousel = () => {
  $('#quote-carousel').carousel({
    pause: true,
    interval: 4000,
  });
}

let injectQuotes = (quotes) => {
  console.assert($(".quote").length === quotes.length && quotes.length === $(".right-name").length);
  const zipped = zip([quotes, $(".quote"), $(".right-name")]);
  for(let i = 0; i < zipped.length; i++){
    $(zipped[i][1]).find("p").html(zipped[i][0].split(",")[0]);
    $(zipped[i][2]).find("small").html(zipped[i][0].split(",")[zipped[i][0].split(",").length-1]);
  }

}
let loadData = () => {
          var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqa3pWvE0mjjU3KMVOsXG5mpb2LjlEr6RscTm8X8VKIWHHrdQbqYxdZHqHXry4yd7snLLC_PJWyulO/pub?output=csv";
          xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4) {
              let data = xmlhttp.responseText.split("\n");
              const shuffled = data.sort(() => 0.5 - Math.random());

              let quotes = shuffled.slice(0, 4);
              injectQuotes(quotes);
              }
          };
          xmlhttp.open("GET", url, true);
          xmlhttp.send(null);
      }
$(document).ready(function() {
  loadData();
});
