import { useState } from "react";
import { RoundedBox, PointerLockControls } from "@react-three/drei";
import { Bobbing } from "./bobbing";
import { Camera } from "./camera";
import { KbMovable } from "./kbmovable";
import { Skybox } from "./skybox";
import { Box } from "./box";

export const Scene = () => {
  const [hover, setHover] = useState(false);

  return (
    <>
      <Camera near={0.01} far={256} position={[0, 0, 0]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 2, 5]} intensity={1.2} />
      <Bobbing>
      <KbMovable>
      {/*<RoundedBox
        position={[0, 0, -2]}
        rotation={[0.5, -0.95, -1.64]}
        radius={0.05}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
        smoothness={4}
      >
        <meshPhongMaterial color={hover ? "orange" : "limegreen"} />
      </RoundedBox>*/}
      <Box position={[0, 0, -2]} color="plum" collide />
      <Box position={[2, 0, -2]} scale={[0.4, 1, 3]} color="plum" collide onCollide={() => console.log("box 2")} />

      </KbMovable>
      </Bobbing>
      <Skybox />
      <PointerLockControls selector="canvas" />
    </>
  );
};
