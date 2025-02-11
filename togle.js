document.addEventListener('DOMContentLoaded', function() {
    var sliderToggle = document.getElementById('slider-toggle');
    
    noUiSlider.create(sliderToggle, {
      start: 0,
      behaviour: 'tap',
      connect: 'lower',
      range: {
        'min': 0,
        'max': 1
      },
      step: 1,
      tooltips: {
        to: function(value) {
          return value === 1 ? 'on' : 'off';
        }
      }
    });
  
    sliderToggle.noUiSlider.on('set', function(values, handle) {
      var value = values[handle];
      console.log('Toggle value: ' + value);
      // Дополнительный код для обработки значения переключателя
    });
  
    // Установка ширины переключателя на 80 пикселей
    sliderToggle.style.width = '50px';
  });

  document.addEventListener('DOMContentLoaded', function() {
    var sliderToggle1 = document.getElementById('slider-toggle1');
    
    noUiSlider.create(sliderToggle1, {
      start: 0,
      behaviour: 'tap',
      connect: 'lower',
      range: {
        'min': 0,
        'max': 1
      },
      step: 1,
      tooltips: {
        to: function(value) {
          return value === 1 ? 'on' : 'off';
        }
      }
    });
  
    sliderToggle1.noUiSlider.on('set', function(values, handle) {
      var value1 = values[handle];
      console.log('Toggle1 value: ' + value1);
      // Дополнительный код для обработки значения переключателя
    });
  
    // Установка ширины переключателя на 80 пикселей
    sliderToggle1.style.width = '50px';
  });


  document.addEventListener('DOMContentLoaded', function() {
    var sliderToggle2 = document.getElementById('slider-toggle2');
    
    noUiSlider.create(sliderToggle2, {
      start: 0,
      behaviour: 'tap',
      connect: 'lower',
      range: {
        'min': 0,
        'max': 1
      },
      step: 1,
      tooltips: {
        to: function(value) {
          return value === 1 ? 'on' : 'off';
        }
      }
    });
  
    sliderToggle2.noUiSlider.on('set', function(values, handle) {
      var value2 = values[handle];
      console.log('Toggle1 value: ' + value2);
      // Дополнительный код для обработки значения переключателя
    });
  
    // Установка ширины переключателя на 80 пикселей
    sliderToggle2.style.width = '50px';
  });
  
  