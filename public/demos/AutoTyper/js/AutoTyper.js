class Typer {
  constructor(element, strings, speed, autoStart=true, deleteAnimation=false, waitTime=1000){
    this.element = document.querySelectorAll(element)[0];
    this.strings = strings;
    this.speed = speed;
    this.curString = 0;
    this.curIndex = 0;
    this.delete = false;
    this.paused = false
    this.waiting = false;
    this.waitTime = waitTime;
    this.deleteAnimation = deleteAnimation;
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
      this.start();
    }
  }
  start(){
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
      setTimeout(()=>{this.waiting = false;if(!this.deleteAnimation){this.element.value="";this.curIndex=0}}, this.waitTime);
    }
    if(!this.delete){
      if(character != undefined){
      this.element.value+=character;
    }
    }else if(!this.waiting){
      if(!this.deleteAnimation){
	this.element.value = "";
	this.curIndex = 0;
	}else{
      this.element.value = this.element.value.slice(0, --this.curIndex);
	}
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
  setTimeout(()=>{this.start()}, this.speed);
  }
}
