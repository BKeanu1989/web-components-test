const handler = {
    get: function(obj, prop) {
        if (typeof obj[prop] === 'object' && obj[prop] !== null) {
            return new Proxy(obj[prop], handler);
        }
        return obj[prop];
    },
    set: function(obj, prop, value) {
        if (prop === 'active') {
            if (value == true) {
                this.proxy.sourceImage();
            }
        }
        obj[prop] = value;
        return true;
    }
}

class ImageCarouselImage extends HTMLElement {
    constructor() {
        super();
        this.image;
        this.imageSrc;
        let that = this;
        

        /**
         * i dont even think i need proxies but it's fun
         */
        this.proxy = new Proxy(this, handler)
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
        this.sourceByActiveAttribute();
        this.addCustomEventListener();
    }

    init() {
        this.proxy.lazyload = this.parentNode.getAttribute('lazyload');
        this.proxy.image = this.shadowRoot.querySelector('img');
        this.proxy.imageSrc = this.getAttribute('src');
        this.proxy.active = this.getAttribute('active');
        if (this.proxy.lazyload) {
            this.proxy.image.dataset.src = this.imageSrc;
        } else {
            this.proxy.image.src = this.imageSrc;
        }
    }
    
    populateDataSrc() {
        this.proxy.image.dataset.src = this.imageSrc;
    }

    sourceImage() {
        // nested object is not detected
        // this.proxy.test = 'test';
        this.proxy.image.src = this.imageSrc;
    }

    sourceByActiveAttribute() {
        if (this.proxy.active) {
            this.sourceImage();
        }
    }

    testMessage() {
        // this is working in the browser
        // let image = document.querySelector('carousel-image');
        // image.testMessage();
        console.log("test message via custom component from image");
    }

    addCustomEventListener() {
        // not working
        // this.addEventListener('change', () => {
        //     console.log(this);
        //     console.log("something changed");
        // })
        document.addEventListener('foo', () => {
            console.log("i dont think this will work");
        })
    }
}

customElements.define('carousel-image', ImageCarouselImage);