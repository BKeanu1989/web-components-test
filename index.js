class SpinnyImage extends HTMLElement {
    constructor() {
        super();
        console.log("spinny logo instantiated");
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
            <slot name="default-test">test prefilled content</slot>
            <slot></slot>
        `;
    }

    /**
     * right now it's kinda unclear for me where to append the template ...
     * there are at least 2 ways to do it. just wondering which is better
     */
    connectedCallback() {
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        console.log(this);
        const slots = Array.from(this.shadowRoot.querySelectorAll('slot'));

        slots.forEach((slot) => slot.addEventListener('click', () => {
            const nodes = slot.assignedNodes();
            console.log("NODES:", nodes);
            console.log("NODES:", nodes[0].innerHTML);
            console.log(`clicked slot: ${slot}`, slot);
        }));

        console.log(this.shadowRoot.childElementCount);
        console.log(this.shadowRoot.childNodes);

        console.log(this.shadowRoot.querySelector('img'));
        this.animate([
            {transform: 'scale(0) rotate(0deg)'},
            {transform: 'scale(1) rotate(1080deg)'},
        ], {
            duration: 250,
            easing: 'cubic-bezier(.88,.02,.06,1)',
            fill: 'forwards'
        })
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

customElements.define('spinny-image', SpinnyImage);