let buffer2 = "";
let counterOfPocket2 = 0;
let errorOfParsing2 = 0;
let jsonArrayTable2 = [];
let jsonArrayLog2 = [];
let flagRunFunction2 = false; // начало приема пакетов для обработки

function handleDecodedString2(decodedString2, startPrefix2, endPrefix2, jsonArrayTable2) {
    if ((decodedString2.indexOf(startPrefix2) >= 0) && (flagRunFunction2 === false)) {
        flagRunFunction2 = true; // включаем обработку
        counterOfPocket2 = 0;
        errorOfParsing2 = 0;
        buffer2 = "";
        jsonArrayTable2.length = 0;
        displayText2("прием Log пакетов:  ");
    }

    buffer2 += decodedString2;

    if ((decodedString2.indexOf(endPrefix2) >= 0) && (flagRunFunction2 === true)) {
        flagRunFunction2 = false; // выключаем обработку 
        // Обработка оставшегося буфера перед завершением
        processBuffer2(true);
        console.log(jsonArrayTable2);
        console.log("return true", decodedString2.indexOf(endPrefix2));
        return true;
    }

    if (flagRunFunction2) {
        processBuffer2(false);
    }

    function processBuffer2(isFinal) {
        let startIndex2 = buffer2.indexOf('{');
        let endIndex2 = buffer2.lastIndexOf('}'); // Изменение для обработки вложенных объектов

        while (startIndex2 !== -1 && endIndex2 !== -1 && startIndex2 < endIndex2) {
            let jsonString2 = buffer2.substring(startIndex2, endIndex2 + 1).trim();

            // Обработка спецсимволов и пробелов
            jsonString2 = jsonString2.replace(/\n/g, '').replace(/\r/g, '');

            // Дополнительная проверка на корректность JSON-строки
            let jsonObject2;
            try {
                jsonObject2 = JSON.parse(jsonString2);
            } catch (error) {
                if (isFinal) {
                    console.error("Ошибка при разборе JSON (окончательная):", error, jsonString2);
                    ++errorOfParsing2;
                }
                return;
            }

            try {
                jsonArrayTable2.push(jsonObject2);
                console.log("OK:", jsonObject2);
                displayText1("Прием Log от MCU:" + jsonString2);
                ++counterOfPocket2;
                displayText2("пакетов:  " + counterOfPocket2 + "   error:  " + errorOfParsing2);
            } catch (error) {
                console.error("Ошибка при разборе JSON:", error, jsonString2);
                ++errorOfParsing2;
                displayText2("пакетов:  " + counterOfPocket2 + "   error:  " + errorOfParsing2);
            }

            buffer2 = buffer2.substring(endIndex2 + 1);
            startIndex2 = buffer2.indexOf('{');
            endIndex2 = buffer2.lastIndexOf('}'); // Изменение для обработки вложенных объектов
        }
    }

    return false;
}



