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
    static get observedAttributes() {
        return ['active'];
    }
    
    
    constructor() {
        super();
        this.image;
        this.imageSrc;
        let that = this;
        

        /**
         * i dont even think i need proxies but it's fun
         * 
         * 
         * with observing active now, it shouldn't matter at all
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
                    opacity: 0;
                    position: absolute;
                    left: 50%;
                    top: 0;
                    transform: translate(-50%);
                    z-index: -1000;
                }

                :host([active="true"]) {
                    // border: 1px solid green;
                    // opacity: 1;
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
        this.animateActiveNChange();
    }

    // TODO: test me
    // The attributeChangedCallback() callback is run whenever one of the element's attributes 
    // is changed in some way. As you can see from its properties, it is possible to act on attributes
    //  individually, looking at their name, and old and new attribute values. In this case however,
    //   we are just running the updateStyle() function again to make sure that the square's style 
    //   is updated as per the new values:
    attributeChangedCallback(name, oldValue, newValue) {
        console.log("attribtue changed");
        console.table({oldValue, newValue});
        if (name === 'active') {
            if (oldValue == "true") {
                this.animateFadeAway();
            }
            if (newValue == "true") {
                // or just animate directly here
                let ACTIVE_CHANGED = new CustomEvent('activeChanged', {
                    detail: {
                        newActiveImage: this.getAttribute('data-number'),
                    },
                    bubbles: true
                });
                this.dispatchEvent(ACTIVE_CHANGED);
            }
        }
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

    animateActiveNChange() {
        // console.log("animate!!");
        const keyframes = [
            {opacity: 0},
            {opacity: 1}
        ];
        const options = {
            duration: 2000,
            // direction: 'forwards',
            fill: 'forwards',
            easing: 'ease-in-out'
        }
        this.animate(keyframes, 
            options
        )
    }

    animateFadeAway() {
        const keyframes = [
            {opacity: 1},
            {opacity: 0},
        ];
        const options = {
            duration: 1800,
            // direction: 'forwards',
            fill: 'forwards',
            easing: 'ease-in-out'
        }
        this.animate(keyframes, 
            options
        )
    }

    addCustomEventListener() {
        document.addEventListener('activeChanged', (event) => {
            let active = this.getAttribute('active');
            if (active) this.animateActiveNChange();
            // console.log("active:" , active);
            // this.animateActiveNChange();
        })
    }
}

customElements.define('carousel-image', ImageCarouselImage);