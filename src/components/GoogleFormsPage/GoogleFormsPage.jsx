import React, { useState } from "react";
import "./GoogleFormsPage.css";
import { useNavigate } from "react-router-dom";

const GoogleFormsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");

    const addQuestion = () => {
        setQuestions([...questions, {
            id: questions.length + 1,
            text: "",
            type: "shortText",
            required: false,
            options: [],
            min: null,
            max: null,
            step: null,
            image: null
        }]);
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const cloneQuestion = (id) => {
        const questionToClone = questions.find(q => q.id === id);
        if (questionToClone) {
            setQuestions([...questions, { ...questionToClone, id: questions.length + 1 }]);
        }
    };

    const deleteQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const moveQuestion = (id, direction) => {
        const index = questions.findIndex(q => q.id === id);
        if (index < 0) return;
        const newQuestions = [...questions];
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < questions.length) {
            [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
            setQuestions(newQuestions);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ formTitle, formDescription, questions });
    };

    return (
        <div className="google-forms-container">
            <header className="google-forms-header">
                <h1>Google Forms Clone</h1>
            </header>
            <main className="google-forms-main">
                <form className="forms" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="form-title">Form Title</label>
                        <input
                            type="text"
                            id="form-title"
                            placeholder="Enter form title"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="form-description">Description</label>
                        <textarea
                            id="form-description"
                            placeholder="Enter form description"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        ></textarea>
                    </div>
                    {questions.map((q, index) => (
                        <div className="form-group" key={q.id}>
                            <label>Question {q.id}</label>
                            <input
                                type="text"
                                placeholder="Enter your question"
                                value={q.text}
                                onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                            />
                            <select
                                value={q.type}
                                onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                            >
                                <option value="shortText">Short Text</option>
                                <option value="longText">Long Text</option>
                                <option value="singleChoice">Single Choice</option>
                                <option value="multipleChoice">Multiple Choice</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="time">Time</option>
                            </select>
                            <input type="file" onChange={(e) => updateQuestion(q.id, "image", e.target.files[0])} />
                            {q.image && <img src={URL.createObjectURL(q.image)} alt="Question Image" className="question-image" />}
                            <div>
                                <button type="button" onClick={() => cloneQuestion(q.id)}>Clone</button>
                                <button type="button" onClick={() => deleteQuestion(q.id)}>Delete</button>
                                <button type="button" onClick={() => moveQuestion(q.id, -1)}>Move Up</button>
                                <button type="button" onClick={() => moveQuestion(q.id, 1)}>Move Down</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="form-button" onClick={addQuestion}>Add Question</button>
                    <button type="submit" className="form-button">Submit</button>
                </form>
                <div>
                    <h3>Share your form</h3>
                    <input type="text" value={window.location.href} readOnly />
                    <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy Link</button>
                </div>
            </main>
        </div>
    );
};

export default GoogleFormsPage;
