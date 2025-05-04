import React from "react";

function Contact() {
  return (
    <div className="container">
      <h1>Contact Us</h1>
      <p>If you have any questions, feel free to reach out!</p>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea id="message" className="form-control" required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}

export default Contact;
