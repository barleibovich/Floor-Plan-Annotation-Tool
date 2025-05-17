// Get canvas element
const canvas = document.getElementById("floorCanvas");
const ctx = canvas.getContext("2d");

let hoveredBoxIndex = null;
let isDrawing = false;
let startX, startY;
const boxes = [];
let floorImage = new Image();

//Load local storage
window.onload = () => {
  const savedImage = localStorage.getItem("floorImage");
  if (savedImage) {
    const savedBoxes = localStorage.getItem("boxes");
    if (savedBoxes) {
      boxes.push(...JSON.parse(savedBoxes));
    }

    floorImage.onload = () => {
      drawBoxes();
      rebuildTable();
    };
    floorImage.src = savedImage;
  }
};

// Get upload button
const uploadInput = document.getElementById("upload");
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    floorImage.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(floorImage, 0, 0, canvas.width, canvas.height);
      drawBoxes();
    };
    floorImage.src = event.target.result;
    localStorage.setItem("floorImage", event.target.result);
  };
  reader.readAsDataURL(file);
});

// Handle mouse down
canvas.addEventListener("mousedown", (e) => {
  const clickX = e.offsetX;
  const clickY = e.offsetY;

  if (isBoxExist(clickX, clickY)) return;

  startX = clickX;
  startY = clickY;
  isDrawing = true;
});

// Handle mouse move
canvas.addEventListener("mousemove", (e) => {
  const x = e.offsetX;
  const y = e.offsetY;

  if (isDrawing) {
    const width = x - startX;
    const height = y - startY;

    drawBoxes();
    //Draw temporary box
    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fillRect(startX, startY, width, height);

    ctx.strokeStyle = "rgba(0, 0, 255, 0.6)";
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(startX, startY, width, height);
    ctx.setLineDash([]);
    return;
  }

  //Get box index if hover over
  hoveredBoxIndex = boxes.findIndex(b =>
    x >= b.x && x <= b.x + b.width &&
    y >= b.y && y <= b.y + b.height
  );

  drawBoxes();
});


// Handle mouse up
canvas.addEventListener("mouseup", (e) => {
  if (!isDrawing) return;
  isDrawing = false;

  let x = startX;
  let y = startY;
  let width = e.offsetX - x;
  let height = e.offsetY - y;
  if (width < 0) {
    x += width;
    width = -width;
  }
  if (height < 0) {
    y += height;
    height = -height;
  }

  //Alert if Over lapping
  const newBox = { x, y, width, height };
  if (isBoxOverlapping(newBox)) {
    alert("Cannot create a box that overlaps with an existing box.");
    drawBoxes();
    return;
  }

  //Add new box
  const label = prompt("Enter label for this box:");
  if (label) {
    newBox.label = label;
    boxes.push(newBox);
    addToTable(newBox);
    localStorage.setItem("boxes", JSON.stringify(boxes));
  }
  drawBoxes();
});

//Draw boxes
function drawBoxes() {
  //Clear image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //Build image
  if (floorImage.src) {
    ctx.drawImage(floorImage, 0, 0, canvas.width, canvas.height);
  }

  //Color the box 
  boxes.forEach((box, i) => {
    ctx.strokeStyle = (i === hoveredBoxIndex) ? "blue" : "red";
    ctx.lineWidth = (i === hoveredBoxIndex) ? 2 : 1;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(box.label, box.x + 5, box.y - 15);
  });
}


//Add box to table
function addToTable(box) {
  const table = document.getElementById("annotationsTable");
  const index = boxes.length - 1;
  insertTableRow(table, box, index);
}

//Clear box by index
function deleteBox(index) {
  boxes.splice(index, 1);
  drawBoxes();
  rebuildTable();
  localStorage.setItem("boxes", JSON.stringify(boxes));
}

//Rebuild the table
function rebuildTable() {
  const table = document.getElementById("annotationsTable");
  //Clear all tabel's rows except header
  while (table.rows.length > 1) table.deleteRow(1);
  //Re-insert all the rows
  boxes.forEach((box, i) => {
    insertTableRow(table, box, i);
  });
}

//Insert new row into the table
function insertTableRow(table, box, index) {
  const row = table.insertRow();
  row.innerHTML = `
    <td>${box.label}</td>
    <td>${box.x}</td>
    <td>${box.y}</td>
    <td>${box.width}</td>
    <td>${box.height}</td>
    <td>
      <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        onclick="deleteBox(${index})">
        Delete
      </button>
    </td>
  `;
}



//Check if new box overlaps exist box
function isBoxOverlapping(newBox) {
  return boxes.some(box =>
    newBox.x < box.x + box.width &&
    newBox.x + newBox.width > box.x &&
    newBox.y < box.y + box.height &&
    newBox.y + newBox.height > box.y
  );
}

//Check if clicked on exist box
function isBoxExist(x, y) {
  for (let i = boxes.length - 1; i >= 0; i--) {
    const box = boxes[i];
    if (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      const confirmDelete = confirm(`You clicked on "${box.label}". Delete it?`);
      if (confirmDelete) {
        deleteBox(i)
      }
      return true;
    }
  }
  return false;
}

// Reset everything
function resetAnnotations() {
  localStorage.removeItem("boxes");
  localStorage.removeItem("floorImage");
  uploadInput.value = "";

  boxes.length = 0;
  floorImage.src = "";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rebuildTable();
}
