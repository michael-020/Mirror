# Zap ⚡

Zap is an innovative, in-browser site builder designed to revolutionize how you create and develop websites. Say goodbye to complex local setups and hello to a full-fledged development environment right in your web browser! 🚀 Craft, code, and deploy your web projects with unparalleled ease and efficiency.

## ✨ Features

*   **In-Browser Development Environment** 💻
    Spin up complete coding projects directly in your browser. Leveraging advanced WebContainer technology, Zap provides a sandboxed, fully functional development environment with an integrated code editor and comprehensive project management tools.
*   **Real-time Live Preview** 👀
    See your changes come to life instantly! As you code, Zap provides a dynamic, live preview of your website, allowing for immediate visualization and rapid iteration.
*   **AI-Assisted Development** 🤖
    Boost your productivity with integrated AI capabilities. Benefit from intelligent code generation, smart suggestions, and a built-in chat interface for interactive AI assistance.
*   **Secure User Authentication & Project Management** 🔒
    Log in effortlessly using Google OAuth (powered by NextAuth.js). Manage your sessions and access personalized project spaces where all your hard work is persistently saved and securely stored.
*   **Cloud Asset Management** ☁️
    Integrate seamlessly with Cloudinary to easily upload, manage, and host all your images and media assets directly in the cloud, streamlining your content workflow.
*   **Integrated Payment Processing** 💰
    Zap includes a secure payment system, ready to support monetization strategies for premium features, subscriptions, project exports, or other value-added services, leveraging JWTs for secure transactions.

## 🛠️ Technologies Used

### Frontend
*   **Next.js**: A React framework for building full-stack web applications.
*   **React**: A JavaScript library for building user interfaces.

### Backend
*   **Next.js**: For API routes and server-side logic.
*   **NextAuth.js**: Secure authentication for Next.js applications, supporting Google OAuth.
*   **WebContainer**: Powers the in-browser development environment.
*   **Cloudinary**: Cloud-based media management platform.
*   **Razorpay**: Payment gateway integration for secure transactions.
*   **JSON Web Tokens (JWT)**: For secure payment initiation and authorization.

## 🚀 Getting Started

Follow these steps to get Zap up and running on your local machine for development and testing purposes.

1.  **Clone the repository:**
    ```bash
    git clone [repository_url]
    cd zap
    ```
    *(Replace `[repository_url]` with the actual URL of the Zap repository)*

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables. Obtain these from their respective service providers:
    *   `NEXTAUTH_SECRET`
    *   `GOOGLE_CLIENT_ID`
    *   `GOOGLE_CLIENT_SECRET`
    *   `CLOUDINARY_CLOUD_NAME`
    *   `CLOUDINARY_API_KEY`
    *   `CLOUDINARY_API_SECRET`
    *   `PAYMENT_JWT_SECRET`
    *   `RAZORPAY_WEBHOOK_SECRET`

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  **Access Zap in your browser:**
    Open [http://localhost:3000](http://localhost:3000) to start building amazing websites!