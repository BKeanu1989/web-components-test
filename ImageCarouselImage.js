class ImageCarouselImage extends HTMLElement {
    constructor() {
        super();
        this.image;
        this.imageSrc;
        this.addCustomEventListener();
    }

    
    // implement proxies for this.image & and so on
    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }

                :host([active="true"]) {
                    border: 1px solid green;
                }

            </style>
            <img src="" data-src="" class="img">
        `;
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.init();
        this.populateDataSrc();
        // this.sourceImage();
    }

    init() {
        this.lazyload = this.parentNode.getAttribute('lazyload');
        this.image = this.shadowRoot.querySelector('img');
        this.imageSrc = this.getAttribute('src');
        if (this.lazyload) {
            this.image.dataset.src = this.imageSrc;
        } else {
            this.image.src = this.imageSrc;
        }
    }
    
    populateDataSrc() {
        this.image.dataset.src = this.imageSrc;
    }

    sourceImage() {
        this.image.src = this.imageSrc;
    }

    testMessage() {
        console.log("test message via custom component");
    }

    addCustomEventListener() {
        document.addEventListener('foo', () => {
            console.log("i dont think this will work");
        })
    }
}

customElements.define('carousel-image', ImageCarouselImage);