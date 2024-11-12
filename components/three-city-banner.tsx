"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CityBannerProps {
  color?: string;
  height?: number;
}

// Add type for objects with geometry and material
interface DisposableMesh extends THREE.Object3D {
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material | THREE.Material[];
}

export function CityBanner({ color = '#F02050', height = 200 }: CityBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cityRef = useRef<THREE.Object3D>();
  const smokeRef = useRef<THREE.Object3D>();
  const townRef = useRef<THREE.Object3D>();
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const animationFrameRef = useRef<number | null>(null);

  const mathRandom = useCallback((num = 8) => {
    return -Math.random() * num + Math.random() * num;
  }, []);

  const createBuilding = useCallback(() => {
    const segments = 2;
    const geometry = new THREE.BoxGeometry(1, 0, 0, segments, segments, segments);
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const wireMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide,
    });

    const cube = new THREE.Mesh(geometry, material);
    const wire = new THREE.Mesh(geometry, wireMaterial);
    cube.add(wire);
    
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    const cubeWidth = 0.9;
    cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
    cube.scale.y = 0.1 + Math.abs(mathRandom(8));
    
    cube.position.x = Math.round(mathRandom());
    cube.position.z = Math.round(mathRandom());

    return cube;
  }, [mathRandom]);

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(color);
    sceneRef.current.fog = new THREE.Fog(color, 10, 16);

    // Objects setup
    cityRef.current = new THREE.Object3D();
    smokeRef.current = new THREE.Object3D();
    townRef.current = new THREE.Object3D();

    // Camera setup
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    cameraRef.current = new THREE.PerspectiveCamera(20, aspect, 1, 500);
    cameraRef.current.position.set(0, 2, 14);

    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (window.innerWidth > 800) {
      rendererRef.current.shadowMap.enabled = true;
      rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
    const lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
    lightFront.position.set(5, 5, 5);
    lightFront.castShadow = true;
    
    // Create city elements
    for (let i = 0; i < 100; i++) {
      const building = createBuilding();
      townRef.current?.add(building);
    }

    // Add everything to the scene
    sceneRef.current.add(cityRef.current);
    cityRef.current.add(smokeRef.current);
    cityRef.current.add(townRef.current);
    cityRef.current.add(ambientLight);
    cityRef.current.add(lightFront);

  }, [color, createBuilding]);

  useEffect(() => {
    initScene();
    const container = containerRef.current;
    // Store animation frame ref in a variable that can be used in cleanup
    let frameId: number | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Cancel animation frame using local variable
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      // Dispose renderer
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      // Helper function to dispose meshes
      const disposeMeshes = (object: THREE.Object3D) => {
        object.children.forEach((child) => {
          const mesh = child as DisposableMesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => mat.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        });
      };

      // Dispose all meshes
      if (cityRef.current) {
        disposeMeshes(cityRef.current);
      }
      if (smokeRef.current) {
        disposeMeshes(smokeRef.current);
      }
      if (townRef.current) {
        disposeMeshes(townRef.current);
      }
    };
  }, [initScene]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: `${height}px`,
        overflow: 'hidden'
      }} 
    />
  );
} 