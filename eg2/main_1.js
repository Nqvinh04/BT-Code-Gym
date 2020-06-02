let canvas;
let ctx;
let gBArrayHeight = 20; // Number of cells in array height - Số lượng ô trong chiều cao mảng
let gBArrayWidth = 12; // Number of cells in array width - Số lượng ô trong chiều rộng mảng
let startX = 4; // Starting X position for Tetromino - Bắt đầu vị trí X cho Tetromino
let startY = 0; // Starting Y position for Tetromino - Bắt đầu vị trí Y cho Tetromino
let score = 0; // Tracks the score - theo dõi điểm số
let level = 1; // Tracks current level - theo số cấp độ hiện tại
let winOrLose = "Playing";
// Used as a look up table where each value in the array
// contains the x & y position we can use to draw the - chưa vị trí X - y chúng ta có thể sủ dụng đề vẽ
// box on the canvas - hộp trên canvas
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let curTetromino = [[1,0], [0,1], [1,1], [2,1]];

// 3. Will hold all the Tetrominos - giữ tất cả các tetrominos
let tetrominos = [];
// 3. The tetromino array with the colors matched to the tetrominos array - màu sắc cho mảng
let tetrominoColors = ['purple','cyan','blue','yellow','orange','green','red'];
    // 3. Holds current Tetromino color - Giữ màu Tetromino hiện tại
let curTetrominoColor;

// 4. Create gameboard array so we know where other squares are - Tạo mảng gameboard để chúng ta biết các ô vuông khác ở đâu
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));

// 6. Array for storing stopped shapes - mảng để lưu trữ hình dạng dừng
// It will hold colors when a shape stops and is added - Nó sẽ giữ màu khi hình dạng dừng lại và được thêm vào
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));

// 4. Created to track the direction I'm moving the Tetromino - Được tạo để theo dõi hướng tôi đang di chuyển Tetromino
//  so that I can stop trying to move through walls - để tôi có thể ngừng cố gắng di chuyển qua các bức tường
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;
// tọa độ
let Coordinates = function (x,y) {
        this.x = x;
        this.y = y;
    }

// Execute SetupCanvas when page loads - thực thi SetupCanvas khi tải trang
document.addEventListener('DOMContentLoaded', SetupCanvas);

// Creates the array with square coordinates [Lookup Table] - Tạo mảng với tọa độ vuông [Bảng tra cứu]
// [0,0] Pixels X: 11 Y: 9, [1,0] Pixels X: 34 Y: 9, ...
function CreateCoordArray(){
    let xR = 0, yR = 19;
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        // 12 * 23 = 276 - 12 = 264 Max X value
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            // console.log(i + ":" + j + " = " + coordinateArray[i][j].x + ":" + coordinateArray[i][j].y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    // Double the size of elements to fit the screen - Nhân đôi kích thước của các yếu tố để vừa với màn hình
    ctx.scale(2, 2);

    // Draw Canvas background - Vẽ nền Canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gameboard rectangle - Vẽ hình chữ nhật gameboard
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    // tetrisLogo = new Image(161, 54);
    // tetrisLogo.onload = DrawTetrisLogo;
    // tetrisLogo.src = "tetrislogo.png";

    // Set font for score label text and draw - Đặt phông chữ cho văn bản nhãn điểm và vẽ
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    // Draw score rectangle - Vẽ hình chữ nhật
    ctx.strokeRect(300, 107, 161, 24);

    // Draw score - Vẽ điểm
    ctx.fillText(score.toString(), 310, 127);

    // Draw level label text - Vẽ văn bản nhãn cấp
    ctx.fillText("LEVEL", 300, 157);

    // Draw level rectangle - Vẽ hình chữ nhật cấp
    ctx.strokeRect(300, 171, 161, 24);

    // Draw level - vẽ cấp độ
    ctx.fillText(level.toString(), 310, 190);

    // Draw next label text - vẽ văn bản tiếp theo
    ctx.fillText("WIN / LOSE", 300, 221);

    // Draw playing condition - Vẽ điều kiện chơi
    ctx.fillText(winOrLose, 310, 261);

    // Draw playing condition rectangle - Vẽ hình chữ nhật điều kiện chơi
    ctx.strokeRect(300, 232, 161, 95);

    // Draw controls label text - Vẽ văn bản điều khiển nhãn
    ctx.fillText("CONTROLS", 300, 354);

    // Draw controls rectangle - Vẽ văn bản điều khiển nhãn
    ctx.strokeRect(300, 366, 161, 104);

    // Draw controls text - Vẽ văn bản điều khiển
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Right", 310, 463);

    // 2. Handle keyboard presses - Xử lý nhấn bàn phím
    document.addEventListener('keydown', HandleKeyPress);

    // 3. Create the array of Tetromino arrays - Tạo mảng các mảng Tetromino
    CreateTetrominos();
    // 3. Generate random Tetromino - Tạo Tetromino ngẫu nhiên
    CreateTetromino();

    // Create the rectangle lookup table - Tạo bảng tra cứu hình chữ nhật
    CreateCoordArray();

    DrawTetromino();
}

// function DrawTetrisLogo(){
//     ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
// }

function DrawTetromino(){
    // Cycle through the x & y array for the tetromino looking - Chuyển qua mảng x & y để tìm tetromino
    // for all the places a square would be drawn - cho tất cả những nơi một hình vuông sẽ được vẽ
    for(let i = 0; i < curTetromino.length; i++){

        // Move the Tetromino x & y values to the tetromino - Di chuyển các giá trị Tetromino x & y sang tetromino
        // shows in the middle of the gameboard - hiển thị ở giữa bảng
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        // 4. Put Tetromino shape in the gameboard array - Đặt hình dạng Tetromino trong mảng gameboard
        gameBoardArray[x][y] = 1;
        // console.log("Put 1 at [" + x + "," + y + "]");

        // Look for the x & y values in the lookup table - Tìm các giá trị x & y trong bảng tra cứu
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        // console.log("X : " + x + " Y : " + y);
        // console.log("Rect X : " + coordinateArray[x][y].x + " Rect Y : " + coordinateArray[x][y].y);

        // 1. Draw a square at the x & y coordinates that the lookup - Vẽ một hình vuông tại tọa độ x & y mà tra cứu
        // table provides - bảng cung cấp
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// ----- 2. Move & Delete Old Tetrimino ----- Di chuyển và xóa Tetrimino cũ
// Each time a key is pressed we change the either the starting - Mỗi lần nhấn phím, chúng tôi sẽ thay đổi bắt đầu
// x or y value for where we want to draw the new Tetromino - giá trị x hoặc y cho nơi chúng tôi muốn vẽ Tetromino mới
// We also delete the previously drawn shape and draw the new one - Chúng tôi cũng xóa hình đã vẽ trước đó và vẽ hình mới
function HandleKeyPress(key){
    if(winOrLose != "Game Over"){
        // a keycode (LEFT) -  sang trái
        if(key.keyCode === 37){
            // 4. Check if I'll hit the wall - Kiểm tra xem tôi có va vào tường không
            direction = DIRECTION.LEFT;
            if(!HittingTheWall() && !CheckForHorizontalCollision()){
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }

            // d keycode (RIGHT) - sang phải
        } else if(key.keyCode === 39){

            // 4. Check if I'll hit the wall - Kiểm tra xem tôi có va vào tường không
            direction = DIRECTION.RIGHT;
            if(!HittingTheWall() && !CheckForHorizontalCollision()){
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }

            // s keycode (DOWN) - xuống dưới
        } else if(key.keyCode === 40){
            MoveTetrominoDown();
            // 9. e keycode calls for rotation of Tetromino - mã khóa gọi cho Tetromino
        } else if(key.keyCode === 69){
            RotateTetromino();
        }
    }
}

function MoveTetrominoDown(){
    // 4. Track that I want to move down - Theo dõi mà tôi muốn di chuyển xuống
    direction = DIRECTION.DOWN;

    // 5. Check for a vertical collision - Kiểm tra va chạm dọc
    if(!CheckForVerticalCollison()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

// 10. Automatically calls for a Tetromino to fall every second - Tự động gọi Tetromino giảm mỗi giây

window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDown();
    }
}, 1000);


// Clears the previously drawn Tetromino - Xóa Tetromino đã rút trước đó
// Do the same stuff when we drew originally - Làm những thứ tương tự khi chúng ta vẽ ban đầu
// but make the square white this time - nhưng làm cho hình vuông màu trắng lần này
function DeleteTetromino(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        // 4. Delete Tetromino square from the gameboard array - Xóa hình vuông Tetromino khỏi mảng gameboard
        gameBoardArray[x][y] = 0;

        // Draw white where colored squares used to be - Vẽ màu trắng nơi hình vuông màu thường được sử dụng
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// 3. Generate random Tetrominos with color - Tạo Tetrominos ngẫu nhiên với màu sắc
// We'll define every index where there is a colored block - Chúng tôi sẽ xác định mọi chỉ mục nơi có một khối màu
function CreateTetrominos(){
    // Push T
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Push Square
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino(){
    // Get a random tetromino index - Lấy chỉ số tetromino ngẫu nhiên
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    // Set the one to draw - Đặt một để vẽ
    curTetromino = tetrominos[randomTetromino];
    // Get the color for it - Lấy màu cho nó
    curTetrominoColor = tetrominoColors[randomTetromino];
}

// 4. Check if the Tetromino hits the wall - Kiểm tra xem Tetromino có đập vào tường không
// Cycle through the squares adding the upper left hand corner - Xoay vòng qua các ô vuông thêm góc trên bên trái
// position to see if the value is <= to 0 or >= 11 - vị trí để xem giá trị là <= đến 0 hoặc> = 11
// If they are also moving in a direction that would be off - Nếu họ cũng đang di chuyển theo hướng sẽ tắt
// the board stop movement - hội đồng quản trị dừng
function HittingTheWall(){
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}

// 5. Check for vertical collison - Kiểm tra va chạm dọc
function CheckForVerticalCollison(){
    // Make a copy of the tetromino so that I can move a fake - Tạo một bản sao của tetromino để tôi có thể di chuyển giả
    // Tetromino and check for collisions before I move the real - Tetromino và kiểm tra va chạm trước khi tôi di chuyển thật
    // Tetromino
    let tetrominoCopy = curTetromino;
    // Will change values based on collisions - Sẽ thay đổi giá trị dựa trên va chạm
    let collision = false;

    // Cycle through all Tetromino squares - Xoay các ô vuông
    for(let i = 0; i < tetrominoCopy.length; i++){
        // Get each square of the Tetromino and adjust the square - Lấy từng hình vuông của Tetromino và điều chỉnh hình vuông
        // position so I can check for collisions - vị trí để tôi có thể kiểm tra va chạm
        let square = tetrominoCopy[i];
        // Move into position based on the changing upper left - Di chuyển vào vị trí dựa trên thay đổi phía trên bên trái
        // hand corner of the entire Tetromino shape - góc tay của toàn bộ hình dạng Tetromino
        let x = square[0] + startX;
        let y = square[1] + startY;

        // If I'm moving down increment y to check for a collison - Nếu tôi đang di chuyển xuống y để kiểm tra va chạm
        if(direction === DIRECTION.DOWN){
            y++;
        }

        // Check if I'm going to hit a previously set piece - Kiểm tra xem tôi có trúng một bộ đã đặt trước đó không
        // if(gameBoardArray[x][y+1] === 1){
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            // console.log("COLLISON x : " + x + " y : " + y);
            // If so delete Tetromino - Nếu vậy hãy xóa Tetromino
            DeleteTetromino();
            // Increment to put into place and draw - Tăng để đưa vào vị trí và vẽ
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        // Check for game over and if so set game over text - kiểm tra trò chơi kết thúc và nếu vậy hãy đặt trò chơi qua văn bản
        if(startY <= 2){
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {

            // 6. Add stopped Tetromino to stopped shape array - Thêm Tetromino đã dừng vào mảng hình dạng đã dừng
            // so I can check for future collisions - vì vậy tôi có thể kiểm tra va chạm trong tương lai
            for(let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                // Add the current Tetromino color - Thêm màu Tetromino hiện tại
                stoppedShapeArray[x][y] = curTetrominoColor;
            }

                // 7. Check for completed rows - Kiểm tra các hàng đã hoàn thành
            CheckForCompletedRows();

            CreateTetromino();

            // Create the next Tetromino and draw it and reset direction -Tạo Tetromino tiếp theo và vẽ nó và đặt lại hướng
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }

    }
}

// 6. Check for horizontal shape collision - Kiểm tra va chạm hình ngang
function CheckForHorizontalCollision(){
    // Copy the Teromino so I can manipulate its x value - Sao chép Teromino để tôi có thể thao tác giá trị x của nó
    // and check if its new value would collide with - và kiểm tra xem giá trị mới của nó có va chạm với
    // a stopped Tetromino - một Tetromino đã dừng lại
    let tetrominoCopy = curTetromino;
    let collision = false;

    // Cycle through all Tetromino squares -   chạy qua các tất cả các ô vuông Tetromino
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Get the square and move it into position using - Lấy hình vuông và di chuyển nó vào vị trí bằng cách sử dụng
        // the upper left hand coordinates - tọa độ bên trái
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        // Move Tetromino clone square into position based - Di chuyển Tetromino clone vuông vào vị trí dựa
        // on direction moving - trên hướng di chuyển
        if (direction == DIRECTION.LEFT){
            x--;
        }else if (direction == DIRECTION.RIGHT){
            x++;
        }

        // Get the potential stopped square that may exist - Có được hình vuông dừng tiềm năng có thể tồn tại
        let stoppedShapeVal = stoppedShapeArray[x][y];

        // If it is a string we know a stopped square is there - Nếu đó là một chuỗi chúng ta biết một hình vuông dừng lại ở đó
        if (typeof stoppedShapeVal === 'string')
        {
            collision=true;
            break;
        }
    }

    return collision;
}

// 7. Check for completed rows -  Kiểm tra các hàng đã hoàn thành
// ***** SLIDE *****
function CheckForCompletedRows(){

    // 8. Track how many rows to delete and where to start deleting - Theo dõi có bao nhiêu hàng cần xóa và nơi bắt đầu xóa
    let rowsToDelete = 0;
    let startOfDeletion = 0;

    // Check every row to see if it has been completed - Kiểm tra từng hàng để xem nó đã được hoàn thành chưa
    for (let y = 0; y < gBArrayHeight; y++)
    {
        let completed = true;
        // Cycle through x values - chạy qua các giá trị X
        for(let x = 0; x < gBArrayWidth; x++)
        {
            // Get values stored in the stopped block array - nhận các giá trị trong mảng chuỗi dừng
            let square = stoppedShapeArray[x][y];

            // Check if nothing is there - Kiểm tra nếu không có gì ở đó
            if (square === 0 || (typeof square === 'undefined'))
            {
                // If there is nothing there once then jump out - Nếu không có gì ở đó một lần thì nhảy ra
                // because the row isn't completed - hàng chưa hoàn thành
                completed=false;
                break;
            }
        }

        // If a row has been completed - nếu hàng hoàn thành
        if (completed)
        {
            // 8. Used to shift down the rows - sử dụng để chuyển xuống các hàng
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;

            // Delete the line everywhere - xóa dòng ở mọi vị trí
            for(let i = 0; i < gBArrayWidth; i++)
            {
                // Update the arrays by deleting previous squares - Cập nhật các mảng bằng cách xóa các ô vuông trước đó
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                // Look for the x & y values in the lookup table - Tìm các giá trị x & y trong bảng tra cứu
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                // Draw the square as white - vẽ hình vuông màu trắng
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

// 8. Move rows down after a row has been deleted - Di chuyển hàng xuống sau khi một hàng đã bị xóa
function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for (let i = startOfDeletion-1; i >= 0; i--)
    {
        for(let x = 0; x < gBArrayWidth; x++)
        {
            let y2 = i + rowsToDelete;
            let square = stoppedShapeArray[x][i];
            let nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; // Put block into GBA - Đặt khối vào
                stoppedShapeArray[x][y2] = square; // Draw color into stopped - Vẽ màu thành dừng

                // Look for the x & y values in the lookup table - Tìm các giá trị x & y trong bảng tra cứu
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in GBA - Xóa vị trí trong GBA
                stoppedShapeArray[x][i] = 0; // Clear the spot in SSA - Xóa vị trí trong SSA
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

// 9. Rotate the Tetromino - Xoay Tetromino
// ***** SLIDE *****
function RotateTetromino()
{
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;

    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Here to handle a error with a backup Tetromino - Ở đây để xử lý lỗi với Tetromino sao lưu
        // We are cloning the array otherwise it would - Chúng tôi đang nhân bản mảng nếu không nó sẽ
        // create a reference to the array that caused the error - tạo một tham chiếu đến mảng gây ra lỗi
        curTetrominoBU = [...curTetromino];

        // Find the new rotation by getting the x value of the - Tìm góc quay mới bằng cách lấy giá trị x của
        // last square of the Tetromino and then we orientate - hình vuông cuối cùng của Tetromino và sau đó chúng tôi định hướng
        // the others squares based on it [SLIDE] - các hình vuông khác dựa trên nó [SLIDE]
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    // Try to draw the new Tetromino rotation - Cố gắng vẽ vòng xoay Tetromino mới
    try{
        curTetromino = newRotation;
        DrawTetromino();
    }
        // If there is an error get the backup Tetromino and - Nếu có lỗi, hãy lấy Tetromino dự phòng và
        // draw it instead - vẽ nó thay
    catch (e){
        if(e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

// Gets the x value for the last square in the Tetromino - Nhận giá trị x cho hình vuông cuối cùng trong Tetromino
// so we can orientate all other squares using that as - vì vậy chúng ta có thể định hướng tất cả các hình vuông khác bằng cách sử dụng
// a boundary. This simulates rotating the Tetromino - ranh giới. Điều này mô phỏng xoay Tetromino
function GetLastSquareX()
{
    let lastX = 0;
    for(let i = 0; i < curTetromino.length; i++)
    {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}