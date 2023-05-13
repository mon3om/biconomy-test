/////////////
/**
 * JavaScript code that is required in index.html build file for Drag and Drop feature to work.
 * Should be added after creating in the "createUnityInstance" function promise resolve block.
 */

function dragAndDrop(instance) {
  console.log("DragAndDrop script successfully added to HTML");
  container.addEventListener("dragover", (event) => {
    event.preventDefault();

    // Send dragover event to unity
    instance.SendMessage("DragAndDropManager", "DragOver");

    // Used to calculate the drop area depending on received data from Unity
    var canvasRect = canvas.getBoundingClientRect();
    const dropArea = {
      top:
        canvasRect.top +
        canvasRect.height / 2 +
        -window.dropLocation_height / 2 +
        -window.dropLocation_y,
      left:
        canvasRect.left +
        canvasRect.width / 2 -
        window.dropLocation_width / 2 +
        window.dropLocation_x,
      right:
        window.dropLocation_x +
        window.dropLocation_width / 2 +
        canvasRect.left +
        canvasRect.width / 2,
      bottom:
        window.dropLocation_height / 2 -
        window.dropLocation_y +
        canvasRect.top +
        canvasRect.height / 2,
    };

    // Check if mouse is inside drop area
    if (
      event.pageX >= dropArea.left &&
      event.pageX <= dropArea.right &&
      event.pageY >= dropArea.top &&
      event.pageY <= dropArea.bottom
    )
      instance.SendMessage("DragAndDropManager", "MouseEnterDropArea");
    else instance.SendMessage("DragAndDropManager", "MouseLeaveDropArea");
  });

  container.addEventListener("dragend", (event) => {
    event.preventDefault();
    instance.SendMessage("DragAndDropManager", "DragEnd");
  });

  container.addEventListener("drop", (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const first = files[0];
    const fileJson = JSON.stringify({
      path: window.URL.createObjectURL(first),
      name: first.name,
      type: first.type,
    });
    instance.SendMessage("DragAndDropManager", "Drop", fileJson);
  });
}

////////////////
