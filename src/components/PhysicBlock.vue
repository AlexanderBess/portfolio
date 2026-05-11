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

// Функция для вычисления адаптивных позиций
const getResponsivePositions = (width) => {
  if (width < 768) {
    // Мобильные устройства
    return [
      { text: 'FRONTEND', class: 'pill', x: width * 0.2, y: 60 },
      { text: 'DEVELOPER', class: 'pill', x: width * 0.5, y: 80 },
      { text: 'VUE', class: 'pill', x: width * 0.7, y: 100 },
      { text: 'SASS', class: 'pill', hasDot: true, x: width * 0.8, y: 60 },
      { text: '★', class: 'circle', icon: '★', x: width * 0.9, y: 70 }
    ];
  } else {
    // Десктоп
    return [
      { text: 'FRONTEND', class: 'pill', x: width * 0.2, y: 80 },
      { text: 'DEVELOPER', class: 'pill', x: width * 0.4, y: 100 },
      { text: 'VUE', class: 'pill', x: width * 0.6, y: 120 },
      { text: 'SASS', class: 'pill', hasDot: true, x: width * 0.75, y: 80 },
      { text: '★', class: 'circle', icon: '★', x: width * 0.9, y: 90 }
    ];
  }
};

// 1. Данные элементов
const items = reactive(getResponsivePositions(window.innerWidth));

const sceneContainer = ref(null);
const itemRefs = ref([]);

// Храним динамические координаты для рендеринга во Vue
const bodiesCoords = reactive(
    items.map(() => ({ x: 0, y: 0, angle: 0 }))
);

let engine, runner, bodies = [];
let resizeObserver = null;
let walls = { ground: null, ceiling: null, leftWall: null, rightWall: null };

// Получение стилей для синхронизации HTML с физическим телом
const getStyles = (index) => {
  const coord = bodiesCoords[index];
  if (!coord) return {};
  // Добавляем translate(-50%, -50%), чтобы точка [x,y] была центром элемента
  return {
    transform: `translate3d(${coord.x}px, ${coord.y}px, 0) translate(-50%, -50%) rotate(${coord.angle}rad)`
  };
};

onMounted(async () => {
  await nextTick(); // Ждем, пока Vue отрендерит элементы в DOM для замера их размеров

  const container = sceneContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // 1. Инициализация физического движка
  engine = Matter.Engine.create({
    gravity: { x: 0, y: 1.2 } // Увеличил гравитацию для более быстрого оседания
  });
  const world = engine.world;

  // Функция обновления границ физического мира
  const updateWalls = (width, height) => {
    const wallThickness = 100;
    const wallOptions = { isStatic: true };

    // Удаляем старые стены
    if (walls.ground) Matter.Composite.remove(world, walls.ground);
    if (walls.ceiling) Matter.Composite.remove(world, walls.ceiling);
    if (walls.leftWall) Matter.Composite.remove(world, walls.leftWall);
    if (walls.rightWall) Matter.Composite.remove(world, walls.rightWall);

    // Создаем новые стены
    walls.ground = Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, wallOptions);
    walls.ceiling = Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, wallOptions);
    walls.leftWall = Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, wallOptions);
    walls.rightWall = Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, wallOptions);

    Matter.Composite.add(world, [walls.ground, walls.ceiling, walls.leftWall, walls.rightWall]);
  };

  // Функция обновления позиций элементов
  const updateItemPositions = (width) => {
    const newPositions = getResponsivePositions(width);
    
    // Обновляем данные элементов
    items.splice(0, items.length, ...newPositions);
    
    // Обновляем позиции физических тел
    bodies.forEach((body, index) => {
      if (newPositions[index]) {
        Matter.Body.setPosition(body, {
          x: newPositions[index].x,
          y: newPositions[index].y
        });
        Matter.Body.setVelocity(body, { x: 0, y: 0 }); // Сбрасываем скорость
      }
    });
  };

  // Функция обработки изменения размера
  const handleResize = () => {
    const container = sceneContainer.value;
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    
    // Обновляем границы
    updateWalls(newWidth, newHeight);
    
    // Обновляем позиции элементов
    updateItemPositions(newWidth);
  };

  // 2. Создание невидимых физических границ (стен)
  updateWalls(width, height);

  // 3. Создание физических тел на основе реальных размеров DOM-элементов
  bodies = items.map((item, index) => {
    const el = itemRefs.value[index];
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    let body;
    if (item.class === 'circle') {
      body = Matter.Bodies.circle(item.x, item.y, w / 2, {
        restitution: 0.3, // Уменьшил отскок
        friction: 0.7,    // Увеличил трение
        density: 0.002,   // Плотность
      });
    } else {
      body = Matter.Bodies.rectangle(item.x, item.y, w, h, {
        restitution: 0.3, // Уменьшил отскок
        friction: 0.7,    // Увеличил трение
        density: 0.002,   // Плотность
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

  // 7. Добавляем ResizeObserver для отслеживания изменений размера контейнера
  resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(container);
});

onUnmounted(() => {
  if (runner) Matter.Runner.stop(runner);
  if (engine) Matter.Engine.clear(engine);
  if (resizeObserver) resizeObserver.disconnect();
});
</script>

<style scoped>
.physics-scene {
  position: relative;
  width: 100%;
  height: 40vh; /* Увеличил высоту контейнера */
  background-color: var(--bg-primary);
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
  background-color: var(--bg-primary);
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
  color: var(--bg-primary);
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