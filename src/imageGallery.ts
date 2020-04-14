/**
 * An image gallery
 * @class
 */
class ImageGallery {
    private readonly settings: { wrapAround: boolean, showGalleryTitle: boolean, galleryTitle: string, galleryType: number, showImageDescription: boolean, selectImages: boolean, imageBaseDirectory: string, useLargeImages: boolean, smallImageDirectory: string, largeImageDirectory: string, boxHeight: number, boxWidth: number, maxImageWidth: number, maxImageHeight: number, directDownload: boolean };
    private galleryImageContainer: HTMLDivElement;
    private galleryPreviewBox: HTMLDivElement;
    private shown: boolean;
    private shownImageID: number;
    private readonly images: Array<{ name: string, description: string }>;
    private readonly largeImageElements: {};
    private readonly smallImageElements: {};
    private readonly loadedImages: {};
    private closeBtn: HTMLSpanElement;
    private nextBtn: HTMLSpanElement;
    private prevBtn: HTMLSpanElement;
    private downBtn: HTMLSpanElement;

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
        this.largeImageElements = {};
        this.smallImageElements = {};
        this.loadedImages = {};

        this.settings = {
            wrapAround: true,
            showGalleryTitle: true,
            galleryTitle: 'Gallery',
            galleryType: 0,  // TODO: Implement - 0, 1: Cycler, 2: Image
            showImageDescription: true,  // TODO: Implement
            selectImages: false,  // TODO: Implement
            imageBaseDirectory: 'assets/images/',
            useLargeImages: true,
            smallImageDirectory: 'small/',
            largeImageDirectory: 'large/',
            boxHeight: .7,
            boxWidth: .8,
            maxImageWidth: .8,
            maxImageHeight: .8,
            directDownload: true,
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
            h1.style.top = '2%';
            h1.style.textAlign = 'center';
            this.galleryPreviewBox.appendChild(h1);
        }

        // Basic styles
        this.galleryPreviewBox.style.display = 'none';
        this.galleryPreviewBox.style.position = 'absolute';
        this.galleryPreviewBox.style.width = `${this.settings.boxWidth * 100}%`;
        this.galleryPreviewBox.style.height = `${this.settings.boxHeight * 100}%`;
        this.galleryPreviewBox.style.left = this.galleryPreviewBox.style.right = '0';
        this.galleryPreviewBox.style.marginLeft = this.galleryPreviewBox.style.marginRight = 'auto';

        // Add nav buttons (for DAUs lel)
        this.closeBtn = document.createElement('span')
        this.closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>`
        this.closeBtn.style.position = 'absolute';
        this.closeBtn.style.right = this.closeBtn.style.top = '15px';
        this.closeBtn.onmouseenter = () => {
            this.closeBtn.style.opacity = '0.5';
            this.closeBtn.style.cursor = 'pointer';
        }
        this.closeBtn.onmouseleave = () => {
            this.closeBtn.style.opacity = '1';
            this.closeBtn.style.cursor = 'default';
        }

        this.prevBtn = document.createElement('span');
        this.prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
        this.prevBtn.style.position = 'relative';
        this.prevBtn.title = 'Previous image';
        this.prevBtn.onmouseenter = () => {
            this.prevBtn.style.opacity = '0.5';
            this.prevBtn.style.cursor = 'pointer';
        }
        this.prevBtn.onmouseleave = () => {
            this.prevBtn.style.opacity = '1';
            this.prevBtn.style.cursor = 'default';
        }

        this.nextBtn = document.createElement('span');
        this.nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>`;
        this.nextBtn.style.position = 'relative';
        this.prevBtn.title = 'Next image';
        this.nextBtn.onmouseenter = () => {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.style.cursor = 'pointer';
        }
        this.nextBtn.onmouseleave = () => {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'default';
        }

        if (this.settings.directDownload) {
            this.downBtn = document.createElement('span');
            this.downBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>`
            this.downBtn.style.position = 'relative';
            this.downBtn.title = 'Download image';
            this.downBtn.onmouseenter = () => {
                this.downBtn.style.opacity = '0.5';
                this.downBtn.style.cursor = 'pointer';
            }
            this.downBtn.onmouseleave = () => {
                this.downBtn.style.opacity = '1';
                this.downBtn.style.cursor = 'default';
            }
        }

        const navDiv = document.createElement('span');
        if (this.settings.directDownload) navDiv.append(this.prevBtn, this.downBtn, this.nextBtn);
        else navDiv.append(this.prevBtn, this.nextBtn);
        navDiv.style.position = 'absolute';
        navDiv.style.bottom = '-3%';
        navDiv.style.left = navDiv.style.right = '0';
        navDiv.style.marginLeft = navDiv.style.marginRight = 'auto';
        navDiv.style.width = (this.settings.directDownload ? '96' : '64') + 'px';

        this.galleryPreviewBox.append(this.closeBtn, navDiv);

        this.initImages();
        this.addListeners();
    }

    private initImages() {
        const images = this.galleryImageContainer.querySelectorAll('img');
        if (this.settings.selectImages) {
            // @ts-ignore -- this works in js :c
            for (const img: HTMLImageElement of images) {
                const name = img.src;
                const description = img.alt;
                this.images.push({name, description})
            }
        }
        // Create images
        let ctr = 0;
        const boxId = this.galleryImageContainer.id
        for (const img of this.images) {
            // Preview box images
            const li = document.createElement('img');
            if (!this.settings.selectImages)
                li.src = this.settings.imageBaseDirectory + (this.settings.useLargeImages ? this.settings.largeImageDirectory : '') + img.name;
            else li.src = img.name;  // TODO: Implement large images
            li.alt = img.description;
            li.style.position = 'absolute';
            li.style.display = 'none';
            li.style.top = '15%';
            li.style.left = li.style.right = '0';
            li.style.marginLeft = li.style.marginRight = 'auto';
            li.style.maxWidth = `${this.settings.maxImageWidth * 100}%`;
            li.style.maxHeight = `${this.settings.maxImageWidth * 100}%`;
            li.dataset.id = (ctr++).toString();
            li.dataset.ratio = (li.naturalHeight / li.naturalWidth).toString();
            console.log(li);
            this.largeImageElements[ctr - 1] = li;

            // Gallery images
            if (!this.settings.selectImages) {
                const si = document.createElement('img');
                si.src = this.settings.imageBaseDirectory + (this.settings.useLargeImages ? this.settings.smallImageDirectory : '') + img.name;
                si.classList.add(`${boxId}-image`)
                si.alt = img.description;
                si.style.display = 'block';
                si.style.cursor = 'pointer';
                si.dataset.id = (ctr - 1).toString();
                this.smallImageElements[ctr - 1] = si;
                this.galleryImageContainer.appendChild(si);
            } else {
                this.smallImageElements[ctr - 1] = images[ctr - 1]
                this.smallImageElements[ctr - 1].dataset.id = (ctr-1).toString();
            }
        }
        console.log(this.smallImageElements);
        console.log(this.largeImageElements);

    }

    /**
     * Adding all events to the images and the preview box
     */
    private addListeners() {
        // Navigation
        document.addEventListener('keydown', e => {
            switch (e.key.toLocaleLowerCase()) {
                case 'arrowleft':
                case 'left':
                case 'h':
                    this.prevImage();
                    break;
                case 'arrowright':
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
        });

        // Image events
        for (const imgIndex in this.smallImageElements) {
            const img = this.smallImageElements[imgIndex];
            img.addEventListener('click', () => {
                this.shownImageID = +img.dataset.id;
                console.log(this.shownImageID);
                this.loadImage();
                this.show();
            })
        }

        // Nav buttons events
        this.closeBtn.addEventListener('click', () => this.hide());
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        if (this.settings.directDownload) {
            this.downBtn.addEventListener('click', () => {
                const img = this.loadedImages[this.shownImageID]
                const a = document.createElement('a');
                a.target = '_self';
                a.download = `download-${location.host}-${img.src.split('/').pop()}`;
                a.href = img.src;
                a.click();
            })
        }
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
        if (this.shownImageID - 1 >= 0) this.shownImageID--;
        else if (this.settings.wrapAround) this.shownImageID = this.images.length - 1;
        this.loadImage();
    }

    /**
     * Loads the {this.shownImageID}th image into the container
     */
    private loadImage() {
        for (const ii in this.loadedImages) this.loadedImages[ii].style.display = 'none';

        // Load already loaded image
        if (this.loadedImages.hasOwnProperty(this.shownImageID)) {
            this.loadedImages[this.shownImageID].style.display = 'block';
            return;
        }

        // Load new image
        const img2load = this.largeImageElements[this.shownImageID].cloneNode();
        console.log(img2load);
        img2load.style.display = 'block';
        console.log(img2load.naturalWidth * .8, img2load.naturalHeight * .8);
        this.galleryPreviewBox.appendChild(img2load);
        this.loadedImages[this.shownImageID] = img2load;
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