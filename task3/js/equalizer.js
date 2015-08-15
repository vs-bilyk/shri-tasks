// объект с данными изменения мощностей сингнала на каждой частоте для каждого музыкального жанра
var genres = {
  rock: [5.4, 4.5, 3.6, -3.65, -6.3, -6.6, -3.6, -2.7, -0.3, 2.1, 4.5, 6, 6.9, 7.5, 7.8, 7.8, 7.8, 8.1],
  pop: [-1.58, 0.6, 3.9, 5.4, 5.53, 4.5, 2.1, 0.9, -0.6, -1.5, -1.5, -1.8, -2.1, -2.1, -2.7, -2.1, -2.1, -0.3],
  jazz: [3.03, 6.27, 5.15, 3.6, 1.8, -3.9, -4.85, -5.1, -2.1, 1.2, 4.5, 9, 3, -1.8, -4.5, -2.4, -0.47, 2.48],
  classic: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2.86, -5.83, -5.83, -6, -8.1],
  normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

// для создания фильтра
var createFilter = function (frequency) { 

  var filter = context.createBiquadFilter(); // создаем фильтр
  filter.type = 'peaking'; // тип фильтра
  filter.frequency.value = frequency; // частота
  filter.Q.value = 1; // добротность
  filter.gain.value = 0; // уровень усиления или ослабления частоты

  return filter;
};

// создаем фильтры
var createFilters = function () {

  var frequencies = [31, 63, 87, 125, 175, 250, 350, 500, 700, 1000, 1400, 2000, 2800, 4000, 5600, 8000, 11200, 16000];
  filters = frequencies.map(createFilter);   // создаем фильтры

  filters.reduce(function (prev, curr) { // последовательно соединяем фильтры
	prev.connect(curr);
	return curr;
  });

  return filters;
};

[].forEach.call(document.querySelectorAll('.set'), function (set) {

  set.addEventListener('click', function() {
	preSet(genres[this.getAttribute("data-set")]);
  }, false);

});

// функция для определения мощности сигнала 
function preSet(set) {
  set.forEach(function(v, i) {
	filters[i].gain.value = set[i];
  })
}