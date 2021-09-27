/*
// Grafo hecho de ejemplo 
var nodos = [{ id: 0 }, { id: 1 }, { id: 2 }];

var vinculos = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 1, target: 2 }
];
*/

// Grafo vacio
var nodos = [];
var vinculos = [];

var ultimoNodo = nodos.length;

var svg = d3.select(".espacio")
svg.on("contextmenu", function() {
  d3.event.preventDefault();
});

var yoffset = 42;
var xoffset = 43;
var w = window.innerWidth, h = window.innerHeight, radio = 10;
svg.attr("width", w - xoffset).attr("height", h - yoffset);

var dragLine = svg
  .append("path")
  .attr("class", "dragLine hidden")
  .attr("d", "M0,0L0,0");

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

var mousedownNode = null;
var tool = null;

var limpiarBtn = document.querySelector(".limpiar");
limpiarBtn.addEventListener("click", limpiarTodo);

// Boton Acerca
var acercaBtn = document.querySelector(".acerca");
var modal = document.querySelector(".modal");
acercaBtn.addEventListener("click", e => {
  modal.style.display = "block";
})
window.onclick = function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}

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
}

// Vacia el grafo
function limpiarTodo() {
  nodos.splice(0);
  vinculos.splice(0);
  ultimoNodo = 0;
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
  for (let i = 0; i < vinculos.length; i++) {
    var l = vinculos[i];
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
      .style("fill", "#d73380")
      .on("mousedown", beginDragLine)
      .on("mouseup", endDragLine)
      .on("contextmenu", borrarNodo);

    ve.append("title").text(function(d) {
      return "v" + d.id;
    });

    vertices = ve.merge(vertices);
  }

  force.nodes(nodos);
  force.force("link").links(vinculos);
  force.alpha(0.8).restart();
}

restart();