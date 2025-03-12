
# Alpha GUI

Alpha GUI is the graphical user interface for Alpha—a low code tool built by Send Arcade to empower everyone to create interactive applications on the Solana Blockchain with ease. Inspired by MIT's Scratch and built on the robust foundation of Google Blockly, Alpha GUI offers an intuitive visual programming experience designed for both beginners and advanced users.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
- [Usage](#usage)
- [Integrating with Alpha VM](#integrating-with-alpha-vm)
- [Contributing](#contributing)
  - [Contribution Guidelines](#contribution-guidelines)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## Features

- **User-Friendly Interface:** Enjoy an intuitive design that simplifies visual programming.
- **Seamless Integration:** Connect effortlessly with the Alpha VM repository to execute your visual logic.
- **Customizable Components:** Easily extend and tailor the UI to meet your needs.
- **Responsive Design:** Works smoothly across various devices and modern web browsers.

## Getting Started

Follow these instructions to set up Alpha GUI on your local machine for development and testing.

### Prerequisites

- **npm** (v6 or higher)
- A modern web browser (Chrome, Firefox, etc.)

### Local Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/SendArcade/alpha-gui
   cd alpha-gui
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

3. **Start the Development Server**

   ```bash
   npm run start
   ```

   The GUI will be hosted on [http://localhost:8601/](http://localhost:8601/).

## Usage

Alpha GUI provides an interactive environment where users can drag and drop blocks, configure settings, and design applications visually. For detailed usage instructions, please refer to the [docs](docs/usage.md) directory.

## Integrating with Alpha VM

For full functionality, Alpha GUI integrates with the Alpha VM repository. Follow these steps to link both projects:

1. Ensure that both `alpha-gui` and `alpha-vm` repositories are located in the same parent directory on your local machine.

2. In the `alpha-vm` repository, run:

   ```bash
   npm run watch
   ```

3. In the `alpha-gui` repository, create a symlink to the VM package:

   ```bash
   npm link alpha-vm
   ```

4. Finally, start the Alpha GUI development server:

   ```bash
   npm run start
   ```

For further details, please refer to the [alpha-vm](https://github.com/SendArcade/alpha-vm) repository.

## Contributing

We welcome contributions from the community! Here's how you can help improve Alpha GUI.

### Contribution Guidelines

1. **Fork the Repository:** Click the fork button at the top right of the GitHub page.
2. **Create a New Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add: description of your feature"
   ```

4. **Push to Your Branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request:** Provide a detailed description of your changes and the rationale behind them.

Please ensure that your pull request adheres to our code style guidelines and passes all tests.

## Roadmap

- [ ] Enhance the UI/UX design.
- [ ] Integrate additional visual programming blocks.
- [ ] Improve performance and responsiveness.
- [ ] Expand support for mobile devices.
- [ ] Foster a broader community for plugins and extensions.

## License

Alpha GUI is licensed under the GPL-3.0. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Scratch** by MIT – for inspiring the low code, visual programming approach.
- **Google Blockly** – for providing the robust foundation for block-based programming.
- **Send Arcade** – for building and maintaining the Alpha platform.
- A big thank you to all our contributors and the open-source community.

## Contact

For questions or suggestions, please open an issue in this repository or join the [Alpha Contributors Telegram Group](https://t.me/+1oBJOPTg0VQ0Njll).
