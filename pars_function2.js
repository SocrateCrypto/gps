let buffer1 = "";
let counter_of_pocket = 0;
let error_of_parsing = 0;
let jsonArrayTable = [];
let jsonArrayLog = [];
let flagRunFunction = false; // начало приема пакетов для обработки

function handleDecodedString(decodedString, startPrefix, endPrefix, jsonArrayTable) {
    //console.log("строка ", decodedString);
    if ((decodedString.indexOf(startPrefix) >= 0) && (flagRunFunction === false)) {
        flagRunFunction = true; // включаем обработку
        counter_of_pocket = 0;
        error_of_parsing = 0;
        buffer1 = "";
        jsonArrayTable.length = 0;
        displayText2("прием Data Base пакетов:  ");
    }

    buffer1 += decodedString;

    if ((decodedString.indexOf(endPrefix) >= 0)&&(flagRunFunction === true)) {
        flagRunFunction = false; // выключаем обработку 
        // Обработка оставшегося буфера перед завершением
        processBuffer();
        console.log("return true", decodedString.indexOf(endPrefix));
        return true;
    }

    if (flagRunFunction) {
        processBuffer();
    }

    function processBuffer() {
        let startIndex = buffer1.indexOf('{');
        let endIndex = buffer1.indexOf('}');

        while (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            let jsonString = buffer1.substring(startIndex, endIndex + 1).trim();

            // Обработка спецсимволов и пробелов
            jsonString = jsonString.replace(/\n/g, '').replace(/\r/g, '');

            try {
                const jsonObject = JSON.parse(jsonString);
                jsonArrayTable.push(jsonObject);
                console.log("OK:", jsonObject);
                displayText1("Прием D_Base от MCU:" + jsonString);
                ++counter_of_pocket;
                displayText2("пакетов:  " + counter_of_pocket + "   error:  " + error_of_parsing);
            } catch (error) {
                console.error("Ошибка при разборе JSON:", error, jsonString);
                ++error_of_parsing;
                displayText2("пакетов:  " + counter_of_pocket + "   error:  " + error_of_parsing);
            }

            buffer1 = buffer1.substring(endIndex + 1);
            startIndex = buffer1.indexOf('{');
            endIndex = buffer1.indexOf('}');
        }
    }

    return false;
}


function addRowsFromArray(array) {
    // Сначала очищаем массив coordinates
    coordinates = [];

    // Проходим по каждому элементу массива и добавляем его в coordinates
    for (var i = 0; i < array.length; i++) {
        coordinates.push({
            n: coordinates.length + 1,
            idx: array[i].idx || '',
            x: array[i].x || 0,
            y: array[i].y || 0,
            type: array[i].type || '',
            speed: array[i].speed || 0,
            dirtype: array[i].dirtype || 0,
            direction: array[i].direction || 0
        });
    }

    // Обновляем индексы n для всех объектов в coordinates
    for (var j = 0; j < coordinates.length; j++) {
        coordinates[j].n = j + 1;
    }

    // Отображаем обновленные координаты в таблице
    displayCoordinates();
}


