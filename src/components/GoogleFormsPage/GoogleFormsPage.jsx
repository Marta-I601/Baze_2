import React, { useState } from "react";
import "./GoogleFormsPage.css";
import { useNavigate } from "react-router-dom";
import { BsParagraph } from "react-icons/bs";

const GoogleFormsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [allowAnonymous, setAllowAnonymous] = useState(false);
    const [responses, setResponses] = useState({});

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
            image: null,
            maxSelections: null
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

    const handleResponseChange = (id, value) => {
        setResponses({ ...responses, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ formTitle, formDescription, allowAnonymous, questions, responses });
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
                    <div className="form-group">
                        <label>
                            Allow anonymous responses
                            <input
                                type="checkbox"
                                checked={allowAnonymous}
                                onChange={(e) => setAllowAnonymous(e.target.checked)}
                            />
                        </label>
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
                            {q.type === "multipleChoice" && (
                                <input
                                    type="number"
                                    placeholder="Max selections"
                                    value={q.maxSelections || ""}
                                    onChange={(e) => updateQuestion(q.id, "maxSelections", parseInt(e.target.value))}
                                />
                            )}
                            {q.type === "number" && (
                                <>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={q.min || ""}
                                        onChange={(e) => updateQuestion(q.id, "min", parseInt(e.target.value))}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={q.max || ""}
                                        onChange={(e) => updateQuestion(q.id, "max", parseInt(e.target.value))}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Step"
                                        value={q.step || ""}
                                        onChange={(e) => updateQuestion(q.id, "step", parseInt(e.target.value))}
                                    />
                                </>
                            )}
                            <input type="file" onChange={(e) => updateQuestion(q.id, "image", e.target.files[0])} />
                            {q.image && <img src={URL.createObjectURL(q.image)} alt="Question Image" className="question-image" />}
                            <div>
                                <button type="button" onClick={() => cloneQuestion(q.id)}>Clone</button>
                                <button type="button" onClick={() => deleteQuestion(q.id)}>Delete</button>
                                <button type="button" onClick={() => moveQuestion(q.id, -1)}>Move Up</button>
                                <button type="button" onClick={() => moveQuestion(q.id, 1)}>Move Down</button>
                            </div>
                            <input
                                type={q.type === "date" ? "date" : q.type === "time" ? "time" : "text"}
                                placeholder={q.type === "shortText" ? "Max 512 chars" : q.type === "longText" ? "Max 4096 chars" : ""}
                                maxLength={q.type === "shortText" ? 512 : q.type === "longText" ? 4096 : undefined}
                                value={responses[q.id] || ""}
                                onChange={(e) => handleResponseChange(q.id, e.target.value)}
                            />
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