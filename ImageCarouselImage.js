class ImageCarouselImage extends HTMLElement {
    constructor() {
        super();
        this.image;
        this.imageSrc;
    }
    
    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
            </style>
            <img src="" data-src="">
        `;
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.init();
        this.populateDataSrc();
        this.sourceImage();
    }

    init() {
        this.image = this.shadowRoot.querySelector('img');
        this.imageSrc = this.getAttribute('src');
    }
    
    populateDataSrc() {
        this.image.dataset.src = this.imageSrc;
    }

    sourceImage() {
        this.image.src = this.imageSrc;

    }
}

customElements.define('carousel-image', ImageCarouselImage);