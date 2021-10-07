/*
// Grafo hecho de ejemplo 
var nodos = [{ id: 0 }, { id: 1 }, { id: 2 }, {id: 3}];

var vinculos = [
  { source: 0, target: 1 },
  { source: 1, target: 0 },
  { source: 1, target: 2 },
  { source: 2, target: 0 },
  { source: 3, target: 2 }
];
*/

// Grafo vacio
var nodos = [], vinculos = [];

var source = [], target = [];
var ultimoNodo = nodos.length;
var auxMatrix = [], matricita = [], matrioska = [], mIndentidad = [], mAnterior = [];
var mcaminos = [], matrizRes = [], c = [];
var columm = null;
var colores =  d3.schemeDark2;
const uuid = Math.floor(Math.random() * 1e9);
var mousedownNode = null;
var tool = null, seleccion = null;
var yoffset = 42;
var w = window.innerWidth, h = window.innerHeight - yoffset, radio = 12;
var conexion = 0, caminocta = 0, vSimples = 0, region = 0;

var svg = d3.select(".espacio")
svg.attr("width", w).attr("height", h);
svg.on("contextmenu", function() {
  d3.event.preventDefault();
});

var dragLine = svg
  .append("path")
  .attr("class", "dragLine hidden")
  .attr("d", "M0,0L0,0");
  
var flecha = svg
  .append('defs')
  .append('marker')
  .attr('id', `arrowhead-${uuid}`)
  .attr('viewBox', '-0 -5 10 10')
  .attr('refX', 18)
  .attr('refY', 0)
  .attr('orient', 'auto')
  .attr('markerWidth', 3)
  .attr('markerHeight', 3)
  .attr('xoverflow', 'visible')
  .append('svg:path')
  .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
  .attr('fill', "#999")
  .attr('stroke', "#999");

var aristas = svg.append("g").selectAll(".arista");
var vertices = svg.append("g").selectAll(".vertice");

var force = d3
  .forceSimulation()
  .force(
    "charge",
    d3
      .forceManyBody()
      .strength(-300)
      .distanceMax(w / 2)
  )
  .force("link", d3.forceLink().distance(60))
  .force("x", d3.forceX(w / 2))
  .force("y", d3.forceY(h / 2))
  .on("tick", tick);

force.nodes(nodos);
force.force("link").links(vinculos);

var limpiarBtn = document.querySelector(".limpiar");
limpiarBtn.addEventListener("click", limpiarTodo);

// Boton Acerca
var acercaBtn = document.querySelector(".acerca");
var modal = document.querySelector(".modal");
var modalIng = document.querySelector(".modal-ingreso");
var tutoIng = document.querySelector(".modal-tutorial");
acercaBtn.addEventListener("click", e => {
  modal.style.display = "block";
})
window.onclick = function(e) {
  if (e.target == modal || e.target == modalIng || e.target == tutoIng) {
    modal.style.display = "none";
    modalIng.style.display = "none";
    tutoIng.style.display = "none";
  }
}

var imagenes = ['./img/crearg.gif','./img/link.gif','./img/simple.gif','./img/borrar.gif','./img/opciones.gif','./img/propiedades.gif'], cont=0;

function imgTuto(aboutTitulo){
  aboutTitulo.addEventListener('click', e =>{
    let atras = aboutTitulo.querySelector('.atras'),
        adelante = aboutTitulo.querySelector('.adelante'),
        img = aboutTitulo.querySelector('img'),
        tgt = e.target;

      if(tgt == atras){
        if(cont > 0){
          img.src = imagenes[cont - 1];
          cont= cont-1;
        } else {
            img.src = imagenes[imagenes.length - 1];
            cont = imagenes.length - 1;
          }
      }else if (tgt == adelante){
        if(cont < imagenes.length - 1){
          img.src = imagenes[cont + 1];
          cont=cont+1;
        } else{
            img.src = imagenes[0];
            cont = 0;
          }
      }
  });
}

document.addEventListener("DOMContentLoaded", ()=> {
  let aboutTitulo=document.querySelector('.aboutTitulo');
   imgTuto(aboutTitulo);
});

//Boton tutorial
var tutorialBtn = document.querySelector(".tutorial");
tutorialBtn.addEventListener("click", e => {
  tutoIng.style.display = "block";
});

// Boton Visualizar
var visualizarBtn = document.querySelector(".visualizar");
visualizarBtn.addEventListener("click", e => {
  modalIng.style.display = "block";
  limpiarTodo();
});
// Input Visualizar
var inputGrafos = document.querySelector('input[name="ginput"]')
inputGrafos.addEventListener("onkeypress", e => {
  e.preventDefault();
  if (e.keyCode == 13) {ingresoDatos();}
});
var submit = document.querySelector('button[type="submit"]')
submit.addEventListener("click", e => {
  modalIng.style.display = "none";
  ingresoDatos();
})

// Ingreso de nodos por texto
var stringcito;
function ingresoDatos() {
  stringcito = inputGrafos.value;
  var stringNodos = inputGrafos.value;

  regexRule = /([\d],[\d])+/g;
  var arrayNodos = [...stringcito.match(regexRule)]
  console.log(arrayNodos);
  contador=0;
  test=arrayNodos.length+1;
  while(contador<test){
    var newNode = {id: contador};
    nodos.push(newNode);
    contador++;
  }
  /*for(let index = 0; index <= test; index++){
    
    var newNode = {id: contador};
    nodos.push(newNode);
    contador++;
    
  }*/
  for(let iindex = 0; iindex < arrayNodos.length; iindex++){
    var newLink = { source: parseInt(arrayNodos[iindex][0], 10), target: parseInt(arrayNodos[iindex][2], 10)};
    vinculos.push(newLink);
  }

  restart();
  console.log(vinculos);
  console.log(nodos);
}

// Checkbox Numeros
var numLabel = document.querySelector('input[name="numeros"]');
numLabel.addEventListener("click", mostrarNum);
function mostrarNum() {
  if (numLabel.checked == true) {
    d3.selectAll(".texto").style("display", "inline");
  } else {
    d3.selectAll(".texto").style("display", "none");
  }
}

// Checkbox Flechas
var flechaCheck = document.querySelector('input[name="flechas"]');
flechaCheck.addEventListener("click", mostrarFlechas);
function mostrarFlechas() {
  if (flechaCheck.checked == true) {
    document.querySelectorAll(".arista").forEach(function (d) {
      d.setAttribute("marker-end", "url(#arrowhead-" + uuid + ")");
    })
      
  } else {
    document.querySelectorAll(".arista").forEach(function (d) {
      d.setAttribute("marker-end", "");
    })
  }
}

svg
  .on("mousedown", añadirNodo)
  .on("mousemove", updateDragLine)
  .on("mouseup", hideDragLine)
  .on("mouseleave", hideDragLine);

// Actualiza la simulación
function tick() {
  aristas
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  vertices.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}

// Vacia el grafo
function limpiarTodo() {
  nodos.splice(0);
  vinculos.splice(0);
  ultimoNodo = 0;
  d3.selectAll("text").remove();
  restart();
}

 document.querySelector(".matrizhide").addEventListener("click", e => {
  var tablamatriz = document.querySelector(".matriz-ady")
  var tablamatrizC = document.querySelector(".matriz-c")
  var labelAdy = document.querySelector(".label-ady")
  var labelC = document.querySelector(".label-c")
  if (tablamatriz.style.display == "block") {
    tablamatriz.style.display = "none";
    tablamatrizC.style.display = "none";
    labelAdy.style.display = "none";
    labelC.style.display = "none";
    document.querySelector('img[alt="menos"]').style.display = "none";
    document.querySelector('img[alt="mas"]').style.display = "block";
  } else {
    tablamatriz.style.display = "block";
    tablamatrizC.style.display = "block";
    labelAdy.style.display = "block";
    labelC.style.display = "block";
    document.querySelector('img[alt="menos"]').style.display = "block";
    document.querySelector('img[alt="mas"]').style.display = "none";
  }
});

// Boton Propiedades
document.querySelector(".propiedades").addEventListener("click", propiedades);
var labelre = document.querySelector(".region");
var barraderecha = document.querySelector(".derecha");
var nAristas = document.querySelector(".naristas");
var nVertices = document.querySelector(".nvertices");
var vinculosReales = new Array ( );
var vinculoIndex = [];

// Hover Vertices
nVertices.addEventListener("mouseenter", e => {
  document.querySelectorAll(".vertice").forEach(function(d){d.setAttribute("class", "vertice seleccionado");})
  setTimeout(function(){
    document.querySelectorAll(".vertice").forEach(function(d){d.setAttribute("class", "vertice");})
  }, 500)
})
// Hover Aristas
nAristas.addEventListener("mouseenter", e => {
  document.querySelectorAll(".arista").forEach(function(d){d.setAttribute("class", "arista arselect");})
  flecha.attr("stroke", "darkorange").attr("fill", "darkorange")
  setTimeout(function(){
    document.querySelectorAll(".arista").forEach(function(d){d.setAttribute("class", "arista");})
    flecha.attr("stroke", "#999").attr("fill", "#999")
  }, 500)
})
// Hover Regiones
labelre.addEventListener("mouseenter", e => {
  d3.selectAll(".aristas")
  setTimeout(function() {
    d3.selectAll(".aristas")
  }, 500)
})

// Remueve enventos del mouse anteriores
function cambioTool(toolname) {
  var toolBtn1 = 'button[name="', toolBtn2= '"]';
  tool = toolBtn1 + toolname + toolBtn2;
  d3.selectAll(".tool").classed("activo", false);
  d3.select(tool).classed("activo", true);
  tool = toolname;
  
  svg
  .on("mousedown", null)
  .on("mousemove", null)
  .on("mouseup", null);
  
  vertices
    .on("mousedown", null)
    //.on("mousemove", null)
    //.on("mouseup", null);

  aristas
    .on("mousedown", null)
    //.on("mousemove", null)
    .on("mouseup", null);

  restart();
}

function añadirNodo() {
  var e = d3.event;
  if (e.button == 0) {
    var coords = d3.mouse(e.currentTarget);
    var newNode = { x: coords[0], y: coords[1], id: ++ultimoNodo };
    nodos.push(newNode);
    restart();
  }
}

function borrarNodo(d, i) {  
  nodos.splice(nodos.indexOf(d), 1);
  var vinculosToRemove = vinculos.filter(function(l) {
    return l.source === d || l.target === d;
  });
  vinculosToRemove.map(function(l) {
    vinculos.splice(vinculos.indexOf(l), 1);
  });
  d3.event.preventDefault();
  restart();
}

function removeEdge(d, i) {
  vinculos.splice(vinculos.indexOf(d), 1);
  d3.event.preventDefault();
  restart();
}

function beginDragLine(d) {
  //to prevent call of añadirNodo through svg
  d3.event.stopPropagation();
  d3.event.preventDefault();
  mousedownNode = d;
  dragLine
    .classed("hidden", false)
    .attr(
      "d",
      "M" +
        mousedownNode.x +
        "," +
        mousedownNode.y +
        "L" +
        mousedownNode.x +
        "," +
        mousedownNode.y
    );
}

function updateDragLine() {
  var coords = d3.mouse(d3.event.currentTarget);
  if (!mousedownNode) return;
  dragLine.attr(
    "d",
    "M" +
      mousedownNode.x +
      "," +
      mousedownNode.y +
      "L" +
      coords[0] +
      "," +
      coords[1]
  );
}

function hideDragLine() {
  dragLine.classed("hidden", true);
  mousedownNode = null;
}

function endDragLine(d) {
  if (!mousedownNode || mousedownNode === d) return;   //Evita bug source.id = null y nodos vinculados así mismos  
  for (let index = 0; index < vinculos.length; index++) {   //Evita crear vinculos ya existentes
    var l = vinculos[index];
    if (l.source === mousedownNode && l.target === d) return;
  }
  var newLink = { source: mousedownNode, target: d };
  vinculos.push(newLink);
  restart();
}

function nVinculos(nvinculos) {
  var cta = 0, zero = 0, uno = 1;
  for (let i = 0; i < nvinculos.length; i++) {
    for (let j = 0; j < nvinculos.length; j++) {
      if(nvinculos[i][zero] === nvinculos[j][uno] && nvinculos[i][uno] === nvinculos[j][zero]) {
        cta++;
      }
    }
  }
  vSimples = cta/2;
  cta = nvinculos.length - vSimples; 
  return(cta) 
}

function aristasVertices(){
  for (let index = 0; index < vinculos.length; index++) {
    for (let jndex = 0; jndex < vinculos.length; jndex++) {
      if (index == jndex) {
        vinculosReales[index] = new Array (vinculos[index].source.id , vinculos[jndex].target.id);
      }
    }
  }
  
  for (let index = 0; index < vinculosReales.length; index++) {
    for (let jndex = 0; jndex < vinculosReales.length; jndex++) {
      if (jndex == 0) {
        vinculoIndex[index] = vinculosReales[index][jndex];
      }
    }
  }
  nAristas.innerHTML = nVinculos(vinculosReales);
  nVertices.innerHTML = nodos.length;
}

function tabla(matriz) {
  var tabla= "<table border=\"0\">";
     
  tabla += "<tr><td></td>";
  for(let jndex = 0; jndex<nodos.length; jndex++) { 
      tabla += "<td>" + (jndex + 1) + "</td>";
  }
  tabla+="</tr>";
  
  for(let index = 0; index < nodos.length; index++) {
      tabla += "<tr>";
      tabla += "<td>" + (index+1) + "</td>";
      for(let jndex = 0; jndex < nodos.length; jndex++) { 
          tabla += "<td>" + matriz[index][jndex] + "</td>";
      }
      tabla += "</tr>";
  }
  tabla += "</table>";

  return tabla;
}

// Muestra las propiedades del grafo
function propiedades() {
  
  barraderecha.style.height = "auto";
  
  aristasVertices();
  regiones();
  tipoGrafo();
  
  for (let index = 0; index < vinculos.length; index++) {
    columm = vinculos[index];
    source.push(columm.source.index);
    target.push(columm.target.index);
    auxMatrix.push([index]);
  }
  matricita.push(source);
  matricita.push(target);

  for (let index = 0; index < nodos.length; index++) {
    auxMatrix[index] = source[index] + "," + target[index];
  }
  
  // Llena una matriz con 0's
  for (let index = 0; index < nodos.length; index++) {
    matrioska[index] = Array(nodos.length).fill(0);
    mIndentidad[index] = Array(nodos.length).fill(0);
    matrizRes[index] = Array(nodos.length).fill(0);
  }
  
  //Matriz Indentidad
  for (let index = 0; index < nodos.length; index++) {
    for (let jndex = 0; jndex < nodos.length; jndex++) {
      if (index == jndex) {
        mIndentidad[index][jndex] = 1;
      }
    }    
  }  
  
  //Matriz funcionando
  for (let jndex = 0; jndex <= nodos.length - 1; jndex++) {
    for (let kndex = 0; kndex <= source.length - 1; kndex++) {
      for (let lndex = 0; lndex <= matricita.length - 1; lndex++) {
        var m = matricita[lndex][kndex];
        if (lndex == 0) {
          mm = m;
        }
      }
      matrioska[mm][m] = 1;
    }
    break;
  }
  
  var matrizAdy = tabla(matrioska);
  document.querySelector(".matriz-ady").innerHTML = matrizAdy;
  mAnterior = matrioska;
  matrizCaminos(matrioska);
  conexo();
  //plano();
  completo();
}

// Función para sumar Matrices
function sumMatrices (matriz1, matriz2) {
  var sum = 0;
  for (let index = 0; index < matriz1.length; index++) {
    for (let jndex = 0; jndex < matriz1.length; jndex++) {
      sum = matriz1[index][jndex] + matriz2[index][jndex];
      matrizRes[index][jndex] = sum;    
    }
  }
  return matrizRes;
}

//Matriz M2 M3 M4
function matrizCaminos(mcaminos) {
  var sum = 0;
  var matrixAux = [], mSum = [];
  var n = nodos.length - 1;

  for (let index = 0; index < mcaminos.length; index++) {
    matrixAux[index] = [];
    for (let jndex = 0; jndex < mcaminos[0].length; jndex++) {
      for (let kndex = 0; kndex < mcaminos[0].length; kndex++) {
        sum += mcaminos[index][kndex] * matrioska[kndex][jndex];
      }
      matrixAux[index][jndex] = sum;
      sum = 0;
    }
  }
  mcaminos = matrixAux;
  caminocta++;
  if (caminocta == n) {
    c = sumMatrices(mIndentidad, mAnterior)
    var matrizC = tabla(c); //Necesita arreglo si es que luego la matriz se hace más grande
    document.querySelector(".matriz-c").innerHTML= matrizC;
    mcaminos = [];
    return caminocta = 0;
  }
  else {
    mSum = sumMatrices(mcaminos, mAnterior)
    mAnterior = mSum;
    return matrizCaminos(mcaminos);
  }
}

function regiones() {
  region = 2 - nodos.length + nVinculos(vinculosReales);
  document.querySelector(".region").innerHTML = region;
}

var tipo = document.querySelector(".tipo");
var conx = document.querySelector(".conexo");

function tipoGrafo() {
  if (vinculos.length == nVinculos(vinculosReales)) {
    tipo.innerHTML = "Es dirigido"
  }
  if (vinculos.length / 2 == nVinculos(vinculosReales)) {
    tipo.innerHTML = "Es Simple";
  }
  if (vinculos.length != nVinculos(vinculosReales) && vinculos.length / 2 != nVinculos(vinculosReales)) {
    tipo.innerHTML = "Es multidigrafo";
  } 
}

function conexo() {
  var conexo = null;
  for (let index = 0; index < c.length; index++) {
    for (let jndex = 0; jndex < c.length; jndex++) {
      if (c[index][jndex] == 0) {
        conexo = false;
        conx.innerHTML = "Es diconexo";
        break;
      }
    }
  }
  if (conexo == null) {
    conexo = true;
    conx.innerHTML = "Es conexo";
  }
}

function plano() {
  var caras = region - 1;
  plano = caras - nVinculos(vinculosReales) + nodos.length
  if (plano ==  2) {
    document.querySelector(".plano").innerHTML = "Es plano";
  } 
}

function completo() {
  var n = nodos.length;
  if (((n * (n - 1)) / 2) == nVinculos(vinculosReales)) {
    document.querySelector(".completo").innerHTML = "Es completo";
  }
}

function mayorGrado() {
  var grado = 0;
  for (let index = 0; index < vinculosReales.length; index++) {
   for (let jndex = 0; jndex < vinculosReales.length; jndex++) {
     if (matrioska[index][jndex] === 1) grado++;
   }
  }
  console.log(grado);
}

// Actualiza el grafo, vinculos y nodos
function restart() {
  aristas = aristas.data(vinculos, function(d) {
    return "v" + d.source.id + "-v" + d.target.id;
  });
  aristas.exit().remove();

  var ar = aristas
    .enter()
    .append("line")
    .attr("class", "arista")
    .attr('marker-end', `url(#arrowhead-${uuid})`)
    .on("mousedown", function() {
      d3.event.stopPropagation();
    })
    .on("contextmenu", removeEdge);

  ar.append("title").text(function(d) {
    return "v" + d.source.id + "-v" + d.target.id;
  });

  aristas = ar.merge(aristas);

  flecha.style("display", mostrarFlechas)

  vertices = vertices.data(nodos, function(d) {
    return d.id;
  });
  vertices.exit().remove();

  vertices.selectAll("text").text(function(d) {
    return d.id;
  });

  var ve = vertices
    .enter()
    .append("g")
    .attr("class", "vertice")
    .on("mousedown", beginDragLine)
    .on("mouseup", endDragLine)
    .on("contextmenu", borrarNodo);
    
  ve.append("circle")
    .attr("r", radio)
    .style("fill", "#d73380") // Añadir funcion de colores
    .append("title").text(function(d) {
      return "v" + d.id;
    });
    
    ve.append("text")
    .attr("class", "texto")
    .attr("x", function(d) {
      if (d.id < 10) return - 4;
       else return - 8;
    })
    .attr("y", 5)
    .style("dislay", mostrarNum)
    .text(function(d) {
      return d.id;
    });

  vertices = ve.merge(vertices);

  force.nodes(nodos);
  force.force("link").links(vinculos);
  force.alpha(0.8).restart();
}

restart();