// Animation layer system for managing multiple animations
export class AnimationLayer {
  constructor(name) {
    this.name = name;
    this.tracks = [];
    this.weight = 1.0;
    this.visible = true;
  }

  addTrack(track) {
    this.tracks.push(track);
  }

  removeTrack(track) {
    const index = this.tracks.indexOf(track);
    if (index !== -1) {
      this.tracks.splice(index, 1);
    }
  }

  evaluate(time) {
    if (!this.visible || this.weight === 0) return null;
    
    return this.tracks.map(track => ({
      property: track.property,
      value: track.evaluate(time) * this.weight
    }));
  }
}

export class AnimationTrack {
  constructor(property) {
    this.property = property;
    this.curve = null;
    this.enabled = true;
  }

  evaluate(time) {
    if (!this.enabled || !this.curve) return null;
    return this.curve.evaluate(time);
  }
}