import * as THREE from 'three';

// Types
import type { Vector3 as TVector3, Box3 } from 'three';

export default class Capsule {
  public start!: TVector3;
  public end!: TVector3;
  public radius!: number;
  private _v1 = new THREE.Vector3();
  private _v2 = new THREE.Vector3();
  private _v3 = new THREE.Vector3();

  constructor(start?: TVector3, end?: TVector3, radius?: number) {
    this.start = start == undefined ? new THREE.Vector3(0, 0, 0) : start;
    this.end = end == undefined ? new THREE.Vector3(0, 1, 0) : end;
    this.radius = radius == undefined ? 1 : radius;
  }

  public clone(): Capsule {
    return new Capsule(this.start.clone(), this.end.clone(), this.radius);
  }

  public set(start: TVector3, end: TVector3, radius: number): void {
    this.start.copy(start);
    this.end.copy(end);
    this.radius = radius;
  }

  public copy(capsule: Capsule): void {
    this.start.copy(capsule.start);
    this.end.copy(capsule.end);
    this.radius = capsule.radius;
  }

  public getCenter(target: TVector3): TVector3 {
    return target.copy(this.end).add(this.start).multiplyScalar(0.5);
  }

  public translate(vector: TVector3): void {
    this.start.add(vector);
    this.end.add(vector);
  }

  public checkAABBAxis(
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    minx: number,
    maxx: number,
    miny: number,
    maxy: number,
    radius: number,
  ): boolean {
    return (
      (minx - p1x < radius || minx - p2x < radius) &&
      (p1x - maxx < radius || p2x - maxx < radius) &&
      (miny - p1y < radius || miny - p2y < radius) &&
      (p1y - maxy < radius || p2y - maxy < radius)
    );
  }

  public intersectsBox(box: Box3): boolean {
    return (
      this.checkAABBAxis(
        this.start.x,
        this.start.y,
        this.end.x,
        this.end.y,
        box.min.x,
        box.max.x,
        box.min.y,
        box.max.y,
        this.radius,
      ) &&
      this.checkAABBAxis(
        this.start.x,
        this.start.z,
        this.end.x,
        this.end.z,
        box.min.x,
        box.max.x,
        box.min.z,
        box.max.z,
        this.radius,
      ) &&
      this.checkAABBAxis(
        this.start.y,
        this.start.z,
        this.end.y,
        this.end.z,
        box.min.y,
        box.max.y,
        box.min.z,
        box.max.z,
        this.radius,
      )
    );
  }

  public lineLineMinimumPoints(
    line1: { start: TVector3; end: TVector3 },
    line2: { start: TVector3; end: TVector3 },
  ): [TVector3, TVector3] {
    const r = this._v1.copy(line1.end).sub(line1.start);
    const s = this._v2.copy(line2.end).sub(line2.start);
    const w = this._v3.copy(line2.start).sub(line1.start);

    const a = r.dot(s),
      b = r.dot(r),
      c = s.dot(s),
      d = s.dot(w),
      e = r.dot(w);

    let t1, t2;
    const divisor = b * c - a * a;

    if (Math.abs(divisor) < 1e-10) {
      const d1 = -d / c;
      const d2 = (a - d) / c;

      if (Math.abs(d1 - 0.5) < Math.abs(d2 - 0.5)) {
        t1 = 0;
        t2 = d1;
      } else {
        t1 = 1;
        t2 = d2;
      }
    } else {
      t1 = (d * a + e * c) / divisor;
      t2 = (t1 * a - d) / c;
    }

    t2 = Math.max(0, Math.min(1, t2));
    t1 = Math.max(0, Math.min(1, t1));

    const point1 = r.multiplyScalar(t1).add(line1.start);
    const point2 = s.multiplyScalar(t2).add(line2.start);

    return [point1, point2];
  }
}
