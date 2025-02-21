var slider = document.getElementById('range'); // Ползунок
var LED1 = document.getElementById('slider-toggle'); // Ползунок
var LED2 = document.getElementById('slider-toggle1'); // Ползунок
var LED3 = document.getElementById('slider-toggle2'); // Ползунок
// Получение состояния переключателей
function getState() {
    return {
        r: parseInt(slider.noUiSlider.get()), 
      
        bzr: parseInt(LED1.noUiSlider.get()),
        L1: parseInt(LED2.noUiSlider.get()),
        L2: parseInt (LED3.noUiSlider.get()),
    };
}

// Функция для создания JSON-пакета
function createJsonPacket() {
    var state = getState();
    var jsonPacket = JSON.stringify(state);
    console.log(jsonPacket);
    return jsonPacket;
}

// Функция для установки значений ползунка и переключателей из JSON строки
function setValuesFromJson(jsonString) {
    try {
      var obj = JSON.parse(jsonString);
      slider.noUiSlider.set(obj.r); // Установка значения ползунка
      LED1.noUiSlider.set(obj.bzr);       // Установка значения переключателя BUZZER
      LED2.noUiSlider.set(obj.L1);        // Установка значения переключателя LED1
      LED3.noUiSlider.set(obj.L2);        // Установка значения переключателя LED2
    } catch (e) {
      console.error("Ошибка парсинга JSON: ", e);
    }
  }

/******************************************************
 * создадим функцию, которая будет последовательно отправлять строки
 *  из массива coordinates в виде JSON строки с помощью метода port.send(),
 *  и после завершения массива выведет сообщение о завершении и количество 
 * переданных строк.

 
 */
// Функция для обновления содержимого на странице
function displayTextMCU(text) {
    // Находим элемент по id
    const container = document.getElementById("contentMCU");
    // Устанавливаем переданный текст в содержимое элемента
    container.textContent = text;
}

  // Функция для обновления содержимого на странице
  function displayText1(text) {
    // Находим элемент по id
    const container = document.getElementById("content1");
    // Устанавливаем переданный текст в содержимое элемента
    container.textContent = text;
}
  // Функция для обновления содержимого на странице
  function displayText2(text) {
    // Находим элемент по id
    const container = document.getElementById("content2");
    // Устанавливаем переданный текст в содержимое элемента
    container.textContent = text;
}

// Пример использования:
//displayText1("Привет, это динамический текст!"); // Выведет текст в div

// Пример использования:
//displayText2("Привет, это динамический текст!"); // Выведет текст в div
function sendCoordinatesAsJson(coordinates, sendFunction) {
    let sentCount = 0;
  
    function sendNextCoordinate(index) {
        displayText1("DBase размер строк  "+coordinates.length);
      if (index >= coordinates.length) {
        console.log("Передача завершена. Количество переданных строк: " + sentCount);
       
        displayText2("Передача завершена. Количество переданных строк:  "+ sentCount);
        sendFunction(new TextEncoder("utf-8").encode("end_DB_transm " +sentCount+ "\0"));
        return;
      }
  
      let coordinate = coordinates[index];
      let jsonPacket = JSON.stringify(coordinate);
     // console.log("Отправка: " + jsonPacket);
      sendFunction(new TextEncoder("utf-8").encode("w_DB"+jsonPacket + "\0"))
        .then(() => {
          console.log(jsonPacket);
          displayText2("передано строк  "+ (index + 1));
          //updateText("Всего пакетов"+coordinates.length);
          //updateText1("переданно пакетов");
          sentCount++;
          setTimeout(() => sendNextCoordinate(index + 1), 7); // Увеличим задержку до 500ms
        })
        .catch((error) => {
          console.error("Ошибка отправки: ", error);
          //updateText1("Ошибка отправки:"+index);
        });
    }
  
    sendNextCoordinate(0);
  }
  
  // Пример использования функции с массивом coordinates и функцией отправки
  //sendCoordinatesAsJson(coordinates, port.send.bind(port));
  
 