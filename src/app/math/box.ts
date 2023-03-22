import { Point } from "app/math/point"

export interface Box {
position: Point;
rotation: Point;
scale: Point;
id?: string;
}

export function distanceToBoxByCoordinates(point: Point, box: Box): Point {
  // Get the position, rotation, and scale of the box
  const [boxX, boxY, boxZ] = box.position;
  const [boxRotationX, boxRotationY, boxRotationZ] = box.rotation;
  const [boxScaleX, boxScaleY, boxScaleZ] = box.scale;

  // Convert the point to the box's local coordinate system
  const localPointX = (point[0] - boxX) / boxScaleX;
  const localPointY = (point[1] - boxY) / boxScaleY;
  const localPointZ = (point[2] - boxZ) / boxScaleZ;

  // Rotate the point around the box's origin
  const cosX = Math.cos(boxRotationX);
  const sinX = Math.sin(boxRotationX);
  const cosY = Math.cos(boxRotationY);
  const sinY = Math.sin(boxRotationY);
  const cosZ = Math.cos(boxRotationZ);
  const sinZ = Math.sin(boxRotationZ);
  const rotatedPointX = localPointX * (cosY * cosZ) + localPointY * (cosY * sinZ) - localPointZ * sinY;
  const rotatedPointY = localPointX * (sinX * sinY * cosZ - cosX * sinZ) + localPointY * (sinX * sinY * sinZ + cosX * cosZ) + localPointZ * sinX * cosY;
  const rotatedPointZ = localPointX * (cosX * sinY * cosZ + sinX * sinZ) + localPointY * (cosX * sinY * sinZ - sinX * cosZ) + localPointZ * cosX * cosY;

  // Calculate the distance between the rotated point and the box
  const dx = Math.max(Math.abs(rotatedPointX) - 0.5, 0);
  const dy = Math.max(Math.abs(rotatedPointY) - 0.5, 0);
  const dz = Math.max(Math.abs(rotatedPointZ) - 0.5, 0);
  return [ dx, dy, dz ];
}

export function distanceToBox(point: Point, box: Box): number {
  const [ dx, dy, dz ] = distanceToBoxByCoordinates(point, box);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function isBoxNearPoint(boxes: Box[], point: Point, distance: number): boolean {
  for (const box of boxes) {
    const dist = distanceToBox(point, box);
    if (dist <= distance) {
      return true;
    }
  }
  return false;
}


/*
export interface Box { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }

export function isPointWithinDistanceFromBoxes(boxes: Box[], point: [number, number, number], distance: number): boolean {
  for (const box of boxes) {
    const localPoint = subtract(point, box.position);
    const localPointRotated = rotate(localPoint, box.rotation);
    const closestPoint = [
      clamp(localPointRotated[0], -box.scale[0], box.scale[0]),
      clamp(localPointRotated[1], -box.scale[1], box.scale[1]),
      clamp(localPointRotated[2], -box.scale[2], box.scale[2]),
    ];
    const d2 = distanceSquared(localPointRotated, closestPoint);
    if (d2 <= distance * distance) {
      return true;
    }
  }
  return false;
}


/*export function isPointWithinDistanceFromBoxes(boxes: Box[], point: [number, number, number], distance: number): boolean {
  for (const box of boxes) {
    const localPoint = subtract(point, box.position);
    const localPointRotated = rotate(localPoint, box.rotation);
    const closestPoint = [
      clamp(localPointRotated[0], -box.scale[0], box.scale[0]),
      clamp(localPointRotated[1], -box.scale[1], box.scale[1]),
      clamp(localPointRotated[2], -box.scale[2], box.scale[2]),
    ];
    const d2 = distanceSquared(localPointRotated, closestPoint);
    if (d2 < distance * distance) {
      return true;
    }
  }

  // If point is outside all boxes, return false
  for (const box of boxes) {
    const localPoint = subtract(point, box.position);
    const localPointRotated = rotate(localPoint, box.rotation);
    const closestPoint = [
      clamp(localPointRotated[0], -box.scale[0], box.scale[0]),
      clamp(localPointRotated[1], -box.scale[1], box.scale[1]),
      clamp(localPointRotated[2], -box.scale[2], box.scale[2]),
    ];
    const d2 = distanceSquared(localPointRotated, closestPoint);
    const distanceFromBox = Math.sqrt(d2);
    if (distanceFromBox <= distance) {
      // The point is within the given distance of at least one box
      return true;
    }
  }

  // Point is outside all boxes and further than the given distance
  return false;
}*/

function rotate(point: [number, number, number], rotation: [number, number, number]): [number, number, number] {
  const [x, y, z] = point;
  const [rx, ry, rz] = rotation;
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const rotatedX = x * cosY * cosZ + y * (cosX * sinZ + sinX * sinY * cosZ) + z * (sinX * sinZ - cosX * sinY * cosZ);
  const rotatedY = -x * cosY * sinZ + y * (cosX * cosZ - sinX * sinY * sinZ) + z * (sinX * cosZ + cosX * sinY * sinZ);
  const rotatedZ = x * sinY + y * -sinX * cosY + z * cosX * cosY;
  return [rotatedX, rotatedY, rotatedZ];
}

/*
export function isPointWithinDistanceFromBoxes(boxes: Box[], point: [number, number, number], distance: number): boolean {
  for (const box of boxes) {
    const [bx, by, bz] = box.position;
    const [rx, ry, rz] = box.rotation;
    const [sx, sy, sz] = box.scale;
    
    // Compute the center of the box in world space.
    const center = [
      bx + sx / 2,
      by + sy / 2,
      bz + sz / 2,
    ];

    // Convert the point to the local space of the box.
    const localPoint = [
      (point[0] - center[0]) / sx,
      (point[1] - center[1]) / sy,
      (point[2] - center[2]) / sz,
    ];

    // Apply the box's rotation to the local point.
    const [sinX, cosX] = [Math.sin(rx), Math.cos(rx)];
    const [sinY, cosY] = [Math.sin(ry), Math.cos(ry)];
    const [sinZ, cosZ] = [Math.sin(rz), Math.cos(rz)];

    const rotX = [
      [1, 0, 0],
      [0, cosX, -sinX],
      [0, sinX, cosX],
    ];

    const rotY = [
      [cosY, 0, sinY],
      [0, 1, 0],
      [-sinY, 0, cosY],
    ];

    const rotZ = [
      [cosZ, -sinZ, 0],
      [sinZ, cosZ, 0],
      [0, 0, 1],
    ];

    const localPointRotated = dot(rotX, dot(rotY, dot(rotZ, localPoint)));

    // Compute the distance from the point to the closest point on the box.
    const closestPoint = [
      clamp(localPointRotated[0], -0.5, 0.5) * sx,
      clamp(localPointRotated[1], -0.5, 0.5) * sy,
      clamp(localPointRotated[2], -0.5, 0.5) * sz,
    ];

    const distanceSq = distanceSquared(point, add(center, closestPoint));
    if (distanceSq <= distance * distance) {
      return true;
    }
  }

  return false;
}
*/

function dot(a: number[][], b: number[]): number[] {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    let sum = 0;
    for (let j = 0; j < a[i].length; j++) {
      sum += a[i][j] * b[j];
    }
    result.push(sum);
  }
  return result;
}

function add(a: number[], b: number[]): number[] {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function distanceSquared(a: number[], b: number[]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}
