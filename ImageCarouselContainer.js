class ImageCarouselContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        })
        this.active;

        this.template = document.createElement('template');
        this.template.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    width: 100%;
                }

                .left-chev {
                    position: absolute;
                    left: 0;

                }

                .right-chev {
                    position: absolute;
                    right: 0;
                }

            </style>
            <slot name="left-handler"><span class="left-chev">left-chevron</span></slot>
            <slot name="right-handler"> <span class="right-chev">right chevron</span></slot>
            <slot name="indicator"></slot>
            <slot></slot>
        `;
    }

    /**
     * right now it's kinda unclear for me where to append the template ...
     * there are at least 2 ways to do it. just wondering which is better
     */
    connectedCallback() {
        // const nodes = slot.assignedNodes();
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        const slots = Array.from(this.shadowRoot.querySelectorAll('slot'));

        slots.forEach((slot) => {
            // default slot ergo should be used for slide images
            if (!slot.name) {
                let images =  Array.from(slot.assignedNodes().filter((x) => x.nodeName === 'CAROUSEL-IMAGE'));
                images = images.map((image, index) => {
                    if (index === 0) image.setAttribute('active', true);
                    image.dataset.number = index + 1;
                    image.dataset.src = image.src;
                    image.src = '';
                    return image;
                });
                
                console.log("IMAGES: ", images);
                // images[0].shadowRoot.testMessage();
                console.log(images[0].hasAttribute('active'));
            }
        });
        this.addCustomEventListener();

    }

    addCustomEventListener() {
        let leftHander = this.shadowRoot.querySelector('slot[name="left-handler"]');
        leftHander.addEventListener('click', () => {
            console.log("left handler clicked");
        })
        let rightHandler = this.shadowRoot.querySelector('slot[name="right-handler"]');
        rightHandler.addEventListener('click', () => {
            console.log("right handler clicked");
        })
    }
}

customElements.define('image-carousel-container', ImageCarouselContainer);

// TODO:
// let carousel container decide if images should be lazy loaded