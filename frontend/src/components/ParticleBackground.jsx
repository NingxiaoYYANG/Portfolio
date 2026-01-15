import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Particles({ count = 2000 }) {
  const mesh = useRef();
  const light = useRef();

  // Deterministic pseudo-random generator (avoids Math.random during render)
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // xorshift32
      let seed = (i + 1) * 1337;
      const rnd = () => {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return (seed >>> 0) / 0xffffffff;
      };
      const time = rnd() * 100;
      const factor = 20 + rnd() * 100;
      const speed = 0.01 + rnd() / 200;
      const x = rnd() * 2000 - 1000;
      const y = rnd() * 2000 - 1000;
      const z = rnd() * 2000 - 1000;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { factor, speed, x, y, z } = particle;
      const t = (particle.time += speed);

      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * factor) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * factor) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * factor) * factor) / 10
      );

      const s = Math.cos(t);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#0ea5e9" />
      </instancedMesh>
    </>
  );
}
