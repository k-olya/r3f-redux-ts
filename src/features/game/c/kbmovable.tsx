import { useFrame } from "@react-three/fiber";
import { FC, ReactNode, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "app/store";
import { Group, Vector3 } from "three";
import { distanceToBoxByCoordinates, distanceToBox } from "app/math/box";
import { Point } from "app/math/point";
import { retrieveFunction } from "app/store-function";

import { PLAYER_RADIUS } from "config";

interface Props {
  children?: ReactNode;
  speed?: number;
  fly?: boolean;
}

const direction = new Vector3(0, 0, 0);
const up = new Vector3(0, 1, 0);
const r = new Vector3(0, 0, 0);
const meta = new Vector3(0, 0, 0);
const playerPosition = new Vector3(0, 0, 0);
const collisionNormal = new Vector3(0, 0, 0);

export const KbMovable: FC<Props> = ({ children, speed = 1, fly }) => {
  const { kb, collisions: { boxes } } = useSelector(s => s);
  const dispatch = useDispatch();
  const ref = useRef<Group>(null);
  const scaleRef = useRef<Group>(null);
  const axisRef = useRef<Group>(null);
  const v = useRef(1);

  useFrame((three, delta) => {
    if (ref.current) {
      if ((kb.ShiftLeft && !fly) || (fly && kb.ShiftLeft && kb.Space)) {
        v.current = 6 * speed;
      } else {
        v.current = 2 * speed;
      }

      three.camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      meta.copy(direction);
      r.set(0, 0, 0);
      if (kb["KeyW"]) r.add(direction.multiplyScalar(-delta * v.current));
      direction.copy(meta);
      if (kb["KeyS"]) r.add(direction.multiplyScalar(delta * v.current));
      direction.copy(meta);
      if (kb["KeyA"])
        r.add(
          direction
            .cross(up)
            .normalize()
            .multiplyScalar(delta * v.current)
        );
      direction.copy(meta);
      if (kb["KeyD"])
        r.add(
          direction
            .cross(up)
            .normalize()
            .multiplyScalar(-delta * v.current)
        );
      direction.copy(meta);
      if (fly) {
      if (kb["Space"]) r.y -= delta * v.current;
      if (kb["ShiftLeft"])
        r.y += delta * v.current;
      }

      playerPosition.copy(ref.current.position).add(r).multiplyScalar(-1);
      const playerXYZ: Point = [playerPosition.x, playerPosition.y, playerPosition.z];
      let canMove = true;
      for (const box of boxes) {
        if (distanceToBox(playerXYZ, box) <= PLAYER_RADIUS) {
          const normalXYZ = distanceToBoxByCoordinates(playerXYZ, box);
          collisionNormal.set(normalXYZ[0], normalXYZ[1], normalXYZ[2]).normalize();
          r.projectOnPlane(collisionNormal);
          box.onCollide && retrieveFunction(box.onCollide)();
        }
      }

      if (canMove) {
        ref.current.position.add(r);
      }
    }
  });

  return (
      <group ref={ref}>
        {children}
      </group>
  );
};
