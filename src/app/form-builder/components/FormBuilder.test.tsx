import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createForm } from '@/services/forms';
import { FormBuilder } from './FormBuilder';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@/services/forms', () => ({
  createForm: jest.fn(),
  saveForm: jest.fn(),
}));

// jsdom has no layout; the open card scrolls itself into view.
Element.prototype.scrollIntoView = jest.fn();
// jsdom lacks structuredClone (the reducer copies the state with it); the state is plain JSON.
globalThis.structuredClone ??= (value) => JSON.parse(JSON.stringify(value));

/** A closed question renders as a button that opens it; the open one shows its editor. */
const closed = (label: string) => screen.queryByRole('button', { name: `Edit question ${label}` });

describe('FormBuilder: the open question', () => {
  it('closes on a click outside it', async () => {
    const user = userEvent.setup();
    render(<FormBuilder mode='create' />);
    expect(closed('1')).not.toBeInTheDocument(); // a new form opens its first question

    await user.click(document.body);

    expect(closed('1')).toBeInTheDocument();
  });

  it('closes when another field outside it is clicked', async () => {
    const user = userEvent.setup();
    render(<FormBuilder mode='create' />);

    await user.click(screen.getByPlaceholderText('e.g. Grade 12 Mentorship Screener'));

    expect(closed('1')).toBeInTheDocument();
  });

  it('stays open on a click inside it', async () => {
    const user = userEvent.setup();
    render(<FormBuilder mode='create' />);

    await user.click(screen.getByRole('button', { name: 'Add option' }));

    expect(closed('1')).not.toBeInTheDocument();
  });

  it('opens the question that + Add Question adds', async () => {
    const user = userEvent.setup();
    render(<FormBuilder mode='create' />);

    await user.click(screen.getByRole('button', { name: '+ Add Question' }));

    expect(closed('1')).toBeInTheDocument();
    expect(closed('2')).not.toBeInTheDocument();
  });

  it('switches to a closed question when it is clicked', async () => {
    const user = userEvent.setup();
    render(<FormBuilder mode='create' />);
    await user.click(screen.getByRole('button', { name: '+ Add Question' }));

    await user.click(closed('1')!);

    expect(closed('1')).not.toBeInTheDocument();
    expect(closed('2')).toBeInTheDocument();
  });

  it('asks before deleting a question together with its follow-ups', async () => {
    const user = userEvent.setup();
    render(<FormBuilder mode='create' />);
    await user.click(screen.getByRole('button', { name: 'Add follow-up question' }));
    await user.click(closed('1')!);

    await user.click(screen.getByRole('button', { name: 'Remove question' }));
    expect(
      screen.getByText('Q.1a is shown only for answers to Q.1, so it is deleted with it.')
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(closed('1a')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove question' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByRole('button', { name: /^Edit question/ })).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Question')).not.toBeInTheDocument();
  });
});

describe('FormBuilder: after saving', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createForm as jest.Mock).mockResolvedValue({ isSuccess: true, id: 'f1' });
  });

  /** A new form with everything Save checks for: a name, question text, two options. */
  async function fillCompleteForm(user: ReturnType<typeof userEvent.setup>) {
    render(<FormBuilder mode='create' />);
    await user.type(screen.getByPlaceholderText('Question'), 'Pick one');
    const [a, b] = screen.getAllByPlaceholderText('Option');
    await user.type(a, 'A');
    await user.type(b, 'B');
    await user.type(screen.getByPlaceholderText('e.g. Grade 12 Mentorship Screener'), 'Test');
  }

  it('goes back to the forms list after Save, like creating a session', async () => {
    const user = userEvent.setup();
    await fillCompleteForm(user);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/forms'));
  });

  it('stays on the form after Save as draft', async () => {
    const user = userEvent.setup();
    await fillCompleteForm(user);

    await user.click(screen.getByRole('button', { name: 'Save as draft' }));

    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/forms/edit?id=f1'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
