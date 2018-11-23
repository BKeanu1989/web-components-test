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
            <p>test prefilled content</p>
            <slot></slot>
        `;
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));

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