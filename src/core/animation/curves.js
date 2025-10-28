// Animation curve system with bezier interpolation
export class AnimationCurve {
  constructor() {
    this.points = [];
    this.type = 'linear'; // linear, bezier, step
  }

  addPoint(time, value, leftHandle = null, rightHandle = null) {
    this.points.push({ time, value, leftHandle, rightHandle });
    this.points.sort((a, b) => a.time - b.time);
  }

  evaluate(time) {
    if (this.points.length === 0) return 0;
    if (this.points.length === 1) return this.points[0].value;

    // Find surrounding points
    let i = 0;
    while (i < this.points.length - 1 && this.points[i + 1].time < time) i++;

    const p0 = this.points[i];
    const p1 = this.points[i + 1];

    if (!p1) return p0.value;

    switch (this.type) {
      case 'step':
        return p0.value;
      case 'bezier':
        return this.evaluateBezier(p0, p1, time);
      default: // linear
        return this.evaluateLinear(p0, p1, time);
    }
  }

  evaluateLinear(p0, p1, time) {
    const t = (time - p0.time) / (p1.time - p0.time);
    return p0.value * (1 - t) + p1.value * t;
  }

  evaluateBezier(p0, p1, time) {
    const t = (time - p0.time) / (p1.time - p0.time);
    const rh = p0.rightHandle || { x: p0.time + (p1.time - p0.time) / 3, y: p0.value };
    const lh = p1.leftHandle || { x: p1.time - (p1.time - p0.time) / 3, y: p1.value };
    
    // Cubic Bezier interpolation
    const mt = 1 - t;
    return (
      mt * mt * mt * p0.value +
      3 * mt * mt * t * rh.y +
      3 * mt * t * t * lh.y +
      t * t * t * p1.value
    );
  }
}