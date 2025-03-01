(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let port;

    /*********************************************************************************/
    var button_reedSettings = document.getElementById("reedSettings");
    button_reedSettings.addEventListener("click", function () {

      console.log("get_settings");
      console.log(port.send(new TextEncoder("utf-8").encode("get_settings" + "\0")));

      //console.log(port.send(new TextEncoder("utf-8").encode("get_log" + "\0")));



    });
    var button_writeSettings = document.getElementById("writeSettings");
    button_writeSettings.addEventListener("click", function () {

      console.log("w_settings");
      var jsonPacket = createJsonPacket();
      console.log(port.send(new TextEncoder("utf-8").encode("w_settings" + jsonPacket + "\0")));


    });

    var button_reedCoordinates = document.getElementById("reedCoordinates");
    button_reedCoordinates.addEventListener("click", function () {

      console.log("get_DB");
      displayText2("получение данных D_Base с MCU ...");
      console.log(port.send(new TextEncoder("utf-8").encode("get_DB" + "\0")));


    });

    var button_saveCoordinates = document.getElementById("saveCoordinates");
    button_saveCoordinates.addEventListener("click", function () {

      console.log("w_DB", coordinates);
      if (coordinates.length === 0) {
        alert("Предупреждение: Сначала загрузите базу данных!");
      } else {
        console.log(port.send(new TextEncoder("utf-8").encode("w_DB" + "\0")));
        console.log(sendCoordinatesAsJson(coordinates, port.send.bind(port)));
        //sendCoordinatesAsJson(coordinates);
      }


    });

    document.getElementById('downloadButton').addEventListener('click', function () {
      console.log("get_log");

      port.send(new TextEncoder("utf-8").encode("get_log" + "\0"));

    });



    /*********************************************************************************/
    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          let textDecoder = new TextDecoder();

          let decodedString = textDecoder.decode(data);
          //console.log(decodedString);
          /************************************************************************************** */
          if (decodedString.trim() === "send_my_settings") {
            console.log("yes");
            var jsonPacket = createJsonPacket();
            console.log(port.send(new TextEncoder("utf-8").encode(jsonPacket + "\0")));
          } else if (decodedString.startsWith("get_settings")) {
            let jsonString = decodedString.slice("get_settings".length);
            setValuesFromJson(jsonString.trim());
          }

          //if ((decodedString.indexOf("MCU") >= 0)) {


          // displayTextMCU(decodedString);
          // }

          if (handleDecodedString(decodedString, "get_DB", "&", jsonArrayTable)) {

            // Сначала вызываем clearTable()"MCU: записал строк DB:"
            clearTable();
            displayText1("очистка текущей и загрузка скачанной с MCU D_Base...");

            // Затем используем setTimeout для вызова addRowsFromArray() через 2 секунды (2000 миллисекунд)
            setTimeout(function () {
              displayText1("загрузка D_Base скачанной с MCU...");
              console.log(jsonArrayTable);
              addRowsFromArray(jsonArrayTable);
            }, 1700);


          }

          if (handleDecodedString2(decodedString, "gt_s", "&", jsonArrayLog2)) {
            // Преобразуем массив в строку с новыми абзацами и разделяем линиями для каждого объекта
            const jsonString = jsonArrayLog2.map((obj, index) => {
              const timestamp = `${obj.timestampUTC.Year}.${obj.timestampUTC.Month}.${obj.timestampUTC.Day} ${obj.timestampUTC.Hour}:${obj.timestampUTC.Minute}:${obj.timestampUTC.Second}`;
              return  `
        #${index + 1}    ${timestamp}
              ================================================
              Событие:        ${obj.event}  ${obj.aux_text}
              ------------------------------------------------
              Latitude:       ${obj.y}       Year:         ${obj.timestampUTC.Year}
              Longitude:      ${obj.x}      Month:        ${obj.timestampUTC.Month}
              Azimuth :       ${obj.azimut_vector}             Day:          ${obj.timestampUTC.Day}
              Speed:          ${obj.speed}                   (UTC)  Hour:    ${obj.timestampUTC.Hour}
              Distance:       ${obj.dist}                   (UTC)  Minute:  ${obj.timestampUTC.Minute}
                                                  (UTC)  Second:  ${obj.timestampUTC.Second}
              ------------------------------------------------
              Radar Index:           ${obj._RADAR_date_._radar_idx_}
              Radar Latitude:        ${obj._RADAR_date_._radar_y}
              Radar Longitude:       ${obj._RADAR_date_._radar_x}
              ------------------------------------------------
                      `;
                  }).join('\n');                         
            
          

            // Создаем объект Blob
            const blob = new Blob([jsonString], { type: "text/plain" });

            // Получаем текущую дату и время в формате UTC
            const now = new Date();
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // месяцы начинаются с 0
            const day = String(now.getUTCDate()).padStart(2, '0');
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');
            const dateTimeUTC = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

            // Создаем ссылку для скачивания
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Log_GPS_${dateTimeUTC}.txt`; // добавляем дату и время к названию файла
            document.body.appendChild(a);
            a.click();

            // Удаляем ссылку после скачивания
            document.body.removeChild
            URL.revokeObjectURL(url);
          }

          /************************************************************************************** */

        };
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    connectButton.addEventListener('click', function () {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length === 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });


  });
})();
