$(document).ready(() => {
    $('[data-toggle="tooltip"]').tooltip()
    let cycleStrings1 = ["I need to pull our sales numbers by region for last month. I have an old query but I think I need to change the time range.",
                        "I'm having trouble getting my SQL query to run, heres what I have so far. Help? SELECT count(*) FROM table WHERE (SELECT* FROM table GROUP BY DATEPART(hour, [date_purchased]) ASC GROUP BY year(date_purchased) ASC",
                        "I'm trying to join two tables but I'm missing a few data points in the result. My schema has two tables. 1) product table with product_name and product_id columns and 2) product_release table with product_id and release_date column"];
    let typer1 = new Typer("#sqlHelp", cycleStrings1, 25);
    let cycleStrings2 = ["Once upon a time, in a faraway land, lived a young boy named Damian. Damian had a pet dalmation, Brutus.",
			 "The best features of Gmail are only available on your phone and tablet with the official Gmail app. Download the app or go to gmail.com on your computer or mobile device to get started.",
			 "Compile Bootstrap with your own asset pipeline by downloading our source Sass, JavaScript, and documentation files."]
    let typer2 = new Typer("#fast", cycleStrings2, 15, false);
    let typer3 = new Typer("#slow", cycleStrings2, 125);
    startType = () => {
	typer2.start();
    }
    let formatSpan = (originalContent, color) => {
      return `<span style="color: ${color}">${originalContent}</span>`
    }
    $(".autoColor").each(function(){
      let formatted = $(this).html();
      formatted = formatted.replace("let", formatSpan("let", "#4CAF50"));
      $(this).html(formatted);
    });

});
