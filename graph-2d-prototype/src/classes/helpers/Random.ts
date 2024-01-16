import lerp from 'lerp';

export default class Random {
  static gaussian(mean=0, stdev=1): number {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    
    return z * stdev + mean;
  }

  static lerp(value: number, t: number): number {
    return lerp(value, Math.random()*2-1, t);    
  }

  static randomIndex(length: number): number
  {
    return Math.floor(Math.random() * length);
  }
}
