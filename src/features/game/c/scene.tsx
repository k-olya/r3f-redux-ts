import { useState } from "react";
import { RoundedBox, PointerLockControls, useCursor } from "@react-three/drei";
import { Bobbing } from "./bobbing";
import { Camera } from "./camera";
import { KbMovable } from "./kbmovable";
import { Skybox } from "./skybox";
import { Box } from "./box";

export const Scene = () => {
  const [hover, setHover] = useState(false);
  useCursor(hover);

  return (
    <>
      <Camera near={0.01} far={256} position={[0, 0, 0]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 2, 5]} intensity={1.2} />
      <RoundedBox
        position={[0, 0, -2]}
        rotation={[0.5, -0.95, -1.64]}
        radius={0.05}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
        smoothness={4}
      >
        <meshPhongMaterial color={hover ? "orange" : "limegreen"} />
      </RoundedBox>
    </>
  );
};
