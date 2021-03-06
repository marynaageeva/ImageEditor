import './style.css';
import './loader.css';
import {GraphicWorker} from './GraphicWorker';
import {MenuWorker} from './MenuWorker';

let subMenuContainer = document.querySelector('.edit-submenu');
let menuContainer = document.querySelector('.edit-menu');
let graphic;
let canvas = document.querySelector('.canvas');
let fileInput = document.querySelector('[name="actionImage"]');

let menu = new MenuWorker(subMenuContainer);

fileInput.addEventListener('change', loadImage);


let isMenuActive = false;
function loadImage(e) {
    let actionButtons = document.querySelector('.action-buttons');
    let file = e.target.files[0];
    graphic = new GraphicWorker(canvas);
    console.log(file.name);
    if (file && correctFileExtention(file)) {
        let loader = document.querySelector('.loader');
        loader.hidden = false;
        actionButtons.hidden = false;
        menuContainer.addEventListener('click', openMenuItem);
        let reader = new FileReader();
        reader.onload = function (event) {
            let img = new Image();
            img.onload = function () {
                graphic.create(img);
                let loader = document.querySelector('.loader').hidden = true;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        actionButtons.hidden = true;
        menuContainer.removeEventListener('click', openMenuItem);
        graphic.clearCanvas();
    }
}

function correctFileExtention(file) {
    let segments = file.name.split('.');
    let extention = segments[segments.length - 1];
    return extention === 'png' || extention === 'jpg';
}

function openMenuItem(e) {
    let target = e.target;

    if (target.tagName !== 'LI') return;
    for (let i = 0; i < subMenuContainer.children.length; i++) {
        if (menuContainer.children[i] === target) {
            menu.setActiveItem(i);
            menuContainer.children[i].classList.add('active');
        } else {
            menuContainer.children[i].classList.remove('active');
        }
    }
}


(function () {
    document.querySelector('#lineWidth').addEventListener('change', setLineWidth);
    document.querySelector('#lineColor').addEventListener('change', setLineColor);
    document.querySelector('#imgWidth').addEventListener('change', setImgWidth);
    document.querySelector('#imgHeight').addEventListener('change', setImgHeight);
    document.querySelector('.undo-btn').addEventListener('click', previous);
    document.querySelector('.redo-btn').addEventListener('click', next);
    document.querySelector('.gs-filter').addEventListener('click', gsfilter);
    document.querySelector('.invert-filter').addEventListener('click', invertfilter);

    function setLineWidth(e) {
        graphic.setLineWidth(+e.target.value);
        graphic.saveState();
    }

    function setLineColor(e) {
        graphic.setLineColor(e.target.value);
        graphic.saveState();
    }

    function setImgWidth(e) {
        graphic.setImageWidth(+e.target.value);
        graphic.saveState();
    }

    function setImgHeight(e) {
        graphic.setImageHeight(+e.target.value);
        graphic.saveState();
    }

    function previous() {
        graphic.undo();
    }

    function next() {
        graphic.redo();
    }

    function gsfilter() {
        graphic.setFilter('grayscale');
        graphic.saveState();
    }

    function invertfilter() {
        graphic.setFilter('invert');
        graphic.saveState();
    }
})();
