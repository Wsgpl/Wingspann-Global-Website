import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Model3DProps {
  title?: string;
  autoRotate?: boolean;
  stlData: string; // base64 encoded STL
}

function parseSTL(arrayBuffer: ArrayBuffer) {
  const view = new Uint8Array(arrayBuffer);
  const isASCII = isASCIISTL(view);

  if (isASCII) {
    return parseASCIISTL(new TextDecoder().decode(arrayBuffer));
  } else {
    return parseBinarySTL(view);
  }
}

function isASCIISTL(view: Uint8Array): boolean {
  const header = new TextDecoder().decode(view.slice(0, 5));
  return header === 'solid';
}

function parseBinarySTL(view: Uint8Array) {
  const triangles = new DataView(view.buffer).getUint32(80, true);
  const faces = [];

  let index = 84;
  for (let i = 0; i < triangles; i++) {
    const nx = new DataView(view.buffer).getFloat32(index, true);
    const ny = new DataView(view.buffer).getFloat32(index + 4, true);
    const nz = new DataView(view.buffer).getFloat32(index + 8, true);
    index += 12;

    const vertices = [];
    for (let j = 0; j < 3; j++) {
      const x = new DataView(view.buffer).getFloat32(index, true);
      const y = new DataView(view.buffer).getFloat32(index + 4, true);
      const z = new DataView(view.buffer).getFloat32(index + 8, true);
      vertices.push([x, y, z]);
      index += 12;
    }

    faces.push({ normal: [nx, ny, nz], vertices });
    index += 2;
  }

  return faces;
}

function parseASCIISTL(str: string) {
  const faces = [];
  const patternFace = /facet([\s\S]*?)endfacet/g;
  const patternNormal = /normal\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/;
  const patternVertex = /vertex\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g;

  let match;
  while ((match = patternFace.exec(str)) !== null) {
    const facetStr = match[1];
    const normalMatch = patternNormal.exec(facetStr);
    const normal = normalMatch
      ? [parseFloat(normalMatch[1]), parseFloat(normalMatch[3]), parseFloat(normalMatch[5])]
      : [0, 0, 1];

    const vertices = [];
    let vertexMatch;
    while ((vertexMatch = patternVertex.exec(facetStr)) !== null) {
      vertices.push([parseFloat(vertexMatch[1]), parseFloat(vertexMatch[3]), parseFloat(vertexMatch[5])]);
    }

    if (vertices.length === 3) {
      faces.push({ normal, vertices });
    }
  }

  return faces;
}

export default function Model3D({ autoRotate = true, stlData }: Model3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !stlData) return;

    try {
      // Decode base64
      const binaryString = atob(stlData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Parse STL
      const faces = parseSTL(bytes.buffer);

      // Create geometry
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const normals: number[] = [];

      faces.forEach((face) => {
        const n = face.normal;
        face.vertices.forEach((v) => {
          vertices.push(v[0], v[1], v[2]);
          normals.push(n[0], n[1], n[2]);
        });
      });

      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));

      // Center and scale
      geometry.computeBoundingBox();
      if (geometry.boundingBox) {
        const size = geometry.boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 40 / maxDim;
        geometry.scale(scale, scale, scale);
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -center.y, -center.z);
      }

      // Setup scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);

      const camera = new THREE.PerspectiveCamera(
        50,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        10000
      );
      camera.position.z = 100;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 20, 20);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.5);
      pointLight.position.set(-10, -10, 20);
      scene.add(pointLight);

      // Material and mesh
      const material = new THREE.MeshPhongMaterial({
        color: 0xdc2626,
        shininess: 100,
        specular: 0x333333,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      meshRef.current = mesh;
      sceneRef.current = scene;
      rendererRef.current = renderer;

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        if (autoRotate && meshRef.current) {
          meshRef.current.rotation.x += 0.003;
          meshRef.current.rotation.y += 0.006;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (containerRef.current && renderer && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    } catch (error) {
      console.error('Error loading 3D model:', error);
    }
  }, [stlData, autoRotate]);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full bg-[#0a0a0a]" />
    </div>
  );
}
