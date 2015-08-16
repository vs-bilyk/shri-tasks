var AudioContext = window.AudioContext // создаем аудио контекст
		|| window.webkitAudioContext || false; // для Сафари

	if (AudioContext) {
		var context = new window.AudioContext() || new window.webkitAudioContext();
	} else {
		alert("Аудио контекст не создан");
	}

	var url, buffer, source, destination, analyser; // переменные для url, буфера, источника, получателя и анализатора

// Загрузка файла
document.querySelector('.file').addEventListener('change', inputAction);  // отслеживание изменений в input
document.querySelector('.upload_file').addEventListener('dragover', dragoverAction); // отслеживание курсора
document.querySelector('.upload_file').addEventListener('drop', dropAction); // отслеживание получения файла

function dragoverAction(e) { // обработка движения курсора
	e.preventDefault(); // отмена действия по умолчанию
	e.stopPropagation(); // отменятет всплытие события
}

function dropAction(e) { // обработка получения файла
	e.preventDefault();
	e.stopPropagation();
	document.querySelector('.name_file').classList.add('name');
	document.querySelector('.name_file').innerHTML = e.dataTransfer.files[0].name;

	getDataSound(e.dataTransfer.files);
	return false;
}

function inputAction(e) { // обработка изменений в инпуте
	e.stopPropagation();
	document.querySelector('.name_file').classList.add('name');
	document.querySelector('.name_file').innerHTML = this.files[0].name;

	getDataSound(this.files);
}

function getDataSound(files) { // получаем данные

	var f = files[0];
	loadSoundFile(URL.createObjectURL(f));
	getMetaData (URL.createObjectURL(f), f);

}

function getMetaData(url, file) { // получаем и выводим метаданные

	ID3.loadTags(url, function() {
		var tags = ID3.getAllTags(url);

		if (tags.artist || tags.title) {
			document.querySelector('.name_file_data').classList.add('name');

			if (tags.artist && tags.title) {
				document.querySelector('.name_file_data').innerHTML = (tags.artist + " - " + tags.title);
			}
			else if (tags.artist) {
				document.querySelector('.name_file_data').innerHTML = ("Исполнитель - " + tags.artist);
			}
			else {
				document.querySelector('.name_file_data').innerHTML = ("Название песни - " + tags.title);
			}
		}
		else {
			document.querySelector('.name_file_data').innerHTML = ("Исполнитель и название песни неизвестны");
		}
	},
	{
		dataReader: FileAPIReader(file)
	});
}

function loadSoundFile(url) { // подгрузка файла в буфер

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {
		context.decodeAudioData(this.response, // декодируем бинарный ответ

		function(decodedArrayBuffer) {
			buffer = decodedArrayBuffer; // получаем декодированный буфер

		}, function(e) {
			console.log('Ошибка декодирования файла', e);
		});
	};
	xhr.send();
}

function playSound() { // функция воспроизведения

	if (source) { // если есть источник, останавливаем воспроизведение
		source.stop(0);
		source = undefined;
	}
	source = context.createBufferSource();  // создаем источник
	source.buffer = buffer;  // подключаем буфер к источнику

	filters = createFilters(); // вызываем функцию создания фильтра
	source.connect(filters[0]); // источник цепляем к первому фильтру
	filters[filters.length - 1].connect(context.destination); // на выход отправляем последний фильтр
	source.start(0);  // воспроизводим

	analyserSourse(); // запускаем анализатор

	source.onended = function() { // очищаем канвас после завершения проигрывания
	cancelAnalyserUpdates();
	}
}

function play() {
	document.querySelector('.play').onclick = function() {
		playSound();
	}
}

document.querySelector('.stop').onclick = function() {
	try {
		source.stop(0);
		source = undefined;
	}
	catch(e) {
			return;
	}
}

var checker = setInterval(function() { // проверка загрузки данных

	if (buffer) {
		play();
		clearInterval(checker);
		clearTimeout(checkerCancel);
	}
	else { document.querySelector('.play').onclick = function() {
			alert ("Пожалуйста, подождите пока трек загрузится");
		}
	}
}, 1000);

var checkerCancel = setTimeout(function() {
	console.log('Не удается загрузить данные');
	clearInterval(checker);
}, 50000);