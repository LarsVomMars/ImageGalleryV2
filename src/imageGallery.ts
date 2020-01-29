/**
 * An image gallery
 * 
 * @class
 */
class ImageGallery {
    private readonly settings: { wrapAround: boolean, showGalleryTitle: boolean, galleryTitle: string, galleryType: number, showImageDescription: boolean, imageBaseDirectory: string, useLargeImages: boolean, smallImageDirectory: string, largeImageDirectory: string, boxHeight: number, boxWidth: number };
    private galleryImageContainer: HTMLDivElement;
    private galleryPreviewBox: HTMLDivElement;
    private shown: boolean;
    private shownImageID: number;

    /**
     * @constructor
     * @param galleryDivID
     * @param settings 
     */
    constructor(galleryDivID: string, settings: {} = {}) {
        this.shown = false;
        this.shownImageID = 0;
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

        // Wait for the page to be fully loaded - probably unnecessary
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

        if (this.settings.showGalleryTitle) {
            const h1: HTMLHeadingElement = document.createElement('h1');
            h1.textContent = this.settings.galleryTitle;
            h1.style.position = 'absolute';
            h1.style.width = '100%';
            h1.style.top = '-20px';
            h1.style.textAlign = 'center';
            this.galleryPreviewBox.appendChild(h1);

            this.galleryPreviewBox.style.display = 'none';
            this.galleryPreviewBox.style.position = 'relative';
            this.galleryPreviewBox.style.width = `${this.settings.boxWidth * 100}%`;
            this.galleryPreviewBox.style.height = `${this.settings.boxHeight * 100}%`;
        }
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