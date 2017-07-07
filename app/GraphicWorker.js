import {History} from './History';
import {Filter} from './Filter';
export class GraphicWorker {

    constructor(canvas) {
        this._canvas = canvas;
        this._canvas.width = window.innerWidth;
        this._canvas.height = 600;
        this._ctx = this._canvas.getContext('2d');
        this.BORDER_MAX_WIDTH = 15;
        this._img = {width: 400};
        this.history = new History();
        this._appliedFilter = null;
    }

    saveState() {
        let state = {
            border: {
                width: this._ctx.lineWidth,
                color: this._ctx.strokeStyle
            },
            img: {
                width: this._img.width,
                height: this._img.height
            },
            filter: this._appliedFilter
        };
        this.history.save(state);
    }

    loadState({border, img, filter}) {
        if (border) {
            if (img.width !== this._img.width) this.setImageWidth(img.width);
            if (img.height !== this._img.height) this.setImageHeight(img.height);
            if (border.width !== this._ctx.lineWidth) this.setLineWidth(border.width);
            if (border.color !== this._ctx.strokeStyle) this.setLineColor(border.color);
            if (filter !== this._appliedFilter) {
                this._appliedFilter = filter;
                this._clearBorder();
                this.setLine();
            }
        }
    }

    undo() {
        this.loadState(this.history.undo());
    }

    redo() {
        this.loadState(this.history.redo());
    }

    create(img) {
        let scale = img.naturalHeight / img.naturalWidth;
        this._img.height = Math.round(this._img.width * scale);/* Set image height depend on image width */
        this._img.x = Math.round(this._canvas.width - this._img.width) / 2;
        this._img.src = img.src;
        this._setImage();

        this.saveState()
    }

    setLine() {
        let width = this._ctx.lineWidth;
        let d = Math.floor(width / 2);
        let imgWidth = this._img.width - width;
        let imgHeight = this._img.height - width + 1;

        this._ctx.strokeRect(this._img.x + d, d, imgWidth, imgHeight);
    }

    setLineWidth(width) {
        this._clearBorder();
        if (width !== 0) { // lineWidth 1px by default
            this._ctx.lineWidth = width <= this.BORDER_MAX_WIDTH ? width : this.BORDER_MAX_WIDTH; // check that _border width in allowed limits
            this.setLine();
        }
    }

    setLineColor(color) {
        this._ctx.strokeStyle = color;
        this.setLineWidth(this._ctx.lineWidth);
    }

    setImageWidth(width) {
        this._clearBorder();
        this._img.x = Math.round(this._canvas.width - width) / 2;
        this._img.width = width;
        this.setLine();
    }

    setImageHeight(height) {
        this._clearBorder();
        this._img.height = +height;
        this.setLine();
    }

    setFilter(filterType) {
        this._appliedFilter = filterType;
            let line = this._ctx.lineWidth;
            let pixels = this._ctx.getImageData(this._img.x + line, line, this._img.width - line*2, this._img.height - line*2);
            let newPixels;
            let filter = new Filter();
            switch (filterType) {
                case 'grayscale':
                    newPixels = filter.grayscale(pixels);
                    break;
                case 'invert':
                    newPixels = filter.invert(pixels);
                    break;
            }
            this._ctx.putImageData(newPixels, Math.floor(this._img.x) + line, line);
    }

    clearCanvas() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    getImageData() {
        return this._ctx.getImageData(this._img.x, 0, this._img.width, this._img.height);
    }

    _clearBorder() {
        this.clearCanvas();
        this._setImage();
    }

    _setImage() {
        let canvasImg = new Image();
        canvasImg.onload = () => {
            this._ctx.globalCompositeOperation = "destination-over";
            this._ctx.drawImage(canvasImg, this._img.x, 0, this._img.width, this._img.height);
            if (this._appliedFilter) {
                this._ctx.globalCompositeOperation = "destination-over";
                this.setFilter(this._appliedFilter);
            }
        };

        canvasImg.src = this._img.src;
    }
}