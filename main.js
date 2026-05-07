const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("imageUpload");
let uploadedImage = null;

// OPEN FILE PICKER
uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

// IMAGE SELECT
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  uploadedImage = file;
  showPreview(file);
});

function showPreview(file) {
  const uploadContainer = uploadBtn.parentElement;
  const reader = new FileReader();

  reader.onload = function (e) {
    // REPLACE CONTAINER CONTENT
    uploadContainer.innerHTML = `
      <div class="w-full h-full flex flex-col">
        <!-- IMAGE AREA -->
        <div class="grid grid-cols-2 gap-4 flex-1">
          <!-- ORIGINAL -->
          <div class="relative rounded-3xl overflow-hidden bg-gray-100">
            <img id="originalPreview" src="${e.target.result}" class="w-full h-full object-cover" />
            <div class="absolute bottom-4 left-4">
              <div class="bg-black/60 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                Original
              </div>
            </div>
          </div>
          <!-- RESULT -->
          <div id="resultBox" class="relative rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center">
            <div id="placeholder" class="text-gray-400 text-center">
              <span class="material-symbols-outlined text-6xl mb-3">image</span>
              <p class="text-lg">Processed image</p>
            </div>
          </div>
        </div>
        <!-- ACTIONS -->
        <div class="flex items-center justify-center gap-4 mt-6">
          <button id="processBtn" class="bg-secondary text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3">
            <span class="material-symbols-outlined">auto_awesome</span>
            Remove Background
          </button>
          <a id="downloadBtn" class="hidden bg-black text-white px-8 py-4 rounded-2xl font-semibold items-center gap-3">
            <span class="material-symbols-outlined">download</span>
            Download
          </a>
        </div>
        <!-- STATUS -->
        <p id="loadingText" class="text-center text-gray-500 mt-4"></p>
      </div>
    `;

    const processBtn = document.getElementById("processBtn");
    const resultBox = document.getElementById("resultBox");
    const loadingText = document.getElementById("loadingText");
    const downloadBtn = document.getElementById("downloadBtn");

    // REMOVE BG
    processBtn.addEventListener("click", async () => {
      try {
        processBtn.disabled = true;
        loadingText.innerText = "Processing image...";

        const formData = new FormData();
        formData.append('file', uploadedImage);

        const response = await fetch('/remove-bg', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Failed to process');

        const blob = await response.blob();
        const removedURL = URL.createObjectURL(blob);

        // SHOW RESULT
        resultBox.innerHTML = `
          <img src="${removedURL}" class="w-full h-full object-cover" />
          <div class="absolute bottom-4 right-4">
            <div class="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold">
              Clean Cut
            </div>
          </div>
        `;

        // DOWNLOAD BUTTON
        downloadBtn.href = removedURL;
        downloadBtn.download = "removed-background.png";
        downloadBtn.classList.remove("hidden");
        downloadBtn.classList.add("flex");

        loadingText.innerText = "Background removed successfully";
      } catch (err) {
        console.error(err);
        loadingText.innerText = "Failed to remove background";
      } finally {
        processBtn.disabled = false;
      }
    });
  };

  reader.readAsDataURL(file);
}

document.addEventListener("paste", (event) => {
  const items = event.clipboardData.items;
  for (const item of items) {
    if (item.type.indexOf("image") !== -1) {
      const file = item.getAsFile();
      uploadedImage = file;
      showPreview(file);
    }
  }
});