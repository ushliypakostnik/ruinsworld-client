/* eslint-disable */
import * as THREE from 'three';

// Types
import type { Box3, Group, Ray, Sphere, Vector3 } from 'three';
import type { TResult } from '@/models/utils';

// Modules
import { Triangle } from 'three';
import Capsule from '@/components/Scene/World/Math/Capsule';

export default class Octree {
  private _v1 = new THREE.Vector3();
  private _v2 = new THREE.Vector3();
  private _plane = new THREE.Plane();
  private _line1 = new THREE.Line3();
  private _line2 = new THREE.Line3();
  private _sphere = new THREE.Sphere();
  private _capsule = new Capsule();

  public triangles: Triangle[] = [];
  public box!: Box3;
  public subTrees: Octree[] = [];
  public bounds!: Box3;

  constructor(box?: Box3) {
    if (box) this.box = box;
  }

  private _addTriangle(triangle: Triangle): void {
    if (!this.bounds) this.bounds = new THREE.Box3();

    this.bounds.min.x = Math.min(
      this.bounds.min.x,
      triangle.a.x,
      triangle.b.x,
      triangle.c.x,
    );
    this.bounds.min.y = Math.min(
      this.bounds.min.y,
      triangle.a.y,
      triangle.b.y,
      triangle.c.y,
    );
    this.bounds.min.z = Math.min(
      this.bounds.min.z,
      triangle.a.z,
      triangle.b.z,
      triangle.c.z,
    );
    this.bounds.max.x = Math.max(
      this.bounds.max.x,
      triangle.a.x,
      triangle.b.x,
      triangle.c.x,
    );
    this.bounds.max.y = Math.max(
      this.bounds.max.y,
      triangle.a.y,
      triangle.b.y,
      triangle.c.y,
    );
    this.bounds.max.z = Math.max(
      this.bounds.max.z,
      triangle.a.z,
      triangle.b.z,
      triangle.c.z,
    );

    this.triangles.push(triangle);
  }

  private _calcBox(): void {
    this.box = this.bounds.clone();

    // offset small ammount to account for regular grid
    this.box.min.x -= 0.01;
    this.box.min.y -= 0.01;
    this.box.min.z -= 0.01;
  }

  private _split(level: any): void {
    if (!this.box) return;

    const subTrees = [];
    const halfsize = this._v2
      .copy(this.box.max)
      .sub(this.box.min)
      .multiplyScalar(0.5);
    let box;
    let v;
    let triangle;

    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 2; z++) {
          box = new THREE.Box3();
          v = this._v1.set(x, y, z);
          box.min.copy(this.box.min).add(v.multiply(halfsize));
          box.max.copy(box.min).add(halfsize);
          subTrees.push(new Octree(box));
        }
      }
    }

    while ((triangle = this.triangles.pop())) {
      for (let i = 0; i < subTrees.length; i++) {
        if (subTrees[i].box?.intersectsTriangle(triangle)) {
          subTrees[i].triangles.push(triangle);
        }
      }
    }

    for (let i = 0; i < subTrees.length; i++) {
      let len = subTrees[i].triangles.length;
      if (len > 8 && level < 16) subTrees[i]._split(level + 1);
      if (len != 0) this.subTrees.push(subTrees[i]);
    }
  }

  _build(): void {
    this._calcBox();
    this._split(0);
  }

  public getRayTriangles(ray: Ray, triangles: Triangle[]): Triangle[] {
    for (let i = 0; i < this.subTrees.length; i++) {
      let subTree = this.subTrees[i];
      if (!ray.intersectsBox(subTree.box)) continue;

      if (subTree.triangles.length > 0) {
        for (let j = 0; j < subTree.triangles.length; j++) {
          if (triangles.indexOf(subTree.triangles[j]) === -1)
            triangles.push(subTree.triangles[j]);
        }
      } else subTree.getRayTriangles(ray, triangles);
    }

    return triangles;
  }

  private _triangleCapsuleIntersect(
    capsule: Capsule,
    triangle: Triangle,
  ): TResult {
    let point1, point2, line1, line2;

    triangle.getPlane(this._plane);

    let d1 = this._plane.distanceToPoint(capsule.start) - capsule.radius;
    let d2 = this._plane.distanceToPoint(capsule.end) - capsule.radius;

    if ((d1 > 0 && d2 > 0) || (d1 < -capsule.radius && d2 < -capsule.radius))
      return false;

    let delta = Math.abs(d1 / (Math.abs(d1) + Math.abs(d2)));
    let intersectPoint = this._v1.copy(capsule.start).lerp(capsule.end, delta);

    if (triangle.containsPoint(intersectPoint)) {
      return {
        normal: this._plane.normal.clone(),
        point: intersectPoint.clone(),
        depth: Math.abs(Math.min(d1, d2)),
      };
    }

    let r2 = capsule.radius * capsule.radius;

    line1 = this._line1.set(capsule.start, capsule.end);

    const lines = [
      [triangle.a, triangle.b],
      [triangle.b, triangle.c],
      [triangle.c, triangle.a],
    ];

    for (let i = 0; i < lines.length; i++) {
      line2 = this._line2.set(lines[i][0], lines[i][1]);

      [point1, point2] = capsule.lineLineMinimumPoints(line1, line2);

      if (point1.distanceToSquared(point2) < r2) {
        return {
          normal: point1.clone().sub(point2).normalize(),
          point: point2.clone(),
          depth: capsule.radius - point1.distanceTo(point2),
        };
      }
    }

    return false;
  }

  private _triangleSphereIntersect(
    sphere: Sphere,
    triangle: Triangle,
  ): TResult {
    triangle.getPlane(this._plane);

    if (!sphere.intersectsPlane(this._plane)) return false;

    let depth = Math.abs(this._plane.distanceToSphere(sphere));
    let r2 = sphere.radius * sphere.radius - depth * depth;

    let plainPoint = this._plane.projectPoint(sphere.center, this._v1);

    if (triangle.containsPoint(sphere.center)) {
      return {
        normal: this._plane.normal.clone(),
        point: plainPoint.clone(),
        depth: Math.abs(this._plane.distanceToSphere(sphere)),
      };
    }

    let lines = [
      [triangle.a, triangle.b],
      [triangle.b, triangle.c],
      [triangle.c, triangle.a],
    ];

    for (let i = 0; i < lines.length; i++) {
      this._line1.set(lines[i][0], lines[i][1]);
      this._line1.closestPointToPoint(plainPoint, true, this._v2);

      const d = this._v2.distanceToSquared(sphere.center);
      if (d < r2) {
        return {
          normal: sphere.center.clone().sub(this._v2).normalize(),
          point: this._v2.clone(),
          depth: sphere.radius - Math.sqrt(d),
        };
      }
    }

    return false;
  }

  public getSphereTriangles(sphere: Sphere, triangles: Triangle[]): void {
    for (let i = 0; i < this.subTrees.length; i++) {
      const subTree = this.subTrees[i];

      if (!sphere.intersectsBox(subTree.box)) continue;

      if (subTree.triangles.length > 0) {
        for (let j = 0; j < subTree.triangles.length; j++) {
          if (triangles.indexOf(subTree.triangles[j]) === -1)
            triangles.push(subTree.triangles[j]);
        }
      } else subTree.getSphereTriangles(sphere, triangles);
    }
  }

  public getCapsuleTriangles(capsule: Capsule, triangles: Triangle[]): void {
    for (let i = 0; i < this.subTrees.length; i++) {
      const subTree = this.subTrees[i];

      if (!capsule.intersectsBox(subTree.box)) continue;
      if (subTree.triangles.length > 0) {
        for (let j = 0; j < subTree.triangles.length; j++) {
          if (triangles.indexOf(subTree.triangles[j]) === -1)
            triangles.push(subTree.triangles[j]);
        }
      } else subTree.getCapsuleTriangles(capsule, triangles);
    }
  }

  public sphereIntersect(sphere: Sphere): TResult {
    this._sphere.copy(sphere);

    const triangles: Triangle[] = [];
    let result: TResult;
    let hit = false;

    this.getSphereTriangles(sphere, triangles);

    for (let i = 0; i < triangles.length; i++) {
      if (
        (result = this._triangleSphereIntersect(this._sphere, triangles[i]))
      ) {
        hit = true;
        this._sphere.center.add(result.normal.multiplyScalar(result.depth));
      }
    }

    if (hit) {
      const collisionVector = this._sphere.center.clone().sub(sphere.center);
      const depth = collisionVector.length();

      return { normal: collisionVector.normalize(), depth: depth };
    }

    return false;
  }

  public capsuleIntersect(capsule: Capsule): TResult {
    this._capsule.copy(capsule);

    const triangles: Triangle[] = [];
    let result: any;
    let hit = false;

    this.getCapsuleTriangles(this._capsule, triangles);

    for (let i = 0; i < triangles.length; i++) {
      if (
        (result = this._triangleCapsuleIntersect(this._capsule, triangles[i]))
      ) {
        hit = true;

        this._capsule.translate(result.normal.multiplyScalar(result.depth));
      }
    }

    if (hit) {
      var collisionVector = this._capsule
        .getCenter(new THREE.Vector3())
        .sub(capsule.getCenter(this._v1));
      var depth = collisionVector.length();

      return { normal: collisionVector.normalize(), depth: depth };
    }

    return false;
  }

  public rayIntersect(ray: Ray): TResult {
    if (ray.direction.length() === 0) return false;

    const triangles: Triangle[] = [];
    let triangle: Triangle;
    let position: Vector3;
    let distance = 1e100;
    let result: Vector3 | null;

    this.getRayTriangles(ray, triangles);

    for (var i = 0; i < triangles.length; i++) {
      result = ray.intersectTriangle(
        triangles[i].a,
        triangles[i].b,
        triangles[i].c,
        true,
        this._v1,
      );

      if (result) {
        var newdistance = result.sub(ray.origin).length();

        if (distance > newdistance) {
          position = result.clone().add(ray.origin);
          distance = newdistance;
          triangle = triangles[i];
        }
      }
    }

    return distance < 1e100
      ? // @ts-ignore
        { distance: distance, triangle: triangle, position: position }
      : false;
  }

  fromGraphNode(group: Group): void {
    let is = false;
    group.traverse((obj: any) => {
      if (obj.type === 'Mesh') {
        obj.updateMatrix();
        obj.updateWorldMatrix();

        let geometry: any;
        let isTemp = false;

        if (obj.geometry.index) {
          isTemp = true;
          geometry = obj.geometry.clone().toNonIndexed();
        } else geometry = obj.geometry;

        var positions = geometry.attributes.position.array;
        var transform = obj.matrixWorld;

        for (var i = 0; i < positions.length; i += 9) {
          var v1 = new THREE.Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2],
          );
          var v2 = new THREE.Vector3(
            positions[i + 3],
            positions[i + 4],
            positions[i + 5],
          );
          var v3 = new THREE.Vector3(
            positions[i + 6],
            positions[i + 7],
            positions[i + 8],
          );

          v1.applyMatrix4(transform);
          v2.applyMatrix4(transform);
          v3.applyMatrix4(transform);

          if (
            !isNaN(v1.x) &&
            !isNaN(v1.y) &&
            !isNaN(v1.z) &&
            !isNaN(v2.x) &&
            !isNaN(v2.y) &&
            !isNaN(v2.z) &&
            !isNaN(v3.x) &&
            !isNaN(v3.y) &&
            !isNaN(v3.z)
          ) {
            is = true;
            this._addTriangle(new Triangle(v1, v2, v3));
          }
        }

        if (isTemp) geometry.dispose();
      }
    });

    if (is) this._build();
  }
}
