/**
 * An image gallery
 * @class
 */
class ImageGallery {
    private readonly settings: { wrapAround: boolean, showGalleryTitle: boolean, galleryTitle: string, galleryType: number, showImageDescription: boolean, imageBaseDirectory: string, useLargeImages: boolean, smallImageDirectory: string, largeImageDirectory: string, boxHeight: number, boxWidth: number };
    private galleryImageContainer: HTMLDivElement;
    private galleryPreviewBox: HTMLDivElement;
    private shown: boolean;
    private shownImageID: number;
    private readonly images: Array<{ name: string, description: string }>;
    private imageElements: HTMLImageElement[];
    private loadedImages: { number: { HTMLImageElement } };

    /**
     * @constructor
     * @param {string} galleryDivID - ID of the container for the images to be put in
     * @param {Array<{string, string}>} images - All images for the gallery
     * @param {{}} settings - Settings for the gallery
     */
    constructor(galleryDivID: string, images: Array<{ name: string, description: string }>, settings: {} = {}) {
        this.shown = false;
        this.shownImageID = 0;
        this.images = [];
        this.imageElements = [];
        console.log(typeof this.images);
        this.settings = {
            wrapAround: true,
            showGalleryTitle: true,
            galleryTitle: 'Gallery',
            galleryType: 0, // TODO: Implement different gallery types
            showImageDescription: true,
            imageBaseDirectory: 'assets/images/',
            useLargeImages: true,
            smallImageDirectory: 'small/',
            largeImageDirectory: 'large/',
            boxHeight: .7,
            boxWidth: .8,
        };

        // Merge settings
        Object.keys(settings).forEach(k => this.settings[k] = settings[k]);

        // Wait until the page is fully loaded - probably unnecessary
        document.addEventListener('DOMContentLoaded', () => {
            this.galleryImageContainer = <HTMLDivElement>document.getElementById(galleryDivID);
            this.galleryPreviewBox = document.createElement('div');
            this.init();
        })
    }

    /**
     * Initializes more values
     */
    private init() {
        this.galleryImageContainer.appendChild(this.galleryPreviewBox);

        // Gallery title
        if (this.settings.showGalleryTitle) {
            const h1: HTMLHeadingElement = document.createElement('h1');
            h1.textContent = this.settings.galleryTitle;
            h1.style.position = 'absolute';
            h1.style.width = '100%';
            h1.style.top = '-20px';
            h1.style.textAlign = 'center';
            this.galleryPreviewBox.appendChild(h1);
        }

        // Basic styles
        this.galleryPreviewBox.style.display = 'none';
        this.galleryPreviewBox.style.position = 'relative';
        this.galleryPreviewBox.style.width = `${this.settings.boxWidth * 100}%`;
        this.galleryPreviewBox.style.height = `${this.settings.boxHeight * 100}%`;

        this.addListeners();
        this.createImages();
    }

    // TODO: Different load methods
    private createImages() {
        let ctr = 0;
        for (const img of this.images) {
            const i = document.createElement('img');
            i.src = this.settings.imageBaseDirectory + (this.settings.useLargeImages ? this.settings.smallImageDirectory : '') + img.name;
            i.alt = img.description;
            i.dataset.id = (ctr++).toString();
        }
    }

    /**
     * Adding all events to the images and the preview box
     */
    private addListeners() {
        // Navigation
        this.galleryPreviewBox.addEventListener('keypress', e => {
            switch (e.key.toLocaleLowerCase()) {
                case 'leftarrow':
                case 'left':
                case 'h':
                    this.prevImage();
                    break;
                case 'rightarrow':
                case 'right':
                case 'l':
                    this.nextImage();
                    break;
                case 'esc':
                case 'escape':
                    this.hide();
                    break;
                default:
                    break;
            }
        })

        // Image events
    }

    /**
     * Shows the gallery box
     */
    private show() {
        if (this.shown) return;
        disableScrolling();
        this.galleryPreviewBox.style.display = 'block';
        this.shown = true;
    }

    /**
     * Hides the gallery box
     */
    private hide() {
        if (!this.shown) return;
        enableScrolling();
        this.galleryPreviewBox.style.display = 'none';
        this.shown = false;
    }

    /**
     * Sets the next image index
     */
    private nextImage() {
        if (this.shownImageID + 1 < this.images.length) this.shownImageID++;
        else if (this.settings.wrapAround) this.shownImageID = 0;
        this.loadImage();
    }

    /**
     * Sets the previous image index
     */
    private prevImage() {
        if (this.shownImageID - 1 > 0) this.shownImageID--;
        else if (this.settings.wrapAround) this.shownImageID = this.images.length - 1;
        this.loadImage();
    }

    /**
     * Loads the {this.shownImageID}th image into the container
     */
    private loadImage() {
    }
}


/**
 * Enables page scrolling
 */
const enableScrolling = () => window.onscroll = () => true;

/**
 * Disables page scrolling
 */
const disableScrolling = () => {
    const x = scrollX;
    const y = scrollY;
    window.onscroll = () => scrollTo(x, y);
};

/**
 * Returns the center of the page
 * @return {{x: number, y: number}}
 */
const getPageCenter = () => ({
    x: scrollX + document.documentElement.clientWidth / 2,
    y: scrollY + document.documentElement.clientHeight / 2,
});

/**
 * Returns the window width
 * @return {number} Page width
 */
const getWidth = () => document.documentElement.clientWidth;

/**
 * Returns the window height
 * @return {number} Page height
 */
const getHeight = () => document.documentElement.clientHeight;