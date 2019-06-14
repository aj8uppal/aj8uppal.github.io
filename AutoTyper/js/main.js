class Typer {
  constructor(element, strings, speed, autoStart=true){
    this.element = document.querySelectorAll(element)[0];
    this.strings = strings;
    this.speed = speed;
    this.curString = 0;
    this.curIndex = 0;
    this.delete = false;
    this.paused = false
    this.waiting = false;
    this.element.onfocus = () => {
      if(this.paused == false){
        this.element.value = "";
        this.paused = true;
      }
    }
    this.element.onblur = () => {
      if(this.element.value == ""){
        this.paused = false;
      }
    }
    if(autoStart){
      this.start(element);
    }
  }
  start(ele){
    if(!this.paused){
    let character = this.strings[this.curString][this.curIndex];
    if(this.delete == false){
      if(this.curIndex < this.strings[this.curString].length){
        this.curIndex++;
      }
    }
    if(this.curIndex == this.strings[this.curString].length && this.delete == false){
      if(character != undefined){
      this.element.value+=character;
    }
        this.delete = true;
        this.waiting = true;
        setTimeout(()=>{this.waiting = false}, 1000);
        // debugger;
    }
    if(!this.delete){
      if(character != undefined){
      this.element.value+=character;
    }
    }else if(!this.waiting){
      // debugger;
      this.element.value = this.element.value.slice(0, --this.curIndex);
      if(this.curIndex <= 0){
        this.delete = !this.delete;
        if(this.curString+1 == this.strings.length){
          this.curString = 0;
        }else{
          this.curString++;
        }
      }
    }
  }else{
    this.curString = 0;
    this.curIndex = 0;
  }
    setTimeout((ele)=>{
      this.start(ele);
    }, this.speed);
  }
}

$(document).ready(() => {
    let cycleStrings = ["I need to pull our sales numbers by region for last month. I have an old query but I think I need to change the time range.",
                        "I'm having trouble getting my SQL query to run, heres what I have so far. Help? SELECT count(*) FROM table WHERE (SELECT* FROM table GROUP BY DATEPART(hour, [date_purchased]) ASC GROUP BY year(date_purchased) ASC",
                        "I'm trying to join two tables but I'm missing a few data points in the result. My schema has two tables. 1) product table with product_name and product_id columns and 2) product_release table with product_id and release_date column"];
    let typer1 = new Typer("#text", cycleStrings, 100);
    let typer2 = new Typer("#text1", cycleStrings, 25);
    let typer3 = new Typer("#text2", cycleStrings, 50);
});
