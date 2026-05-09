const storyText = document.getElementById("story-text");
const choices = document.getElementById("choices");
const inventoryList = document.getElementById("inventory-list");
const sceneImage = document.getElementById("scene-image");
const lootPopup = document.getElementById("loot-popup");
const lootText = document.getElementById("loot-text");
const clickSound = document.getElementById("click-sound");
const ambientSound = document.getElementById("ambient-sound");
const typeSound = document.getElementById("type-sound");

let inventory = [
  "старая рубаха",
  "штаны крестьянина",
  "деревянная дубинка",
  "ключ от погреба"
];

function updateInventory() {
  inventoryList.textContent = inventory.length ? inventory.join(", ") : "пусто";
}

function playClick() {
  if (!clickSound) return;

  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

function startAmbient() {
  if (!ambientSound) return;

  ambientSound.volume = 0.25;
  ambientSound.play().catch(() => {});
}

function playTypeSound() {
  if (!typeSound) return;

  const sound = typeSound.cloneNode();
  sound.volume = 0.12;
  sound.play().catch(() => {});
}

let typingTimer = null;
let isTyping = false;
let currentText = "";
let currentButtons = [];

function renderButtons(buttons) {
  choices.innerHTML = "";

  buttons.forEach(button => {
    const btn = document.createElement("button");
    btn.textContent = button.text;

    btn.onclick = () => {
      playClick();
      startAmbient();
      button.action();
    };

    choices.appendChild(btn);
  });
}

function showScene(text, buttons = []) {
  clearInterval(typingTimer);

  currentText = text;
  currentButtons = buttons;
  isTyping = true;

  storyText.textContent = "";
  choices.innerHTML = "";

  const skipBtn = document.createElement("button");
  skipBtn.textContent = "Показать текст сразу";

  skipBtn.onclick = () => {
    playClick();
    startAmbient();
    skipText();
  };

  choices.appendChild(skipBtn);

  let i = 0;
  const speed = 25;

  typingTimer = setInterval(() => {
  storyText.textContent += text[i];

  if (
    text[i] !== " " &&
    text[i] !== "." &&
    text[i] !== "," &&
    text[i] !== "\n"
  ) {
    playTypeSound();
  }

  i++;

  if (i >= text.length) {
    finishTyping();
  }
}, speed);

  updateInventory();
}

function finishTyping() {
  clearInterval(typingTimer);
  isTyping = false;
  storyText.textContent = currentText;
  renderButtons(currentButtons);
  updateInventory();
}

function skipText() {
  if (isTyping) {
    finishTyping();
  }
}

function showLoot(items, callback = null) {
  lootText.innerHTML = items.join("<br>");
  lootPopup.classList.remove("hidden");
  window.lootCallback = callback;
}

function closeLoot() {
  playClick();
  startAmbient();

  lootPopup.classList.add("hidden");

  if (window.lootCallback) {
    const cb = window.lootCallback;
    window.lootCallback = null;
    cb();
  }
}

function startGame() {
  startAmbient();

  inventory = [
    "старая рубаха",
    "штаны крестьянина",
    "деревянная дубинка",
    "ключ от погреба"
  ];

  sceneImage.style.backgroundImage = "linear-gradient(#1d1a16, #080706)";

  showScene(
    `Старый северный погреб.

По приказу великого короля Себастиана Золотое Перо здесь должны устроить новый винный погреб.

Кавус, простой крестьянин при дворе, подошёл к двери и остановился.

Через щели пробивался тусклый свет.
Изнутри доносились шаркающие шаги.`,
    [
      {
        text: "Отворить дверь",
        action: meetIzvraticus
      },
      {
        text: "Не отворять. Доложить страже",
        action: reportToGuard
      }
    ]
  );
}

function reportToGuard() {
  showScene(
    `Кавус медленно убрал руку с дверной ручки.

Шаркающие шаги за дверью продолжались.

— Нет уж, — пробормотал он. — За это мне не платят.

Он поднялся обратно к страже.

Стражник выслушал его, нахмурился и ткнул пальцем вниз.

— Ты зачем сюда вернулся?

— Там кто-то ходит.

— В погребе всегда кто-то ходит. Крысы, слуги, долги казны. Иди работай.

— Но свет...

— Свет — это хорошо. Значит, сам найдёшь метлу.

Кавуса отправили обратно к двери.`,
    [
      {
        text: "Вернуться и отворить дверь",
        action: meetIzvraticus
      }
    ]
  );
}

function meetIzvraticus() {
  showScene(
    `Дверь открылась с тяжёлым скрипом.

Внутри стоял старик в потрёпанном звёздном балахоне.

Он был или старым сумасшедшим, или сумасшедшим стариком. В любом случае — его здесь быть не должно.

Кавус не успел сказать ни слова.

Старик резко поднял палец:

— О-о-о... это ты. Скажи, что это ты, избранный?`,
    [
      {
        text: "О чём ты говоришь, дед?",
        action: choiceConfused
      },
      {
        text: "Я уборщик. Зовут Кавус.",
        action: choiceCleaner
      }
    ]
  );
}

function choiceConfused() {
  showScene(
    `Извратикус прищурился.

— А-а-а... скромность. Первый знак избранного.

Он закашлялся, но продолжил торжественно:

— Я видел это... о, видение, множество видений! Юный муж придёт ко мне, пройдёт испытание и примет вызов от... от... вызов он примет, и будет так.

Старик протянул сухую ладонь.

— Снимай свои лохмотья и смени их на достойное снаряжение.`,
    [
      {
        text: "Передать вещи",
        action: coughOne
      }
    ]
  );
}

function coughOne() {
  showScene(
    `Кавус нехотя передал свои пожитки.

Извратикус довольно кивнул.

Затем старик кашлянул.

Один раз.

Второй.`,
    [
      {
        text: "Будь здоров",
        action: stealGearFog
      }
    ]
  );
}

function choiceCleaner() {
  showScene(
    `— Уборщик? Кавус? Кааавус...

Извратикус задумался так глубоко, будто провалился внутрь собственного черепа.

— Возможно. Возможно, это ты и есть. Тот, кто очищает путь.

Он достал мутный пузырёк.

— Не гоже в таком расхаживать здесь. Тут опасно бывает. Кхе...

— Выпей это снадобье, чтобы укрепить своё дело. То есть тело.`,
    [
      {
        text: "Выпить снадобье",
        action: stealGearPotion
      }
    ]
  );
}

function stealGearFog() {
  inventory = [];

  showScene(
    `— Будь здоров, — сказал Кавус.

Извратикус поднял палец, будто это тоже было частью пророчества.

На третий раз весь погреб заволок густой туман.

Когда туман рассеялся, Извратикуса уже не было.

Как и вещей Кавуса.`,
    [
      {
        text: "Осмотреться",
        action: cellarAfterRobbery
      }
    ]
  );
}

function stealGearPotion() {
  inventory = [];

  showScene(
    `Кавус выпил снадобье.

На вкус оно напоминало мокрую тряпку, перец и ошибку.

Мир качнулся.

Когда Кавус очнулся, он лежал на холодном полу.

Извратикуса не было.

Вещей тоже.`,
    [
      {
        text: "Подняться и осмотреться",
        action: cellarAfterRobbery
      }
    ]
  );
}

function cellarAfterRobbery() {
  showScene(
    `Погреб был сырой и тесный.

На стене чадил факел. Между бочек лежала пыль, солома и что-то, что лучше не трогать.

На одной из старых бочек Кавус заметил оловянную вилку.

У неё было три зубца. Один из них был странно кривой.

На ручке виднелся узор, похожий то ли на завиток, то ли на предупреждение.`,
    [
      {
        text: "Взять факел",
        action: takeTorch
      },
      {
        text: "Взять оловянную вилку",
        action: takeFork
      }
    ]
  );
}

function takeTorch() {
  if (!inventory.includes("факел")) {
    inventory.push("факел");
  }

  showLoot(
    ["Факел"],
    () => {
      showScene(
        `Кавус взял факел.

Стало немного светлее.

К сожалению, вместе со светом стало лучше видно грязь.`,
        [
          {
            text: "Взять оловянную вилку",
            action: takeFork
          }
        ]
      );
    }
  );
}

function takeFork() {
  if (!inventory.includes("оловянная вилка")) {
    inventory.push("оловянная вилка");
  }

  showLoot(
    ["Оловянная вилка"],
    () => {
      showScene(
        `Кавус поднял оловянную вилку.

Тип: оружие / непонятно что
Урон: 0.5

Вилка выглядела жалко, но уверенно.`,
        [
          {
            text: "Идти дальше по коридору",
            action: findChest
          }
        ]
      );
    }
  );
}

function findChest() {
  showScene(
    `Кавус двинулся дальше.

Коридор привёл его к старому сундуку.

Замок был маленький, хитрый и неприятно самодовольный.

Кавус внимательно пригляделся к скважине.

Оловянная вилка будто подходила к ней.`,
    [
      {
        text: "Попробовать открыть сундук вилкой",
        action: lockpickOne
      }
    ]
  );
}

function lockpickOne() {
  showScene(
    `Кавус вставил вилку в замок и осторожно повернул.

ХРЯСЬ.

Один прямой зубец отломился.

Теперь у вилки осталось два зубца.`,
    [
      {
        text: "Попробовать ещё раз",
        action: lockpickTwo
      }
    ]
  );
}

function lockpickTwo() {
  showScene(
    `Кавус попробовал ещё раз.

ХРЯСЬ.

Второй прямой зубец тоже отломился.

Теперь у вилки остался один-единственный кривой зубец.

Сундук молчал.

Это молчание не внушало доверия.`,
    [
      {
        text: "Рискнуть и повернуть вилку",
        action: chestOpensAfterRisk
      },
      {
        text: "Не рисковать",
        action: chestOpensWithoutRisk
      }
    ]
  );
}

function chestOpensAfterRisk() {
  showScene(
    `Кавус сжал зубы и повернул вилку.

Одинокий кривой зубец вошёл в замок так мягко, будто всю жизнь только этого и ждал.

ЩЁЛК.

Сундук открылся.`,
    [
      {
        text: "Открыть сундук",
        action: openChest
      }
    ]
  );
}

function chestOpensWithoutRisk() {
  showScene(
    `Кавус убрал руку.

— Нет. Хватит с меня этой проклятой вилки.

Он сделал шаг назад.

ЩЁЛК.

Сундук открылся сам.

Где-то в сырости погреба будто хихикнули.`,
    [
      {
        text: "Открыть сундук",
        action: openChest
      }
    ]
  );
}

function openChest() {
  inventory = [
    "сломанная оловянная вилка",
    "кожаные штаны",
    "кожаная куртка",
    "малый меч",
    "свиток малого исцеления",
    "чёрствый хлеб",
    "бурдюк с водой"
  ];

  showLoot(
    [
      "Кожаные штаны",
      "Кожаная куртка",
      "Малый меч",
      "Свиток малого исцеления",
      "Чёрствый хлеб",
      "Бурдюк с водой"
    ],
    () => {
      showScene(
        `В сундуке лежали вещи.

Не роскошные, но после холодного пола и украденных штанов они казались даром небес.

Сломанная оловянная вилка осталась при Кавусе.

Почему-то теперь она выглядела полезнее, чем раньше.`,
        [
          {
            text: "Подойти к закрытой двери",
            action: finalDoor
          }
        ]
      );
    }
  );
}

function finalDoor() {
  showScene(
    `В конце коридора стояла закрытая дверь.

Кавус толкнул её плечом.

Дверь нехотя открылась.

Из темноты впереди донёсся сухой старческий смех.

— Кхе-хе-хе... прямые зубцы всегда лишние...

Уровень 1.1 завершён.`,
    [
      {
        text: "Продолжить",
        action: endLevel
      }
    ]
  );
}

function endLevel() {
  showScene(
    `Переход на уровень 1.2.

Пока здесь будет заглушка.`,
    [
      {
        text: "Начать заново",
        action: startGame
      }
    ]
  );
}

startGame();
