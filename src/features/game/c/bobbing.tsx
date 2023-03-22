import { FC, ReactNode, useRef, useEffect, useState } from "react";
import { useTransition } from "app/transition";
import { useInterval } from "app/interval";
import { useSelector } from "app/store";
import { irand, lerp } from "app/math";
import { Group } from "three";

interface Props {
  children?: ReactNode;
}

export const Bobbing: FC<Props> = ({ children }) => {
  const { kb } = useSelector((s) => s);
  const active = kb.KeyW || kb.KeyA || kb.KeyS || kb.KeyD;
  const ref = useRef<Group>(null);
  const [side, setSide] = useState(0);

  useTransition(side, 500, (x, three, delta) => {
    if (ref.current) {
      ref.current.position.y = 0.05 * x;
    }
  });

  useInterval(() => {
    setSide((side) => side * -1);
  }, 500);

  useEffect(() => {
    setSide(active ? lerp(-1, 1, irand(2)) : 0);
  }, [active]);

  return <group ref={ref}>{children}</group>;
};
