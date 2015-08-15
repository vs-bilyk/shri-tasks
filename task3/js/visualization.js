var rafID, analyserContext, canvasWidth, canvasHeight;

function cancelAnalyserUpdates() { // останавливаем визуализацию и очищаем канвас
	window.cancelAnimationFrame( rafID );
	rafID = null;
	analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

function analyserSourse() { // анализ потока
	analyser = context.createAnalyser(); // создаем контекст анализатора
	filters[filters.length - 1].connect(analyser); // подключаем асточник к анализатору
	analyser.fftSize = 2048; // Размерность преобразования Фурье
	updateAnalysers(); 
}

function updateAnalysers() { // обновление анализатора

	if (!analyserContext) { // создаем холст
		var canvas = document.getElementById("analyser");
		canvasWidth = canvas.width;
		canvasHeight = canvas.height; 
		analyserContext = canvas.getContext('2d');
	}
	
	// визуализация 
	var SPACING = 3; // размер шага
	var BAR_WIDTH = 1.2; // ширина пики
	var numBars = Math.round(canvasWidth / SPACING); // определяем длину волны

	var freqByteData = new Uint8Array(analyser.frequencyBinCount); // создаем массив для хранения данных
	analyser.getByteFrequencyData(freqByteData); // получаем данные
		
	analyserContext.clearRect(0, 0, canvasWidth, canvasHeight); // очищаем канвас

	var grd=analyserContext.createLinearGradient(canvasWidth, 0, canvasWidth, canvasHeight); // создаем градиент
	grd.addColorStop(1,'#325390');
	grd.addColorStop(0.65,'#49A4C8');
	grd.addColorStop(0.35,'#62AB79');
	analyserContext.fillStyle=grd;

	var multiplier = analyser.frequencyBinCount / numBars; 

	// Рисуем канвас для каждого элемента  
	for (var i = 0; i < numBars; ++i) {
		var magnitude = 0; 
		var offset = Math.floor( i * multiplier * 0.8 ); // смещение
		
		for (var j = 0; j< multiplier; j++)
			magnitude += freqByteData[offset + j];
		magnitude = magnitude / multiplier; 
		analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude/1.5);
	}
	rafID = window.requestAnimationFrame( updateAnalysers ); // Запрос покадровой анимации
}
