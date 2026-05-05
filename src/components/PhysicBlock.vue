<template>
  <div ref="sceneContainer" class="physics-scene">
    <div
        v-for="(item, index) in items"
        :key="index"
        :ref="el => { if (el) itemRefs[index] = el }"
        class="physics-body"
        :class="item.class"
        :style="getStyles(index)"
    >
      <span v-if="item.hasDot" class="dot"></span>
      <span class="text">{{ item.text }}</span>
      <span v-if="item.icon" class="icon">{{ item.icon }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, nextTick } from 'vue';
import Matter from 'matter-js';

// 1. Данные элементов
const items = reactive([
  { text: 'FRONTEND', class: 'pill', x: 200, y: 100 },
  { text: 'DEVELOPER', class: 'pill', x: 400, y: 120 },
  { text: 'ALEX', class: 'pill', x: 600, y: 150 },
  { text: 'XXVII', class: 'pill', hasDot: true, x: 750, y: 100 },
  { text: '★', class: 'circle', icon: '★', x: 900, y: 110 }
]);

const sceneContainer = ref(null);
const itemRefs = ref([]);

// Храним динамические координаты для рендеринга во Vue
const bodiesCoords = reactive(
    items.map(() => ({ x: 0, y: 0, angle: 0 }))
);

let engine, runner, bodies = [];

// Получение стилей для синхронизации HTML с физическим телом
const getStyles = (index) => {
  const coord = bodiesCoords[index];
  if (!coord) return {};
  return {
    transform: `translate3d(${coord.x}px, ${coord.y}px, 0) rotate(${coord.angle}rad)`
  };
};

onMounted(async () => {
  await nextTick(); // Ждем, пока Vue отрендерит элементы в DOM для замера их размеров

  const container = sceneContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // 1. Инициализация физического движка
  engine = Matter.Engine.create({
    gravity: { x: 0, y: 0.8 } // Комфортная гравитация (0 — невесомость, 1 — стандартная)
  });
  const world = engine.world;

  // 2. Создание невидимых физических границ (стен)
  const wallThickness = 100;
  const wallOptions = { isStatic: true };

  const ground = Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, wallOptions);
  const ceiling = Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, wallOptions);
  const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, wallOptions);
  const rightWall = Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, wallOptions);

  Matter.Composite.add(world, [ground, ceiling, leftWall, rightWall]);

  // 3. Создание физических тел на основе реальных размеров DOM-элементов
  bodies = items.map((item, index) => {
    const el = itemRefs.value[index];
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    let body;
    if (item.class === 'circle') {
      body = Matter.Bodies.circle(item.x, item.y, w / 2, {
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.01
      });
    } else {
      body = Matter.Bodies.rectangle(item.x, item.y, w, h, {
        restitution: 0.5,
        friction: 0.1,
        frictionAir: 0.01,
        chamfer: { radius: 10 } // Скругление физической модели под стать CSS-рамке
      });
    }

    return body;
  });

  Matter.Composite.add(world, bodies);

  // 4. Настройка управления (мышь и тачбар)
  const mouse = Matter.Mouse.create(container);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
      render: { visible: false }
    }
  });

  Matter.Composite.add(world, mouseConstraint);

  // ==========================================
  // НАСТРОЙКА СВОБОДНОГО СКРОЛЛА СТРАНИЦЫ
  // ==========================================

  // А. Разрешаем прокрутку колесиком мыши на десктопе
  if (mouse.element) {
    mouse.element.removeEventListener("wheel", mouseConstraint.mouse.mousewheel);
    mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
  }

  // Б. Базовая разблокировка тач-активности в контейнере
  container.style.touchAction = 'manipulation';

  // В. Умный мобильный скролл при перетаскивании плашек
  container.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];

    // Получаем координаты касания относительно контейнера физики
    const rect = container.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    const touchPosition = { x: touchX, y: touchY };

    // Проверяем, попал ли палец на какую-нибудь плашку
    const clickedBody = Matter.Query.point(bodies, touchPosition)[0];

    if (clickedBody) {
      // Если схватили плашку — отключаем скролл страницы, чтобы её тащить
      container.style.touchAction = 'none';
    } else {
      // Если коснулись пустого места — разрешаем вертикальный скролл страницы пальцем
      container.style.touchAction = 'pan-y';
    }
  }, { passive: false });

  container.addEventListener('touchend', () => {
    // Возвращаем дефолтный режим после того, как палец убрали
    container.style.touchAction = 'manipulation';
  });

  // ==========================================

  // 5. Синхронизация физики с Vue-состоянием на каждом кадре
  Matter.Events.on(engine, 'afterUpdate', () => {
    bodies.forEach((body, index) => {
      bodiesCoords[index] = {
        x: body.position.x,
        y: body.position.y,
        angle: body.angle
      };
    });
  });

  // 6. Запуск физического мира
  runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
});

onUnmounted(() => {
  if (runner) Matter.Runner.stop(runner);
  if (engine) Matter.Engine.clear(engine);
});
</script>

<style scoped>
.physics-scene {
  position: relative;
  width: 100%;
  height: 50vh;
  background-color: #0d0d0d;
  overflow: hidden;
  user-select: none;
}

/* Стили для плашек — теперь это чистый CSS! */
.physics-body {
  position: absolute;
  /* Центрируем элемент относительно точки координат Matter.js */
  left: 0;
  top: 0;
  margin-left: -50px; /* Будет скорректировано при рендере, но базовое центрирование важно */
  margin-top: -20px;
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
  border: 1px solid rgb(143, 143, 143);
  background-color: rgb(250, 250, 250);
  border-radius: 12px;
  color: #000000;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}

/* Стилизация круглых иконок */
.circle {
  width: 50px;
  height: 50px;
  background-color: #ffffff;
  border-radius: 50%;
  color: #0d0d0d;
  font-size: 20px;
  font-weight: bold;
}

/* Точка внутри плашки XIX */
.dot {
  width: 8px;
  height: 8px;
  background-color: #000000;
  border-radius: 50%;
}
</style>