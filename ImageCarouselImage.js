class ImageCarouselImage extends HTMLElement {
    constructor() {
        super();
        this.image;
        this.imageSrc;
        let that = this;
        

        /**
         * i dont even think i need proxies but it's fun
         */
        this.proxy = new Proxy(this, {
            get: function(obj, prop) {
                return obj[prop];
            },
            set: function(obj, prop, value) {
                obj[prop] = value;
                console.log(`${prop}`, value);
                return true;
            }
        })
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
        
        this.sourceImage();
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
        this.proxy.image.src = this.imageSrc;
    }

    testMessage() {
        // this is working in the browser
        // let image = document.querySelector('carousel-image');
        // image.testMessage();
        console.log("test message via custom component");
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