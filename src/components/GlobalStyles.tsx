import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --color-text: black;
    --color-background: #fff;
    --color-primary: #f04;
		--gutter-xs: 4px;
		--gutter-sm: 8px;
		--gutter: 16px;
		--gutter-lg: 24px;
		--gutter-xl: 32px;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

	body {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
    background-color: var(--color-background);
		font-family: Montserrat, sans-serif;
		margin: 0;
		padding: 0;
	}

	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
		monospace;
	}

  a {
    color: var(--color-text);

    &:visited {
      color: var(--color-text)
    }
  }
  
  button {
    -webkit-appearance: none;
    border: 0;
    background-color: transparent;
  }

  p {
    line-height: 1.4;
    margin: 0;

    + p {
      margin-top: var(--gutter-sm);
    }
  }
`;

export default GlobalStyles;
