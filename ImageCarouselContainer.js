// to import/require stuff needs webpack (bundlers)

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
                    bottom: 5%;
                    transform: translate(-50%);
                    z-index: 1000;
                }

                .indicators li {
                    min-width: 10px;
                    min-height: 10px;
                    display: inline-block;
                    background-color: green;
                    margin-left: 5px;
                }

                li.active {
                    border: 1px solid green;
                    background-color: yellow;
                }

                li[active="true"] {
                    background-color: red;
                }

            </style>
            <slot name="left-handler"><span class="left-chev">left-chevron</span></slot>
            <slot name="right-handler"> <span class="right-chev">right chevron</span></slot>
            <ul class="indicators"></ul>
            <slot></slot>
        `;
    }

    // ???
    // TODO: test me
    // The attributeChangedCallback() callback is run whenever one of the element's attributes 
    // is changed in some way. As you can see from its properties, it is possible to act on attributes
    //  individually, looking at their name, and old and new attribute values. In this case however,
    //   we are just running the updateStyle() function again to make sure that the square's style 
    //   is updated as per the new values:
    attributeChangedCallback(name, oldValue, newValue) {

    }
    /**
     * right now it's kinda unclear for me where to append the template ...
     * there are at least 2 ways to do it. just wondering which is better
     */
    connectedCallback() {
        // const nodes = slot.assignedNodes();
        this.activeIndex = 0;
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        const slots = Array.from(this.shadowRoot.querySelectorAll('slot'));
        const list = this.shadowRoot.querySelector('ul');
        slots.forEach((slot) => {
            // default slot ergo should be used for slide images

            // sourcing of images
            // if is default === slot with no name in this case slide images
            if (!slot.name) {
                let images =  Array.from(slot.assignedNodes().filter((x) => x.nodeName === 'CAROUSEL-IMAGE'));
                // let activeImageGiven = images.some((x) => x.hasAttribute('active'));
                let activeImageGiven = images.findIndex((x) => x.hasAttribute('active'));
                this.numIndicators = images.length;
                this.images = images.map((image, index) => {

                    if (index === 0 && !activeImageGiven) {
                        image.setAttribute('active', true);
                        this.activeIndex = 0;
                    } else {
                        // active is given
                        
                    }


                    image.dataset.number = index + 1;
                    // image.dataset.src = image.src;
                    image.src = '';
                    return image;
                });
            }
        });

        // refactor into settup
        // this.activeIndex = 0;
        this.list = [];
        for (let index = 0; index < this.numIndicators; index++) {
            let li = document.createElement('li');
            list.appendChild(li);
            this.list.push(li);
            
            if (index === this.activeIndex) {
                this.list[index].setAttribute('active', true);
            }

        }
        this.launch(this.activeIndex);
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
            let nextIndex;
            switch(event.detail.action) {
                case 'prev':
                    console.log("prev clicked");
                    this.images[this.activeIndex].removeAttribute('active');
                    nextIndex = indexEvaluator(this.images, this.activeIndex, -1);
                    console.log("next index:", nextIndex);
                    this.setActiveIndicator(nextIndex);
                    this.setActiveImageNSource(nextIndex)
                    break;
                case 'next': 
                console.log("next clicked");
                    this.images[this.activeIndex].removeAttribute('active');
                    nextIndex = indexEvaluator(this.images, this.activeIndex, 1);
                    this.images[0].testMessage();
                    console.log("next index:", nextIndex);
                    this.setActiveIndicator(nextIndex);
                    this.setActiveImageNSource(nextIndex)
                    break;
            }
        })

        this.eventListenerActiveChanged();
    }

    eventListenerActiveChanged() {
        this.addEventListener('activeChanged', (event) => {
            console.log("active changed", event);
            let nextActiveIndex = event.detail.newActiveImage - 1;
            this.setActiveIndicator(nextActiveIndex);
            this.activeIndex = nextActiveIndex;
        })  
    }

    getByIndex() {

    }

    getNext() {

    }

    removeActive() {
        
    }

    launch(nextIndex) {
        this.setActiveIndicator(nextIndex);
        // this.setActiveImageNSource(nextIndex);
    }

    setActiveIndicator(nextIndex) {
        if (this.list[this.activeIndex].hasAttribute('active')) {
            this.list[this.activeIndex].removeAttribute('active');
        }
        this.list[nextIndex].setAttribute('active', true);
        this.activeIndex = nextIndex;
    }

    setActiveImageNSource(nextIndex) {
        // remove old active
        this.images[this.activeIndex].removeAttribute('active');
        // set new active
        // proxy?
        // this.images.proxy[nextIndex].setAttribute('active', true);
        this.images[nextIndex].setAttribute('active', true);
        this.images[nextIndex].sourceImage();
        
        this.activeIndex = nextIndex;
    }

}
function indexEvaluator(array, curIndex, nextIndex) {
    let nextValue;
	let max = array.length - 1;
    let min = 0;

    if (curIndex !== max && curIndex !== min) {
        nextValue = curIndex + nextIndex;
        return nextValue;
    }

    if (curIndex === min) {
        switch(nextIndex) {
            case 1:
                nextValue = curIndex + nextIndex;
                break;
            }
        if (nextIndex == -1) {
            nextValue = max;
        }
        return nextValue;
    }

    if (curIndex === max) {
        switch(nextIndex) {
            case -1:
                nextValue = curIndex + nextIndex;
                break;
        }

        if (nextIndex == 1) {
            nextValue = min;
        }
        return nextValue;
    }
}

// console.log(IndexHelper);
// Object.assign(ImageCarouselContainer.prototype, IndexHelper);
customElements.define('image-carousel-container', ImageCarouselContainer);

// TODO:
// let carousel container decide if images should be lazy loaded