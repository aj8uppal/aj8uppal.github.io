class AnimatedElement {
  constructor(querySelector, type){
    this.ele = $(querySelector);
    this.ele.css("display", "none");
    this.ele.css("opacity", 0);
    this.type = type;
    this.duration = parseFloat(this.ele.css("transition-duration").split("s"))*1000;
  }
  appear(callback){
    this.ele.css("display", "block");
    this.ele.css("opacity", 1);
    if(callback){
      setTimeout(()=>{
        callback();
      }, this.duration);
    }
  }
  appearIn(ms){
    setTimeout(()=>{
      this.appear();
    }, ms);
  }
  disappear(callback){
    this.ele.css("opacity", 0);
    setTimeout(()=>{
      this.ele.css("display", "none");
      if(callback){
        callback();
      }
    }, this.duration);
  }
  disappearIn(ms){
    setTimeout(()=>{
      this.disappear()
    }, ms);
  }
  changeText(newText, callback){
    if(this.type !== "text"){
      throw new TypeError(`Cannot modify text of a ${this.type}`);
    }
    this.disappear(()=>{
      this.ele.html(newText);
      this.appear(callback);
    });
  }
  changeTextIn(newText, ms, callback){
    if(this.type !== "text"){
      throw new TypeError(`Cannot modify text of a ${this.type}`);
    }
    setTimeout(()=>{
      this.changeText(newText, callback)
    }, ms);
  }
  changeHTML(newHTML){
    this.ele.html(newHTML);
  }
  css(key, value){
    this.ele.css(key, value);
  }
}
