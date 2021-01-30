let
	canvas 		= document.querySelector(".graph__canvas"),
	ctx    		= canvas.getContext("2d");

	canvas.width = 630;
	canvas.height = canvas.width;

let 
	cell = (canvas.width - 70) / 8,													// Размер клетки
	field = [],
	checkers = [],
	isWhiteStep = true;


drawField();
startGame();

console.log(field);

canvas.addEventListener("click", checkerStep);

function checkerStep(e) {																			// Обработка нажатия на клетку
	for(let x = 0; x < 8; x++) {
		for(let y = 0; y < 8; y++) {																// Большое условие даёт понять на какую клетку нажали
			if((e.offsetX >= field[x][y].startX && e.offsetX <= field[x][y].startX + cell) && 
			   (e.offsetY >= field[x][y].startY && e.offsetY <= field[x][y].startY + cell)) {
				
				if(field[x][y].busy) {
					drawField();											// Перерисовываем всё						
					drawCheckers();
					ctx.lineWidth = 2;
					ctx.strokeStyle = "#A61212";
					ctx.strokeRect(field[x][y].startX, field[x][y].startY, cell, cell);
				}

				if (field[x][y].busy == true) {
					canvas.addEventListener("click", function step(e) {								// Обработка нажатия на клетку
						for(let xs = 0; xs < 8; xs++) {
							for(let ys = 0; ys < 8; ys++) {											// Большое условие даёт понять на какую клетку нажали
								if((e.offsetX >= field[xs][ys].startX && e.offsetX <= field[xs][ys].startX + cell) && 
								   (e.offsetY >= field[xs][ys].startY && e.offsetY <= field[xs][ys].startY + cell)) {
									if(field[xs][ys].busy == false) {								
										if((field[x][y].checkerColor == "black" && xs - x == 1 && (ys - y == 1 || ys - y == -1) && isWhiteStep == false) || 	
										   (field[x][y].checkerColor == "white" && xs - x == -1 && (ys - y == 1 || ys - y == -1) && isWhiteStep)) {	//Если шашка ходит
											delete field[x][y].busy;

											ctx.clearRect(0, 0, canvas.width, canvas.height);		// Очищаем холст

											drawField();											// Перерисовываем всё
											
											drawCheckers();
											drawChecker(field[x][y].checkerColor, xs, ys);
											console.log("step");
											console.log(ys - y);	

											isWhiteStep = !isWhiteStep;

										} else if (field[x][y].checkerColor == "black" && xs - x == 2 && ys - y != -1 && isWhiteStep == false) { //Если черная рубит
											console.log("loh");
											let leftCheck = false;
											if(field[x+1][y-1].checkerColor == "white" && field[x+1][y-1].busy) {
												leftCheck = true;
												console.log("left");
											}
											if(field[x+1][y+1].checkerColor == "white" && field[x+1][y+1].busy) {
												leftCheck = false;
												console.log("right");
											}  

											if (leftCheck) {
												delete field[x+1][y-1].busy;
											} else {
												delete field[x+1][y+1].busy;
											}
											delete field[x][y].busy;

											ctx.clearRect(0, 0, canvas.width, canvas.height);		// Очищаем холст

											drawField();											// Перерисовываем всё
											
											drawCheckers();
											drawChecker(field[x][y].checkerColor, xs, ys);
											console.log(field);
											
											isWhiteStep = !isWhiteStep;
										} else if (field[x][y].checkerColor == "white" && xs - x == -2 && ys - y != 1 && isWhiteStep == true) {		// Если белая рубит
											console.log("loh");
											let leftCheck = false;
											if(field[x-1][y+1].checkerColor == "black" && field[x-1][y+1].busy) {
												leftCheck = true;
												console.log("left");
											}
											if(field[x-1][y-1].checkerColor == "black" && field[x-1][y-1].busy) {
												leftCheck = false;
												console.log("right");
											}  

											if (leftCheck) {
												delete field[x-1][y+1].busy;
											} else {
												delete field[x-1][y-1].busy;
											}
											delete field[x][y].busy;

											ctx.clearRect(0, 0, canvas.width, canvas.height);		// Очищаем холст

											drawField();											// Перерисовываем всё
											
											drawCheckers();
											drawChecker(field[x][y].checkerColor, xs, ys);
											console.log(field);
											
											isWhiteStep = !isWhiteStep;
										}
											
									}									
								}
							}
						}
						canvas.removeEventListener("click", step);
					});	
				} 
			} 	
		}
	}

}	



function drawField() {
	ctx.restore();

	let 
		colorWhiteFlag = true,
		numberColumn   = 8,
		textRow	       = ["A", "B", "C", "D", "E", "F", "G", "H"];

	ctx.fillStyle = "#e7cfa9"														// Рисуем рамки
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 2;

	ctx.strokeStyle = "#000000"
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);



	for(let x = 1; x <= 8; x++) {													// Рисуем клетки
		let fieldX = field.length == 8 ? field[x-1] : [];							// Если уже была информация о клетках, то перезаписываем, если нет - создаем новую инфу

		for(let y = 1; y <= 8; y++) {
			colorWhiteFlag == true ? ctx.fillStyle = "#e7cfa9" : ctx.fillStyle = "#7c6249";
			ctx.fillRect(x * cell - 35, y * cell - 35, cell, cell);                 // Клетки

			fieldX.push({															// Добавляем информацию о клетках в строке
				startX: y * cell - 35,
				startY: x * cell - 35,
				white: colorWhiteFlag
			});

			colorWhiteFlag = !colorWhiteFlag;

			if (x == 1) {															// Рисуем цифры
				ctx.font = "20px sans-serif";
				let text = ctx.measureText(numberColumn);
				ctx.fillStyle = "#000";

				ctx.fillText(numberColumn--, x * cell - cell + text.width, y * cell + cell / 2 - 28);	
			} 
			if (y == 8) {															// Рисуем буквы
				ctx.font = "20px sans-serif";
				let text = ctx.measureText(textRow[x-1]);
				ctx.fillStyle = "#000";

				ctx.fillText(textRow[x-1], x * cell - text.width / 2, y * cell + cell - 10);
			}

		}
		field[x-1] = fieldX;														//Добавляем информацию о клетках в строке в массив поля

		colorWhiteFlag = !colorWhiteFlag;
	}
	ctx.save();
}

function drawChecker(color, x, y) {													// Рисуем шашку
	if (field[x][y].white == false) {
		if (color == "white") {
			ctx.beginPath();														// Белая шашка
			ctx.fillStyle = "#fff";
			ctx.arc(field[x][y].startX + 35, field[x][y].startY + 35, 30, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = "#E4E4E4";
			ctx.arc(field[x][y].startX + 35, field[x][y].startY + 35, 23, 0, 2 * Math.PI);
			ctx.fill();
		}
		if (color == "black") {
			ctx.beginPath();														// Черная шашка
			ctx.fillStyle = "#2A2A2A";
			ctx.arc(field[x][y].startX + 35, field[x][y].startY + 35, 30, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = "#3E3E3E";
			ctx.arc(field[x][y].startX + 35, field[x][y].startY + 35, 23, 0, 2 * Math.PI);
			ctx.fill();
		}
		field[x][y].busy = true;
		field[x][y].checkerColor = color;
	}
}

function drawCheckers() {
	for (let x = 0; x < 8; x++) {
		for(let y = 0; y < 8; y++) {
			if(field[x][y].busy == true) {											// Перерисовываем поле со всеми занятыми клетками
				drawChecker(field[x][y].checkerColor, x, y);
			} 
			if (field[x][y].hasOwnProperty("busy") == false) {
				field[x][y].busy = false;											// Если нет флага занятости, то добавляем
			}
		}
	}

}

function startGame() {																// Начало игры
	for (let x = 0; x < 8; x++) {
		for(let y = 0; y < 8; y++) {
			if(x <= 2) {
				drawChecker("black", x, y);
			}
			if(x >= 5) {
				drawChecker("white", x, y);
			}
			if (field[x][y].hasOwnProperty("busy") == false) {						// Если нет флага занятости, то добавляем
				field[x][y].busy = false;	
			}
		}
	}
}