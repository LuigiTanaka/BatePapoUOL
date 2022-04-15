let nomeUsuario;
let start = 0;
let ultimaMsg = document.querySelector(".mensagens");

function entrarSala() {
  nomeUsuario = prompt("Qual seu nome?");
  let objNome = { name: nomeUsuario };
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    objNome
  );
  promise.then(obterMensagens);
  promise.catch(erroEntrada);
}

function erroEntrada(erro) {
  if (erro.response.status === 400) {
    alert("Já existe um usuário online com esse nome!");
    entrarSala();
  } else {
    alert("Desculpe, tivemos um erro inesperado. Por favor tente novamente!");
    entrarSala();
  }
}

function obterMensagens() {
  let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(carregarMensagens);
}

function carregarMensagens(response) {
  let mensagens = response.data;
  let containerMensagens = document.querySelector(".mensagens");
  containerMensagens.innerHTML = "";

  for (let i = 0; i < mensagens.length; i++) {
    if (mensagens[i].type === "status") {
      containerMensagens.innerHTML += `
            <div class="msg-status">
                <span class="hora">(${mensagens[i].time})</span>
                <span class="nome">${mensagens[i].from}</span>
                <span>${mensagens[i].text}</span>
            </div>`;
    } else if (mensagens[i].type === "message") {
      containerMensagens.innerHTML += `
            <div class="msg-normal">
                <span class="hora">(${mensagens[i].time})</span>
                <span class="nome">${mensagens[i].from}</span>
                <span>para</span>
                <span class="nome">${mensagens[i].to}: </span>
                <span>${mensagens[i].text}</span>
            </div>`;
    } else if (mensagens[i].type === "private_message") {
      containerMensagens.innerHTML += `
            <div class="msg-reservada">
                <span class="hora">(${mensagens[i].time})</span>
                <span class="nome">${mensagens[i].from}</span>
                <span>reservadamente para</span>
                <span class="nome">${mensagens[i].to}: </span>
                <span>${mensagens[i].text}</span>
            </div>`;
    }
  }

  let newUltimaMsg = document.querySelector(".mensagens").lastElementChild;

  if (newUltimaMsg.innerHTML !== ultimaMsg.innerHTML) {
    newUltimaMsg.scrollIntoView();
    ultimaMsg = newUltimaMsg;
  }

  if (start === 0) {
    setInterval(manterConexao, 4500);
    setInterval(obterMensagens, 3000);
    start++;
  }
}

function manterConexao() {
  let objNome = { name: nomeUsuario };
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objNome);
}

function enviarMensagem() {
  let textoMensagem = document.querySelector("input").value;
  let mensagem = {
    from: nomeUsuario,
    to: "Todos",
    text: textoMensagem,
    type: "message" // ou "private_message" para o bônus
  };

  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    mensagem
  );
  promise.then(sucessoEnvio);
  promise.catch(erroEnvio);
}

function sucessoEnvio() {
  obterMensagens();
  document.querySelector("input").value = "";
}

function erroEnvio(erro) {
  if (erro.response.status !== 400) {
       window.location.reload();
  } 
}

entrarSala();
