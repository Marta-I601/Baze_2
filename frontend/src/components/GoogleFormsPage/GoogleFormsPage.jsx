import React, { useState, useEffect } from "react";
import "./GoogleFormsPage.css";
import { v4 as uuidv4 } from "uuid";

const GoogleFormsPage = ({ currentUser }) => {
    const [questions, setQuestions] = useState([]);
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [allowAnonymous, setAllowAnonymous] = useState(false);
    const [shareLink, setShareLink] = useState("");

//  Tema (svetlo/tamno)
 const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
            });
   useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    // Dodaj novo pitanje
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: uuidv4(),
                text: "",
                type: "shortText",
                required: false,
                options: [],
                maxSelections: null,
                min: null,
                max: null,
                step: null,
                image: null,
            }
        ]);
    };

    // Ažuriraj polje pitanja
    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    // Dodaj opciju odgovora (za single/multiple choice)
    const addOption = (id) => {
        setQuestions(questions.map(q =>
            q.id === id
                ? { ...q, options: [...q.options, { id: uuidv4(), text: "", image: null }] }
                : q
        ));
    };

    // Ažuriraj opciju odgovora
    const updateOption = (qId, optId, field, value) => {
        setQuestions(questions.map(q =>
            q.id === qId
                ? {
                    ...q,
                    options: q.options.map(o =>
                        o.id === optId ? { ...o, [field]: value } : o
                    )
                }
                : q
        ));
    };

    // Kloniraj pitanje
    const cloneQuestion = (id) => {
        const questionToClone = questions.find(q => q.id === id);
        if (questionToClone) {
            setQuestions([...questions, { ...questionToClone, id: uuidv4() }]);
        }
    };

    // Obriši pitanje
    const deleteQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    // Promeni redosled pitanja
    const moveQuestion = (id, direction) => {
        const index = questions.findIndex(q => q.id === id);
        if (index < 0) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= questions.length) return;
        const updated = [...questions];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setQuestions(updated);
    };

    // Generiši listu brojeva za numeric tip
    const generateNumberList = (min, max, step) => {
        let list = [];
        for (let i = min; i <= max; i += step) {
            list.push(i);
        }
        return list;
    };

    // Kreiraj link za deljenje
    const createShareLink = () => {
        const link = `${window.location.origin}/fill-form/${uuidv4()}`;
        setShareLink(link);
    };

    // Submit forme
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            formTitle,
            formDescription,
            allowAnonymous,
            questions
        });
    };

    return (
        <div className="google-forms-container">
            <header className="google-forms-header">
                <div className="header-left">
                 Dobrodošao, {currentUser || "Gost"} na Google Formu.!</div>
                 <div>
                    <h2>Google Forms</h2>
                </div>
                <div className="header-right">
                    <button onClick={toggleDarkMode}>
                        {darkMode ? "🌙 Tamni mod" : "☀️ Svetli mod"}
                    </button></div>
                    <div>
                    <button onClick={createShareLink}>Generiši link</button>
                </div>
                {shareLink && <p>Link: <a href={shareLink}>{shareLink}</a></p>}
            </header>

            <main className="google-forms-main">
                <form className="forms" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Naziv forme</label>
                        <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            placeholder="Unesite naziv"
                        />
                    </div>
                    <div className="form-group">
                        <label>Opis</label>
                        <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Unesite opis"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>
                            Dozvoli anonimne odgovore
                            <input
                                type="checkbox"
                                checked={allowAnonymous}
                                onChange={(e) => setAllowAnonymous(e.target.checked)}
                            />
                        </label>
                    </div>

                    {questions.map((q) => (
                        <div key={q.id} className="question-block">
                            <input
                                type="text"
                                placeholder="Unesite pitanje"
                                value={q.text}
                                onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                            />
                            <label>
                                Obavezno
                                <input
                                    type="checkbox"
                                    checked={q.required}
                                    onChange={(e) => updateQuestion(q.id, "required", e.target.checked)}
                                />
                            </label>
                            <select
                                value={q.type}
                                onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                            >
                                <option value="shortText">Kratak tekst (max 512)</option>
                                <option value="longText">Dug tekst (max 4096)</option>
                                <option value="singleChoice">Jedan izbor</option>
                                <option value="multipleChoice">Više izbora</option>
                                <option value="number">Broj</option>
                                <option value="date">Datum</option>
                                <option value="time">Vreme</option>
                            </select>

                            {q.type === "multipleChoice" && (
                                <>
                                    <input
                                        type="number"
                                        placeholder="Maksimalan broj izbora"
                                        value={q.maxSelections || ""}
                                        onChange={(e) => updateQuestion(q.id, "maxSelections", e.target.value)}
                                    />
                                    <button type="button" onClick={() => addOption(q.id)}>Dodaj opciju</button>
                                    {q.options.map(opt => (
                                        <div key={opt.id}>
                                            <input
                                                type="text"
                                                placeholder="Tekst opcije"
                                                value={opt.text}
                                                onChange={(e) => updateOption(q.id, opt.id, "text", e.target.value)}
                                            />
                                            <input
                                                type="file"
                                                onChange={(e) => updateOption(q.id, opt.id, "image", e.target.files[0])}
                                            />
                                            {opt.image && <img src={URL.createObjectURL(opt.image)} alt="" />}
                                        </div>
                                    ))}
                                </>
                            )}

                            {q.type === "singleChoice" && (
                                <>
                                    <button type="button" onClick={() => addOption(q.id)}>Dodaj opciju</button>
                                    {q.options.map(opt => (
                                        <div key={opt.id}>
                                            <input
                                                type="text"
                                                placeholder="Tekst opcije"
                                                value={opt.text}
                                                onChange={(e) => updateOption(q.id, opt.id, "text", e.target.value)}
                                            />
                                            <input
                                                type="file"
                                                onChange={(e) => updateOption(q.id, opt.id, "image", e.target.files[0])}
                                            />
                                            {opt.image && <img src={URL.createObjectURL(opt.image)} alt="" />}
                                        </div>
                                    ))}
                                </>
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
                                        placeholder="Korak"
                                        value={q.step || ""}
                                        onChange={(e) => updateQuestion(q.id, "step", parseInt(e.target.value))}
                                    />
                                    {q.min !== null && q.max !== null && q.step && (
                                        <p>
                                            Lista: {generateNumberList(q.min, q.max, q.step).join(", ")}
                                        </p>
                                    )}
                                </>
                            )}

                            <input
                                type="file"
                                onChange={(e) => updateQuestion(q.id, "image", e.target.files[0])}
                            />
                            {q.image && <img src={URL.createObjectURL(q.image)} alt="" />}

                            <div className="question-actions">
                                <button type="button" onClick={() => cloneQuestion(q.id)}>Kloniraj</button>
                                <button type="button" onClick={() => deleteQuestion(q.id)}>Obriši</button>
                                <button type="button" onClick={() => moveQuestion(q.id, -1)}>Pomeri gore</button>
                                <button type="button" onClick={() => moveQuestion(q.id, 1)}>Pomeri dole</button>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addQuestion}>Dodaj pitanje</button>
                    <button type="submit">Sačuvaj formu</button>
                </form>
            </main>
        </div>
    );
};

export default GoogleFormsPage;
