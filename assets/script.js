const baseUrl = "https://el-geladon-backend-by-ip.herokuapp.com/paletas";

async function findAllPaletas() {
  const response = await fetch(`${baseUrl}/find-paletas`);

  const paletas = await response.json();
  // console.log("Response" , response) // => Utilizar essa grafia, e não o template string: ${`Response: ${response}`}
  console.log("paletas:", paletas); // para facilitar a correção, este console.log, está presente

  paletas.map((paleta) => {
    let isEdit = true;
    return document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="PaletaListaItem__acoes Acoes">
  <div class="PaletaListaItem" id="PaletaListaItem_${paleta._id}">
    <div>
      <div class="dropdown">
        <div class="dropdown-button" onclick="viewDropdown()" ;>
          <i class="bi bi-three-dots-vertical"></i>
        </div>

        <div class="dropdown-content" style="display: none">
          <button
            class="Acoes__editar"
            id="${paleta._id}"
            onclick="abrirModal(${isEdit})"
            >Editar</i
          </button>
          <button
            class="Acoes__deletar"
            id="${paleta._id}"
            onclick="deletePaleta('${paleta._id}')"
          >
            Deletar
          </button>
        </div>
      </div>

      <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
      <div class="PaletaListaItem__preco">R$ ${paleta.preco.toFixed(2)}</div>
      <div class="PaletaListaItem__descricao">${paleta.descricao}</div>
    </div>
    <img
      class="PaletaListaItem__foto"
      src="${paleta.foto}"
      alt="${`Paleta"
      de
      ${paleta.sabor}`}
    />
  </div>
</div>
  `
    );
  });
}

findAllPaletas();

async function findPaletaById() {
  const id = document.getElementById("idPaleta").value;

  const response = await fetch(`${baseUrl}/find-paleta/${id}`);
  const paleta = await response.json();

  console.log("paleta", paleta);
  let isEdit = true;

  const paletaEscolhidaDiv = document.getElementById("paletaEscolhida");

  //Por algum motivo, não chama a função de abrir o modal edit dentro de um button, só dentro desse <i>
  paletaEscolhidaDiv.innerHTML = `
    <div class="PaletaListaItem__acoes Acoes">
<div class="PaletaListaItem" id="PaletaListaItem_${paleta._id}">
  <div>
    <div class="dropdown">
      <div class="dropdown-button" onclick="viewDropdown()" ;>
        <i class="bi bi-three-dots-vertical"></i>
      </div>

      <div class="dropdown-content" style="display: none">
        <i
          class="Acoes__editar"
          id="${paleta._id}"
          onclick="abrirModal(${isEdit})"
          >Editar</i
        >
        <button
          class="Acoes__deletar"
          id="${paleta._id}"
          onclick="deletePaleta('${paleta._id}')"
        >
          Deletar
        </button>
      </div>
    </div>

    <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
    <div class="PaletaListaItem__preco">R$ ${paleta.preco.toFixed(2)}</div>
    <div class="PaletaListaItem__descricao">${paleta.descricao}</div>
  </div>
  <img
    class="PaletaListaItem__foto"
    src="${paleta.foto}"
    alt="${`Paleta"
    de
    ${paleta.sabor}`}
  />
</div>
</div>
`;
}

// modal acessado tanto pela barra de pesquisa, quanto pelas opções do dropdown-button
async function abrirModal(isEdit = false) {
  if (isEdit) {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma paleta";
    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const id = event.target.id;

    const response = await fetch(`${baseUrl}/find-paleta/${id}`);
    const paleta = await response.json();

    document.querySelector("#id").value = paleta._id;
    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma paleta";
    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }
  document.querySelector(".modal-overlay").style.display = "flex";
}

function fecharModalCadastro() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#sabor").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

// create paleta estava funcionando só, mas por algum motivo, ao adicionar o update paleta, parou de funcionar e
// tive que utilizar os dois dentro dessa função
async function submitPaleta() {
  const id = document.getElementById("id").value;
  const sabor = document.querySelector("#sabor").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const paleta = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };

  const modoEdicaoAtivado = !!id; // transforma um valor em booleano

  const endpoint = baseUrl + (modoEdicaoAtivado ? `/update/${id}` : "/create");

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await response.json();

  let isEdit = true;
  const html = `
    <div class="PaletaListaItem" id="PaletaListaItem_${paleta._id}">
      <div>
        <div class="PaletaListaItem__sabor">${novaPaleta.sabor}</div>
        <div class="PaletaListaItem__preco">R$ ${novaPaleta.preco.toFixed(
          2
        )}</div>
        <div class="PaletaListaItem__descricao">${novaPaleta.descricao}</div>

      <div class="PaletaListaItem__acoes Acoes">

      <div class="dropdown-content" style="display: none">
      <button
        class="Acoes__editar"
        id="${paleta._id}"
        onclick="abrirModal(${isEdit})"
        >Editar</i
      </button>
        <button 
           class="Acoes__deletar"
           id=${paleta._id}
           onclick="deletePaleta()">
           deletar
        </button>
      </div>
    </div>

      <img
        class="PaletaListaItem__foto"
        src=${novaPaleta.foto}
        alt=${`Paleta de ${novaPaleta.sabor}`} 
      />
</div>
`;

  if (modoEdicaoAtivado) {
    document.getElementById(`PaletaListaItem_${id}`).outerHTML = html;
  } else {
    document.getElementById("paletaList").insertAdjacentHTML("beforeend", html);
  }

  document.getElementById("id").value = "";

  fecharModalCadastro();
  document.location.reload(true);
}

async function deletePaleta(id) {
  const response = await fetch(`${baseUrl}/delete/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  const result = await response.json();
  alert(result.message);
  document.getElementById("paletaList").innerHTML = "";
  findAllPaletas();
}

// recurso extra para estilização => ver futuramente a utilização do map nesse forEach
function viewDropdown() {
  const buttons = document.querySelectorAll(".dropdown-button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const content = event.path[2].children[1];
      console.log(content);

      content.classList.toggle("active");

      if (content.classList.contains("active")) {
        content.style.display = "block";
      } else {
        content.style.display = "none";
      }

      content.addEventListener("mouseleave", () => {
        content.classList.remove("active");
        if (!content.classList.contains("active")) {
          content.style.display = "none";
        }
      });
    });
  });
}

viewDropdown();
