import { css } from "lit";

const styles = css`
    * {
        margin: 0;
        padding: 0;
        font-family: "IBM Plex Serif", serif;
        box-sizing: border-box;
    }

    img {
        max-width: 100%;
    }

    body {
        background-image: url("/assets/hero_image.webp");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        background-attachment: fixed;
        background-color: var(--color-background);
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-normal);
        font-family: var(--font-family-base), serif;
    }

    mu-form::part(form) {
        display: block;
    }

`;

export default { styles };