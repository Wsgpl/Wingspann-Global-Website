import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface STLViewerProps {
  stlBase64: string;
  autoRotate?: boolean;
}

export default function STLViewer({ stlBase64, autoRotate = true }: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 20);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, -10, 20);
    scene.add(pointLight);

    // Parse STL
    const binaryData = atob(stlBase64);
    const view = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      view[i] = binaryData.charCodeAt(i);
    }

    // Skip 80-byte header
    const dv = new DataView(view.buffer, 84);
    const triangles = dv.getUint32(0, true);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const normals = [];

    let offset = 4;
    for (let i = 0; i < triangles; i++) {
      const nx = dv.getFloat32(offset, true);
      const ny = dv.getFloat32(offset + 4, true);
      const nz = dv.getFloat32(offset + 8, true);
      offset += 12;

      for (let j = 0; j < 3; j++) {
        vertices.push(
          dv.getFloat32(offset, true),
          dv.getFloat32(offset + 4, true),
          dv.getFloat32(offset + 8, true)
        );
        normals.push(nx, ny, nz);
        offset += 12;
      }

      offset += 2; // attribute byte count
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
    geometry.computeBoundingBox();

    // Center and scale model
    if (geometry.boundingBox) {
      const size = geometry.boundingBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 40 / maxDim;
      geometry.scale(scale, scale, scale);

      const center = geometry.boundingBox.getCenter(new THREE.Vector3());
      geometry.translate(-center.x, -center.y, -center.z);
    }

    const material = new THREE.MeshPhongMaterial({
      color: 0xdc2626,
      shininess: 100,
      specular: 0x111111,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;
    sceneRef.current = scene;
    rendererRef.current = renderer;

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
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [stlBase64, autoRotate]);

  return <div ref={containerRef} className="w-full h-full bg-[#0a0a0a]" />;
}
