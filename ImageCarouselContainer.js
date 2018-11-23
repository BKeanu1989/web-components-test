class ImageCarouselContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        })
        this.activeIndex;
        this.images;
        this.numIndicators;

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

                .indicators {
                    position: absolute;
                    left: 50%;
                    bottom: 10%;
                }

                .indicators li {
                    min-width: 10px;
                    min-height: 10px;
                    display: inline;
                    background-color: green;
                }

            </style>
            <slot name="left-handler"><span class="left-chev">left-chevron</span></slot>
            <slot name="right-handler"> <span class="right-chev">right chevron</span></slot>
            <ul class="indicators"></ul>
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
        const list = this.shadowRoot.querySelector('ul');
        slots.forEach((slot) => {
            // default slot ergo should be used for slide images
            if (!slot.name) {
                let images =  Array.from(slot.assignedNodes().filter((x) => x.nodeName === 'CAROUSEL-IMAGE'));
                let activeImageGiven = images.some((x) => x.hasAttribute('active'));
                this.numIndicators = images.length;
                this.images = images.map((image, index) => {

                    if (index === 0 && !activeImageGiven) {
                        image.setAttribute('active', true);
                        this.activeIndex = 0;
                    } 

                    image.dataset.number = index + 1;
                    image.dataset.src = image.src;
                    image.src = '';
                    return image;
                });
            }
        });
        for (let index = 0; index < this.numIndicators; index++) {
            let li = document.createElement('li');
            list.appendChild(li);
            console.log(list);
            
        }
        this.addCustomEventListener();

    }

    addCustomEventListener() {
        let leftHander = this.shadowRoot.querySelector('slot[name="left-handler"]');
        leftHander.addEventListener('click', () => {
            const prevImageEvent = new CustomEvent('changeImage', {
                detail: {
                    action: 'prev'
                },
                bubbles: true
            });
            this.dispatchEvent(prevImageEvent);
        })
        let rightHandler = this.shadowRoot.querySelector('slot[name="right-handler"]');
        rightHandler.addEventListener('click', () => {
            const nextImageEvent = new CustomEvent('changeImage', {
                detail: {
                    action: 'next'
                },
                bubbles: true
            });
            this.dispatchEvent(nextImageEvent);
        })
        this.addEventListener('changeImage', (event) => {
            // console.log("change image called");
            // console.log(event);
            switch(event.detail.action) {
                case 'prev':
                    this.images[this.activeIndex].removeAttribute('active');
                    this.images[1].setAttribute('active', true);
                    break;
                case 'next': 
                    this.images[this.activeIndex].removeAttribute('active');
                    this.images[0].testMessage();
                    break;
            }
        })
    }

    // handle index ...
}

customElements.define('image-carousel-container', ImageCarouselContainer);

// TODO:
// let carousel container decide if images should be lazy loaded