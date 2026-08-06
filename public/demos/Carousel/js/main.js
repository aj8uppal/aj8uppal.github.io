let zip = rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))

let startCarousel = () => {
  $('#quote-carousel').carousel({
    pause: true,
    interval: 4000,
  });
}

let injectQuotes = (quotes, names) => {
  console.assert($(".quote").length === quotes.length && quotes.length === $(".right-name").length && quotes.length === names.length);
  for(let i = 0; i < quotes.length; i++){
    $($(".quote")[i]).find("p").html(quotes[i]);
    $($(".right-name")[i]).find("small").html(names[i]);
  }

}
let loadData = () => {
          var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqa3pWvE0mjjU3KMVOsXG5mpb2LjlEr6RscTm8X8VKIWHHrdQbqYxdZHqHXry4yd7snLLC_PJWyulO/pub?output=tsv";
          xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4) {
              let data = xmlhttp.responseText.split("\n");
              const shuffled = data.sort(() => 0.5 - Math.random());
              let lines = shuffled.slice(0, 4);
              let [quotes, ids, names] = zip([...lines.map(item=>{return item.split('\t')})])
              injectQuotes(quotes, names);
              }
          };
          xmlhttp.open("GET", url, true);
          xmlhttp.send(null);
      }
$(document).ready(function() {
  loadData();
  $(".carousel").css("opacity", "1");
});
