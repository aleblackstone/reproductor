let data;
let videosVistos = 0;
window.onload = function(){
    leerJson();
    let aux = setTimeout(main,50);
    
}

function leerJson(){
    readTextFile("/reproductor/data/data.json", function(text){
        data = JSON.parse(text);
    }); 
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

function main(){
    crearVideo();
    crearPlayList();
    marcarReproduciendo(0);
}

function crearVideo(){
    $("#reproductor").append(
        '<video id="video" src="'+ data[videosVistos]["src"] +'"></video>'
    )
    document.getElementById("video").play();
    videosVistos++;
}

function crearPlayList(){
    for(let i = 0; i < data.length; i++){
        if(i == 2)
            i = 4;

        let tipo;
        if(data[i]["tipo"] == "video")
            tipo = "icon-video"
        else
            tipo = "icon-audio"

        $("#colaReproduccion").append(
            '<p class="remarcar">'+
                '<label class="'+tipo+'"/>'+
                '<label onclick="mostrarVideo(event)" data="'+ i + '">'+ data[i]["titulo"]+ '</label>'+
            '</p>'
        )
    }
}

function mostrarVideo(){
    let indiceVideo = event.target.attributes[1]["value"];

    if(indiceVideo == "videoAnterior()"){
        indiceVideo = videosVistos--;
        if(indiceVideo == 3)
            indiceVideo = 1;
    }

    if(indiceVideo == "videoSiguiente()")
        indiceVideo = videosVistos++;

    if(indiceVideo > 1 && indiceVideo <4)
        indiceVideo = 4;

    $("#reproductor").find("video").remove();

    desmarcar();

    if(indiceVideo != 1){
        $("#reproductor").append(
            '<video src="'+ data[indiceVideo]["src"] +'" id="video"></video>'
        )
    }
    else{
        $("#reproductor").append(
            '<video id="video">'+
                '<source src="'+ data[1]["src"] +'" type="video/mp4"'+
                '<source src="'+ data[2]["src"] +'" type="video/webm"'+
                '<source src="'+ data[3]["src"] +'" type="video/ogg"'+
            '</video>'
        )
    }
    document.getElementById("video").play();
    
    videosVistos = indiceVideo;

    marcarReproduciendo(indiceVideo);
}

function marcarReproduciendo(video){
    let aux = $(".colaReproduccion").children();

    if(video > 3)
        video = video -2;

    $(aux[video]).removeClass();
    $(aux[video]).addClass("reproduciendo");
    $(aux[video]).append(
        '<label class="icon-todoVolumen" id="iconoReproduciendo">'
    );
}

function desmarcar(){
    let aux= $(".colaReproduccion").children();
    for(let i=0; i < aux.length; i++){
        $(aux[i]).removeClass();
        $(aux[i]).addClass("remarcar");
        $("#iconoReproduciendo").remove();
    }    
}

function reanudarVideo(){
    document.getElementById("video").play();
}

function pausarVideo(){
    document.getElementById("video").pause();
}

function videoAnterior(){
    mostrarVideo();
    videosVistos--;
}

function atrasarVideo(){
    document.getElementById("video").currentTime -= 10;
}

function adelantarVideo(){
    document.getElementById("video").currentTime += 10;
}

function videoSiguiente(){
    mostrarVideo();
    videosVistos++;
}

function sileciarVideo(){
    document.getElementById("video").volume = 0;
}

function bajarVolumen(){
    document.getElementById("video").volume -= 0.1;
}

function subirVolumen(){
    document.getElementById("video").volume += 0.1;
}

function todoVolumen(){
    document.getElementById("video").volume = 1;
}