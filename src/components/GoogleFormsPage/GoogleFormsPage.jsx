import React from "react";
import "./GoogleFormsPage.css";
import { useNavigate } from "react-router-dom";


const GoogleFormsPage = () => {
    return (
        <div className="google-forms-container">
            <header className="google-forms-header">
                <h1>Google Forms Clone</h1>
            </header>
            <main className="google-forms-main">
                <form className="forms">
                    <div className="form-group">
                        <label htmlFor="form-title">Form Title</label>
                        <input type="text" id="form-title" placeholder="Enter form title" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="form-description">Description</label>
                        <textarea id="form-description" placeholder="Enter form description"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="question">Question</label>
                        <input type="text" id="question" placeholder="Enter your question" />
                    </div>
                    <button type="submit" className="form-button">Submit</button>
                </form>
            </main>
        </div>
    );
};

export default GoogleFormsPage;
