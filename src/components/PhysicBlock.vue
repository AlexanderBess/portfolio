<template>
  <section id="home">
    <!-- Decorative physics scene: hidden from screen readers, the real
         h1/title lives in the hero bento card -->
    <div ref="sceneContainer" class="physics-scene" aria-hidden="true">
      <div
          v-for="(item, index) in items"
          :key="index"
          :ref="(el) => { if (el) itemRefs[index] = el as HTMLElement }"
          class="physics-body"
          :class="item.class"
          :style="getStyles(index)"
      >
        <span v-if="item.hasDot" class="dot"></span>
        <span class="text">{{ item.text }}</span>
        <span v-if="item.icon" class="icon">{{ item.icon }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, nextTick } from 'vue';
import Matter from 'matter-js';

/**
 * REPOSNSIVE LAYOUT CONFIGURATION
 * Defines initial splash positions for physical bodies based on viewport width.
 */
const getResponsivePositions = (width: number) => {
  const isMobile = width < 768;
  const config = isMobile
      ? { frontend: 0.2, dev: 0.5, vue: 0.7, sass: 0.8, star: 0.9, yBase: 60 }
      : { frontend: 0.2, dev: 0.4, vue: 0.6, sass: 0.75, star: 0.9, yBase: 80 };

  return [
    { text: 'FRONTEND', class: 'pill', x: width * config.frontend, y: config.yBase },
    { text: 'DEVELOPER', class: 'pill', x: width * config.dev, y: config.yBase + 20 },
    { text: 'ENGINEER', class: 'pill', x: width * config.dev, y: config.yBase + 20 },
    { text: 'VUE', class: 'pill', x: width * config.vue, y: config.yBase + 40 },
    { text: 'SASS', class: 'pill', hasDot: true, x: width * config.sass, y: config.yBase },
    { text: '★', class: 'circle', icon: '★', x: width * config.star, y: config.yBase + 10 }
  ];
};

// --- STATE MANAGEMENT ---
const items = reactive(getResponsivePositions(window.innerWidth));
const sceneContainer = ref<HTMLElement | null>(null);
const itemRefs = ref<(HTMLElement)[]>([]);

/** * MIRROR STATE
 * Reactive bridge between Matter.js calculations and Vue's DOM updates.
 * This object holds the calculated physics data to be applied via CSS.
 */
const bodiesCoords = reactive(
    items.map(() => ({ x: 0, y: 0, angle: 0 }))
);

let engine: Matter.Engine,
    runner: Matter.Runner,
    bodies: Matter.Body[] = [];
let resizeObserver: ResizeObserver | null = null;
let walls: Record<string, Matter.Body | null> = { ground: null, ceiling: null, leftWall: null, rightWall: null };

/**
 * DOM-PHYSICS SYNCHRONIZATION
 * Maps physics engine coordinates to CSS Transform properties.
 * translate(-50%, -50%) ensures the Matter.js center of mass aligns with the HTML element center.
 */
const getStyles = (index: number) => {
  const coord = bodiesCoords[index];
  if (!coord) return {};
  return {
    transform: `translate3d(${coord.x}px, ${coord.y}px, 0) translate(-50%, -50%) rotate(${coord.angle}rad)`
  };
};

onMounted(async () => {
  // Ensure DOM elements are rendered to calculate accurate bounding boxes
  await nextTick();

  const container = sceneContainer.value!;
  const { clientWidth: width, clientHeight: height } = container;

  // --- ENGINE SETUP ---
  engine = Matter.Engine.create({
    gravity: { x: 0, y: 1.2 } // Slightly higher gravity for "snappy" settling effect
  });

  /**
   * BOUNDARY MANAGEMENT
   * Reconstructs static walls on resize to prevent elements from falling out of frame.
   */
  const updateWalls = (w: number, h: number) => {
    const wallThickness = 100;
    const wallOptions = { isStatic: true };

    // Cleanup previous boundaries from the world
    Object.values(walls).forEach(wall => {
      if (wall) Matter.Composite.remove(engine.world, wall);
    });

    walls.ground = Matter.Bodies.rectangle(w / 2, h + wallThickness / 2, w, wallThickness, wallOptions);
    walls.ceiling = Matter.Bodies.rectangle(w / 2, -wallThickness / 2, w, wallThickness, wallOptions);
    walls.leftWall = Matter.Bodies.rectangle(-wallThickness / 2, h / 2, wallThickness, h, wallOptions);
    walls.rightWall = Matter.Bodies.rectangle(w + wallThickness / 2, h / 2, wallThickness, h, wallOptions);

    Matter.Composite.add(engine.world, Object.values(walls) as Matter.Body[]);
  };

  /**
   * DYNAMIC RE-POSITIONING
   * Teleports physical bodies to their responsive starting points without destroying the engine.
   */
  const updateItemPositions = (w: number) => {
    const newPos = getResponsivePositions(w);
    items.splice(0, items.length, ...newPos);

    bodies.forEach((body, i) => {
      if (newPos[i]) {
        Matter.Body.setPosition(body, { x: newPos[i].x, y: newPos[i].y });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
      }
    });
  };

  // Initial boundary setup
  updateWalls(width, height);

  /**
   * BODY GENERATION
   * Converts HTML DOM dimensions into physical Matter.js entities.
   * We use getBoundingClientRect to ensure the physics engine matches the visual scale exactly.
   */
  bodies = items.map((item, index) => {
    const el = itemRefs.value[index];
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const options = { restitution: 0.3, friction: 0.7, density: 0.002 };

    return item.class === 'circle'
        ? Matter.Bodies.circle(item.x, item.y, rect.width / 2, options)
        : Matter.Bodies.rectangle(item.x, item.y, rect.width, rect.height, options);
  }).filter(Boolean) as Matter.Body[];

  Matter.Composite.add(engine.world, bodies);

  // --- INTERACTION SETUP ---
  const mouse = Matter.Mouse.create(container);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.1, render: { visible: false } }
  });

  Matter.Composite.add(engine.world, mouseConstraint);

  /**
   * SCROLL UX OVERRIDE
   * Matter.js hijacks all input by default.
   * We manually restore native scrolling for better User Experience.
   */

  // A. Desktop: Restore mouse wheel for page scrolling
  if (mouse.element) {
    mouse.element.removeEventListener("wheel", (mouseConstraint.mouse as any).mousewheel);
    mouse.element.removeEventListener("mousewheel", (mouseConstraint.mouse as any).mousewheel);
  }

  // B. Mobile: Context-aware touch behavior
  container.addEventListener('touchstart', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };

    // Disable scroll ONLY if the user is grabbing a physical object
    const isGrabbingBody = Matter.Query.point(bodies, touch).length > 0;
    container.style.touchAction = isGrabbingBody ? 'none' : 'pan-y';
  }, { passive: false });

  /**
   * TICK EVENT
   * The core loop: transfers Matter.js calculations back into Vue's reactive state.
   */
  Matter.Events.on(engine, 'afterUpdate', () => {
    bodies.forEach((body, i) => {
      bodiesCoords[i] = { x: body.position.x, y: body.position.y, angle: body.angle };
    });
  });

  // --- LIFECYCLE START ---
  runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  resizeObserver = new ResizeObserver(() => {
    updateWalls(container.clientWidth, container.clientHeight);
    updateItemPositions(container.clientWidth);
  });
  resizeObserver.observe(container);
});

onUnmounted(() => {
  Matter.Runner.stop(runner);
  Matter.Engine.clear(engine);
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.physics-scene {
  position: relative;
  width: 100%;
  height: 40vh; /* Увеличил высоту контейнера */
  /* Transparent: the page-wide InteractiveGridBg canvas shows through */
  background-color: transparent;
  overflow: hidden;
  user-select: none;
  transition: var(--theme-transition);
}

/* Стили для плашек — теперь это чистый CSS! */
.physics-body {
  position: absolute;
  /* Центрируем элемент относительно точки координат Matter.js */
  left: 0;
  top: 0;
  will-change: transform;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  cursor: grab;
}

.physics-body:active {
  cursor: grabbing;
}

/* Стилизация прямоугольных плашек */
.pill {
  padding: 10px 20px;
  border: 1px solid var(--text-primary);
  /* Matches the canvas background so pills look "punched out" of the grid */
  background-color: var(--canvas-bg);
  border-radius: 12px;
  color: var(--text-primary);
  font-family: 'Space Mono', monospace;
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

/* Стилизация круглых иконок */
.circle {
  width: 80px;
  height: 80px;
  background-color: var(--text-primary);
  border-radius: 50%;
  color: var(--canvas-bg);
  font-size: 24px;
  font-weight: bold;
}

/* Точка внутри плашки XIX */
.dot {
  width: 8px;
  height: 8px;
  background-color: var(--text-primary);
  border-radius: 50%;
}

@media (max-width: 768px) {
  .pill {
    font-size: 14px;
  }

  /* Стилизация круглых иконок */
  .circle {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  /* Точка внутри плашки XIX */
  .dot {
    width: 8px;
    height: 8px;
  }
}
</style>