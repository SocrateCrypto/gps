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





    });
    var button_writeSettings = document.getElementById("writeSettings");
    button_writeSettings.addEventListener("click", function () {

      console.log("w_settings");
      console.log(port.send(new TextEncoder("utf-8").encode("w_settings" + "\0")));

    });

    var button_reedCoordinates = document.getElementById("reedCoordinates");
    button_reedCoordinates.addEventListener("click", function () {

      console.log("get_DB");
      console.log(port.send(new TextEncoder("utf-8").encode("get_DB" + "\0")));

    });

    var button_saveCoordinates = document.getElementById("saveCoordinates");
    button_saveCoordinates.addEventListener("click", function () {

      console.log("w_DB",coordinates);
      console.log(port.send(new TextEncoder("utf-8").encode("w_DB" + "\0")));

    });

    document.getElementById('downloadButton').addEventListener('click', function() {
      console.log("get_log");
      console.log(port.send(new TextEncoder("utf-8").encode("get_log" + "\0")));

      // Ваш массив JSON объектов
      const jsonObjects = [
          { "name": "John", "age": 30, "city": "New York" },
          { "name": "Anna", "age": 25, "city": "London" },
          { "name": "Mike", "age": 32, "city": "Paris" }
      ];
  
      // Преобразуем массив в строку с новыми абзацами для каждого объекта
      const jsonString = jsonObjects.map(obj => JSON.stringify(obj, null, 2)).join('\n\n');
  
      // Создаем объект Blob
      const blob = new Blob([jsonString], { type: "text/plain" });
  
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.txt";
      document.body.appendChild(a);
      a.click();
  
      // Удаляем ссылку после скачивания
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  });



      /*********************************************************************************/
      function connect() {
        port.connect().then(() => {
          statusDisplay.textContent = '';
          connectButton.textContent = 'Disconnect';

          port.onReceive = data => {
            let textDecoder = new TextDecoder();
           
            let decodedString = textDecoder.decode(data);
            console.log(decodedString);
            /************************************************************************************** */
           if (decodedString.trim() === "send_my_settings") {
            console.log("yes");
            var jsonPacket = createJsonPacket();
            console.log(port.send(new TextEncoder("utf-8").encode(jsonPacket + "\0")));
           }else  if (decodedString.startsWith("get_settings")) {
            let jsonString = decodedString.slice("get_settings".length);
            setValuesFromJson(jsonString.trim());
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