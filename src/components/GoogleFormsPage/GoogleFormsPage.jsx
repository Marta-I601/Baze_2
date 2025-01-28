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
            step: null
        }]);
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
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
                    {questions.map((q) => (
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
                            {q.type === "multipleChoice" || q.type === "singleChoice" ? (
                                <div>
                                    <button type="button" onClick={() => updateQuestion(q.id, "options", [...q.options, ""])}>
                                        Add Option
                                    </button>
                                    {q.options.map((opt, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            placeholder={`Option ${idx + 1}`}
                                            value={opt}
                                            onChange={(e) => {
                                                const newOptions = [...q.options];
                                                newOptions[idx] = e.target.value;
                                                updateQuestion(q.id, "options", newOptions);
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : null}
                            {q.type === "number" ? (
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        onChange={(e) => updateQuestion(q.id, "min", e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        onChange={(e) => updateQuestion(q.id, "max", e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Step"
                                        onChange={(e) => updateQuestion(q.id, "step", e.target.value)}
                                    />
                                </div>
                            ) : null}
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={q.required}
                                        onChange={(e) => updateQuestion(q.id, "required", e.target.checked)}
                                    />
                                    Required
                                </label>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="form-button" onClick={addQuestion}>Add Question</button>
                    <button type="submit" className="form-button">Submit</button>
                </form>
            </main>
        </div>
    );
};

export default GoogleFormsPage;
