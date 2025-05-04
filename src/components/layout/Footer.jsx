import React from "react";

function Footer() {
    return (
        <footer className="bg-blue-600 text-white py-4">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} My Application. All rights reserved.</p>
                <p className="text-sm">Follow us on <a href="https://twitter.com" className="text-blue-300 hover:underline">Twitter</a> and <a href="https://github.com" className="text-blue-300 hover:underline">GitHub</a>.</p>
            </div>
        </footer>
    );
}

export default Footer;
