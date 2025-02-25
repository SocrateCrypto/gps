var clickPipsSlider = document.getElementById('range');

noUiSlider.create(clickPipsSlider, {
    range: {
        min: 1,
        max: 3000
    },
    connect: 'lower',
    start: [10],
    pips: {mode: 'count', values: 5},
    tooltips: [
        // no tooltip
        true,
        // tooltip with custom formatting
       
    ],
   
       
       
    
});

var pips = clickPipsSlider.querySelectorAll('.noUi-value');

function clickOnPip() {
    var value = Number(this.getAttribute('data-value'));
    clickPipsSlider.noUiSlider.set(value);
}

for (var i = 0; i < pips.length; i++) {

    // For this example. Do this in CSS!
    pips[i].style.cursor = 'pointer';
    pips[i].addEventListener('click', clickOnPip);
}



