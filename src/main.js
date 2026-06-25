(function () {
  // ---- DOM refs ----
  const textInput = document.getElementById("textInput");
  const generateBtn = document.getElementById("generateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const asciiOutput = document.getElementById("asciiOutput");
  const copyBtn = document.getElementById("copyBtn");
  const toast = document.getElementById("toast");
  const styleBtns = document.querySelectorAll(".style-btn");
  const exampleChips = document.querySelectorAll(".example-chip");

  // ---- Estado ----
  let currentStyle = "standard"; // standard, block, mirror, dots

  // ---- Funciones de transformación ASCII ----
  function toAscii(text, style) {
    if (!text || text.trim() === "") return "⚠️ Escribe algo primero";

    const lines = text.split("\n");
    let result = "";

    switch (style) {
      case "standard":
        // Estilo clásico: cada letra se envuelve en un marco simple
        result = lines
          .map((line) => {
            if (line.trim() === "") return "";
            const chars = line.split("");
            const top = " .-.-.-.";
            const bottom = " `-´-´-´";
            let middle = "| ";
            for (let ch of chars) {
              middle += ch + " ";
            }
            middle += "|";
            return [top, middle, bottom].join("\n");
          })
          .join("\n\n");
        break;

      case "block":
        // Estilo bloque: cada letra con relleno
        result = lines
          .map((line) => {
            if (line.trim() === "") return "";
            const chars = line.split("");
            let block = "";
            for (let i = 0; i < 3; i++) {
              let row = "  ";
              for (let ch of chars) {
                if (i === 1) row += ` ${ch} `;
                else row += " █ ";
              }
              block += row + "\n";
            }
            return block.trimEnd();
          })
          .join("\n\n");
        break;

      case "mirror":
        // Efecto espejo (texto reflejado)
        result = lines
          .map((line) => {
            if (line.trim() === "") return "";
            const reversed = line.split("").reverse().join("");
            const mid = Math.floor(line.length / 2);
            const left = line.slice(0, mid);
            const right = line.slice(mid);
            return `→ ${line} ←\n← ${reversed} →`;
          })
          .join("\n\n");
        break;

      case "dots":
        // Arte con puntos (cada letra separada por puntos)
        result = lines
          .map((line) => {
            if (line.trim() === "") return "";
            const chars = line.split("");
            let dotArt = "";
            for (let i = 0; i < 3; i++) {
              let row = "";
              for (let ch of chars) {
                if (i === 1) row += `• ${ch} • `;
                else row += "•   • ";
              }
              dotArt += row.trimEnd() + "\n";
            }
            return dotArt.trimEnd();
          })
          .join("\n\n");
        break;

      default:
        result = lines.map((line) => `[ ${line} ]`).join("\n");
    }

    return result || "⚠️ No se pudo generar";
  }

  // ---- Renderizar ----
  function renderAscii() {
    const text = textInput.value;
    if (!text || text.trim() === "") {
      asciiOutput.className = "ascii-output placeholder";
      asciiOutput.textContent = '💬 Escribe algo y presiona "Generar ASCII"';
      return;
    }
    const asciiArt = toAscii(text, currentStyle);
    asciiOutput.className = "ascii-output";
    asciiOutput.textContent = asciiArt;
  }

  // ---- Limpiar ----
  function clearAll() {
    textInput.value = "";
    asciiOutput.className = "ascii-output placeholder";
    asciiOutput.textContent = "🧹 Limpio. Escribe algo nuevo.";
    // Reset estilo a standard
    styleBtns.forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector('.style-btn[data-style="standard"]')
      .classList.add("active");
    currentStyle = "standard";
  }

  // ---- Copiar ----
  function copyAscii() {
    const content = asciiOutput.textContent;
    if (
      !content ||
      content.includes("Escribe algo") ||
      content.includes("Limpio")
    ) {
      showToast("⚠️ No hay nada que copiar");
      return;
    }
    navigator.clipboard
      .writeText(content)
      .then(() => {
        showToast("✅ ¡Copiado al portapapeles!");
      })
      .catch(() => {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast("✅ ¡Copiado! (fallback)");
      });
  }

  // ---- Toast ----
  let toastTimeout = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  // ---- Eventos ----
  // Generar
  generateBtn.addEventListener("click", renderAscii);

  // Limpiar
  clearBtn.addEventListener("click", clearAll);

  // Copiar
  copyBtn.addEventListener("click", copyAscii);

  // Estilos
  styleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      styleBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentStyle = this.dataset.style;
      // Si hay texto, regenerar automáticamente
      if (textInput.value.trim() !== "") {
        renderAscii();
      }
    });
  });

  // Ejemplos (al hacer clic, rellenar input y generar)
  exampleChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      const text = this.dataset.text;
      textInput.value = text;
      renderAscii();
    });
  });

  // Ctrl+Enter para generar
  textInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      renderAscii();
    }
  });

  // ---- Inicializar con algo chulo ----
  textInput.value = "ASCII art";
  renderAscii();

  // ---- Extra: efecto de consola (pequeño easter egg) ----
  console.log(
    "%c⚡ ASCII ART STUDIO ⚡",
    "font-size:20px; font-weight:bold; color:#b8a58e;",
  );
  console.log("%cDiviértete generando arte ASCII", "color:#8b949e;");
})();
