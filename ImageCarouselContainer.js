class ImageCarouselContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        })
        this.addCustomEventListener();

        this.template = document.createElement('template');
        this.template.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
            </style>
            <slot name="left-handler">left-chevron</slot>
            <slot name="right-handler">right chevron</slot>
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
                let images = Array.from(slot.assignedNodes().filter((x) => x.nodeName === 'IMG'));
                images = images.map((image) => {
                    console.log(image);
                    image.dataset.src = image.src;
                    image.src = '';
                    return image;
                });
                console.log(images);
            }
        });
    }

    addCustomEventListener() {
        this.shadowRoot.addEventListener("click", () => {
            const event = new CustomEvent('foo', {
                detail: {
                    bar: 'BAR',
                    baz: 'BAZ'
                },
                bubbles: true
            })
            this.dispatchEvent(event);
        })
    }
}

customElements.define('image-carousel-container', ImageCarouselContainer);

// TODO:
// let carousel container decide if images should be lazy loaded