/**
 * An image gallery
 * @class
 */
class ImageGallery {
    private readonly settings: { wrapAround: boolean, showGalleryTitle: boolean, galleryTitle: string, galleryType: number, showImageDescription: boolean, createImages: boolean, imageBaseDirectory: string, useLargeImages: boolean, smallImageDirectory: string, largeImageDirectory: string, boxHeight: number, boxWidth: number };
    private galleryImageContainer: HTMLDivElement;
    private galleryPreviewBox: HTMLDivElement;
    private shown: boolean;
    private shownImageID: number;
    private readonly images: Array<{ name: string, description: string }>;
    private imageElements: Array<HTMLImageElement>;
    private loadedImages: { number: { HTMLImageElement } };

    /**
     * @constructor
     * @param {string} galleryDivID - ID of the container for the images to be put in
     * @param {Array<{string, string}>} images - All images for the gallery
     * @param {{}} settings - Settings for the gallery
     */
    constructor(galleryDivID: string, images: Array<{ name: string, description: string }> = [], settings: {} = {}) {
        this.shown = false;
        this.shownImageID = 0;
        this.images = images;
        this.imageElements = [];

        this.settings = {
            wrapAround: true,
            showGalleryTitle: true,
            galleryTitle: 'Gallery',
            galleryType: 0, // TODO: Implement different gallery types
            showImageDescription: true,
            createImages: true,
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

        this.initImages();
        this.addListeners();
    }

    private initImages() {
        if (this.settings.createImages) {
            // Create images
            let ctr = 0;
            for (const img of this.images) {
                const i = document.createElement('img');
                i.src = this.settings.imageBaseDirectory + (this.settings.useLargeImages ? this.settings.smallImageDirectory : '') + img.name;
                i.alt = img.description;
                i.dataset.id = (ctr++).toString();
                this.imageElements.push(i);  // TODO: Test this - should work
            }
        } else {
            // Select images from page
            console.log(this.galleryImageContainer.querySelectorAll('img') || []);  // TODO: Test and debug select method
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
        this.disableScrolling();
        this.galleryPreviewBox.style.display = 'block';
        this.shown = true;
    }

    /**
     * Hides the gallery box
     */
    private hide() {
        if (!this.shown) return;
        this.enableScrolling();
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


    /*
        Some helper functions
    */
    /**
     * Enables page scrolling
     */
    private enableScrolling() {
        window.onscroll = () => true;
    }

    /**
     * Disables page scrolling
     */
    private disableScrolling() {
        const x = scrollX;
        const y = scrollY;
        window.onscroll = () => scrollTo(x, y);
    }

    /**
     * Returns the page height
     * @return {number} Page height
     */
    private getPageHeight() {
        return document.documentElement.clientHeight;
    }

    /**
     * Returns the maximum box height
     * @return {number} Maximum box height
     */
    private getMaxBoxHeight() {
        return this.getPageHeight() * this.settings.boxHeight;
    }

    /**
     * Returns the page width
     * @return {number} Page width
     */
    private getPageWidth() {
        return document.documentElement.clientWidth;
    }

    /**
     * Returns the maximum box width
     * @return {number} Maximum box width
     */
    private getMaxBoxWidth() {
        return this.getPageWidth() * this.settings.boxWidth;
    }
}