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
