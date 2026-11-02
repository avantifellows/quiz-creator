import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormBuilder } from './FormBuilder';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), refresh: jest.fn() }),
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
});
