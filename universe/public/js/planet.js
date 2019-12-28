class Planet extends Body {
  constructor(ecc, smaxis, period, radius, temperature, scene, scale, name){
    // a(1-e^2)/(1+ecos(theta))
    super(0, 0, 0, radius*scale, temperature, scene);
    this.ecc = ecc;
    this.smaxis = smaxis*scale;
    this.period = period;
    this.theta = 0;
    this.timeScale = 0.02;
    this.calculateDTheta();
    this.x = this.getDistance();
    this.y = 0;
    this.z = 0;
    this.name = name;
    this.updatePos();

  }
  calculateDTheta(newTimeScale){
    this.timeScale = newTimeScale || this.timeScale;
    this.Dtheta = this.timeScale/this.period;
  }
  updatePos(){
    super.setPos(this.x, this.y, this.z);
  }
  getDistance() {
    return this.smaxis*(1-this.ecc**2)/(1+this.ecc*Math.cos(this.theta))
  }
  move() {
    this.theta+=this.Dtheta;
    let distance = this.getDistance();
    let x = distance*Math.cos(this.theta);
    let z = distance*Math.sin(this.theta);
    super.setPos(x, 0, z);
  }
}
