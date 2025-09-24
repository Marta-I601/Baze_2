import { render, screen, fireEvent } from '@testing-library/react';
import GoogleFormsPage from './GoogleFormsPage'; // putanja zavisi od tvoje strukture
import '@testing-library/jest-dom';

beforeAll(() => {
  // Mocking console.log pre nego sto testovi pocnu da se izvrsavaju
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  // Vracanje originalne implementacije console.log nakon sto su testovi zavrseni
  console.log.mockRestore();
});

test('renders Google Forms Clone page', () => {
  render(<GoogleFormsPage />);
  const formTitleInput = screen.getByLabelText(/Form Title/i);
  expect(formTitleInput).toBeInTheDocument();
  const descriptionInput = screen.getByLabelText(/Description/i);
  expect(descriptionInput).toBeInTheDocument();
});

test('adds a new question when "Add Question" button is clicked', () => {
  render(<GoogleFormsPage />);
  const addButton = screen.getByText(/Add Question/i);
  fireEvent.click(addButton);

  const questionInput = screen.getByPlaceholderText(/Enter your question/i);
  expect(questionInput).toBeInTheDocument();
});

test('updates question text', () => {
  render(<GoogleFormsPage />);
  const addButton = screen.getByText(/Add Question/i);
  fireEvent.click(addButton);

  const questionInput = screen.getByPlaceholderText(/Enter your question/i);
  fireEvent.change(questionInput, { target: { value: 'What is your name?' } });

  expect(questionInput.value).toBe('What is your name?');
});

test('deletes a question when "Delete" button is clicked', () => {
  render(<GoogleFormsPage />);
  const addButton = screen.getByText(/Add Question/i);
  fireEvent.click(addButton);

  const deleteButton = screen.getByText(/Delete/i);
  fireEvent.click(deleteButton);

  const questionInput = screen.queryByPlaceholderText(/Enter your question/i);
  expect(questionInput).toBeNull(); // Nakon brisanja pitanje vise ne postoji
});

test('submits the form data', () => {
  render(<GoogleFormsPage />);

  const formTitleInput = screen.getByLabelText(/Form Title/i);
  fireEvent.change(formTitleInput, { target: { value: 'Test Form' } });

  const descriptionInput = screen.getByLabelText(/Description/i);
  fireEvent.change(descriptionInput, { target: { value: 'This is a test form' } });

  const addButton = screen.getByText(/Add Question/i);
  fireEvent.click(addButton);

  const questionInput = screen.getByPlaceholderText(/Enter your question/i);
  fireEvent.change(questionInput, { target: { value: 'What is your favorite color?' } });

  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);

  // Proveravaju se podaci koji su pravilno izlogovani (ako koristiš console.log)
  expect(console.log).toHaveBeenCalledWith({
    formTitle: 'Test Form',
    formDescription: 'This is a test form',
    allowAnonymous: false,
    questions: expect.arrayContaining([{ text: 'What is your favorite color?' }]),
    responses: {},
  });
});
