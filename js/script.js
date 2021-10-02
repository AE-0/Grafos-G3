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
var nodos = [];
var vinculos = [];


var source = [], target = [];
var ultimoNodo = nodos.length;
let auxMatrix = [];


var svg = d3.select(".espacio")
svg.on("contextmenu", function() {
  d3.event.preventDefault();
});

var yoffset = 42;
var xoffset = 293;
var w = window.innerWidth - xoffset, h = window.innerHeight - yoffset, radio = 10;
svg.attr("width", w).attr("height", h);

var dragLine = svg
  .append("path")
  .attr("class", "dragLine hidden")
  .attr("d", "M0,0L0,0");


const uuid = Math.floor(Math.random() * 1e9);

svg
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
var textos = svg.append("g").selectAll(".text");


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

var mousedownNode = null;
var tool = null;

var limpiarBtn = document.querySelector(".limpiar");
limpiarBtn.addEventListener("click", limpiarTodo);

// Boton Acerca
var acercaBtn = document.querySelector(".acerca");
var modal = document.querySelector(".modal");
var modalIng = document.querySelector(".modal-ingreso");
acercaBtn.addEventListener("click", e => {
  modal.style.display = "block";
})
window.onclick = function(e) {
  if (e.target == modal || e.target == modalIng) {
    modal.style.display = "none";
    modalIng.style.display = "none";
  }
}

// Boton Visualizar
var visualizarBtn = document.querySelector(".visualizar");
visualizarBtn.addEventListener("click", e => {
  modalIng.style.display = "block";
});
var inputGrafos = document.querySelector('input[name="ginput"]')
inputGrafos.addEventListener("onkeypress", e => {
  e.preventDefault();
  if (e.keyCode == 13) {ingresoDatos();}
});
var submit = document.querySelector('button[type="submit"]')
submit.addEventListener("click", ingresoDatos)

var stringcito;

// Ingreso de nodos por texto
function ingresoDatos() {
  stringcito = inputGrafos.value;
  var stringNodos = inputGrafos.value;

  regexRule = /\[[0-9],[0-9]\]/;
  var arrayNodos = [...stringcito.match(regexRule)]
  console.log(arrayNodos);

}

// Boton Propiedades ("temporal")
var propiedadesBtn = document.querySelector(".propiedades");
propiedadesBtn.addEventListener("click", propiedades);

var columm = null;

var matricita = [];
var matrioska = [];

function propiedades() {
  var nAristas = document.querySelector(".naristas");
  nAristas.innerHTML = "Aristas: " + vinculos.length;
  var nVertices = document.querySelector(".nvertices");
  nVertices.innerHTML = "Vertices: " + nodos.length;
  nVertices.addEventListener("mouseenter", e => {
    document.querySelectorAll(".vertice").forEach(function(d){d.setAttribute("class", "vertice seleccionado");})
    setTimeout(function(){
      document.querySelectorAll(".vertice").forEach(function(d){d.setAttribute("class", "vertice");})
    }, 500)
  })
  nAristas.addEventListener("mouseenter", e => {
    document.querySelectorAll(".arista").forEach(function(d){d.setAttribute("class", "arista seleccionado");})
    setTimeout(function(){
      document.querySelectorAll(".arista").forEach(function(d){d.setAttribute("class", "arista");})
    }, 500)
  })

  var barraderecha = document.querySelector(".derecha");
  barraderecha.style.height = "calc(100% - 45px)";


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
  
  //Llena una matriz con 0's
  for (let index = 0; index < nodos.length; index++) {
    matrioska[index] = Array(nodos.length).fill(0)
  }
  
  //Matriz funcionando
  for (let index = 0; index <= nodos.length - 1; index++) {
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
  }

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
          tabla += "<td>" + matrioska[index][jndex] + "</td>";
      }
      tabla += "</tr>";
  }
  tabla += "</table>";

  document.querySelector(".matriz").innerHTML=tabla;
}

var numLabel = document.querySelector('input[name="numeros"]');
numLabel.addEventListener("click", e => {
  if (numLabel.checked == true) {
    textos.style("display", "inline");
  } else {
    textos.style("display", "none");
  }
});


var flechaCheck = document.querySelector('input[name="flechas"]');
flechaCheck.addEventListener("click", e => {
  if (flechaCheck.checked == true) {
    document.querySelectorAll(".arista").forEach(function (d) {
      d.setAttribute("marker-end", "url(#arrowhead-" + uuid + ")");
    })
      
  } else {
    document.querySelectorAll(".arista").forEach(function (d) {
      d.setAttribute("marker-end", "");
    })
  }
});
// Boton Crear 
var crearBtn = d3.select('button[name="crear"]');
crearBtn.on("click", function(d) {
  cambioTool("crear");
  svg
    .on("mousedown", añadirNodo)
    .on("mousemove", updateDragLine)
    .on("mouseup", hideDragLine)
    .on("mouseleave", hideDragLine);
});

var seleccion = null;

// Boton Mover
var moverBtn = d3.select('button[name="mover"]');
moverBtn.on("click", function(d) {
  cambioTool("mover");
//  vertices.on("mousedown", function(e) {
//    console.log(e)
//    seleccion = e;
//    restart();
//  });
});

// Boton Borrar
var borrarBtn = d3.select('button[name="borrar"]');
borrarBtn.on("click", function(d) {
  cambioTool("borrar");
//  vertices.on("mousedown", borrarNodo);
//  aristas.on("mousedown", borrarNodo);
});


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

  vertices
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
  textos
    .attr("x", function(d) {
      if (d.id < 10) {
        return d.x - 4;
      } else {
        return d.x - 9;
      }
    })
    .attr("y", function(d) {
      return d.y + 5;
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

// Remueve enventos del mouse anteriores
function cambioTool(toolname) {
  var toolBtn1 = 'button[name="', toolBtn2= '"]';
  tool = toolBtn1 + toolname + toolBtn2;
  document.querySelectorAll(".tool").forEach(function(d) {
    d.setAttribute("class", "tool");
  });
  document.querySelector(tool).setAttribute("class", "tool activo");
  svg
    .on("mousedown", null)
    .on("mousemove", null)
    .on("mouseup", null);
  vertices
    .on("mousedown", null)
    .on("mousemove", null)
    .on("mouseup", null);
  aristas
    .on("mousedown", null)
    .on("mousemove", null)
    .on("mouseup", null);
  tool = toolname;
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
  var texto1 = '.texto[id="', texto2= '"]';
  var textoB = texto1 + nodos.indexOf(d) + texto2;
  var vinculosToRemove = vinculos.filter(function(l) {
    return l.source === d || l.target === d;
  });
  vinculosToRemove.map(function(l) {
    vinculos.splice(vinculos.indexOf(l), 1);
  });
  d3.event.preventDefault();
  d3.select(textoB).remove()
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
  //to prevent dragging of svg in firefox
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
  restart();
}

function endDragLine(d) {
  if (!mousedownNode || mousedownNode === d) return;
  //return if link already exists
  for (let index = 0; index < vinculos.length; index++) {
    var l = vinculos[index];
    if (
      (l.source === mousedownNode && l.target === d) ||
      (l.source === d && l.target === mousedownNode)
    ) {
      return;
    }
  }
  var newLink = { source: mousedownNode, target: d };
  vinculos.push(newLink);
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

  vertices = vertices.data(nodos, function(d) {
    return d.id;
  });
  vertices.exit().remove();

  if (tool === "mover") {
    var ve = vertices
      .on("mousedown", function() {
        ve.style("fill", "#57d733");
      });
  } else {
    var ve = vertices
      .enter()
      .append("circle")
      .attr("r", radio)
      .attr("class", "vertice")
      .style("fill", "#d73380") // Añadir funcion de colores
      .on("mousedown", beginDragLine)
      .on("mouseup", endDragLine)
      .on("contextmenu", borrarNodo);

    ve.append("title").text(function(d) {
      return "v" + d.id;
    });

    vertices = ve.merge(vertices);
  }

  textos = textos.data(nodos, function(d) {
    return d.id;
  });

  var te = textos
    .enter()
    .append("text")
    .text(d => d.id)
    .attr("class", "texto")
    .attr("id", d => d.id)
    .on("mousedown", beginDragLine)
    .on("mouseup", endDragLine)
    .on("contextmenu", borrarNodo);

  textos = te.merge(textos);

  force.nodes(nodos);
  force.force("link").links(vinculos);
  force.alpha(0.8).restart();
}

restart();